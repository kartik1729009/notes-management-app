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
exports.updatenotes = exports.updatesubject = exports.updatechapter = void 0;
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
const updatechapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { chaptername, subjectType } = req.body;
        if (!isSubjectType(subjectType)) {
            res.status(400).json({
                success: false,
                message: "does not belong to given subjectType",
            });
            return;
        }
        const model = models[subjectType];
        const update = yield model.findByIdAndUpdate(id, { chaptername, updatedAt: Date.now() }, { new: true });
        if (!update) {
            res.status(404).json({
                success: false,
                message: "chapter doesnt exist",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "chapter updated successfully",
        });
        return;
    }
    catch (err) {
        console.error(err);
        console.log("some error occured");
        res.status(500).json({
            success: false,
            message: "server error"
        });
    }
});
exports.updatechapter = updatechapter;
const updatesubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { subjectId, newSubjectName, subjectType } = req.body;
        if (!isSubjectType(subjectType)) {
            res.status(400).json({
                success: false,
                message: "subjectType doesnt match"
            });
            return;
        }
        const model = models[subjectType];
        const update = yield model.updateOne({ _id: id, "subcontent._id": subjectId }, {
            $set: {
                "subcontent.$.nameofsubject": newSubjectName,
                updatedAt: Date.now(),
            }
        });
        res.status(200).json({
            success: true,
            message: "subject updated",
        });
    }
    catch (err) {
        console.error(err);
        console.log("some error occured");
        res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
});
exports.updatesubject = updatesubject;
const updatenotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { notesId, newformula, newnotes, subjectType } = req.body;
        if (!isSubjectType(subjectType)) {
            res.status(400).json({
                success: false,
                message: "Subject type doesn't match",
            });
            return;
        }
        const model = models[subjectType];
        // Updated query to match the nested structure
        const result = yield model.updateOne({
            _id: id,
            "subcontent.notes._id": notesId
        }, {
            $set: {
                "subcontent.$[].notes.$[note].formula": newformula,
                "subcontent.$[].notes.$[note].notes": newnotes,
            }
        }, {
            arrayFilters: [
                { "note._id": notesId }
            ]
        });
        if (result.modifiedCount === 0) {
            res.status(404).json({
                success: false,
                message: "Note not found or no changes made",
            });
            return; // Don't forget to return
        }
        res.status(200).json({
            success: true,
            message: "Formula and notes updated successfully",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.updatenotes = updatenotes;
