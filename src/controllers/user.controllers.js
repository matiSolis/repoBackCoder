/* eslint-disable indent */
/* eslint-disable camelcase */
import passport from 'passport';
import UserManagerMongo from '../Dao/mongo/userManagerMongo.js';
import { EError } from '../enums/EError.js';
import { generateErrorParam } from '../services/error/errorParam.js';
import CustomError from '../services/error/errorConstructor/customError.service.js';
import { sendMailRegister } from '../helpers/sendMailRegister.js';
import userModel from '../Dao/models/user.model.js';
import cartModel from '../Dao/models/cart.model.js';

const userManagerMongo = new UserManagerMongo();

export default class UserController {
  // Obtener todos los usuarios
  async getAllUsersAdmin (req, res) {
    try {
      const users = await userModel.find().lean().exec();
      const data = users.map((user) => {
        return {
          _id: user._id,
          first_name: user.first_name,
          email: user.email,
          cart: user.cart,
          role: user.role
        };
      });
      res.json({ status: 'succes', payload: data });
    } catch (error) {
      res.status(400).send({
        status: 'Error',
        msg: 'El total de usuarios no se puede visualizar.'
      });
    }
  };

  async getAllUsers (req, res) {
    try {
      const users = await userModel.find();
      const data = users.map((user) => {
        return {
          _id: user._id,
          first_name: user.first_name,
          email: user.email,
          cart: user.cart,
          role: user.role
        };
      });
      res.json({ status: 'succes', payload: data });
    } catch (error) {
      res.status(400).send({
        status: 'Error',
        msg: 'El total de usuarios no se puede visualizar.'
      });
    }
  };

  // Crear un usuario nuevo
  async createUser (req, res) {
    try {
      const { first_name, last_name, email, age, password, role } = req.body;
      const findUser = await userManagerMongo.findUserByEmail({ email });
      if (findUser && findUser.email === email) {
        throw new Error('Ya hay un usuario creado con ese Email.');
      }
      console.log('Pasamos por el create user del user.controller');
      const newUser = {
        first_name,
        last_name,
        age,
        email,
        password,
        role
      };
      const result = await userManagerMongo.addUser(newUser);
      res.status(200).send({
        status: 'success',
        result
      });
    } catch (error) {
      res.status(400).send({
        status: 'Error',
        msg: 'Aca el usuario no se pudo crear.'
      });
    }
  };

  // Buscar un usuario por su id
  async findUserById (req, res, next) {
    try {
      const idUser = req.params.uid;
      const result = await userManagerMongo.findUserById(idUser);
      if (!result) {
        CustomError.createError({
          name: 'User get by id error',
          cause: 'Error obteniendo el usuario por el id.',
          message: generateErrorParam(idUser),
          errorCode: EError.INVALID_PARAM
        });
      };
      res.status(200).send({
        status: 'success',
        result
      });
    } catch (error) {
      next(error);
    }
  };

  // Buscar un usuario por su id
  async findUserByCartId (req, res, next) {
    try {
      const idCart = req.params.cid;
      const result = await userModel.findOne({ cart: idCart });
      if (!result) {
        CustomError.createError({
          name: 'User get by id error',
          cause: 'Error obteniendo el usuario por el id.',
          message: generateErrorParam(idCart),
          errorCode: EError.INVALID_PARAM
        });
      };
      res.status(200).send({
        status: 'success',
        result
      });
    } catch (error) {
      next(error);
    }
  };

  // Eliminar un usuario
  async deleteUserById (req, res, next) {
    try {
      const idUser = req.params.uid;
      const user = await userModel.findById(idUser);
      if (!user) {
        CustomError.createError({
          name: 'User not found error',
          cause: 'Usuario no encontrado.',
          message: generateErrorParam(idUser),
          errorCode: EError.INVALID_PARAM
        });
      }
      const cartId = user.cart;
      if (cartId) {
        const cartDeleted = await cartModel.findByIdAndDelete(cartId);
        if (!cartDeleted) {
          CustomError.createError({
            name: 'Cart not deleted error',
            cause: 'Error eliminando el carrito por el ID.',
            message: generateErrorParam(cartId),
            errorCode: EError.INVALID_PARAM
          });
        }
      }
      const result = await userModel.findByIdAndDelete(idUser);
      if (!result) {
        CustomError.createError({
          name: 'User deleted by id error',
          cause: 'Error eliminando el usuario por el ID.',
          message: generateErrorParam(idUser),
          errorCode: EError.INVALID_PARAM
        });
      }
      res.status(200).send({
        status: 'success',
        result
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // Elimina usuario inactivo por dos dias
  async deleteInactiveUser (req, res, next) {
    try {
      const result = await userManagerMongo.deleteInactiveUsers();
      res.status(200).send({
        status: 'success',
        result
      });
    } catch (error) {
      next(error);
    }
  }

  // Registro de usuarios
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

  // Registro fallido de usuario
  async failRegister (req, res) {
    console.log('Fallo en el registro');
    req.logger.warn('Fallo al registrarse');
    res.send({ error: 'Error en el registro' });
  };

  // Login de usuario
  async login (req, res) {
    if (!req.user) {
      return res.status(400).json({ status: 'error', error: 'Credenciales de usuario Incorrectas' });
    }
    req.session.user = {
      id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      cart: req.user.cart,
      role: req.user.role,
      last_connection: req.user.last_connection
    };
    req.logger.info('Inicio de Session');
    res.json({ status: 'success', payload: req.user });
  };

  // Login fallido de usuario
  async failLogin (req, res) {
    console.log('Fallo en el ingreso');
    res.status(400).send({ error: 'Error en el ingreso.' });
  };

  // Cerrar sesion
  async logout (req, res) {
    req.session.destroy(err => {
      if (err) return res.status(500).send({ status: 'error', error: 'No pudo cerrar sesion' });
      req.logger.info('Usuario desconectado');
      res.redirect('/login');
    });
  };

  // Sesion con github
  async github (req, res, next) {
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
  };

  // Github Callback
  async githubCallbacks (req, res) {
    passport.authenticate('github', { failureRedirect: '/login' });
    req.session.user = req.user;
    req.logger.info('Usuario logueado usando github');
    res.redirect('/');
  };

  // Edita el role del usuario
  editUserRole = async (req, res) => {
    try {
      const { role } = req.body;
      const idUser = req.params.uid;
      const user = await userModel.findById(idUser);
      if (!user) {
        return res.json({
          status: 'error',
          message: 'Usuario inexistente.'
        });
      }
      user.role = role;
      await userModel.updateOne({ _id: user._id }, user);
      res.status(200).json({ status: 'success', message: 'Rol modificado exitosamente.' });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({
        status: 'error',
        message: 'No es posible modificar el rol del usuario seleccionado. Contactese con soporte.'
      });
    }
  };
};
