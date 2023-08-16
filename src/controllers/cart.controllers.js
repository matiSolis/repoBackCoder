import CartManagerMongo from "../Dao/managers/mongo/cartManagerMongo.js";
import TicketManagerMongo from "../Dao/managers/mongo/ticketManagerMongo.js";
import { EError } from "../enums/EError.js";
import { generateErrorParam } from "../services/error/errorParam.js";
import { generateQuantityErrorInfo } from "../services/error/errorInfo.js";
import CustomError from "../services/error/errorConstructor/customError.service.js";

const cartManagerMongo = new CartManagerMongo();
const ticketManagerMongo = new TicketManagerMongo();

export default class CartController{
    //Obtener todos los carts
    async getAllCarts (req, res) {
        try {
            const result = await cartManagerMongo.getAllCarts();
            res.status(200).send({
                status: "success",
                result
            });
        }catch(error){
            res.status(400).send({
                status: "Error",
                msg: `El total de carritos no se puede visualizar.`
            });
        };
    };
    //obtener cart por id
    async getCartById (req, res, next) {
        try{
            const idCart = req.params.cid;
            const result = await cartManagerMongo.getCartById(idCart);
            if(!result){
                CustomError.createError({
                    name: "Cart get by id error",
                    cause:"Error obteniendo el carrito por el id.",
                    message:generateErrorParam(idCart),
                    errorCode: EError.INVALID_PARAM
                });
            };
            return res.status(200).send({
                status: "success",
                result
            });
        }catch (error) {
            next(error);
        };
    };
    //Obtener todos los productos completos dentro del cart seleccionado
    async getDetailsInCart (req, res, next) {
        try {
            const idCart = req.params.cid;
            CustomError.createError({
                name: "Cart get by id error",
                cause:generateErrorParam(idCart),
                message:"Error obteniendo el carrito por el id.",
                errorCode: EError.INVALID_PARAM
            });
            const result = await cartManagerMongo.getDetailsInCart(idCart);
            return res.status(200).send({
                status: "success",
                result
            });
        } catch (error) {
            next(error);
        };
    };
    //crear un cart
    async createNewCart (req, res,) {
        try{
            const result = await cartManagerMongo.createNewCart();
            res.status(200).send({
                status: "success",
                result
            });
        }catch (error) {
            res.status(400).send({
                status: "Error",
                msg: `El carrito solicitado no se puede crear.`
            });
        };
    };
    //agregar productos por id en el cart seleccionado
    async addProductInCart (req, res, next) {
        try {
            const idCart = req.params.cid;
            const idProduct = req.params.pid;
            CustomError.createError({
                name: "Cart get by id error",
                cause:generateErrorParam(idCart),
                message:"Error obteniendo el carrito por el id.",
                errorCode: EError.INVALID_PARAM
            });
            CustomError.createError({
                name: "Product get by id error",
                cause:generateErrorParam(idProduct),
                message:"Error obteniendo el uproducto por el id",
                errorCode: EError.INVALID_PARAM
            });
            const result = await cartManagerMongo.addProductInCart(idCart, idProduct);
            return res.status(200).send({
                status: "success",
                result
            });
        } catch (error) {
            next(error);
        };
    };
    //elimiar todos los productos del cart
    async clearCart (req, res, next) {
        try {
            const idCart = req.params.cid;
            CustomError.createError({
                name: "Cart get by id error",
                cause:"Error obteniendo el carrito por el id.",
                message:generateErrorParam(idCart),
                errorCode: EError.INVALID_PARAM
            });
            const result = await cartManagerMongo.clearCart(idCart);
            res.status(200).send({
                status: "Success",
                result
            });
        } catch (error) {
            next(error);
        };
    };
    //actualizar la cantidad del producto seleccionado en el cart enviado por id
    async updateProductQuantity (req, res, next) {
        try {
            const idCart = req.params.cid;
            const idProduct = req.params.pid;
            const quantity = req.body.quantity;
            CustomError.createError({
                name: "Cart get by id error",
                cause:generateErrorParam(idCart),
                message:"Error obteniendo el carrito por el id.",
                errorCode: EError.INVALID_PARAM
            });
            CustomError.createError({
                name: "Product get by id error",
                cause:generateErrorParam(idProduct),
                message:"Error obteniendo el uproducto por el id",
                errorCode: EError.INVALID_PARAM
            });
            const quantityNumb = parseInt(quantity);
            if(Number.isNaN(quantityNumb)){
                CustomError.createError({
                    name: "Qantity error",
                    cause:generateQuantityErrorInfo(quantityNumb),
                    message:"Error obteniendo la cantidad solicitada.",
                    errorCode: EError.INVALID_JSON
                });
            };
            const result = await cartManagerMongo.updateProductQuantity(idCart, idProduct, quantity);
            res.status(200).send({
                status: "success",
                result
            });
        } catch (error) {
            next(error);
        };
    };
    //agrega un producto seleccionado a un carrito en especial y si este producto ya esta en el cart, le suma el quantity
    async addProductsToCart (req, res, next) {
        try {
            const idCart = req.params.cid;
            const products = req.body;
            CustomError.createError({
                name: "Cart get by id error",
                cause:generateErrorParam(idCart),
                message:"Error obteniendo el carrito por el id.",
                errorCode: EError.INVALID_PARAM
            });
            const result = await cartManagerMongo.addProductsToCart(idCart, products);
            res.status(200).send({
                status: 'success',
                result,
            });
        } catch (error) {
            next(error);
        };
    };
    //genera la orden de compra del cart
    async purchaseCart (req, res, next) {
        try {
            const idCart = req.params.cid;
            CustomError.createError({
                name: "Cart get by id error",
                cause:generateErrorParam(idCart),
                message:"Error obteniendo el carrito por el id.",
                errorCode: EError.INVALID_PARAM
            });
            const result = await ticketManagerMongo.purchaseCart(idCart);
            res.status(200).send({
                status: 'success',
                result
            });
        } catch (error) {
            next(error);
        }
    };
};