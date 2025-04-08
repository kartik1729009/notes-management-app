import mongoose from 'mongoose';

const notesSchema = new mongoose.Schema({
    formula: { type: String },
    notes: { type: String, required: true }
}, { _id: true });  // Ensure _id is generated for each note

const subjectSchema = new mongoose.Schema({
    nameofsubject: { type: String, required: true },
    notes: [notesSchema]
}, { _id: true });  // Ensure _id is generated for each subject

const chapterSchema = new mongoose.Schema({
    chaptername: { type: String, required: true, unique: true }, // Added unique
    subcontent: [subjectSchema]
}, { timestamps: true });  // Added timestamps for created/updated

// Create and export the model
const ChemistryModel = mongoose.model("Chemistry", chapterSchema);
export default ChemistryModel;