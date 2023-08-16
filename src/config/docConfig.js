import __dirname from "../path.js";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const swaggerOptions = {
    definition:{
        openapi: "3.0.1",
        info:{
            title:"Documentacion api de Ecommerce Jardineria: 'El emporio del jardin'.",
            version: "1.0.0",
            description: "Definicion de endpoints para la api de productos de jardineria."
        }
    },
    apis:[`${path.join(__dirname, "../docs/**/*.yaml")}`]
};

//creamos y exportamos la variable que interprete las opciones
export const swaggerSpecs = swaggerJSDoc(swaggerOptions);