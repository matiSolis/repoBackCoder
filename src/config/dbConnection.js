import mongoose from 'mongoose';
import { options } from './options.js';

let connectDB = null;

(async () => {
  try {
    if (connectDB) {
      console.log('Ya estás conectado a la base de datos');
      return connectDB;
    } else {
      connectDB = await mongoose.connect(options.mongoDB.url);
      console.log('Conectado con la base de datos');
      return connectDB;
    }
  } catch (error) {
    console.log('Error al conectarse a la base de datos: ' + error);
  }
})();
