import { Request, Response, RequestHandler } from "express";
import PhysicsModel from "../models/physicsmodel";
import ChemistryModel from "../models/chemistrymodel";
import MathsModel from "../models/mathsmodel";
// import mongoose from 'mongoose';

type subjectType = 'physics' | 'chemistry' | 'math'

const models:Record<subjectType, typeof PhysicsModel> = {
    physics:PhysicsModel,
    chemistry:ChemistryModel,
    math:MathsModel,
}

function isSubjectType(str:string):str is subjectType{
    return ['physics', 'chemistry', 'math'].includes(str);
}
export const updatechapter:RequestHandler = async(req:Request, res:Response):Promise<void>=>{
    try{
        const {id} = req.params;
    const {chaptername, subjectType} = req.body;
    if(!isSubjectType(subjectType)){
        res.status(400).json({
            success:false,
            message:"does not belong to given subjectType",
        })
        return;
    }
    const model = models[subjectType]
    const update =await model.findByIdAndUpdate(
        id,
        {chaptername, updatedAt:Date.now()},
        {new: true}
    )
    if(!update){
        res.status(404).json({
            success:false,
            message:"chapter doesnt exist",
        })
        return;
    }
     res.status(200).json({
        success:true,
        message:"chapter updated successfully",
    })
    return;
    
    }
    catch(err){
        console.error(err);
        console.log("some error occured");
        res.status(500).json({
            success:false,
            message:"server error"
        })
    }
}

export const updatesubject:RequestHandler = async(req:Request, res:Response):Promise<void> => {
    try{
        const{id} = req.params;
        const{subjectId, newSubjectName, subjectType} = req.body;
        if(!isSubjectType(subjectType)){
            res.status(400).json({
                success:false,
                message:"subjectType doesnt match"
            })
            return;
        }
        const model = models[subjectType]
        const update = await model.updateOne(
            {_id:id, "subcontent._id": subjectId},
            {
                $set: {
                    "subcontent.$.nameofsubject": newSubjectName,
                    updatedAt: Date.now(),
                }
            }
        )
         res.status(200).json({
            success:true,
            message:"subject updated",
        })
    }
    catch(err){
        console.error(err);
        console.log("some error occured");
        res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }
}
export const updatenotes: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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
    const result = await model.updateOne(
      { 
        _id: id, 
        "subcontent.notes._id": notesId 
      },
      {
        $set: {
          "subcontent.$[].notes.$[note].formula": newformula,
          "subcontent.$[].notes.$[note].notes": newnotes,
        }
      },
      {
        arrayFilters: [
          { "note._id": notesId }
        ]
      }
    );

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
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};