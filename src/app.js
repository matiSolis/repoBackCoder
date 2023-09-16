import express from 'express';
import handlebars from 'express-handlebars';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
// imports propios
import './config/dbConnection.js';
import { swaggerSpecs } from './config/docConfig.js';
import { options } from './config/options.js';
import mongoDB from './config/mongoDB.js';
import __dirname from './path.js';
import loggerRoute from './routes/loger.router.js';
import cartRouter from './routes/cart.router.js';
// import purchaseRouter from './routes/purchase.router.js';
import userRouter from './routes/user.router.js';
import currentRouter from './routes/current.router.js';
import productRouter from './routes/product.router.js';
import sessionRouter from './routes/session.router.js';
import adminRouter from './routes/admin.router.js';
import viewsRouter from './routes/views.router.js';
import initializePassport from './config/passport.config.js';
import { errorHandler } from './middlewares/middlewareError.js';
import { addLogger } from './helpers/logger.js';

export const PORT = options.server.port;

const app = express();
app.use(addLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
mongoDB(app);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
// vistas
app.use('/', viewsRouter);
app.use('/admin', adminRouter);
app.use('/api/products', productRouter);
app.use('/api/current', currentRouter);
app.use('/api/carts', cartRouter);
app.use('/api/users', userRouter);
app.use('/api/loger', loggerRoute);
app.use('/api/session', sessionRouter);
// app.use('/api/purchase', purchaseRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Servidor funcionando en el puerto: ' + PORT);
});
