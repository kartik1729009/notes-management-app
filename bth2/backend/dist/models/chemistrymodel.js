"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notesSchema = new mongoose_1.default.Schema({
    formula: { type: String },
    notes: { type: String, required: true }
}, { _id: true }); // Ensure _id is generated for each note
const subjectSchema = new mongoose_1.default.Schema({
    nameofsubject: { type: String, required: true },
    notes: [notesSchema]
}, { _id: true }); // Ensure _id is generated for each subject
const chapterSchema = new mongoose_1.default.Schema({
    chaptername: { type: String, required: true, unique: true }, // Added unique
    subcontent: [subjectSchema]
}, { timestamps: true }); // Added timestamps for created/updated
// Create and export the model
const ChemistryModel = mongoose_1.default.model("Chemistry", chapterSchema);
exports.default = ChemistryModel;
