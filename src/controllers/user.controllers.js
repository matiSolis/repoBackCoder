/* eslint-disable camelcase */
import UserManagerMongo from '../Dao/managers/mongo/userManagerMongo.js';
import { EError } from '../enums/EError.js';
import { generateErrorParam } from '../services/error/errorParam.js';
import CustomError from '../services/error/errorConstructor/customError.service.js';

const userManagerMongo = new UserManagerMongo();

export default class UserController {
  // Obtener todos los usuarios
  async getAllUsers (req, res) {
    try {
      const result = await userManagerMongo.getAllUsers();
      res.status(200).send({
        status: 'success',
        result
      });
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

  // Eliminar un usuario
  async deleteUserById (req, res, next) {
    try {
      const idUser = req.params.uid;
      const result = await userManagerMongo.deleteUserById(idUser);
      if (!result) {
        CustomError.createError({
          name: 'User deleted by id error',
          cause: 'Error eliminando el usuario por el id.',
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

  // Elimina usuario inactivo por dos dias
  async deleteInactiveUser (req, res, next) {
    try {
      const result = await userManagerMongo.deleteInactiveUser();
      res.status(200).send({
        status: 'success',
        result
      });
    } catch (error) {
      next(error);
    }
  }
};
