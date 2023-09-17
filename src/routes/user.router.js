import { Router } from 'express';
import { adminSession } from '../middlewares/middlewareAccess.js';
import UserController from '../controllers/user.controllers.js';

const router = Router();
const userController = new UserController();

router.get('/', userController.getAllUsers);
router.get('/:uid', userController.findUserById);
router.get('/cart/:cid', userController.findUserByCartId);
router.post('/', userController.createUser);
router.get('/admin/', adminSession, userController.getAllUsersAdmin);
router.put('/admin/editrole/:uid', adminSession, userController.editUserRole);
router.delete('admin/:uid', adminSession, userController.deleteUserById);
router.delete('admin/deleteInactiveUser', adminSession, userController.deleteInactiveUser);
export default router;
