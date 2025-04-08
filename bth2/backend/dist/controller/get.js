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
exports.getNotes = exports.getsubject = exports.getchapter = void 0;
const physicsmodel_1 = __importDefault(require("../models/physicsmodel"));
const chemistrymodel_1 = __importDefault(require("../models/chemistrymodel"));
const mathsmodel_1 = __importDefault(require("../models/mathsmodel"));
const models = {
    physics: physicsmodel_1.default,
    chemistry: chemistrymodel_1.default,
    math: mathsmodel_1.default,
};
function isSubjectType(str) {
    return ['physics', 'chemistry', 'math'].includes(str);
}
const getchapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjectType = req.query.subjectType;
        if (!subjectType || !isSubjectType(subjectType)) {
            res.status(400).json({
                success: false,
                message: "Invalid subject type. Choose from physics, chemistry, or math.",
            });
            return;
        }
        const model = models[subjectType];
        const chapters = yield model.find({}); // Changed from findOne to find to get all chapters
        if (!chapters || chapters.length === 0) {
            res.status(404).json({
                success: false,
                message: "No chapters found for this subject",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: chapters,
            message: "Chapters fetched successfully"
        });
    }
    catch (err) {
        console.error("Error fetching chapters:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching chapters",
        });
    }
});
exports.getchapter = getchapter;
const getsubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjectType = req.query.subjectType;
        const chaptername = req.query.chaptername;
        if (!chaptername || !subjectType) {
            res.status(400).json({
                success: false,
                message: "Missing required parameters: chaptername and subjectType",
            });
            return;
        }
        if (!isSubjectType(subjectType)) {
            res.status(400).json({
                success: false,
                message: "Invalid subject type. Choose from physics, chemistry, or math.",
            });
            return;
        }
        const model = models[subjectType];
        const chapter = yield model.findOne({ chaptername });
        if (!chapter) {
            res.status(404).json({
                success: false,
                message: "Chapter not found",
            });
            return;
        }
        if (!chapter.subcontent || chapter.subcontent.length === 0) {
            res.status(404).json({
                success: false,
                message: "No subjects found in this chapter",
            });
            return;
        }
        const subjectwithid = chapter.subcontent.map(subject => ({
            _id: subject._id,
            subject: subject.nameofsubject,
        }));
        res.status(200).json({
            success: true,
            data: subjectwithid,
            message: "Subjects fetched successfully",
        });
    }
    catch (err) {
        console.error("Error fetching subjects:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching subjects",
        });
    }
});
exports.getsubject = getsubject;
const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjectType = req.query.subjectType;
        const chaptername = req.query.chaptername;
        const subjectname = req.query.subjectname;
        // Validate inputs
        if (!subjectType || !chaptername || !subjectname) {
            res.status(400).json({
                success: false,
                message: "Missing required parameters: subjectType, chaptername, or subjectname",
            });
            return;
        }
        if (!isSubjectType(subjectType)) {
            res.status(400).json({
                success: false,
                message: "Invalid subject type. Choose from physics, chemistry, or math.",
            });
            return;
        }
        const model = models[subjectType];
        const chapter = yield model.findOne({ chaptername });
        if (!chapter) {
            res.status(404).json({
                success: false,
                message: "Chapter not found",
            });
            return;
        }
        if (!chapter.subcontent || chapter.subcontent.length === 0) {
            res.status(404).json({
                success: false,
                message: "No subjects found in this chapter",
            });
            return;
        }
        const subject = chapter.subcontent.find(sub => sub.nameofsubject === subjectname);
        if (!subject) {
            res.status(404).json({
                success: false,
                message: "Subject not found in this chapter",
            });
            return;
        }
        if (!subject.notes || subject.notes.length === 0) {
            res.status(404).json({
                success: false,
                message: "No notes found for this subject",
            });
            return;
        }
        const notesWithIds = subject.notes.map(note => ({
            _id: note._id,
            formula: note.formula,
            notes: note.notes
        }));
        res.status(200).json({
            success: true,
            data: notesWithIds,
            message: "Notes fetched successfully",
        });
    }
    catch (err) {
        console.error("Error fetching notes:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching notes",
        });
    }
});
exports.getNotes = getNotes;
