import { CreateContactDto } from '../Dao/dto/contact.dto.js';

export class ContactRepository {
  constructor (dao) {
    this.dao = dao;
  };

  async getContacts () {
    const contacts = await this.dao.getAllUsers();
    return contacts;
  };

  async createContact (user) {
    const contactDto = new CreateContactDto(user);
    const contactCreated = await this.dao.addUser(contactDto);
    return contactCreated;
  };

  async createContactGitHub (user) {
    const contactDto = new CreateContactDto(user);
    const contactCreated = await this.dao.addUserGithub(contactDto);
    return contactCreated;
  };
}
