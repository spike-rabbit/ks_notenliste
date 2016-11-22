/**
 * Created by maximilian.koeller on 11.11.2016.
 */
import * as express from "express";
import * as path from "path";
import * as bodyparser from "body-parser";
import stammdaten = require('./router/stammdaten');
import noten = require('./router/noten');
import bodyParser = require("body-parser");

/**
 * The server.
 *
 * @class Server
 */
class Server {

    public app: express.Application;


    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        //create expressjs application
        this.app = express();
        this.app.use(express.static(path.join(__dirname, '../../ksn_client')));
        this.app.use(bodyparser.json());
        this.app.use('/stammdaten', stammdaten);
        this.app.use("/noten", noten);


        //configure application
    }
}

let server = new Server();
export = server.app;