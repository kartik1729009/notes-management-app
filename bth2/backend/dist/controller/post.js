"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNotes = exports.addSubject = exports.createChapter = void 0;
const physicsmodel_1 = __importDefault(require("../models/physicsmodel"));
const chemistrymodel_1 = __importDefault(require("../models/chemistrymodel"));
const mathsmodel_1 = __importDefault(require("../models/mathsmodel"));
const models = {
    physics: physicsmodel_1.default,
    chemistry: chemistrymodel_1.default,
    maths: mathsmodel_1.default
};
function isSubjectType(str) {
    return ['physics', 'chemistry', 'maths'].includes(str);
}
const createChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chaptername, subjectType } = req.body;
        if (!isSubjectType(subjectType)) {
            return res.status(400).json({ success: false, message: "Invalid subject type" });
        }
        const Model = models[subjectType];
        let chapter = yield Model.findOne({ chaptername });
        if (!chapter) {
            chapter = yield Model.create({ chaptername, subcontent: [] });
        }
        res.status(200).json({ success: true, data: chapter, message: "Chapter is ready!" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error creating chapter" });
    }
});
exports.createChapter = createChapter;
const addSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chaptername, nameofsubject, subjectType } = req.body;
        if (!isSubjectType(subjectType)) {
            return res.status(400).json({ success: false, message: "Invalid subject type" });
        }
        const Model = models[subjectType];
        const chapter = yield Model.findOne({ chaptername });
        if (!chapter)
            return res.status(404).json({ success: false, message: "Chapter not found" });
        const subjectExists = chapter.subcontent.some(sub => sub.nameofsubject === nameofsubject);
        if (subjectExists)
            return res.status(400).json({ success: false, message: "Subject already exists" });
        chapter.subcontent.push({ nameofsubject, notes: [] });
        yield chapter.save();
        res.status(200).json({ success: true, message: "Subject added successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error adding subject" });
    }
});
exports.addSubject = addSubject;
const addNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chaptername, nameofsubject, formula, notes, subjectType } = req.body;
        if (!isSubjectType(subjectType)) {
            return res.status(400).json({ success: false, message: "Invalid subject type" });
        }
        const Model = models[subjectType];
        const chapter = yield Model.findOne({ chaptername });
        if (!chapter)
            return res.status(404).json({ success: false, message: "Chapter not found" });
        const subject = chapter.subcontent.find(sub => sub.nameofsubject === nameofsubject);
        if (!subject)
            return res.status(404).json({ success: false, message: "Subject not found" });
        subject.notes.push({ formula, notes });
        yield chapter.save();
        res.status(200).json({ success: true, message: "Notes added successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error adding notes" });
    }
});
exports.addNotes = addNotes;
