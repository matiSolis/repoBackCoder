import passport from 'passport';
import { sendMailRegister } from '../helpers/sendMailRegister.js';
import { dateConnection } from '../helpers/dateConnection.js';

export default class SessionController {
  async register (req, res) {
    try {
      const user = req.body;
      await sendMailRegister(user);
      res.send({ status: 'success', payload: req.user, message: 'User registered' });
      req.logger.info('Usuario registrado');
    } catch (error) {
      console.log('Error en el registro:', error);
      res.status(400).send({ error: 'Error en el registro' });
    };
  };

  async failRegister (req, res) {
    console.log('Fallo en el registro');
    req.logger.warn('Fallo al registrarse');
    res.send({ error: 'Error en el registro' });
  };

  async login (req, res, next) {
    passport.authenticate('login', { failureRedirect: '/failLogin' }, (err, user) => {
      if (err) {
        return res.status(500).send({ status: 'error', error: 'Error en el servidor' });
      };
      if (!user) {
        return res.status(400).send({ status: 'error', error: 'Credenciales inválidas' });
      };
      user.last_connection = dateConnection();
      user.save();
      req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        email: user.email,
        cart: user.cart,
        role: user.role
      };
      req.logger.info('Usuario logueado');
      if (user.role === 'Admin') {
        return res.redirect('/admin');
      } else {
        return res.status(200).send({ status: 'success', payload: req.res.user, message: 'Logueo de usuario exitoso.' });
      };
    })(req, res, next);
  };

  async failLogin (req, res) {
    console.log('Fallo en el ingreso');
    res.status(400).send({ error: 'Error en el ingreso.' });
  };

  async logout (req, res) {
    req.session.destroy(err => {
      if (err) return res.status(500).send({ status: 'error', error: 'No pudo cerrar sesion' });
      req.logger.info('Usuario desconectado');
      res.redirect('/login');
    });
  };

  async github (req, res, next) {
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
  };

  async githubCallbacks (req, res) {
    passport.authenticate('github', { failureRedirect: '/login' });
    req.session.user = req.user;
    req.logger.info('Usuario logueado usando github');
    res.redirect('/');
  };
}
