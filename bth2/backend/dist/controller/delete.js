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
exports.deletenotes = exports.deletesubject = exports.deletechapter = void 0;
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
const deletechapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { subjectType } = req.body;
        if (!isSubjectType(subjectType)) {
            return res.status(400).json({
                success: false,
                message: "subjectType does not match"
            });
        }
        const model = models[subjectType];
        const find = yield model.findById(id);
        if (!find) {
            return res.status(404).json({
                success: false,
                message: "chapter does not exist",
            });
        }
        const deleted = yield model.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(400).json({
                success: false,
                message: "cant delete due to some error",
            });
        }
        return res.status(200).json({
            success: true,
            message: "chapter deleted successfully",
        });
    }
    catch (err) {
        console.error(err);
        console.log("some error occured");
        res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
});
exports.deletechapter = deletechapter;
const deletesubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nameofsubject, subjectType } = req.body;
        if (!isSubjectType(subjectType)) {
            res.status(400).json({
                success: false,
                message: "subject does not match",
            });
            return;
        }
        const model = models[subjectType];
        const updated = yield model.updateOne({ _id: id }, {
            $pull: {
                subcontent: { nameofsubject: nameofsubject }
            }
        });
        if (updated.modifiedCount === 0) {
            res.status(404).json({
                success: false,
                message: "subject not found or already deleted"
            });
        }
        res.status(200).json({
            success: true,
            message: "subject deleted successfully"
        });
    }
    catch (err) {
        console.error(err);
        console.log("some error occured");
        res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
});
exports.deletesubject = deletesubject;
const deletenotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { subjectType, nameofsubject, noteId } = req.body; // Only require noteId
        if (!isSubjectType(subjectType)) {
            res.status(400).json({
                success: false,
                message: "Subject type does not match"
            });
            return;
        }
        const model = models[subjectType];
        const updated = yield model.updateOne({
            _id: id,
            "subcontent.nameofsubject": nameofsubject
        }, {
            $pull: {
                "subcontent.$.notes": {
                    _id: noteId // Delete by ID instead of formula & notes
                }
            }
        });
        if (updated.modifiedCount === 0) {
            res.status(404).json({
                success: false,
                message: "Note not found or already deleted"
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.deletenotes = deletenotes;
