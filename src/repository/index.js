import { ContactRepository } from './user.repository.js';
import UserManagerMongo from '../Dao/managers/mongo/userManagerMongo.js';

export const contactService = new ContactRepository(UserManagerMongo());
