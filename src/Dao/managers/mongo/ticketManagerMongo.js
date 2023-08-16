import cartModel from "../../models/cart.model.js";
import ticketModel from "../../models/ticket.model.js";
import userModel from "../../models/user.model.js";
import {code} from "../../../helpers/codeGenerator.js";
import {date} from "../../../helpers/dateGenerator.js";
import { sendMailTicket } from "../../../helpers/sendMailTicket.js";

export default class TicketManagerMongo {
    async purchaseCart(idCart) {
    const cart = await cartModel.findById(idCart).populate("products.product");
    let totalAmount = 0;
    const productsToRemove = [];
    for (const productInCart of cart.products) {
        const product = productInCart.product;
        if (productInCart.quantity <= product.stock) {
            product.stock -= productInCart.quantity;
            await product.save();
            totalAmount += product.price * productInCart.quantity;
            productsToRemove.push(productInCart);
        };
    };
    const generateCode = await code();
    const generateDate = await date();
    const user = await userModel.findOne({ cart: idCart });
    const purchaserEmail = user.email;
    const ticketData = {
        code: generateCode,
        purchase_dateTime: generateDate,
        amount: totalAmount,
        purchaser: purchaserEmail,
    };
    await ticketModel.create(ticketData);
    await sendMailTicket(generateCode, generateDate, amount, purchaserEmail);
    for (const productToRemove of productsToRemove) {
            cart.products = cart.products.filter(
            (productInCart) => productInCart._id.toString() !== productToRemove._id.toString()
        );
    };
    await cart.save();
    return ticket;
    };
};