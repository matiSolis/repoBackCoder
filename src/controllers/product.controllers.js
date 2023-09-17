import ProductManagerMongo from '../Dao/mongo/productManagerMongo.js';
import UserManagerMongo from '../Dao/mongo/userManagerMongo.js';
import { EError } from '../enums/EError.js';
import { generateErrorParam } from '../services/error/errorParam.js';
import { generateProductErrorInfo } from '../services/error/errorInfo.js';
import CustomError from '../services/error/errorConstructor/customError.service.js';
import { sendMailProductPremiumDeleted } from '../helpers/sendMailProductPremiumDeleted.js';

const productManagerMongo = new ProductManagerMongo();
const userManagerMongo = new UserManagerMongo();

const customError = new CustomError();
export default class ProductController {
  // trae todos los productos de la base de datos
  async getProducts (req, res) {
    try {
      const products = await productManagerMongo.getProducts();
      res.status(200).send({ products });
    } catch (error) {
      res.status(500).send({ error: 'Error interno del servidor' });
    };
  };

  // trae un producto por su id
  async getProductById (req, res) {
    try {
      const idProduct = req.params.pid;
      const productID = parseInt(idProduct);
      if (Number.isNaN(productID)) {
        customError.createError({
          name: 'Product get by id error',
          cause: generateErrorParam(productID),
          message: 'Error obteniendo el uproducto por el id',
          errorCode: EError.INVALID_PARAM
        });
      };
      const product = await productManagerMongo.getProductById(idProduct);
      res.status(200).send({ product });
    } catch (error) {
      res.status(500).send({ error: 'Error interno del servidor' });
    };
  };

  // crea un producto. Por defecto el owner siempre va a ser admin, si el que lo crea es un user premium
  // le modifica el owner a premium
  async addProduct (req, res) {
    try {
      const { title, description, category, price, thumbnail, code, stock, owner } = req.body;
      console.log(req.body);
      if (!title || !description || !category || !price || !thumbnail || !code || !stock || !owner) {
        customError.createError({
          name: 'Product create error',
          cause: generateProductErrorInfo(req.body),
          message: 'Error creando el producto.',
          errorCode: EError.INVALID_JSON
        });
      };
      // let owner = 'Admin';
      // const userRole = req.session.user.role;
      // if (userRole === 'Premium') {
      //   owner = 'Premium';
      // }
      const productData = {
        title,
        description,
        category,
        price,
        thumbnail,
        code,
        stock,
        owner
      };
      await productManagerMongo.addProduct(productData);
      res.status(200).send({ msg: 'Producto creado exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Error interno del servidor' });
    };
  };

  // elimina un producto por id, si ese producto pertenece a un usuario premium se le envia un email avisandole de
  // que su producto fue eliminado
  async deleteProductById (req, res) {
    try {
      const idProduct = req.params.pid;
      customError.createError({
        name: 'Product get by id error',
        cause: generateErrorParam(idProduct),
        message: 'Error obteniendo el uproducto por el id',
        errorCode: EError.INVALID_PARAM
      });
      const product = await ProductController.getProductById(idProduct);
      if (product.owner === 'Premium') {
        const findOwner = await userManagerMongo.findUserById(product.owner);
        await sendMailProductPremiumDeleted(findOwner);
      }
      await productManagerMongo.deleteProductById(idProduct);
      res.status(200).send({ msg: 'Producto eliminado exitosamente' });
    } catch (error) {
      res.status(500).send({ error: 'Error interno del servidor' });
    };
  };

  // actualiza las values de un producto por id
  async updateProductById (req, res) {
    try {
      const idProduct = req.params.pid;
      const { title, description, price, category, thumbnail, code, stock, owner } = req.body;
      customError.createError({
        name: 'Product get by id error',
        cause: generateErrorParam(idProduct),
        message: 'Error obteniendo el uproducto por el id',
        errorCode: EError.INVALID_PARAM
      });
      if (!title || !description || !price || !category || !thumbnail || !code || !stock || !owner) {
        customError.createError({
          name: 'Product create error',
          cause: generateProductErrorInfo(req.body),
          message: 'Error creando el producto.',
          errorCode: EError.INVALID_JSON
        });
      };
      const updateData = {
        title,
        description,
        price,
        category,
        thumbnail,
        code,
        stock,
        owner
      };
      await productManagerMongo.updateProductById(idProduct, updateData);
      res.status(200).send({ msg: 'Producto actualizado exitosamente' });
    } catch (error) {
      res.status(500).send({ error: 'Error interno del servidor' });
    };
  };
};
