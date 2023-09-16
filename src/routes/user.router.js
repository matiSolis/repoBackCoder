import { Router } from 'express';
import UserManagerMongo from '../Dao/managers/mongo/userManagerMongo.js';

const router = Router();
const userManagerMongo = new UserManagerMongo();

router.get('/', userManagerMongo.getAllUsers);
router.get('/:uid', userManagerMongo.findUserById);
router.post('/', userManagerMongo.addUser);
router.delete('/:uid', userManagerMongo.deleteUserById);
router.delete('/', userManagerMongo.deleteInactiveUsers);

export default router;
