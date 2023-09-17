import passport from 'passport';
import { Router } from 'express';
import UserController from '../controllers/user.controllers.js';

const router = Router();
const sessionController = new UserController();

router.post('/register', passport.authenticate('register', { failureRedirect: '/failRegister' }), sessionController.register);
router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), sessionController.login);
router.get('/failregister', sessionController.failRegister);
router.get('/faillogin', sessionController.failLogin);
router.get('/logout', sessionController.logout);
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), sessionController.github);
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/register' }), sessionController.githubCallbacks);

export default router;
