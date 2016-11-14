/**
 * Created by maximilian.koeller on 11.11.2016.
 */
import * as express from "express";
import * as path from "path";
import masterData = require('./router/masterData');

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
        this.app.get("/bob", function (req, res) {
            res.send("Bob Details!");
        });
        this.app.use('/masterData', masterData);

        //configure application
    }
}

let server = new Server();
export = server.app;