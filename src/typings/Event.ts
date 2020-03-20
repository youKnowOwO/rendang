import { ClientEvents } from "discord.js";

export default interface EventProp {
    name: keyof ClientEvents;
    run: any;
}
