import { readdir } from "fs";
import BotClient from "./BotClient";
import CommandComponent from "../typings/Command";
import ModuleConf from "../typings/ModuleConf";

export default class ModulesLoader {
    constructor(private client: BotClient, readonly path: string) {}

    public build(): BotClient {
        readdir(this.path, (err, categories: string[]) => {
            if (err) {
                console.error(err);
            }
            categories.forEach(category => {
                if (category.endsWith(".schema")) {
                    const index = categories.indexOf(category);
                    if (index > -1) {
                        categories.splice(index, 1);
                    }
                }
            });
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
                        if (!file.endsWith(".js") && !file.endsWith(".ts")) return undefined;
                        const prop: CommandComponent = new (require(`${this.path}/${category}/${file}`).default)(this.client, category, `${this.path}/${category}/${file}`);
                        if (prop.conf.disable) disabledCommands.push(prop.help.name);
                        this.client.commands.set(prop.help.name, prop);
                        prop.conf.aliases.forEach(alias => {
                            this.client.aliases.set(alias, prop.help.name);
                        });
                        moduleConf.cmds.push(prop.help.name);
                    });
                    if (disabledCommands.length !== 0) console.info(`There are ${disabledCommands.length} command(s) disabled.`);
                    this.client.categories.set(category, this.client.commands.filter((cmd: CommandComponent | undefined) => cmd!.category === category));
                });
            });
        });
        return this.client;
    }
}
