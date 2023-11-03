import { QueryTypes } from 'sequelize';
import db, { sequelize } from '../models/index';
import public_method from '../public/public_method';

import imageService from '../services/imageService';
import productService from '../services/productService';
import discountService from '../services/discountService';

let createOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataOrder = {};
            let idOrder = public_method.formatDate() + public_method.generateRandomString();
            // const lastorder = await sequelize.query("SELECT * FROM orders ORDER BY createdAt DESC LIMIT 1;", {
            //     type: QueryTypes.SELECT
            // });
            // if (lastorder.length === 0) {
            //     idOrder = 'ORDER1';
            //     console.log(idOrder);
            // } else {
            //     //Tao idOrder mới bằng cách lấy số cuối của idUser cuối bảng cộng thêm 1 rồi thêm vào chuỗi 'ORDER'
            //     idOrder = 'ORDER' + (public_method.parseIdtoInt(lastorder[0].idOrder) + 1);
            //     console.log(idOrder);
            // }

            //Insert to database
            try {
                const query = `INSERT INTO orders (idOrder, idDelivery, idUser, idPayment, nameCustomer,
                    sdtOrder, address, status, total, payStatus, dayCreateAt, dayUpdateAt, createdAt, updatedAt) VALUES 
                    (:idOrder, :idDelivery, :idUser, :idPayment, :nameCustomer,
                        :sdtOrder, :address, :status, :total, :payStatus, :dayCreateAt, :dayUpdateAt, :createdAt, :updatedAt)`;
                // idOrder	idDelivery	idUser	idPayment	nameCustomer	sdtOrder	address	status	total	payStatus	dayCreateAt	dayUpdateAt	createdAt	updatedAt	

                const values = {
                    idOrder: idOrder,
                    idDelivery: data.idDelivery,
                    idUser: data.idUser,
                    idPayment: data.idPayment,
                    nameCustomer: data.nameCustomer,
                    sdtOrder: data.sdtOrder,
                    address: data.address,
                    status: 'R1',
                    total: data.total,
                    payStatus: data.payStatus,
                    dayCreateAt: new Date(),
                    dayUpdateAt: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                const result = await sequelize.query(query, {
                    replacements: values,
                    type: sequelize.QueryTypes.INSERT,
                });
                console.log('Inserted record:', result[0]);
                if (result[1] === 0) {
                    dataOrder.errCode = 2;
                    dataOrder.errMessage = 'Tạo đơn hàng thất bại.'
                } else {
                    dataOrder.errCode = 0;
                    dataOrder.errMessage = 'Tạo đơn hàng thành công.'

                    for (let i = 0; i < data.products.length; i++) {
                        let result = await createDetailOrder(idOrder, data.products[i])
                        if (result[1] === 0) {
                            dataOrder.errCode = 2;
                            dataOrder.errMessage = 'Tạo đơn hàng thất bại.'
                        } else {
                            let resultUpdateQuantityProduct =
                                await productService.updateQuantityProduct(
                                    data.products[i].idProduct,
                                    data.products[i].numProduct
                                );
                            if (resultUpdateQuantityProduct.errCode === 1) {
                                dataOrder.errCode = 2;
                                dataOrder.errMessage = 'Tạo đơn hàng thất bại.'
                            }

                            if (data.products[i].discount !== null ||
                                data.products[i].discount !== undefined || data.products[i].discount !== '') {

                                let resultUpdateQuantityDiscount =
                                    await discountService.updateQuantityDiscount(
                                        data.products[i].discount
                                    );
                                if (resultUpdateQuantityDiscount.errCode === 1) {
                                    dataOrder.errCode = 2;
                                    dataOrder.errMessage = 'Tạo đơn hàng thất bại.'
                                }
                            }

                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
            resolve(dataOrder);
        } catch (error) {
            reject(error);
        }
    });
}

let createDetailOrder = (idOrder, product) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            const query = `INSERT INTO detailorder (idOrder, idProduct, idDiscount, numProduct,
                 createdAt, updatedAt) VALUES (:idOrder, :idProduct, :idDiscount, :numProduct, :createdAt, :updatedAt)`

            const values = {
                idOrder: idOrder,
                idProduct: product.idProduct,
                idDiscount: product.idDiscount,
                numProduct: product.numProduct,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = await sequelize.query(query, {
                replacements: values,
                type: sequelize.QueryTypes.INSERT,
            });
            if (result[1] === 0) {
                data.errCode = 2;
                data.errMessage = 'Tạo chi tiết đơn hàng thất bại.'
            } else {
                data.errCode = 0;
                data.errMessage = 'Tạo chi tiết đơn hàng thành công.'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let updateOrder = (idOrder, data) => { }

let deleteOrder = (idOrder) => { }

let getOrderByPage = (page, limit) => { }

let getListOrder = () => { }

let getListOrderDeliveresForUser = (idUser, page, limit) => { }

let getListOrderProcessingForUser = (idUser, page, limit) => { }

let getListOrderCancleForUser = (idUser, page, limit) => { }

module.exports = {
    createOrder: createOrder,
    updateOrder: updateOrder,
    deleteOrder: deleteOrder,
    getOrderByPage: getOrderByPage,
    getListOrder: getListOrder,
    getListOrderDeliveresForUser: getListOrderDeliveresForUser,
    getListOrderProcessingForUser: getListOrderProcessingForUser,
    getListOrderCancleForUser: getListOrderCancleForUser,
}