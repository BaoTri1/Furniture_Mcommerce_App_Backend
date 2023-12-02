import { QueryTypes } from 'sequelize';
import db, { sequelize } from '../models/index';
import public_method from '../public/public_method';

import productService from '../services/productService';

let createOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataOrder = {};
            let idOrder = 'ORDER' + public_method.formatDate() + public_method.generateRandomString();

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
                                    data.products[i].numProduct,
                                    '-'
                                );
                            if (resultUpdateQuantityProduct.errCode === 1) {
                                dataOrder.errCode = 2;
                                dataOrder.errMessage = 'Tạo đơn hàng thất bại.'
                            }
                        }
                    }

                    let order = await getInforOrder(idOrder);
                    dataOrder.orders = order.orders
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
            const query = `INSERT INTO detailorder (idOrder, idProduct, numProduct,
                 createdAt, updatedAt) VALUES (:idOrder, :idProduct, :numProduct, :createdAt, :updatedAt)`

            const values = {
                idOrder: idOrder,
                idProduct: product.idProduct,
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

let updateOrder = (idOrder, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataOrder = {};
            const query = `UPDATE orders SET nameCustomer = :nameCustomer, sdtOrder = :sdtOrder, address = :address,
            status = :status, payStatus = :payStatus, dayUpdateAt = :dayUpdateAt,
             updatedAt = :updatedAt WHERE idOrder = '${idOrder}';`;
            const values = {
                nameCustomer: data.nameCustomer,
                sdtOrder: data.sdtOrder,
                address: data.address,
                status: data.status,
                payStatus: data.payStatus,
                dayUpdateAt: new Date(),
                updatedAt: new Date(),
            };

            const result = await sequelize.query(query, {
                replacements: values,
                type: sequelize.QueryTypes.UPDATE,
            });

            console.log('Inserted record:', result[0]);
            if (result[1] === 0) {
                dataOrder.errCode = 1;
                dataOrder.errMessage = 'Cập nhật sản phẩm thất bại.'
            } else {
                dataOrder.errCode = 0;
                dataOrder.errMessage = 'Cập nhật sản phẩm thành công.'
            }
            resolve(dataOrder);
        } catch (error) {
            reject(error);
        }
    });
 }

 let cancelOrder = (idOrder, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataOrder = {};
            if(data.status === 'R1'){
                const query = `UPDATE orders SET status = :status, dayUpdateAt = :dayUpdateAt,
                                updatedAt = :updatedAt WHERE idOrder = '${idOrder}';`;
                const values = {
                    status: 'R5',
                    dayUpdateAt: new Date(),
                    updatedAt: new Date(),
                };

                const result = await sequelize.query(query, {
                    replacements: values,
                    type: sequelize.QueryTypes.UPDATE,
                });

                console.log('Inserted record:', result[0]);
                if (result[1] === 0) {
                    dataOrder.errCode = 1;
                    dataOrder.errMessage = 'Cập nhật đơn hàng thất bại.'
                } else {
                    for (let i = 0; i < data.products.length; i++) {
                        let resultUpdateQuantityProduct =
                                await productService.updateQuantityProduct(
                                    data.products[i].idProduct,
                                    data.products[i].numProduct,
                                    '+'
                                );
                            if (resultUpdateQuantityProduct.errCode === 1) {
                                dataOrder.errCode = 1;
                                dataOrder.errMessage = 'Cập nhật đơn hàng thất bại.'
                            }
                            else {
                                dataOrder.errCode = 0;
                                dataOrder.errMessage = 'Cập nhật đơn hàng thành công.'
                                let order = await getInforOrder(idOrder);
                                dataOrder.orders = order.orders
                            }
                    }
                }
            }else{
                dataOrder.errCode = 2;
                dataOrder.errMessage = 'Cập nhật đơn hàng thất bại. Do trạng thái không phù hợp.'
            }
            resolve(dataOrder);
        } catch (error) {
            reject(error);
        }
    });
 }

let deleteOrder = (idOrder) => { }

let getOrderByPage = (page, limit, status, dayCreate, dayUpdate, search, price, payStatus) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        let total_row;
        let start = (page - 1) * limit;
        let total_page;
        const [price_start, price_end] = price.split('-');

        // const queryTypeRoom = !typeroom ? `OR kindofrooms.nameRoom IS NULL` : `AND kindofrooms.nameRoom IS NOT NULL`
        // const [price_start, price_end] = price.split('-');
        // const date = dateformat();

        try {
            const query = `SELECT orders.idOrder, dayCreateAt, dayUpdateAt, nameCustomer, sdtOrder,
            status.idStatus, status.name, payStatus, total
                FROM orders LEFT JOIN status ON orders.status = status.idStatus
                WHERE status.idStatus LIKE '%${status}%' 
                AND orders.dayCreateAt LIKE '%${dayCreate}%'
                AND orders.dayUpdateAt LIKE '%${dayUpdate}%'
                AND (orders.idOrder LIKE '%${search}%' OR nameCustomer LIKE '%${search}%' OR sdtOrder LIKE '%${search}%')
                AND orders.payStatus LIKE '%${payStatus}%'
                AND (orders.total > ${!+price_start ? 0 : +price_start} 
                    AND orders.total <= ${!+price_end ? 1000000000 : +price_end})
                    ORDER BY orders.dayCreateAt`

            const rowData = await sequelize.query(query, { type: QueryTypes.SELECT });
            if (rowData.length !== 0) {
                total_row = rowData.length;
            }
            total_page = Math.ceil(total_row / limit);
            const orders = await sequelize.query(`${query} DESC LIMIT ${start}, ${limit};`, { type: QueryTypes.SELECT });
            if (orders.length !== 0) {
                console.log(orders);
                console.log(orders.length);
                data.errCode = 0
                data.errMessage = 'Đã lấy danh sách đơn hàng thành công'
                data.total_row = total_row
                data.limit = limit
                data.page = page
                data.total_page = total_page
                for(let i = 0; i < orders.length; i++) {
                    let resultDetailOrder = await getDetailOrder(orders[i].idOrder)
                    if(resultDetailOrder.length !== 0){
                        console.log(resultDetailOrder.orders)
                        orders[i].detailorder = [...resultDetailOrder.orders]
                    }
                }
                data.orders = orders
            } else {
                data.errCode = 1,
                    data.errMessage = 'Không tìm thấy danh sách đơn hàng'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let getInforOrder = (idOrder) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            const query = `SELECT idOrder, nameCustomer AS NameCustomer, sdtOrder AS SDT,
            address, deliverymethods.nameShipment, deliverymethods.fee,
            paymentmethods.namePayment, status.idStatus, status.name, total, 
            payStatus AS StatusPayment, dayCreateAt, dayUpdateAt
               FROM orders 
               LEFT JOIN status ON orders.status = status.idStatus
               LEFT JOIN paymentmethods ON paymentmethods.idPayment = orders.idPayment
               LEFT JOIN deliverymethods ON deliverymethods.idShipment = orders.idDelivery
                 WHERE idOrder = '${idOrder}'`;

            const order = await sequelize.query(`${query}`, { type: QueryTypes.SELECT });
            if(order.length !== 0){
                let detailorder = await getDetailOrder(idOrder);
                if(detailorder.errCode == 0){
                    data.errCode = 0
                    data.errMessage = 'Lấy đơn hàng thành công'
                    data.orders = {...order[0], DetailOrder: detailorder.orders}
                }

            }else{
                data.errCode = 1
                data.errMessage = 'Lấy đơn hàng thất bại'
            }
            resolve(data)
        } catch (error) {
            reject(error);
        }
    });
}

let getDetailOrder = (idOrder) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            const query = `SELECT detailorder.idProduct, products.nameProduct, 
            images.imgUrl ,products.price AS originalPrice,
            CASE
                WHEN discounts.value IS NOT NULL AND discounts.dayStart <= orders.dayCreateAt AND discounts.dayEnd >= orders.dayCreateAt
                THEN products.price - (products.price * discounts.value / 100)
                ELSE products.price
                END AS finalPrice,
            numProduct
            FROM
                detailorder
            LEFT JOIN
                products ON detailorder.idProduct = products.idProduct
            LEFT JOIN
                discounts ON products.idProduct = discounts.idProduct
            LEFT JOIN
                orders ON orders.idOrder = detailorder.idOrder
            LEFT JOIN images ON products.idProduct = images.idProduct
            WHERE detailorder.idOrder = '${idOrder}' AND images.typeImg = 'Avatar'`;

            const detailorder = await sequelize.query(`${query}`, { type: QueryTypes.SELECT });
            if(detailorder.length !== 0){
                data.errCode = 0
                data.errMessage = 'Lấy đơn hàng thành công'
                data.orders = detailorder

            }else{
                data.errCode = 1
                data.errMessage = 'Lấy đơn hàng thất bại'
            }
            resolve(data)
        } catch (error) {
            reject(error);
        }
    });
}

let getListOrderProcess = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let total_row;
            const query = `SELECT
            orders.idOrder,
            orders.dayCreateAt,
            orders.total,
            status.name
              FROM
                  orders
              INNER JOIN
                  status ON orders.status = status.idStatus
              LEFT JOIN
                  detailorder ON orders.idOrder = detailorder.idOrder
              WHERE
                  status.name = 'Đang chờ xử lý'
              GROUP BY
                  orders.idOrder, orders.dayCreateAt, orders.total, status.name
              ORDER BY
                  orders.dayCreateAt DESC`;

            const rowData = await sequelize.query(query, { type: QueryTypes.SELECT });
            if (rowData.length !== 0) {
                total_row = rowData.length;
            }

            const orders = await sequelize.query(`${query} LIMIT 0, 5;`, { type: QueryTypes.SELECT });
            if(orders.length !== 0){
                data.errCode = 0
                data.errMessage = 'Lấy danh sách đơn hàng thành công'
                data.badge = total_row
                data.orders = orders

            }else{
                data.errCode = 1
                data.errMessage = 'Không có đơn hàng chưa xử lí nào.'
            }
            resolve(data)
        } catch (error) {
            reject(error);
        }
    });        
}

let getListOrderDelivereredForUser = (idUser, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            const query = `SELECT
            orders.idOrder,
            orders.dayCreateAt,
            SUM(detailorder.numProduct) AS Quantity,
            orders.total,
            status.name
        FROM
            orders
        INNER JOIN
            status ON orders.status = status.idStatus
        LEFT JOIN
            detailorder ON orders.idOrder = detailorder.idOrder
        WHERE
            status.idStatus = 'R4'
            AND orders.idUser = '${idUser}'
        GROUP BY
            orders.idOrder, orders.dayCreateAt, orders.total, status.name;`;

            const orders = await sequelize.query(`${query}`, { type: QueryTypes.SELECT });
            if(orders.length !== 0){
                data.errCode = 0
                data.errMessage = 'Lấy danh sách đơn hàng thành công'
                data.orders = orders

            }else{
                data.errCode = 1
                data.errMessage = 'Lấy danh sách đơn hàng thất bại'
            }
            resolve(data)
        } catch (error) {
            reject(error);
        }
    });
 }

let getListOrderProcessingForUser = (idUser, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            const query = `SELECT
            orders.idOrder,
            orders.dayCreateAt,
            SUM(detailorder.numProduct) AS Quantity,
            orders.total,
            status.name
        FROM
            orders
        INNER JOIN
            status ON orders.status = status.idStatus
        LEFT JOIN
            detailorder ON orders.idOrder = detailorder.idOrder
        WHERE
            status.idStatus = 'R1'
            AND orders.idUser = '${idUser}'
        GROUP BY
            orders.idOrder, orders.dayCreateAt, orders.total, status.name;`;

            const orders = await sequelize.query(`${query}`, { type: QueryTypes.SELECT });
            if(orders.length !== 0){
                data.errCode = 0
                data.errMessage = 'Lấy danh sách đơn hàng thành công'
                data.orders = orders

            }else{
                data.errCode = 1
                data.errMessage = 'Lấy danh sách đơn hàng thất bại'
            }
            resolve(data)
        } catch (error) {
            reject(error);
        }
    });
}

let getListOrderReadyDeliveryForUser = (idUser, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            const query = `SELECT
            orders.idOrder,
            orders.dayCreateAt,
            SUM(detailorder.numProduct) AS Quantity,
            orders.total,
            status.name
        FROM
            orders
        INNER JOIN
            status ON orders.status = status.idStatus
        LEFT JOIN
            detailorder ON orders.idOrder = detailorder.idOrder
        WHERE
            status.idStatus = 'R2'
            AND orders.idUser = '${idUser}'
        GROUP BY
            orders.idOrder, orders.dayCreateAt, orders.total, status.name;`;

            const orders = await sequelize.query(`${query}`, { type: QueryTypes.SELECT });
            if(orders.length !== 0){
                data.errCode = 0
                data.errMessage = 'Lấy danh sách đơn hàng thành công'
                data.orders = orders

            }else{
                data.errCode = 1
                data.errMessage = 'Lấy danh sách đơn hàng thất bại'
            }
            resolve(data)
        } catch (error) {
            reject(error);
        }
    });
 }

 let getListOrderDeliveringForUser = (idUser, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            const query = `SELECT
            orders.idOrder,
            orders.dayCreateAt,
            SUM(detailorder.numProduct) AS Quantity,
            orders.total,
            status.name
        FROM
            orders
        INNER JOIN
            status ON orders.status = status.idStatus
        LEFT JOIN
            detailorder ON orders.idOrder = detailorder.idOrder
        WHERE
            status.idStatus = 'R3'
            AND orders.idUser = '${idUser}'
        GROUP BY
            orders.idOrder, orders.dayCreateAt, orders.total, status.name;`;

            const orders = await sequelize.query(`${query}`, { type: QueryTypes.SELECT });
            if(orders.length !== 0){
                data.errCode = 0
                data.errMessage = 'Lấy danh sách đơn hàng thành công'
                data.orders = orders

            }else{
                data.errCode = 1
                data.errMessage = 'Lấy danh sách đơn hàng thất bại'
            }
            resolve(data)
        } catch (error) {
            reject(error);
        }
    });
 }

let getListOrderCancleForUser = (idUser, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            const query = `SELECT
            orders.idOrder,
            orders.dayCreateAt,
            SUM(detailorder.numProduct) AS Quantity,
            orders.total,
            status.name
        FROM
            orders
        INNER JOIN
            status ON orders.status = status.idStatus
        LEFT JOIN
            detailorder ON orders.idOrder = detailorder.idOrder
        WHERE
            status.idStatus = 'R5'
            AND orders.idUser = '${idUser}'
        GROUP BY
            orders.idOrder, orders.dayCreateAt, orders.total, status.name;`;

            const orders = await sequelize.query(`${query}`, { type: QueryTypes.SELECT });
            if(orders.length !== 0){
                data.errCode = 0
                data.errMessage = 'Lấy danh sách đơn hàng thành công'
                data.orders = orders

            }else{
                data.errCode = 1
                data.errMessage = 'Lấy danh sách đơn hàng thất bại'
            }
            resolve(data)
        } catch (error) {
            reject(error);
        }
    });
}

//SELECT COUNT(idOrder) AS numOrder FROM `orders` WHERE idUser = 'USER20231030XGJlr'
let getCountOrderForUser = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            const query = `SELECT COUNT(idOrder) AS numOrder FROM orders WHERE idUser = '${idUser}'`;

            const count = await sequelize.query(`${query}`, { type: QueryTypes.SELECT });
            if(count.length !== 0){
                data.errCode = 0
                data.errMessage = 'Lấy số lượng đơn hàng thành công'
                data.numorder = count[0].numOrder

            }else{
                data.errCode = 1
                data.errMessage = 'Lấy số lượng đơn hàng thất bại'
            }
            resolve(data)
        } catch (error) {
            reject(error);
        }
    });
}

let getListStatus = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            const query = `SELECT idStatus, name FROM status`;

            const status = await sequelize.query(`${query}`, { type: QueryTypes.SELECT });
            if(status.length !== 0){
                data.errCode = 0
                data.errMessage = 'Lấy danh sách trạng thái thành công'
                data.status = status

            }else{
                data.errCode = 1
                data.errMessage = 'Lấy danh sách trạng thái thất bại'
            }
            resolve(data)
        } catch (error) {
            reject(error);
        }
    });
}

let updateStatusOrder = (idOrder, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataOrder = {};
            if(data.idStatus === 'R3' &&  data.payStatus === 0)
                data.payStatus = 1;
            const queryNextStatus = `SELECT idStatus, name FROM status WHERE idStatus > '${data.idStatus}' LIMIT 1`;

            const resultNextStatus = await sequelize.query(`${queryNextStatus}`, { type: QueryTypes.SELECT });
            if(resultNextStatus.length !== 0){

                const query = `UPDATE orders SET status = :status, payStatus = :payStatus, updatedAt = :updatedAt 
                WHERE idOrder = '${idOrder}';`;
                const values = {
                    status: resultNextStatus[0].idStatus,
                    payStatus: data.payStatus,
                    updatedAt: new Date(),
                };

                const result = await sequelize.query(query, {
                    replacements: values,
                    type: sequelize.QueryTypes.UPDATE,
                });

                console.log('Inserted record:', result[0]);
                if (result[1] === 0) {
                    dataOrder.errCode = 1;
                    dataOrder.errMessage = 'Cập nhật đơn hàng thất bại.'
                } else {
                    dataOrder.errCode = 0;
                    dataOrder.errMessage = 'Cập nhật đơn hàng thành công.'
                }

            }else{
                dataOrder.errCode = 1
                dataOrder.errMessage = 'Cập nhật đơn hàng thất bại.'
            }    
            resolve(dataOrder)
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    createOrder: createOrder,
    updateOrder: updateOrder,
    deleteOrder: deleteOrder,
    getInforOrder: getInforOrder,
    getDetailOrder: getDetailOrder,
    getOrderByPage: getOrderByPage,
    getListOrderProcess: getListOrderProcess,

    getListOrderDelivereredForUser: getListOrderDelivereredForUser,
    getListOrderProcessingForUser: getListOrderProcessingForUser,
    getListOrderReadyDeliveryForUser: getListOrderReadyDeliveryForUser,
    getListOrderCancleForUser: getListOrderCancleForUser,
    getListOrderDeliveringForUser: getListOrderDeliveringForUser,
    getCountOrderForUser: getCountOrderForUser,
    cancelOrder: cancelOrder,

    getListStatus: getListStatus,
    updateStatusOrder: updateStatusOrder,
}

/**
 * SELECT
    orders.idOrder,
    orders.dayCreateAt,
    SUM(detailorder.numProduct) AS Quantity,
    orders.total,
    status.name
FROM
    orders
INNER JOIN
    status ON orders.status = status.idStatus
LEFT JOIN
    detailorder ON orders.idOrder = detailorder.idOrder
WHERE
    status.name = 'Đang chờ xử lý'
    AND orders.idUser = 'USER20231030XGJlr'
GROUP BY
    orders.idOrder, orders.dayCreateAt, orders.total, status.name;
 */