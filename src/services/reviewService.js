import { QueryTypes } from 'sequelize';
import db, { sequelize } from '../models/index';
import public_method from '../public/public_method';

let createReview = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReview = {};
            let idRat;
            const check = await checkCommentforUser(data.idUser, data.idProduct);
            console.log(check)
            if (check) {
                dataReview.errCode = 1;
                dataReview.errMessage = 'Người dùng chỉ có thể đánh giá sản phẩm một lần.';
            } else {
                const lastreview = await sequelize.query("SELECT * FROM ratings ORDER BY createdAt DESC LIMIT 1;", {
                    type: QueryTypes.SELECT
                });
                if (lastreview.length === 0) {
                    idRat = 'CM1';
                    console.log(idRat);
                } else {
                    //Tao idRat mới bằng cách lấy số cuối của idUser cuối bảng cộng thêm 1 rồi thêm vào chuỗi 'SP'
                    idRat = 'CM' + (public_method.parseIdtoInt(lastreview[0].idRat) + 1);
                    console.log(idRat);
                }

                //Insert to database
                try {
                    const query = `INSERT INTO ratings (idRat, idUser, idProduct, point, comment,
                        timeCreate, createdAt, updatedAt) VALUES 
                        (:idRat, :idUser, :idProduct, :point, :comment, :timeCreate, :createdAt, :updatedAt)`;
                    const values = {
                        idRat: idRat,
                        idUser: data.idUser,
                        idProduct: data.idProduct,
                        point: data.point,
                        comment: data.comment,
                        timeCreate: data.timeCreate, // kiem tra voi fulter
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    const result = await sequelize.query(query, {
                        replacements: values,
                        type: sequelize.QueryTypes.INSERT,
                    });
                    console.log('Inserted record:', result[0]);
                    if (result[1] === 0) {
                        dataReview.errCode = 2;
                        dataReview.errMessage = 'Thêm đánh giá thất bại.'
                    } else {
                        dataReview.errCode = 0;
                        dataReview.errMessage = 'Thêm đánh giá thành công.'
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            resolve(dataReview);
        } catch (error) {
            reject(error);
        }
    });
}

let getReviewByPage = (page, limit, search) => {

}

let getListReviewForProduct = (idProduct, page, limit) => {

}

let checkCommentforUser = (idUser, idProduct)  => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT * FROM ratings WHERE idUser = '${idUser}' AND idProduct = ${idProduct};`;
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

let Rating = (idProduct) => {

}

let updateReview = (idRievew, data) => {

}

let deleteReview = (idRievew) => {}

module.exports = {
    createReview: createReview,
    getReviewByPage: getReviewByPage,
    getListReviewForProduct: getListReviewForProduct,
    Rating: Rating,
    updateReview: updateReview,
    deleteReview: deleteReview,
}