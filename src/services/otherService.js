import { QueryTypes } from 'sequelize';
import db, { sequelize } from '../models/index';
import public_method from '../public/public_method';

let getMethodShipping = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = {};
            const query = `SELECT idShipment, nameShipment, fee, timeShip, iconShipment FROM deliverymethods`;
            const result = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
            });
            if (result.length !== 0) {
                data.errCode = 0;
                data.errMessage = 'Lấy phương thức vận chuyển thành công.'
                data.methodshinppings = result
            } else {
                data.errCode = 1;
                data.errMessage = 'Lấy phương thức vận chuyển thất bại.'
            }
            resolve(data);
        } catch (error) {   
            reject(error);
        }
    });
}

let getMethodPayment = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = {};
            const query = `SELECT idPayment, namePayment, iconPayment FROM paymentmethods`;
            const result = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
            });
            if (result.length !== 0) {
                data.errCode = 0;
                data.errMessage = 'Lấy phương thức thanh toán thành công.'
                data.methodpayments = result
            } else {
                data.errCode = 1;
                data.errMessage = 'Lấy phương thức thanh toán thất bại.'
            }
            resolve(data);
        } catch (error) {   
            reject(error);
        }
    });
}

module.exports = {
    getMethodShipping: getMethodShipping,
    getMethodPayment: getMethodPayment,
}