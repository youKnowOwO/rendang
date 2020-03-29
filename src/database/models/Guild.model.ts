import { model as createModel } from "mongoose";
import { createSchema, Type } from "ts-mongoose";

export default createModel("guild", createSchema({
    _id: Type.string({ required: true }),
    config: {
        prefix: Type.string({ required: true })
    }
}));
