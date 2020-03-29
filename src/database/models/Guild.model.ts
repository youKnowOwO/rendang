import { createSchema, Type } from "ts-mongoose";

export default createSchema({
    _id: Type.string({ required: true }),
    name: Type.string({ required: true }),
    config: {
        prefix: Type.string({ required: true })
    }
});