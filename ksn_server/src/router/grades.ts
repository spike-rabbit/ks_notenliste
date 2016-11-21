/**
 * Created by maximilian.koeller on 14.11.2016.
 */
import * as mysql from "mysql";
import * as wrapper from "node-mysql-wrapper";
import * as express from "express";


class Grade {

    public connection = mysql.createConnection({
        host: "intranet",
        user: "FS141_maxi_koel",
        password: "FS141_maxi_koel",
        database: 'fs141_maximilian_koeller',
        insecureAuth: true,
    });

    public ksnDB = wrapper.wrap(this.connection);

    public router: express.Router;

    constructor() {
        this.router = express.Router();
        this.router.get("/listFachnoten", listFachnoten);
        this.router.get("/getSubjectGradeList", getSubjectGradeList);
        this.router.post("/convertGrades", convertGrades);
        this.router.post("/saveGrades", saveGrades);
        this.router.get("/loadSingleGrades", loadSingleGrades);
        this.router.get("/loadZeugnis", loadZeugnis);
        this.router.get("/deleteEinzelnotenliste", deleteEinzelnotenliste);
    }
}

function listFachnoten(req: express.Request, res: express.Response): void {
    let db = grade.ksnDB;
    db.ready(() => {
        db.query("select * from einzelnotenliste el, einzelnote en, " +
            "fachnotenliste fl where el.einzelnotenlisteID = en.einzelnotenlisteID " +
            "and el.FachnotenlisteID = fl.fachnotenlisteID and klasse = ? and unterrichtsfach = ? and block = ?", (err, response) => {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }
        }, [req.query.klasse, req.query.fach, req.query.block]);
    });
}

function convertGrades(req: express.Request, res: express.Response): void {
    let rawList = (<string> req.body.list);
    let rawRows = rawList.split('\n');
    let parsedList: EinzelNote[] = [];
    for (let row of rawRows) {
        if (row != "") {
            let rawColumn = row.split('\t');
            parsedList.push({
                nachname: rawColumn[0],
                vorname: rawColumn[1],
                id: 0,
                note: parseInt(rawColumn[2])
            });
        }
    }


    let db = grade.ksnDB;
    let acceptedList: EinzelNote[] = [];
    let notFound: Schueler[] = [];
    db.ready(() => {
        db.query("select vorname, name as nachname, schuelerID as id from schueler where klasse = ?", (err, result) => {
            for (let schueler of (<Schueler[]>result)) {
                let found = false;
                for (let einzelNote of parsedList) {
                    if (schueler.vorname == einzelNote.vorname && schueler.nachname == einzelNote.nachname) {
                        einzelNote.id = schueler.id;
                        acceptedList.push(einzelNote);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    notFound.push(schueler);
                }
            }
            res.send({
                data: {
                    accepted: acceptedList,
                    notFound: notFound,
                    notenlisteOkStatus: notFound.length == 0
                }
            });
        }, [req.body.klasse]);
    });
}

function getSubjectGradeList(req: express.Request, res: express.Response): void {
    let db = grade.ksnDB;
    db.ready(() => {

        db.query("select fachnotenlisteID, unterrichtsfach, klasse, block, stundenzahl from fachnotenliste where unterrichtsfach = ? and klasse = ? and block = ?", ((error, result) => {
            res.send({data: result[0]});
        }), [req.query.fach, req.query.klasse, req.query.block]);

        // db.table("fachnotenliste").findSingle({
        //     unterrichtsfach: req.query.fach,
        //     klasse: req.query.klasse,
        //     block:req.query.block
        // }).then(result => {
        //     res.send({data: result});
        // });
    });
}

function loadSingleGrades(req: express.Request, res: express.Response): void {
    let db = grade.ksnDB;
    db.ready(() => {
        db.query("SELECT s.schuelerID, s.vorname, s.name FROM klasse k, schueler s WHERE k.Kuerzel = ? and s.Klasse = k.Kuerzel", (error, response) => {
            loadPupilGrades(res, req.query.fachnotenlisteID, response, []);
        }, [req.query.klasse]);
    });
}

function loadPupilGrades(res: express.Response, fachnotenlisteID: number, toDo: any[], results: any[]) {
    let current = toDo.pop();
    let db = grade.ksnDB;
    db.ready(() => {
        db.query("SELECT * FROM einzelnotenliste WHERE fachnotenlisteID = ?", (error, einzelnotenlisten) => {
            db.query("SELECT el.einzelnotenlisteID, en.wert FROM fachnotenliste fl, einzelnotenliste el, einzelnote en " +
                "WHERE el.fachnotenlisteID = fl.fachnotenlisteID and " +
                "en.einzelnotenlisteID = el.einzelnotenlisteID and" +
                " en.schuelerID=? and fl.fachnotenlisteID = ?", (error, response) => {

                let noten = [];
                let pushed = false;
                for (let einzelnotenliste of einzelnotenlisten) {
                    for (let row of response) {
                        if (row.einzelnotenlisteID == einzelnotenliste.einzelnotenlisteID) {
                            noten.push(parseFloat(row.wert));
                            pushed = true;
                        }
                    }
                    if (!pushed) {
                        noten.push(-1);
                    }
                    pushed = false;
                }
                let result = {
                    schueler: current,
                    noten: noten
                };
                results.push(result);
                if (toDo.length == 0) {
                    res.send({
                        data: {
                            einzelnoten: results,
                            header: einzelnotenlisten
                        }
                    });
                } else {
                    loadPupilGrades(res, fachnotenlisteID, toDo, results);
                }

            }, [current.schuelerID, fachnotenlisteID]);
        }, [fachnotenlisteID]);
    });
}

function loadZeugnis(req: express.Request, res: express.Response): void {
    let db = grade.ksnDB;
    db.ready(() => {
        db.query("SELECT s.schuelerID, s.vorname, s.name FROM klasse k, schueler s " +
            "WHERE k.Kuerzel = ? and s.Klasse = k.Kuerzel", (error, response) => {
            loadZeugnisGrades(res, req.query.block, req.query.fach, response);
        }, [req.query.klasse]);
    });
}

function loadZeugnisGrades(res: express.Response, block: number, fachKuerzel: string, toDo: any[]) {
    let db = grade.ksnDB;
    db.ready(() => {

        db.query("SELECT * FROM fachnotenliste fl, einzelnotenliste el WHERE fl.unterrichtsfach IN " +
            "(SELECT uf.Kuerzel FROM unterrichtsfach uf WHERE uf.Kuerzel = ? OR uf.istUnterfachvon = ?) " +
            "and fl.fachnotenlisteID = el.fachnotenlisteID and (fl.block = ? or fl.block = ? - 1) " +
            "order by fl.unterrichtsfach, el.einzelnotenlisteID", (error, einzelnotenlisten) => {
            let currentFachID = null;
            let faecher = [];
            let result;
            let kleineEinzelnotenliste = [];
            let fach = null;
            let count = 0;
            for (let liste of einzelnotenlisten) {
                if (currentFachID != liste.fachnotenlisteID) {
                    if (fach != null) {
                        fach.listencount = count;
                    }
                    count = 0;
                    currentFachID = liste.fachnotenlisteID;
                    faecher.push(fach = {
                        kuerzel: liste.unterrichtsfach,
                        block: liste.block,
                        stundenzahl: liste.stundenzahl,
                        listencount: 0
                    });
                }
                count++;
                kleineEinzelnotenliste.push({
                    einzelnotenlisteID: liste.einzelnotenlisteID,
                    lehrer: liste.lehrer,
                    gewichtung: liste.gewichtung,
                    typ: liste.typ
                });
            }
            if (fach != null) {
                fach.listencount = count;
            }

            result = {
                header: faecher,
                subheader: kleineEinzelnotenliste,
                body: []
            };
            loadSchuelerZeugnisNoten(res, block, fachKuerzel, toDo, result);


        }, [fachKuerzel, fachKuerzel, block, block]);
    });
}

function loadSchuelerZeugnisNoten(res: express.Response, block: number, fach: string, verbleibendeSchueler: any[], zwischenstand: any) {
    let db = grade.ksnDB;
    let schueler = verbleibendeSchueler.pop();
    let bodyRow = {schueler: schueler, noten: []};
    db.ready(() => {
        db.query("SELECT * FROM fachnotenliste fl, einzelnotenliste el, einzelnote en WHERE fl.unterrichtsfach IN " +
            "(SELECT uf.Kuerzel FROM unterrichtsfach uf WHERE uf.Kuerzel = ? OR uf.istUnterfachvon = ?) " +
            "and fl.fachnotenlisteID = el.fachnotenlisteID and en.schuelerID = ? and (fl.block = ? or fl.block = ? - 1) " +
            "and en.einzelnotenlisteID = el.einzelnotenlisteID " +
            "order by fl.unterrichtsfach, el.einzelnotenlisteID" +
            "", (error, einzelnoten) => {
            for (let einzelnotenIDs of zwischenstand.subheader) {
                let gefunden = false;
                for (let einzelnote of einzelnoten) {
                    if (einzelnote.einzelnotenlisteID == einzelnotenIDs.einzelnotenlisteID) {
                        bodyRow.noten.push(parseFloat(einzelnote.wert));
                        gefunden = true;
                        break;
                    }
                }

                if (!gefunden) {
                    bodyRow.noten.push(-1);
                }

            }

            zwischenstand.body.push(bodyRow);
            if (verbleibendeSchueler.length == 0) {
                res.send({data: zwischenstand});
            } else {
                loadSchuelerZeugnisNoten(res, block, fach, verbleibendeSchueler, zwischenstand);
            }
        }, [fach, fach, schueler.schuelerID, block, block]);
    });
}

function saveGrades(req: express.Request, res: express.Response): void {
    let db = grade.ksnDB;
    let toSave = {
        fachnotenlisteID: req.body.data.fachNotenListe,
        gewichtung: req.body.data.gewichtung,
        typ: req.body.data.typ,
        lehrer: req.body.data.lehrer
    };
    if (req.body.data.noten.length > 0) {
        db.ready(() => {
            db.query("insert into einzelnotenliste values(?,?,?,?,?,?)", (err, response) => {
                for (let note of req.body.data.noten) {
                    note.einzelnotenlisteID = response.insertId;
                }
                saveSingelGrade(res, req.body.data.noten);

            }, [null, toSave.fachnotenlisteID, toSave.lehrer, "2016-03-12", toSave.typ, toSave.gewichtung]);
        });
    }
    else {
        res.send({data: {}});
    }
}

function saveSingelGrade(res: express.Response, remaining: any []) {
    let db = grade.ksnDB;
    db.ready(() => {
        let note = remaining.pop();
        db.query("insert into einzelnote value(?,?,?)", (err, result) => {
            if (remaining.length == 0) {
                res.send({data: "done"});
            } else {
                saveSingelGrade(res, remaining);
            }
        }, [note.id, note.einzelnotenlisteID, note.note]);
    });
}

function deleteEinzelnotenliste(req: express.Request, res: express.Response) {
    let db = grade.ksnDB;
    db.ready(() => {
        db.query("delete from einzelnote where einzelnotenlisteID = ?", (error, response) => {
            db.query("delete from einzelnotenliste where einzelnotenlisteID = ?", (error, response) => {
                res.send({data: !error && response.affectedRows == 1});
            }, [req.query.einzelnotenlisteID]);
        }, [req.query.einzelnotenlisteID]);
    });
}

interface EinzelNote extends Schueler {
    note: number;
}

interface Schueler {
    vorname: string;
    nachname: string;
    id: number;
}

interface FachnotenListe {
    fachnotenlisteID: number;
}

let grade = new Grade();
export = grade.router;