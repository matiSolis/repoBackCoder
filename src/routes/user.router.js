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
router.delete('/admin/:uid', adminSession, userController.deleteUserById);
// Cuando al endpoint lo pongo en DELETE no funciona, pero si lo dejo en get funciona. No se que pasa
// router.delete('/admin/deleteInactiveUsers', userController.deleteInactiveUsers);
router.get('/admin/deleteInactiveUsers', userController.deleteInactiveUsers);

export default router;
