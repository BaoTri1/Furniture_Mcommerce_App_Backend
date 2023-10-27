import { QueryTypes } from 'sequelize';
import db, { sequelize } from '../models/index';
import public_method from '../public/public_method';

import imageService from '../services/imageService';

let createProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataProduct = {};
            let idProduct;
            const check = await checkProduct(data.nameProduct);
            console.log(check)
            if (check) {
                dataProduct.errCode = 1;
                dataProduct.errMessage = 'Sản phẩm đã tồn tại.';
            } else {
                const lastproduct = await sequelize.query("SELECT * FROM products ORDER BY createdAt DESC LIMIT 1;", {
                    type: QueryTypes.SELECT
                });
                if (lastproduct.length === 0) {
                    idProduct = 'SP1';
                    console.log(idProduct);
                } else {
                    //Tao idProduct mới bằng cách lấy số cuối của idUser cuối bảng cộng thêm 1 rồi thêm vào chuỗi 'SP'
                    idProduct = 'SP' + (public_method.parseIdtoInt(lastproduct[0].idProduct) + 1);
                    console.log(idProduct);
                }

                //Insert to database
                try {
                    const query = `INSERT INTO products (idProduct, idCategory, idTypesRoom, nameProduct, price,
                        quantity, material, size, description, createdAt, updatedAt) VALUES 
                        (:idProduct, :idCategory, :idTypesRoom, :nameProduct, :price,
                            :quantity, :material, :size, :description, :createdAt, :updatedAt)`;
                    const values = {
                        idProduct: idProduct,
                        idCategory: data.idCategory,
                        idTypesRoom: !data.idTypesRoom ? null : data.idTypesRoom,
                        nameProduct: data.nameProduct,
                        price: data.price,
                        quantity: data.quantity,
                        material: data.material,
                        size: data.size,
                        description: data.description,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    const result = await sequelize.query(query, {
                        replacements: values,
                        type: sequelize.QueryTypes.INSERT,
                    });
                    console.log('Inserted record:', result[0]);
                    if (result[1] === 0) {
                        dataProduct.errCode = 2;
                        dataProduct.errMessage = 'Thêm sản phẩm thất bại.'
                    } else {
                        dataProduct.errCode = 0;
                        dataProduct.errMessage = 'Thêm sản phẩm thành công.'
                        dataProduct.idProduct = idProduct
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            resolve(dataProduct);
        } catch (error) {
            reject(error);
        }
    });
}

let checkProduct = (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT * FROM products WHERE nameProduct = '${name}';`;
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

let updateProduct = (idProduct, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataProduct = {};
            const query = `UPDATE products SET idCategory = :idCategory, idTypesRoom = :idTypesRoom, nameProduct = :nameProduct,
                price = :price, quantity = :quantity, material = :material, size = :size, 
                description = :description, updatedAt = :updatedAt WHERE idProduct = '${idProduct}';`;
                const values = {
                    idCategory: data.idCategory,
                    idTypesRoom: !data.idTypesRoom ? null : data.idTypesRoom,
                    nameProduct: data.nameProduct,
                    price: data.price,
                    quantity: data.quantity,
                    material: data.material,
                    size: data.size,
                    description: data.description,
                    updatedAt: new Date(),
                };

                const result = await sequelize.query(query, {
                    replacements: values,
                    type: sequelize.QueryTypes.UPDATE,
                });

                console.log('Inserted record:', result[0]);
                if (result[1] === 0) {
                    dataProduct.errCode = 1;
                    dataProduct.errMessage = 'Cập nhật sản phẩm thất bại.'
                } else {
                    dataProduct.errCode = 0;
                    dataProduct.errMessage = 'Cập nhật sản phẩm thành công.'
                }
            resolve(dataProduct);
        } catch (error) {
            reject(error);
        }
    });
}

let getProductByPage = (page, limit, category, price, typeroom, search) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        let total_row;
        let start = (page - 1) * limit;
        let total_page;

        const queryTypeRoom = !typeroom ? `OR kindofrooms.nameRoom IS NULL` : `AND kindofrooms.nameRoom IS NOT NULL`
        const [price_start, price_end] = price.split('-');

        try {
            // const query = `SELECT products.idProduct, images.imgUrl, images.typeImg, categorys.nameCat, kindofrooms.nameRoom,
            // nameProduct, price, quantity, material, size, description
            //     FROM products
            //          INNER JOIN images ON products.idProduct = images.idProduct
            //          INNER JOIN categorys ON products.idCategory = categorys.idCat
            //          LEFT JOIN kindofrooms ON products.idTypesRoom = kindofrooms.idRoom
            //             WHERE (images.typeImg = 'Avatar' AND products.idTypesRoom IS NULL) OR
    		// 				  (images.typeImg = 'Avatar' AND kindofrooms.idRoom IS NOT NULL)
            //             ORDER BY products.createdAt`
            const query = `SELECT products.idProduct, images.imgUrl, images.typeImg, categorys.nameCat, kindofrooms.nameRoom, 
            nameProduct, price, quantity, material, size, description 
                FROM products 
                INNER JOIN images ON products.idProduct = images.idProduct 
                INNER JOIN categorys ON products.idCategory = categorys.idCat 
                LEFT JOIN kindofrooms ON products.idTypesRoom = kindofrooms.idRoom 
                    WHERE images.typeImg = 'Avatar' 
                    AND (products.idProduct = '${search}' OR products.nameProduct LIKE '%${search}%')
                    AND (categorys.nameCat LIKE '%${category}%' OR categorys.nameCat IS NULL)
                    AND (kindofrooms.nameRoom LIKE '%${typeroom}%' ${queryTypeRoom})
                    AND (products.price > ${+price_start} AND products.price <= ${+price_end})
                        ORDER BY products.createdAt`
            const rowData = await sequelize.query(query, { type: QueryTypes.SELECT });
            if (rowData.length !== 0) {
                total_row = rowData.length;
            }
            total_page = Math.ceil(total_row / limit);
            const products = await sequelize.query(`${query} ASC LIMIT ${start}, ${limit};`, { type: QueryTypes.SELECT });
            if (products.length !== 0) {
                console.log(products);
                console.log(products.length);
                data.errCode = 0
                data.errMessage = 'Đã lấy danh sách sản phẩm thành công'
                data.total_row = total_row
                data.limit = limit
                data.page = page
                data.total_page = total_page
                data.data = products
            } else {
                data.errCode = 1,
                    data.errMessage = 'Không tìm thấy danh sản phẩm'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let getListProduct = () => {
    return new Promise(async (resolve, reject) => {
        let data = {};

        try {
            const query = `SELECT idProduct, nameProduct FROM products ORDER BY createdAt`
            const products = await sequelize.query(`${query}`, { type: QueryTypes.SELECT });
            if (products.length !== 0) {
                console.log(products);
                console.log(products.length);
                data.errCode = 0
                data.errMessage = 'Đã lấy danh sách sản phẩm thành công'
                data.data = products
            } else {
                data.errCode = 1,
                    data.errMessage = 'Không tìm thấy danh sản phẩm'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let getInfoProduct = (idProduct) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            const query = `SELECT products.idProduct, images.imgUrl, categorys.idCat, categorys.nameCat, kindofrooms.idRoom, kindofrooms.nameRoom,
            nameProduct, price, quantity, material, size, description
                FROM products
                     INNER JOIN images ON products.idProduct = images.idProduct
                     INNER JOIN categorys ON products.idCategory = categorys.idCat
                     LEFT JOIN kindofrooms ON products.idTypesRoom = kindofrooms.idRoom
                        WHERE images.typeImg = 'Avatar' AND products.idProduct = '${idProduct}'`
            const product = await sequelize.query(`${query}`, { type: QueryTypes.SELECT });
            if (product.length !== 0) {
                console.log(product);
                console.log(product.length);
                data.errCode = 0
                data.errMessage = 'Đã lấy sản phẩm thành công'
                let listImageDetail = await imageService.getListImagesDetail(idProduct);
                data.data = {...product[0], listImageDetail: listImageDetail}
            } else {
                data.errCode = 1,
                    data.errMessage = 'Không tìm thấy sản phẩm'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let deleteProduct = (idProduct) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let d = await imageService.deleteImages(idProduct)
            const query = `DELETE FROM products WHERE idProduct = '${idProduct}'`;
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

module.exports = {
    createProduct: createProduct,
    getProductByPage: getProductByPage,
    getListProduct: getListProduct,
    getInfoProduct: getInfoProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
}

/**
 * SELECT products.idProduct, images.imgUrl, images.typeImg, categorys.nameCat, kindofrooms.nameRoom, 
nameProduct, price, quantity, material, size, description 
	FROM products 
    INNER JOIN images ON products.idProduct = images.idProduct 
    INNER JOIN categorys ON products.idCategory = categorys.idCat 
    LEFT JOIN kindofrooms ON products.idTypesRoom = kindofrooms.idRoom 
    	WHERE images.typeImg = 'Avatar' 
        AND (products.idProduct = '' OR products.nameProduct LIKE '%%')
        AND (categorys.nameCat LIKE '%%' OR categorys.nameCat IS NULL)
    	AND (kindofrooms.nameRoom LIKE '%%' OR kindofrooms.nameRoom IS NULL)
        AND (products.price > 0 AND products.price <= 1000000000)
        	ORDER BY products.createdAt;
 */