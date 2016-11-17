/**
 * Created by maximilian.koeller on 14.11.2016.
 */
import * as mysql from "mysql";
import * as wrapper from "node-mysql-wrapper";
import * as express from "express";
import {error} from "util";


class Grade {

    public connection = mysql.createConnection({
        host: "intranet",
        user: 'FS141_maxi_koel',
        password: 'FS141_maxi_koel',
        database: 'fs141_maximilian_koeller',
        insecureAuth: true
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
    }
}

function listFachnoten(req: express.Request, res: express.Response): void {
    let db = grade.ksnDB;
    db.ready(()=> {
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
                vorname: rawColumn[1],
                nachname: rawColumn[0],
                id: 0,
                note: parseInt(rawColumn[2])
            });
        }
    }


    let db = grade.ksnDB;
    let acceptedList: EinzelNote[] = [];
    let notFound: EinzelNote[] = [];
    db.ready(() => {
        db.query("select vorname, name as nachname, schuelerID as id from schueler where klasse = ?", (err, result) => {
            for (let schueler of (<Schueler[]>result)) {
                for (let einzelNote of parsedList) {
                    if (schueler.vorname == einzelNote.vorname && schueler.nachname == einzelNote.nachname) {
                        einzelNote.id = schueler.id;
                        acceptedList.push(einzelNote);
                        break;
                    }
                    notFound.push(einzelNote);
                }
            }
            res.send({
                data: {
                    accepted: acceptedList,
                    notFound: notFound
                }
            });
        }, [req.body.klasse]);
    });
}

function getSubjectGradeList(req: express.Request, res: express.Response): void {
    let db = grade.ksnDB;
    db.ready(() => {

        db.query("select * from fachnotenliste where unterrichtsfach = ? and klasse = ? and block = ?", ((error, result) => {
            res.send({data: result[0]});
        }), [req.query.fach, req.query.klasse, req.query.block]);

        // db.table("fachnotenliste").findSingle({
        //     unterrichtsfach: req.query.fach,
        //     klasse: req.query.klasse,
        //     block:req.query.block
        // }).then(result => {
        //     res.send({data: result});
        // });
    })
}

function loadSingleGrades(req: express.Request, res: express.Response): void {
    let db = grade.ksnDB;
    db.ready(() => {
        db.query("SELECT s.SchuelerID, s.Vorname, s.Name FROM klasse k, schueler s WHERE k.Kuerzel = ? and s.Klasse = k.Kuerzel", (error,response) => {
            loadPupilGrades(res,req.query.fachnotenlisteID,response,[]);
        },[req.query.klasse]);
    });
}

function loadPupilGrades(res: express.Response,fachnotenlisteID : number, toDo: any[], results:any[]) {
    let current = toDo.pop();
    let db = grade.ksnDB;
    db.ready(() => {
        db.query("SELECT el.einzelnotenlisteID, en.wert FROM fachnotenliste fl, einzelnotenliste el, einzelnote en " +
            "WHERE el.fachnotenlisteID = fl.fachnotenlisteID and " +
            "en.einzelnotenlisteID = el.einzelnotenlisteID and" +
            " en.schuelerID=? and fl.fachnotenlisteID = ?", (error,response) => {
            let result = {schueler: current};
            for(let row of response) {
                result[row.einzelnotenlisteID] = row.wert;
            }

            results.push(result);
            if(toDo.length == 0) {
                res.send({data:results});
            } else {
                loadPupilGrades(res,fachnotenlisteID,toDo,results);
            }

        },[current.schuelerID,fachnotenlisteID]);
    });
}

function getSingleGradeLists(req: express.Request, res: express.Response): void {
    let db = grade.ksnDB;
    db.ready(() => {
        db.query("select * from einzelnotenliste where fachnotenlisteID = ?", (error, response) => {
            if (error) {
                console.log(error);
                res.send(error);
            } else {
                getGrades(res, response, response.slice());
            }
        }, [req.query.fachnotenlisteID]);
    });
}

function getGrades(res: express.Response, complete: any[], toDo: any[]) {
    let current = toDo.pop();
    let db = grade.ksnDB;
    db.ready(() => {
        db.query("select * from einzelnote where einzelnotenlisteID = ?", (error, response) => {
            current.noten = response;
            if (toDo.length == 0) {
                res.send({data: complete});
            } else {
                getGrades(res, complete, toDo);
            }
        }, [current.einzelnotenlisteID]);
    });
}


function saveGrades(req: express.Request, res: express.Response): void {
    let db = grade.ksnDB;
    let toSave = {
        fachnotenlisteID: req.body.data.fachNotenListe,
        gewichtung: req.body.data.gewichtung,
        typ: req.body.data.type,
        lehrer: req.body.data.lehrer
    };
    db.ready(()=> {
        db.query("insert into einzelnotenliste values(?,?,?,?,?,?)", (err, response) => {
            for (let note of req.body.data.noten) {
                note.einzelnotenlisteID = response.insertId;
            }
            saveSingelGrade(res, req.body.data.noten);

        }, [null, toSave.fachnotenlisteID, toSave.lehrer, "2016-03-12", toSave.typ, toSave.gewichtung]);
    });
}

function saveSingelGrade(res: express.Response, remaining: any []) {
    let db = grade.ksnDB;
    db.ready(() => {
        let note = remaining.pop();
        console.log(note);
        db.query("insert into einzelnote value(?,?,?)", (err, result) => {
            console.log(result);
            res.send({data: "done"});
        }, [note.schuelerID, note.einzelnotenlisteID, note.wert]);
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

// SELECT * FROM klasse k, schueler s WHERE k.Kuerzel = 'FS141' and s.Klasse = k.Kuerzel
//SELECT * FROM fachnotenliste fl, einzelnotenliste el, einzelnote en WHERE el.fachnotenlisteID = fl.fachnotenlisteID and en.einzelnotenlisteID = el.einzelnotenlisteID and en.schuelerID=1 and fl.fachnotenlisteID = 2