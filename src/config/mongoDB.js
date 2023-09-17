import session from 'express-session';
import MongoStore from 'connect-mongo';
import { options } from './options.js';

const MONGO_URL = options.mongoDB.url;
const SECRET_SESSION = options.server.secretSession;

function mongoConfig (app) {
  app.use(session({
    store: new MongoStore({
      mongoUrl: MONGO_URL,
      ttl: 3200
    }),
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: false
  }));
}

export default mongoConfig;
