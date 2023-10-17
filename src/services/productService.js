import { QueryTypes } from 'sequelize';
import db, { sequelize } from '../models/index';
import public_method from '../public/public_method';

let createProduct = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let productData = {};
            const check = checkProduct(data.nameProduct);
            
        } catch (error) {   
            reject(error);
        }
    });
}

let checkProduct = (name) => {
    return new Promise(async(resolve, reject) => {
        try {
            const query = `SELECT * FROM products WHERE nameProduct = '${name}';`;
            const results = await sequelize.query(query, { type: QueryTypes.SELECT });
            if(results.length !== 0) {
                resolve(true);
            }else{
                resolve(false);
            }
        } catch (error) {   
            reject(error);
        }
    });
}

let updateProduct = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            const query = ``;
            const results = await sequelize.query(query, { type: QueryTypes.SELECT });
            if(results.length !== 0) {
                resolve(true);
            }else{
                resolve(false);
            }
        } catch (error) {   
            reject(error);
        }
    });
}


module.exports = {
    createProduct: createProduct,
}