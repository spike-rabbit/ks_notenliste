/**
 * Created by maximilian.koeller on 14.11.2016.
 */
import * as mysql from "mysql";
import * as wrapper from "node-mysql-wrapper";
import * as express from "express";


class Grade {

    public ksnDB = wrapper.wrap(mysql.createConnection({
        host: "intranet",
        user: 'FS141_maxi_koel',
        password: 'FS141_maxi_koel',
        database: 'fs141_maximilian_koeller',
        insecureAuth: true
    }));

    public router: express.Router;

    constructor() {
        this.router = express.Router();
        this.router.get("/listFachnoten", listFachnoten);
        this.router.post("/convertGrades", convertGrades)
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
    let db = grade.ksnDB;
    let rawList = (<string> req.body.list);
    let rawRows = rawList.split('\n');
    let parsedList: EinzelNote[] = [];
    for (let row of rawRows) {
        if (row != "") {
            let rawColumn = row.split('\t');
            parsedList.push({
                vorname: rawColumn[0],
                nachname: rawColumn[1],
                id: 0,
                note: parseInt(rawColumn[2])
            });
        }
    }


    let acceptedList: EinzelNote[] = [];
    let notFound: EinzelNote[] = [];
    db.ready(() => {
       db.table("schueler").find({klasse : req.body.klasse}).then(result => {
           for(let schueler of (<Schueler[]>result)) {
               for(let einzelNote of parsedList) {
                   if(schueler.vorname == einzelNote.vorname && schueler.nachname == einzelNote.nachname) {
                       einzelNote.id = schueler.id;
                       acceptedList.push(einzelNote);
                       break;
                   }
                   notFound.push(einzelNote);
               }
           }
           res.send({data: {
               accepted : acceptedList,
               notFound : notFound
           }});
       });
    });
}

function addNotenliste(req: express.Request, res: express.Response): void {
    let db = grade.ksnDB;
    db.ready(()=> {
        db.table("einzelnotenliste").save({
            fachnotenlisteID: req.body.fachnotenliste,
            gewichtung: req.body.gewichtung,
            typ: req.body.type,
            stundenanzahl: req.body.stundenanzahl,
            lehrer: req.body.lehrer
        }).then();
    });
}

interface EinzelNote extends Schueler{
    note: number;
}

interface Schueler {
    vorname: string;
    nachname: string;
    id: number;
}

let grade = new Grade();
export = grade.router;