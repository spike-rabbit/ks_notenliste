/**
 * Created by maximilian.koeller on 14.11.2016.
 */
import * as mysql from "mysql";
import * as wrapper from "node-mysql-wrapper";
import * as express from "express";


class MasterData {

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
        this.router.get("/listKlassen", listKlassen);
        this.router.get("/listFaecher", listFaecher);
        this.router.get("/listLehrer", listLehrer);
        this.router.get("/listSchueler", listSchueler);
        this.router.get("/listBloecke", listBloecke);
    }
}

let masterData = new MasterData();

function listKlassen(req: express.Request, res: express.Response): void {
    let db = masterData.ksnDB;
    db.ready(()=> {
        db.query("select * from klasse", (err, response) => {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }
        });
    });
}

function listFaecher(req: express.Request, res: express.Response): void {
    let db = masterData.ksnDB;
    db.ready(()=> {
        db.query("select unterrichtsfach as fach from fachnotenliste where klasse = ? group by fach", (err, response) => {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }
        }, [req.query.klasse]);
    });
}

function listBloecke(req: express.Request, res: express.Response): void {
    let db = masterData.ksnDB;
    console.log(req.query.fach + " " + req.query.klasse);
    db.ready(() => {
       db.query("select block from fachnotenliste where unterrichtsfach = ? and klasse = ?", (err, response) => {
           if (err) {
               res.send(err);
           } else {
               res.send(response);
           }
        }, [req.query.fach, req.query.klasse])
    });
}

function listLehrer(req: express.Request, res: express.Response): void {
    let db = masterData.ksnDB;
    db.ready(() => {
        db.query("select * from lehrer", (err, response) => {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }
        });
    });
}

function listSchueler(req: express.Request, res: express.Response): void {
    let db = masterData.ksnDB;
    db.ready(() => {
        db.query("select * from schueler where klasse = ?", (err, response) => {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }
        }, [req.query.klasse]);
    });
}

export = masterData.router;