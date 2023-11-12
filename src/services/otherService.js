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

let getInfomation = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = {};
            const queryNumProduct = `SELECT COUNT(idProduct) AS 'NumProduct' FROM products`;
            const resultNumProduct = await sequelize.query(queryNumProduct, {
                type: sequelize.QueryTypes.SELECT,
            });
            if (resultNumProduct.length !== 0) {
                data.errCode = 0;
                data.errMessage = 'Lấy thông tin thành công.'
                data.numProduct = resultNumProduct[0].NumProduct
            } else {
                data.errCode = 1;
                data.errMessage = 'Lấy thông tin thất bại.'
            }

            const queryNumUser = `SELECT COUNT(idUser) AS 'NumUser' FROM users`;
            const resultNumUser = await sequelize.query(queryNumUser, {
                type: sequelize.QueryTypes.SELECT,
            });
            if (resultNumUser.length !== 0) {
                data.errCode = 0;
                data.errMessage = 'Lấy thông tin thành công.'
                data.numUser = resultNumUser[0].NumUser - 1
            } else {
                data.errCode = 1;
                data.errMessage = 'Lấy thông tin thất bại.'
            }
            resolve(data);
        } catch (error) {   
            reject(error);
        }
    });
}

let getMostProductForMonth = (yearMonth) => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = {};
            const query = `SELECT
            EXTRACT(YEAR_MONTH FROM orders.dayCreateAt) AS yearMonth,
            products.nameProduct AS productName,
            SUM(detailorder.numProduct) AS totalSoldQuantity
        FROM
            orders
        LEFT JOIN
            detailorder ON orders.idOrder = detailorder.idOrder
        LEFT JOIN
            products ON detailorder.idProduct = products.idProduct
        WHERE
            orders.status != 'R5'
            AND EXTRACT(YEAR_MONTH FROM orders.dayCreateAt) = '${yearMonth}'
        GROUP BY
            yearMonth, productName
        ORDER BY
            yearMonth, totalSoldQuantity DESC`;
            const result = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
            });
            if (result.length !== 0) {
                data.errCode = 0;
                data.errMessage = 'Lấy danh sánh sản phẩm thành công.'
                data.products = result
            } else {
                data.errCode = 1;
                data.errMessage = 'Lấy danh sánh sản phẩm thất bại.'
            }
            resolve(data);
        } catch (error) {   
            reject(error);
        }
    });
}

let statisticalProduct_ParentCategory = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = {};
        //     const query= `SELECT
        //     parentcategorys.name AS groupCategory,
        //     COUNT(products.idProduct) AS totalProducts
        // FROM
        //     parentcategorys
        // LEFT JOIN
        //     categorys ON parentcategorys.idcatParent = categorys.catParent
        // LEFT JOIN
        //     products ON categorys.idCat = products.idCategory
        // GROUP BY
        //     parentcategorys.name
        // ORDER BY
        //     totalProducts DESC;`;
        const query= `SELECT
        categorys.nameCat AS categoryName,
        COUNT(products.idProduct) AS totalProducts
    FROM
        categorys
    LEFT JOIN
        products ON categorys.idCat = products.idCategory
    GROUP BY
        categorys.nameCat
    ORDER BY
        totalProducts DESC;
    `;
            const result = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
            });
            if (result.length !== 0) {
                data.errCode = 0;
                data.errMessage = 'Lấy thông tin thành công.'
                data.result = result
            } else {
                data.errCode = 1;
                data.errMessage = 'Lấy thông tin thất bại.'
            }
            resolve(data);
        } catch (error) {   
            reject(error);
        }
    });
}

let statisticalForMonth = (yearMonth) => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = {};
            const queryTotalProduct_Amount= `SELECT
            EXTRACT(YEAR_MONTH FROM orders.dayCreateAt) AS yearMonth,
            SUM(detailorder.numProduct) AS totalSoldProducts,
            SUM(orders.total) AS totalInvoiceAmount
          FROM
            orders
          LEFT JOIN
            detailorder ON orders.idOrder = detailorder.idOrder
          WHERE
            orders.status != 'R5'
            AND EXTRACT(YEAR_MONTH FROM orders.dayCreateAt) = '${yearMonth}'
          GROUP BY
            yearMonth
          ORDER BY
            yearMonth`;
            const resultToltalProduct_Amount = await sequelize.query(queryTotalProduct_Amount, {
                type: sequelize.QueryTypes.SELECT,
            });
            if (resultToltalProduct_Amount.length !== 0) {
                data.errCode = 0;
                data.errMessage = 'Lấy thông tin thành công.'
                data.ToltalProduct_Amount = resultToltalProduct_Amount
            } else {
                data.errCode = 1;
                data.errMessage = `Chưa có thông tin tổng doanh thu và tổng sản phẩm bán được của ${yearMonth.slice(-2)}/${yearMonth.slice(0, 4)}.`
                resolve(data)
                return;
            }

            const queryTotalInvoicest= `SELECT
                        EXTRACT(YEAR_MONTH FROM orders.dayCreateAt) AS yearMonth,
                        COUNT(orders.idOrder) AS totalInvoices
                    FROM
                        orders
                    WHERE
                    EXTRACT(YEAR_MONTH FROM orders.dayCreateAt) = '${yearMonth}'
                    GROUP BY
                        yearMonth
                    ORDER BY
                        yearMonth;`;
            const resultTotalInvoicest = await sequelize.query(queryTotalInvoicest, {
                type: sequelize.QueryTypes.SELECT,
            });
            if (resultTotalInvoicest.length !== 0) {
                data.errCode = 0;
                data.errMessage = 'Lấy thông tin thành công.'
                data.TotalInvoicest = resultTotalInvoicest
            } else {
                data.errCode = 1
                data.errMessage = `Chưa có thông tin tổng số hóa đơn của ${yearMonth.slice(-2)}/${yearMonth.slice(0, 4)}.`
                resolve(data)
                return;
            }
            resolve(data);
        } catch (error) {   
            reject(error);
        }
    });
}

let monthlyRevenueStatisticsByCategory = (yearMonth) => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = {};
            const query= `SELECT
            categorys.nameCat AS categoryName,
            SUM(products.price * (1 - IFNULL(discounts.value / 100, 0)) * detailorder.numProduct) AS totalRevenue
        FROM
            orders
        JOIN
            detailorder ON orders.idOrder = detailorder.idOrder
        JOIN
            products ON detailorder.idProduct = products.idProduct
        JOIN
            categorys ON products.idCategory = categorys.idCat
        JOIN
            parentcategorys ON parentcategorys.idcatParent = categorys.catParent
        LEFT JOIN
            discounts ON products.idProduct = discounts.idProduct
        WHERE
            orders.status != 'R5'
            AND (discounts.dayStart IS NULL OR discounts.dayStart <= orders.dayCreateAt)
            AND (discounts.dayEnd IS NULL OR discounts.dayEnd >= orders.dayCreateAt)
            AND EXTRACT(YEAR_MONTH FROM orders.dayCreateAt) = '${yearMonth}'
        GROUP BY
            categoryName
        ORDER BY
            totalRevenue DESC;
        `;
            const result = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
            });
            if (result.length !== 0) {
                data.errCode = 0;
                data.errMessage = 'Lấy thông tin thành công.'
                data.result = result
            } else {
                data.errCode = 1;
                data.errMessage = `Chưa có thông tin tổng doanh thu theo danh mục của ${yearMonth.slice(-2)}/${yearMonth.slice(0, 4)}.`
            }
            resolve(data);
        } catch (error) {   
            reject(error);
        }
    });
}

let getOrderByListStatus = (yearMonth) => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = {};
            const query= `SELECT
            EXTRACT(YEAR_MONTH FROM orders.dayCreateAt) AS month,
            status.name AS orderStatus,
            idStatus,
            COUNT(orders.idOrder) AS orderCount
        FROM
            orders
        JOIN
            status ON orders.status = status.idStatus
        WHERE
            EXTRACT(YEAR_MONTH FROM orders.dayCreateAt) = '${yearMonth}'
        GROUP BY
            month, orderStatus
        ORDER BY
            month, orderStatus;
        `;
            const result = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
            });
            if (result.length !== 0) {
                data.errCode = 0;
                data.errMessage = 'Lấy thông tin thành công.'
                data.result = result
            } else {
                data.errCode = 1;
                data.errMessage = `Chưa có thông tin số đơn hàng theo trạng thái của ${yearMonth.slice(-2)}/${yearMonth.slice(0, 4)}.`
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
    getInfomation: getInfomation,
    getMostProductForMonth: getMostProductForMonth,

    statisticalProduct_ParentCategory: statisticalProduct_ParentCategory,
    statisticalForMonth: statisticalForMonth,
    monthlyRevenueStatisticsByCategory: monthlyRevenueStatisticsByCategory,
    getOrderByListStatus: getOrderByListStatus,
}