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
        this.router.post("/addNotenliste",)
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

function addNotenliste(req: express.Request, res: express.Response): void {
    let db = grade.ksnDB;
    db.ready(()=> {
        db.table("einzelnotenliste").save({
            fachnotenlisteID: req.body.fachnotenliste,
            gewichtung: req.body.gewichtung,
            typ: req.body.type,
            stundenanzahl : req.body.stundenanzahl,
            lehrer : req.body.lehrer
        }).then();
    });
}


let grade = new Grade();
export = grade.router;