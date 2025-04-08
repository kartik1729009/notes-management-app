import express, { RequestHandler } from 'express'
const router = express.Router();
import {login, createUser} from '../controller/auth'

router.post("/createuser", createUser);
router.post("/login", login);

export default router;