import express, { RequestHandler } from 'express';
import { createChapter, addSubject, addNotes } from '../controller/post';
import { getchapter, getsubject, getNotes } from '../controller/get';
import { updatechapter, updatenotes, updatesubject } from '../controller/put';
import { deletechapter, deletenotes, deletesubject } from '../controller/delete';

const router = express.Router();

router.post('/chapters', createChapter as RequestHandler);

router.post('/chapters/:chapterId/subjects', addSubject as RequestHandler);

router.post('/chapters/:chapterId/subjects/:subjectId/notes', addNotes as RequestHandler);

router.get('/getchapters', getchapter as RequestHandler); 

router.get('/chapters/:chapterId/getsubjects', getsubject as RequestHandler);

router.get('/chapters/:chapterId/subjects/:subjectId/getnotes', getNotes as RequestHandler);

router.put('/updatechapter/:id', updatechapter as RequestHandler);

router.put('/chapter/:id/updatesubject', updatesubject as RequestHandler);

router.put('/chapter/:id/updatenotes', updatenotes as RequestHandler);

router.delete('/deletechapter/:id', deletechapter as RequestHandler)

router.delete('/deletesubject/:id', deletesubject as RequestHandler)

router.delete('/deletenotes/:id', deletenotes as RequestHandler)
export default router;