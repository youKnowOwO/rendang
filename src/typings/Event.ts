import BotClient from "../handlers/BotClient";

export default interface EventProp {
    client: BotClient;
    name: string;
    run: any;
}