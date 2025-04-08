import { Request, Response, RequestHandler } from "express";
import PhysicsModel from "../models/physicsmodel";
import ChemistryModel from "../models/chemistrymodel";
import MathsModel from "../models/mathsmodel";

type subjectType = 'physics'|'chemistry'|'maths'

const models:Record<subjectType, typeof PhysicsModel>={
    physics:PhysicsModel,
    chemistry:ChemistryModel,
    maths:MathsModel
}

function isSubjectType(str:string):str is subjectType{
    return ['physics', 'chemistry', 'maths'].includes(str);
}

export const deletechapter = async(req:Request, res:Response)=>{
    try{
    const {id} = req.params;
        const {subjectType} = req.body;
        if(!isSubjectType(subjectType)){
            return res.status(400).json({
                success:false,
                message:"subjectType does not match"
            })
        }
        const model = models[subjectType];
        const find = await model.findById(id);
        if(!find){
            return res.status(404).json({
                success:false,
                message:"chapter does not exist",
            });
        }
        const deleted = await model.findByIdAndDelete(id);
        if(!deleted){
            return res.status(400).json({
                success:false,
                message:"cant delete due to some error",
            })
        }
        return res.status(200).json({
            success:true,
            message:"chapter deleted successfully",
        })
    }
    catch(err){
        console.error(err);
        console.log("some error occured");
        res.status(500).json({
            success:false,
            message:"internal server error",
        })
    }
}

export const deletesubject : RequestHandler= async(req:Request, res:Response):Promise<void>=>{
    try{
        const {id} = req.params;
        const {nameofsubject, subjectType} = req.body;
        if(!isSubjectType(subjectType)){
             res.status(400).json({
                success:false,
                message:"subject does not match",
            })
            return;
        }
        const model = models[subjectType];
        const updated = await model.updateOne(
            {_id:id},
            {
                $pull:{
                    subcontent:{nameofsubject: nameofsubject}
                }
            }
        )
        if(updated.modifiedCount ===0){
             res.status(404).json({
                success:false,
                message:"subject not found or already deleted"
            });
        }
         res.status(200).json({
            success: true,
            message: "subject deleted successfully"
        });

    }
    catch(err){
        console.error(err);
        console.log("some error occured");
        res.status(500).json({
            success:false,
            message:"internal server error",
        })
    }
}

export const deletenotes:RequestHandler = async (req: Request, res: Response):Promise<void> => {
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

        const updated = await model.updateOne(
            {
                _id: id,
                "subcontent.nameofsubject": nameofsubject
            },
            {
                $pull: {
                    "subcontent.$.notes": {
                        _id: noteId // Delete by ID instead of formula & notes
                    }
                }
            }
        );

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

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};