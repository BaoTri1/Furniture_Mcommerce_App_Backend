import { QueryTypes } from 'sequelize';
import db, { sequelize } from '../models/index';
import public_method from '../public/public_method';

let getDiscountByPage = (page, limit, search) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        let total_row;
        let start = (page - 1) * limit;
        let total_page;

        try {
            const query = `SELECT idDiscount, nameDiscount, products.nameProduct, products.idProduct,
            value, numDiscount, dayStart, dayEnd
                FROM discounts LEFT JOIN products ON discounts.idProduct = products.idProduct
                WHERE idDiscount = '${search}' OR nameDiscount LIKE '%${search}%' 
                    OR products.nameProduct LIKE '%${search}%' OR dayStart LIKE '%${search}%' OR dayEnd LIKE '%${search}%'
                        ORDER BY discounts.createdAt`
            const rowData = await sequelize.query(query, { type: QueryTypes.SELECT });
            if (rowData.length !== 0) {
                total_row = rowData.length;
            }
            total_page = Math.ceil(total_row / limit);
            const discounts = await sequelize.query(`${query} ASC LIMIT ${start}, ${limit};`, { type: QueryTypes.SELECT });
            if (discounts.length !== 0) {
                console.log(discounts);
                console.log(discounts.length);
                data.errCode = 0
                data.errMessage = 'Đã lấy danh sách khuyến mãi thành công'
                data.total_row = total_row
                data.limit = limit
                data.page = page
                data.total_page = total_page
                data.discounts = discounts
            } else {
                data.errCode = 1,
                data.errMessage = 'Không tìm thấy khuyến mãi'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let getListDiscount = () => {
    return new Promise(async (resolve, reject) => {
        let data = {};

        try {
            const query = `SELECT idDiscount, nameDiscount, products.nameProduct, products.idProduct,
            value, numDiscount, dayStart, dayEnd
                FROM discounts LEFT JOIN products ON discounts.idProduct = products.idProduct
                    ORDER BY discounts.createdAt`
            const discounts = await sequelize.query(`${query}`, { type: QueryTypes.SELECT });
            if (discounts.length !== 0) {
                console.log(discounts);
                console.log(discounts.length);
                data.errCode = 0
                data.errMessage = 'Đã lấy danh sách khuyến mãi thành công'
                data.data = discounts
            } else {
                data.errCode = 1,
                data.errMessage = 'Không tìm thấy khuyến mãi'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let createDiscount = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataDiscount = {};
            let idDiscount;
            const check = await checkDiscount(data.nameDiscount);
            console.log(check)
            if (check) {
                dataDiscount.errCode = 1;
                dataDiscount.errMessage = 'Khuyến mãi đã tồn tại.';
            } else {
                const lastdiscount = await sequelize.query("SELECT * FROM discounts ORDER BY createdAt DESC LIMIT 1;", {
                    type: QueryTypes.SELECT
                });
                if (lastdiscount.length === 0) {
                    idDiscount = 'DC1';
                    console.log(idDiscount);
                } else {
                    //Tao lastdiscount mới bằng cách lấy số cuối của lastdiscount cuối bảng cộng thêm 1 rồi thêm vào chuỗi 'DC'
                    idDiscount = 'DC' + (public_method.parseIdtoInt(lastdiscount[0].idDiscount) + 1);
                    console.log(idDiscount);
                }

                //Insert to database
                try {
                    const query = `INSERT INTO discounts (idDiscount, idProduct, nameDiscount, value,
                     numDiscount, dayStart, dayEnd, createdAt, updatedAt) 
                     VALUES (:idDiscount, :idProduct, :nameDiscount, :value, :numDiscount, :dayStart,
                     :dayEnd, :createdAt, :updatedAt);`;
                    const values = {
                        idDiscount: idDiscount,
                        idProduct: data.idProduct,
                        nameDiscount: data.nameDiscount,
                        value: data.value,
                        numDiscount: data.numDiscount,
                        dayStart: data.dayStart,
                        dayEnd: data.dayEnd,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    const result = await sequelize.query(query, {
                        replacements: values,
                        type: sequelize.QueryTypes.INSERT,
                    });
                    console.log('Inserted record:', result[0]);
                    if (result[1] === 0) {
                        dataDiscount.errCode = 2;
                        dataDiscount.errMessage = 'Thêm khuyến mãi thất bại.'
                    } else {
                        dataDiscount.errCode = 0;
                        dataDiscount.errMessage = 'Thêm khuyến mãi thành công.'
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            resolve(dataDiscount);
        } catch (error) {
            reject(error);
        }
    });
}

let checkDiscount = (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT * FROM discounts WHERE nameDiscount = '${name}';`;
            const results = await sequelize.query(query, { type: QueryTypes.SELECT });
            if (results.length !== 0) {
                console.log(results)
                resolve(true);
            } else {
                console.log('false', results.length)
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
}

let updateDiscount = (idDiscount, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataDiscount = {};
            // const query = `UPDATE discounts (idDiscount, idProduct, nameDiscount, value,
            //     numDiscount, dayStart, dayEnd, createdAt, updatedAt) 
            //     VALUES (:idDiscount, :idProduct, :nameDiscount, :value, :numDiscount, :dayStart,
            //     :dayEnd, :createdAt, :updatedAt);`;
            const query = `UPDATE discounts SET idProduct = :idProduct, nameDiscount = :nameDiscount,
             value = :value, numDiscount = :numDiscount, dayStart = :dayStart, dayEnd = :dayEnd, 
             updatedAt = :updatedAt WHERE idDiscount = '${idDiscount}';`;
            const values = {
                idProduct: data.idProduct,
                nameDiscount: data.nameDiscount,
                value: data.value,
                numDiscount: data.numDiscount,
                dayStart: data.dayStart,
                dayEnd: data.dayEnd,
                updatedAt: new Date(),
            };

            const result = await sequelize.query(query, {
                replacements: values,
                type: sequelize.QueryTypes.UPDATE,
            });

            console.log('Inserted record:', result[0]);
            if (result[1] === 0) {
                dataDiscount.errCode = 1;
                dataDiscount.errMessage = 'Cập nhật khuyến mãi thất bại.'
            } else {
                dataDiscount.errCode = 0;
                dataDiscount.errMessage = 'Cập nhật khuyến mãi thành công.'
            }
            resolve(dataDiscount);
        } catch (error) {
            reject(error);
        }
    });
}

let deleteDiscount = (idDiscount) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            const query = `DELETE FROM discounts WHERE idDiscount = '${idDiscount}'`;
            const result = await sequelize.query(query, {
                type: sequelize.QueryTypes.DELETE,
            });
            data.errCode = 0;
            data.errMessage = 'Xóa sản phẩm thành công.'
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let updateQuantityDiscount = (idDiscount) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            const queryQuantity = `SELECT numDiscount FROM discounts WHERE idDiscount = '${idDiscount}'`;
            const resultQuatity = await sequelize.query(queryQuantity, {
                type: sequelize.QueryTypes.SELECT,
            });
            if (resultQuatity.length !== 0) {
                let quantity = resultQuatity[0].quantity;
                let newQuatity;
                if(quantity > 0){
                    newQuatity = +quantity - 1;
                    try {
                        const query = `UPDATE discounts SET nameDiscount = :nameDiscount, updatedAt = :updatedAt 
                                        WHERE idDiscount = '${idDiscount}';`;
                        const values = {
                            nameDiscount: newQuatity,
                            updatedAt: new Date(),
                        };
            
                        const result = await sequelize.query(query, {
                            replacements: values,
                            type: sequelize.QueryTypes.UPDATE,
                        });
            
                        console.log('Inserted record:', result[0]);
                        if (result[1] === 0) {
                            data.errCode = 1;
                            data.errMessage = 'Cập nhật số lượng khuyến mãi thất bại.'
                        } else {
                            data.errCode = 0;
                            data.errMessage = 'Cập nhật số lượng khuyến mãi thành công.'
                        }
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    data.errCode = 2;
                    data.errMessage = 'Số lượng khuyến mãi đã hết.'
                }
            } else {
                data.errCode = 1;
                data.errMessage = 'Lấy số lượng khuyến mãi thất bại.'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let checkQuantity = (idDiscount) => {
    return new Promise(async (resolve, reject) =>{
        try {
            let data = {};
            const queryQuantity = `SELECT numDiscount FROM discounts WHERE idDiscount = '${idDiscount}'`;
            const resultQuatity = await sequelize.query(queryQuantity, {
                type: sequelize.QueryTypes.SELECT,
            });
            if (resultQuatity.length !== 0) {
                let quantity = resultQuatity[0].numDiscount;
                if (quantity > 0) {
                    data.errCode = 0;
                    data.errMessage = 'Mã giảm giá vẫn còn.'
                }
                else {
                    data.errCode = 1;
                    data.errMessage = 'Đã hết mã giảm giá.'
                }

            } else {
                data.errCode = 2;
                data.errMessage = 'Lấy số lượng mã giảm giá thất bại.'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getDiscountByPage: getDiscountByPage,
    getListDiscount: getListDiscount,
    createDiscount: createDiscount,
    updateDiscount: updateDiscount,
    deleteDiscount: deleteDiscount,

    updateQuantityDiscount: updateQuantityDiscount,
    checkQuantity: checkQuantity,
}