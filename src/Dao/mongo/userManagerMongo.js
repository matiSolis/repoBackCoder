/* eslint-disable camelcase */
import userModel from '../models/user.model.js';
import CartManagerMongo from './cartManagerMongo.js';
import { createHash } from '../../helpers/hashAndValidate.js';
import { sendMailUserDeleted } from '../../helpers/sendMailUserDeleted.js';

const cartManagerMongo = new CartManagerMongo();

export default class UserManagerMongo {
  constructor () {
    this.userModel = userModel;
  }

  // creamos un usuario y hacemos un hash del password
  async addUser (first_name, last_name, age, email, password, role, username) {
    try {
      const userExist = await this.userModel.findOne({ email: username }).exec();
      if (userExist) {
        console.log('El usuario ya exite');
        return false;
      }
      const newCart = await cartManagerMongo.createNewCart({});
      const newUser = {
        first_name,
        last_name,
        age,
        email,
        password: createHash(password),
        cart: newCart._id,
        role
      };
      const result = await this.userModel.create(newUser);
      return result;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  async login (username) {
    try {
      const user = await this.userModel.findOne({ email: username }).exec();
      if (!user) {
        console.log('Es necesario registrarse');
        return false;
      }
      return user;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // creamos un usuario desde la cuenta de github
  async addUserGithub ({ first_name, last_name, age, email, password }) {
    const newUser = {
      first_name,
      last_name,
      age,
      email,
      password
    };
    const result = await userModel.create(newUser);
    return result;
  };

  // buscamos un usuario por su email
  async findUserByEmail (username) {
    const user = await userModel.findOne({ email: username });
    return user;
  };

  // buscamos un usuario por su id
  async findUserById (idUser) {
    const user = await userModel.findById(idUser);
    return user;
  };

  // buscamos un usuario por su email
  async findUserByJsonEmail (profile) {
    const user = await userModel.findOne({ email: profile._json.email });
    return user;
  };

  // buscamos un usuario por su id de cart
  async findUserByCartId (cartId) {
    const user = await userModel.findOne({ cart: cartId });
    return user;
  }

  // borramos un usuario por su id, tambien borramos el cart que se le genero
  async deleteUserById (idUser) {
    const user = await userModel.findOne({ _id: idUser });
    console.log(user);
    if (!user) {
      throw new Error('Usuario inexistente.');
    } else {
      const cartId = user.cart.toString();
      console.log(cartId + ' esta aca');
      const deleteCart = await cartManagerMongo.deleteCart(cartId);
      console.log(deleteCart);
      await this.model.findByIdAndDelete(idUser);
      await sendMailUserDeleted(user.email);
    };
    await user.save();
  };

  // traemos todos los usuarios de la base de datos
  async getAllUsers (req, res) {
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
  };

  // elimina un usuario inactivo luego de un determinado tiempo
  async deleteInactiveUsers () {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const deletedUsers = await userModel.deleteMany({
      last_connection: { $lte: twoDaysAgo },
      role: { $ne: 'Admin' } // con esto evito eliminar admins
    });
    for (const user of deletedUsers) {
      await sendMailUserDeleted(user);
    }
    console.log(`Se eliminaron ${deletedUsers.deletedCount} usuarios inactivos.`);
  }

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
