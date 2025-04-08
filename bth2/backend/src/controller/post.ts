import { Request, Response } from 'express';
import PhysicsModel from '../models/physicsmodel'; 
import ChemistryModel from '../models/chemistrymodel'; 
import MathsModel from '../models/mathsmodel';

type SubjectType = 'physics' | 'chemistry' | 'maths';

const models: Record<SubjectType, typeof PhysicsModel> = {
    physics: PhysicsModel,
    chemistry: ChemistryModel,
    maths: MathsModel
};

interface CreateChapterBody {
    chaptername: string;
    subjectType: SubjectType;
}

interface AddSubjectBody {
    chaptername: string;
    nameofsubject: string;
    subjectType: SubjectType;
}

interface AddNotesBody {
    chaptername: string;
    nameofsubject: string;
    formula?: string;
    notes: string;
    subjectType: SubjectType;
}

function isSubjectType(str: string): str is SubjectType {
    return ['physics', 'chemistry', 'maths'].includes(str);
}

export const createChapter = async (req: Request<{}, {}, CreateChapterBody>, res: Response) => {
    try {
        const { chaptername, subjectType } = req.body;
        
        if (!isSubjectType(subjectType)) {
            return res.status(400).json({ success: false, message: "Invalid subject type" });
        }

        const Model = models[subjectType];
        let chapter = await Model.findOne({ chaptername });

        if (!chapter) {
            chapter = await Model.create({ chaptername, subcontent: [] });
        }

        res.status(200).json({ success: true, data: chapter, message: "Chapter is ready!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error creating chapter" });
    }
};

export const addSubject = async (req: Request<{}, {}, AddSubjectBody>, res: Response) => {
    try {
        const { chaptername, nameofsubject, subjectType } = req.body;
        
        if (!isSubjectType(subjectType)) {
            return res.status(400).json({ success: false, message: "Invalid subject type" });
        }

        const Model = models[subjectType];
        const chapter = await Model.findOne({ chaptername });
        if (!chapter) return res.status(404).json({ success: false, message: "Chapter not found" });

        const subjectExists = chapter.subcontent.some(sub => sub.nameofsubject === nameofsubject);
        if (subjectExists) return res.status(400).json({ success: false, message: "Subject already exists" });

        chapter.subcontent.push({ nameofsubject, notes: [] });
        await chapter.save();

        res.status(200).json({ success: true, message: "Subject added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error adding subject" });
    }
};

export const addNotes = async (req: Request<{}, {}, AddNotesBody>, res: Response) => {
    try {
        const { chaptername, nameofsubject, formula, notes, subjectType } = req.body;
        
        if (!isSubjectType(subjectType)) {
            return res.status(400).json({ success: false, message: "Invalid subject type" });
        }

        const Model = models[subjectType];
        const chapter = await Model.findOne({ chaptername });
        if (!chapter) return res.status(404).json({ success: false, message: "Chapter not found" });

        const subject = chapter.subcontent.find(sub => sub.nameofsubject === nameofsubject);
        if (!subject) return res.status(404).json({ success: false, message: "Subject not found" });

        subject.notes.push({ formula, notes });
        await chapter.save();

        res.status(200).json({ success: true, message: "Notes added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error adding notes" });
    }
};