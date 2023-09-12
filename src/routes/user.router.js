import { Router } from 'express';
import UserController from '../controllers/user.controllers.js';

const router = Router();
const userController = new UserController();

router.get('/', userController.getAllUsers);
router.get('/:uid', userController.findUserById);
router.post('/', userController.createUser);
router.delete('/:uid', userController.deleteUserById);
router.delete('/', userController.deleteInactiveUser);

export default router;
