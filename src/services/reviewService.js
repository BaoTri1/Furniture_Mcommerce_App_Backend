import { QueryTypes } from 'sequelize';
import db, { sequelize } from '../models/index';
import public_method from '../public/public_method';

let createReview = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataReview = {};
            let idRat = 'CM' + public_method.formatDate() + public_method.generateRandomString();
            const check = await checkCommentforUser(data.idUser, data.idProduct);
            console.log(check)
            if (check) {
                dataReview.errCode = 1;
                dataReview.errMessage = 'Người dùng chỉ có thể đánh giá sản phẩm một lần.';
            } else {
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
                        timeCreate: new Date(), // kiem tra voi fulter
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
    return new Promise(async (resolve, reject) => {
        let data = {};
        let total_row;
        let start = (page - 1) * limit;
        let total_page;

        try {
            const query = `SELECT
            products.idProduct,
            products.nameProduct,
            IFNULL(ROUND(AVG(ratings.point), 1), 0) AS AVGPoint,
            IFNULL(COUNT(ratings.idRat), 0) AS NumReviews
        FROM
            products
        LEFT JOIN
            ratings ON products.idProduct = ratings.idProduct
        GROUP BY
            products.nameProduct
        ORDER BY
            AVGPoint DESC`
            const rowData = await sequelize.query(query, { type: QueryTypes.SELECT });
            if (rowData.length !== 0) {
                total_row = rowData.length;
            }
            total_page = Math.ceil(total_row / limit);
            const ratings = await sequelize.query(`${query} LIMIT ${start}, ${limit};`, { type: QueryTypes.SELECT });
            if (ratings.length !== 0) {
                console.log(ratings);
                console.log(ratings.length);
                data.errCode = 0
                data.errMessage = 'Đã lấy danh sách đánh giá thành công'
                data.total_row = total_row
                data.limit = limit
                data.page = page
                data.total_page = total_page
                data.reviews = ratings
            } else {
                data.errCode = 1,
                    data.errMessage = 'Không tìm thấy danh đánh giá'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let getListReviewForProduct = (idProduct, page, limit) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        let total_row;
        let start = (page - 1) * limit;
        let total_page;

        try {
            const query = `SELECT ratings.idRat, users.idUser, users.avatar, users.fullName, point, comment, timeCreate 
            FROM 
                ratings 
            LEFT JOIN
                users ON ratings.idUser = users.idUser 
            WHERE 
                idProduct = '${idProduct}' 
            ORDER BY ratings.timeCreate DESC`

            const rowData = await sequelize.query(query, { type: QueryTypes.SELECT });
            if (rowData.length !== 0) {
                total_row = rowData.length;
            }
            total_page = Math.ceil(total_row / limit);
            const ratings = await sequelize.query(`${query} LIMIT ${start}, ${limit};`, { type: QueryTypes.SELECT });
            if (ratings.length !== 0) {
                console.log(ratings);
                console.log(ratings.length);
                data.errCode = 0
                data.errMessage = 'Đã lấy danh sách đánh giá thành công'
                data.total_row = total_row
                data.limit = limit
                data.page = page
                data.total_page = total_page
                for(let i = 0; i < ratings.length; i++) {
                    if(ratings[i].avatar !== null){
                        const [path, name] = ratings[i].avatar.split(' ');
                        ratings[i].avatar = path
                    }
                }
                data.reviews = ratings
            } else {
                data.errCode = 1,
                    data.errMessage = 'Không tìm thấy danh đánh giá'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let checkCommentforUser = (idUser, idProduct)  => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT * FROM ratings WHERE idUser = '${idUser}' AND idProduct = '${idProduct}';`;
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
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            const query = `SELECT products.nameProduct, ROUND(AVG(ratings.point), 1) AS AVGPoint, COUNT(idRat) AS NumReviews 
            FROM
                ratings
            LEFT JOIN 
                products ON products.idProduct = ratings.idProduct
            WHERE 
                ratings.idProduct = '${idProduct}'
            ORDER BY 
                ratings.timeCreate DESC`

            const resultRating = await sequelize.query(query, { type: QueryTypes.SELECT });
            if (resultRating.length !== 0) {
                console.log(resultRating);
                console.log(resultRating.length);
                data.errCode = 0
                data.errMessage = 'Đã lấy điểm đánh giá thành công'
                const [result] = resultRating
                data.ratings = {...result }
            } else {
                data.errCode = 1,
                    data.errMessage = 'Không tìm thấy điểm đánh giá'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
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