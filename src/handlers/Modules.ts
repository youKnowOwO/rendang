import { readdir } from "fs";
import BotClient from "./BotClient";
import CommandComponent from "../typings/Command";
import ModuleConf from "../typings/ModuleConf";

export default class ModulesLoader {
    private client: BotClient;
    private path: string;
    constructor(client: BotClient, path: string) {
        this.client = client;
        this.path = path;
    }

    public build(): BotClient {
        readdir(this.path, (err, categories: string[]) => {
            if (err) {
                console.error(err);
            }
            console.info(`Found ${categories.length} categories.`);
            categories.forEach(category => {
                const moduleConf: ModuleConf = require(`${this.path}/${category}/module.json`);
                moduleConf.path = `${this.path}/${category}`;
                moduleConf.cmds = [];
                if (!moduleConf) return undefined;
                this.client.helpMeta.set(category, moduleConf);
                readdir(`${this.path}/${category}`, (err, files: string[]) => {
                    console.info(`Found ${files.length - 1} command(s) from ${category}`);
                    if (err) console.error(err);
                    const disabledCommands: string[] = [];
                    files.forEach(file => {
                        if (!file.endsWith(".js")) return undefined;
                        const prop: CommandComponent = new (require(`${this.path}/${category}/${file}`).default)();
                        const cmdName: string = file.split(".")[0];
                        prop.category = category;
                        prop.path = `${this.path}/${category}/${file}`;
                        prop.reload = (): CommandComponent | void => {
                            delete require.cache[require.resolve(`${this.path}/${prop.category}/${cmdName}`)];
                            const newCMD = require(`${this.path}/${prop.category}/${file}`);
                            this.client.commands.get(cmdName) !.run = newCMD.run;
                            this.client.commands.get(cmdName) !.help = newCMD.help;
                            this.client.commands.get(cmdName) !.conf = newCMD.conf;
                            console.info(`${cmdName} command reloaded.`);
                            return this.client.commands.get(cmdName);
                        };
                        if (prop.conf.disable) disabledCommands.push(prop.help.name!);
                        this.client.commands.set(prop.help.name!, prop);
                        prop.conf.aliases.forEach(alias => {
                            this.client.aliases.set(alias, prop.help.name!);
                        });
                        moduleConf.cmds.push(cmdName);
                    });
                    if (disabledCommands.length !== 0) console.info(`There are ${disabledCommands.length} command(s) disabled.`);
                    this.client.categories.set(category, this.client.commands.filter((cmd: CommandComponent) => cmd.category === category));
                });
            });
        });
        return this.client;
    }
}
