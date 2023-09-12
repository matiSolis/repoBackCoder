/* eslint-disable camelcase */
import userModel from '../../models/user.model.js';
import CartManagerMongo from './cartManagerMongo.js';
import { createHash } from '../../../helpers/hashAndValidate.js';
import { sendMailUserDeleted } from '../../../helpers/sendMailUserDeleted.js';

const cartManagerMongo = new CartManagerMongo();

export class UserManagerMongo {
  constructor () {
    this.model = userModel;
  };

  // creamos un usuario y hacemos un hash del password
  async post ({ first_name, last_name, age, email, password, cart, role, last_connection, products } = {}) {
    if (!first_name || !last_name || !age || !email || !password || !cart || !last_connection || !products) {
      throw new Error('Faltan datos');
    };
    const newUser = {
      first_name,
      last_name,
      age,
      email,
      password: createHash(password),
      cart,
      role,
      last_connection,
      products
    };
    const result = await this.model.create(newUser);
    return result;
  };

  // creamos un usuario desde la cuenta de github
  async postGithub ({ first_name, last_name, age, email, password, cart, role, last_connection, products }) {
    const newUser = {
      first_name,
      last_name,
      age,
      email,
      password,
      cart,
      role,
      last_connection,
      products
    };
    const result = await this.model.create(newUser);
    return result;
  };

  // buscamos un usuario por su email
  async findUserByEmail (username) {
    const user = await this.model.findOne({ email: username });
    return user;
  };

  // buscamos un usuario por su id
  async findUserById (idUser) {
    const user = await this.model.findOne({ _id: idUser });
    return user;
  };

  async findUserByJsonEmail (profile) {
    const user = await this.model.findOne({ email: profile._json.email });
    return user;
  };

  // borramos un usuario por su id, tambien borramos el cart que se le genero
  async deleteUserById (idUser) {
    const user = await this.model.findOne({ _id: idUser });
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
  async getAllUsers () {
    const users = await this.model.find();
    return users;
  };

  // elimina un usuario inactivo luego de un determinado tiempo
  async deleteInactiveUsers () {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const deletedUsers = await userModel.deleteMany({
      last_connection: { $lte: twoDaysAgo }
    });
    console.log(`Se eliminaron ${deletedUsers.deletedCount} usuarios inactivos.`);
  }
};
