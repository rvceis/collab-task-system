import {Router} from 'express'
import { addMemberController } from '../controllers/addMemberController.js'
import authMiddleware from '../middlewares/authMiddleware.js'   
const router = Router()

router.post("/add-member", authMiddleware, addMemberController);
export default router;