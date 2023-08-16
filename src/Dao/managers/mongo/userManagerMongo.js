import userModel from "../../models/user.model.js";
import CartManagerMongo from "./cartManagerMongo.js";
import { createHash } from "../../../helpers/hashAndValidate.js";
import { sendMailUserDeleted } from "../../../helpers/sendMailUserDeleted.js"

const cartManagerMongo = new CartManagerMongo();

export class UserManagerMongo {
    constructor(){
        this.model = userModel;
    };
    async post ({first_name, last_name, age, email, password}) {
        if (!first_name || !last_name || !age || !email || !password ) {
            throw new Error(`Faltan datos`);
        };
        const newUser = {
            first_name,
            last_name,
            age,
            email,
            password:createHash(password)
        };
        const result = await this.model.create(newUser);
        return result;
    };
    async postGithub ({first_name, last_name, age, email, password}) {
        const newUser = {
            first_name,
            last_name,
            age,
            email,
            password
        };
        const result = await this.model.create(newUser);
        return result;
    };
    async findUserByEmail(username){
        const user = await this.model.findOne({email:username});
        return user;
    };
    async findUserById(idUser){
        const user = await this.model.findOne({_id: idUser});
        return user;
    };
    async findUserByJsonEmail(profile){
        const user = await this.model.findOne({email: profile._json.email});
        return user;
    };
    async deleteUserById(idUser){
        const user = await this.model.findOne({_id: idUser});
        console.log(user)
        if(!user){
            throw new Error('Usuario inexistente.')
        }else{
            const cartId = user.cart.toString();
            console.log(cartId + " esta aca");
            const deleteCart = await cartManagerMongo.deleteCart(cartId);
            console.log(deleteCart);
            await this.model.findByIdAndDelete(idUser);
            await sendMailUserDeleted(user.email);
        };
        await user.save();
    };
    async getAllUsers(){
        const users = await this.model.find();
        return users;
    };
};