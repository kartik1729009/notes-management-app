import { Request, Response, RequestHandler } from "express";
import PhysicsModel from '../models/physicsmodel'; 
import ChemistryModel from '../models/chemistrymodel'; 
import MathsModel from '../models/mathsmodel';

type SubjectType = 'physics' | 'chemistry' | 'math';
const models = {
    physics: PhysicsModel,
    chemistry: ChemistryModel,
    math: MathsModel,
} as const;

function isSubjectType(str: string): str is SubjectType {
    return ['physics', 'chemistry', 'math'].includes(str);
}

export const getchapter = async (req: Request, res: Response): Promise<void> => {
    try {
        const subjectType = req.query.subjectType as string;
        
        if (!subjectType || !isSubjectType(subjectType)) {
            res.status(400).json({
                success: false,
                message: "Invalid subject type. Choose from physics, chemistry, or math.",
            });
            return;
        }

        const model = models[subjectType];
        const chapters = await model.find({}); // Changed from findOne to find to get all chapters
        
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

    } catch (err) {
        console.error("Error fetching chapters:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching chapters",
        });
    }
}

export const getsubject = async (req: Request, res: Response): Promise<void> => {
    try {
        const subjectType = req.query.subjectType as string;
        const chaptername = req.query.chaptername as string;

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
        const chapter = await model.findOne({ chaptername });

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

    } catch (err) {
        console.error("Error fetching subjects:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching subjects",
        });
    }
}

export const getNotes: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const subjectType = req.query.subjectType as string;
        const chaptername = req.query.chaptername as string;
        const subjectname = req.query.subjectname as string;

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
        const chapter = await model.findOne({ chaptername });

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

    } catch (err) {
        console.error("Error fetching notes:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching notes",
        });
    }
};