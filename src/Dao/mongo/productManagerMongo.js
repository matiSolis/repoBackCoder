import productModel from '../models/products.model.js';

export default class ProductManagerMongo {
  // crea un producto
  async addProduct (productData) {
    const { title, description, category, price, thumbnail, code, stock, owner } = productData;
    if (!title || !description || !category || !price || !thumbnail || !code || !stock || !owner) {
      throw new Error('Faltan datos');
    };
    const product = { title, description, category, price, thumbnail, code, stock, owner };
    const result = await productModel.create(product);
    return result;
  };

  // trae todos los productos de la base de datos
  async getProducts () {
    const products = await productModel.find();
    return products;
  };

  // trae un producto por su id
  async getProductById (idProduct) {
    const product = await productModel.findById(idProduct);
    console.log(product)
    return product;
  };

  // borrra un producto por su id
  async deleteProductById (idProduct) {
    const result = await productModel.findByIdAndDelete(idProduct);
    return result;
  };

  // busca un producto por su id y modifica las value
  async updateProductById (idProduct, updateData) {
    const { title, description, price, category, thumbnail, code, stock } = updateData;
    if (!title || !description || !price || !category || !thumbnail || !code || !stock) {
      throw new Error('Faltan datos');
    };
    const product = await productModel.updateOne({ _id: idProduct }, { $set: updateData });
    await product.save();
  };

  // busca y devuelve todos los productos en forma de objetos
  async productsFindLean () {
    const products = await productModel.find().lean();
    return products;
  };
};
