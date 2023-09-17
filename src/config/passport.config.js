/* eslint-disable camelcase */
import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import { validatePassword } from '../helpers/hashAndValidate.js';
import userModel from '../Dao/models/user.model.js';
import UserManagerMongo from '../Dao/mongo/userManagerMongo.js';
// import { ContactRepository } from '../repository/user.repository.js';
import CartModel from '../Dao/models/cart.model.js';
import { dateConnection } from '../helpers/dateConnection.js';
// import UserController from '../controllers/user.controllers.js';

// const userController = new UserController();
const userManagerMongo = new UserManagerMongo();
const cartModel = new CartModel();
const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });

  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age, role } = req.body;
        try {
          const newUser = await userManagerMongo.addUser(
            first_name,
            last_name,
            age,
            email,
            password,
            role,
            username
          );
          if (!newUser) {
            const errorMessage = 'El usuario ya existe en la base de datos';
            return done(null, false, errorMessage);
          }
          return done(null, newUser);
        } catch (error) {
          return done('Error al registrar el usuario: ' + error);
        }
      }
    )
  );

  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await userManagerMongo.login(username);
          if (!user) {
            console.log('No existe el usuario');
            return done(null, false);
          }
          if (!validatePassword(password, user)) return done(null, false);
          user.last_connection = dateConnection();
          await user.save();
          return done(null, user);
        } catch (error) {
          return done('Error al intentar ingresar: ' + error);
        }
      }
    )
  );

  passport.use('github', new GitHubStrategy(
    {
      clientID: 'Iv1.8d404415d7c956ee',
      clientSecret: 'aaddafdf749d73f2bf53fb45473024714da1f093',
      callbackURL: 'http://localhost:8080/api/session/githubcallback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await userModel.findOne({ email: profile._json.email });
        if (!user) {
          const email = profile._json.email || `${profile._json.name.replace(/\s+/g, '')}@github.com`;
          const nameParts = profile._json.name.split(' ');
          const newCart = await cartModel.create({});
          const newUser = {
            first_name: nameParts[0],
            last_name: nameParts[1] || '',
            age: 18,
            email,
            password: '1234',
            cart: newCart._id,
            last_connection: dateConnection()
          };
          const result = await userManagerMongo.addUserGithub(newUser);
          done(null, result);
        } else {
          done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  ));
};

export default initializePassport;
