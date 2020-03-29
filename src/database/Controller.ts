// import mongoose from "mongoose";
// import model from "./models/Guild.model";

// export default class DatabaseController {
//     constructor(private BaseModel: CrateSchema) {}
//     public get(id, validate = false) {
//         return new Promise((resolve, reject) => {
//             if (validate) {
//                 if (!mongoose.Types.ObjectId.isValid(id)) reject(new Error("Please provide correct ID"));
//             }
//             this.BaseModel.findById(id).then((data) => {
//                 resolve(data);
//             }).catch((err) => {
//                 reject(err);
//             });
//         });
//     }

//     public getBulk(filter = {}) {
//         return new Promise((resolve, reject) => {
//             this.BaseModel.find(filter).then((data) => {
//                 resolve(data);
//             }).catch((err) => {
//                 reject(err);
//             });
//         });
//     }

//     public getOne(filter = {}) {
//         return new Promise((resolve, reject) => {
//             this.BaseModel.findOne(filter).then((data) => {
//                 resolve(data);
//             }).catch((err) => {
//                 reject(err);
//             });
//         });
//     }

//     public create(data) {
//         let newdata = new this.BaseModel(data);
//         return new Promise((resolve, reject) => {
//             newdata.save().then(data => {
//                 resolve(data);
//             }).catch((err) => {
//                 reject(err);
//             });
//         });
//     }

//     public delete(id, validate = false) {
//         return new Promise((resolve, reject) => {
//             if (validate) {
//                 if (!mongoose.Types.ObjectId.isValid(id)) reject(new Error("Please provide correct ID"));
//             }
//             this.BaseModel.findOneAndRemove({
//                 _id: id
//             }).then((data) => {
//                 resolve(data);
//             }).catch((err) => {
//                 reject(err);
//             });
//         });
//     }

//     public deleteBulk(filter = {}) {
//         return new Promise((resolve, reject) => {
//             this.BaseModel.remove(filter).then((data) => {
//                 resolve(data);
//             }).catch((err) => {
//                 reject(err);
//             });
//         });
//     }

//     public set(id, data = {}, options = { multi: false }) {
//         return new Promise((resolve, reject) => {
//             this.BaseModel.update({
//                 _id: id
//             }, {
//                 $set: data
//             }, options).then((data) => {
//                 resolve(data);
//             }).catch((err) => {
//                 reject(err);
//             });
//         });
//     }
// }