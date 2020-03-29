import mongoose from "mongoose";
import { EventEmitter } from "events";
import { LogWrapper } from "../handlers/LogWrapper";
import { botName } from "../config.json";
import { Logger } from "winston";

export class Adapter extends EventEmitter {
    private log: Logger = new LogWrapper(`${botName}-MongoAdapter`).logger;
    constructor(private uri: string | undefined, private options: mongoose.ConnectionOptions) {
        super();
        Object.assign(options, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    public getMongo(): typeof mongoose {
        return mongoose;
    }
    public connect(uri?: string | undefined): Adapter {
        mongoose.connect(uri ? uri : this.uri as string, this.options).then(() => {
            this.log.info("MongoDB Open Source Driver connected, succesfully synchronized with database...");
        }).catch(err => {
            this.log.error("DATABASE_ERR: ", err);
        });
        return this;
    }
}