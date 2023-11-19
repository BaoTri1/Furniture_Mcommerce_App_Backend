import { QueryTypes } from 'sequelize';
import { sequelize } from '../models/index';

const cloudinary = require('cloudinary').v2;


let uploadImageProduct = (params, file) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataImage = {};
            console.log(file)

            //Insert database
            try {
                const query = `INSERT INTO images (idProduct, nameImage, typeImg, imgUrl, createdAt, updatedAt) 
                VALUES 
                    (:idProduct, :nameImage, :typeImg, :imgUrl, :createdAt, :updatedAt)`;

                const values = {
                    idProduct: params.idProduct,
                    nameImage: file.filename,
                    typeImg: params.typeImg,
                    imgUrl: file.path,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                const result = await sequelize.query(query, {
                    replacements: values,
                    type: sequelize.QueryTypes.INSERT,
                });
                console.log('Inserted record:', result[1]);
                if (result[1] === 0) {
                    dataImage.errCode = 1;
                    dataImage.errMessage = 'Thêm hình ảnh thất bại.'
                    cloudinary.uploader.destroy(file.filename);
                } else {
                    dataImage.errCode = 0;
                    dataImage.errMessage = 'Thêm hình ảnh thành công.'
                }
            } catch (error) {
                console.log(error);
            }
            resolve(dataImage)
        } catch (error) {
            reject(error);
        }
    });
}

let uploadAvatar = (idUser, file) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataImage = {};
            console.log(file)

            //Insert database
            try {
                const queryAvatar = `SELECT avatar FROM users WHERE idUser = '${idUser}'`;

                // const values = {
                //     idProduct: params.idProduct,
                //     nameImage: file.filename,
                //     typeImg: params.typeImg,
                //     imgUrl: file.path,
                //     createdAt: new Date(),
                //     updatedAt: new Date(),
                // };

                const resultAvatar = await sequelize.query(queryAvatar, {
                    type: sequelize.QueryTypes.SELECT,
                });
                console.log(resultAvatar);
                if (resultAvatar.length === 0) {
                    dataImage.errCode = 1;
                    dataImage.errMessage = 'Thêm hình ảnh thất bại.'
                } else {
                    console.log(resultAvatar[0]);
                    if(resultAvatar[0].avatar !== null){
                        const [path, name] = resultAvatar[0].avatar.split(' ');
                        cloudinary.uploader.destroy(name)
                    }

                    const query = `UPDATE users SET avatar = :avatar, updatedAt = :updatedAt WHERE idUser = '${idUser}'`;
                    const values = {
                        avatar: `${file.path} ${file.filename}`,
                        updatedAt: new Date(),
                    };

                    const result = await sequelize.query(query, {
                        replacements: values,
                        type: sequelize.QueryTypes.UPDATE,
                    });
                    if (result[1] === 0) {
                        dataImage.errCode = 1;
                        dataImage.errMessage = 'Cập nhật avatar thất bại.'
                    } else {
                        dataImage.errCode = 0;
                        dataImage.errMessage = 'Cập nhật avatar thành công.'
                    }
                }
            } catch (error) {
                console.log(error);
            }
            resolve(dataImage)
        } catch (error) {
            reject(error);
        }
    });
}

let uploadDetailImageProduct = (params, files) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataImage = {};
            console.log(files)

            //Insert database

            for (let i = 0; i < files.length; i++) {
                let result = await uploadImageProduct(params, files[i]);
                if (result.errCode === 1) {
                    dataImage.errCode = 1
                    dataImage.errMessage = 'Thêm hình ảnh thất bại'
                    return;
                }
            }
            dataImage.errCode = 0
            dataImage.errMessage = 'Thêm hình ảnh chi tiết sản phẩm thành công'
            resolve(dataImage)
        } catch (error) {
            reject(error);
        }
    });
}

let updateAvatarProduct = (params, file) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataImage = {};
            console.log(file)
            let nameImage = await getavatarProduct(params.idProduct);
            if (nameImage.length !== 0) {
                console.log("nameImage", nameImage[0].nameImage)
                cloudinary.uploader.destroy(nameImage[0].nameImage)
                const query = `DELETE FROM images WHERE nameImage = '${nameImage[0].nameImage}'`;
                const resultQuery = await sequelize.query(query, {
                    type: sequelize.QueryTypes.DELETE,
                });
                let result = await uploadImageProduct(params, file)
                if (result.errCode === 1) {
                    dataImage.errCode = 1
                    dataImage.errMessage = 'Thêm hình ảnh thất bại'
                    return;
                }
            }
            dataImage.errCode = 0
            dataImage.errMessage = 'Cập nhật hình ảnh sản phẩm thành công'
            resolve(dataImage)
        } catch (error) {
            reject(error);
        }
    });
}

let updateDetailImagesProduct = (params, files) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataImage = {};
            console.log(files)
            let listImage = await getListNameImagesDetail(params.idProduct);
            if (listImage.length !== 0) {
                for (let i = 0; i < listImage.length; i++) {
                    console.log("nameImages", listImage[i].nameImage)
                    cloudinary.uploader.destroy(listImage[i].nameImage)
                    const query = `DELETE FROM images WHERE nameImage = '${listImage[i].nameImage}'`;
                    const resultQuery = await sequelize.query(query, {
                        type: sequelize.QueryTypes.DELETE,
                    });
                }

                for (let i = 0; i < files.length; i++) {
                    let result = await uploadImageProduct(params, files[i]);
                    if (result.errCode === 1) {
                        dataImage.errCode = 1
                        dataImage.errMessage = 'Thêm hình ảnh thất bại'
                        return;
                    }
                }
            }
            dataImage.errCode = 0
            dataImage.errMessage = 'Cập nhật hình ảnh sản phẩm thành công'
            resolve(dataImage)
        } catch (error) {
            reject(error);
        }
    });
}

let getListNameImages = (idProduct) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT nameImage FROM images WHERE idProduct = '${idProduct}'`;
            const result = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
}

let getListImagesDetail = (idProduct) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT imgUrl FROM images WHERE typeImg = 'Detail' AND idProduct = '${idProduct}'`;
            const result = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
}

let getListNameImagesDetail = (idProduct) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT nameImage FROM images WHERE typeImg = 'Detail' AND idProduct = '${idProduct}'`;
            const result = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
}

let getavatarProduct = (idProduct) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT nameImage FROM images WHERE typeImg = 'Avatar' AND idProduct = '${idProduct}'`;
            const result = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
            });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
}

let deleteImages = (idProduct) => {
    return new Promise(async (resolve, reject) => {
        try {
            let listImage = await getListNameImages(idProduct);
            console.log(listImage)
            if (listImage.length !== 0) {
                for (let i = 0; i < listImage.length; i++) {
                    cloudinary.uploader.destroy(listImage[i].nameImage)
                }
                const query = `DELETE FROM images WHERE idProduct = '${idProduct}'`;
                const result = await sequelize.query(query, {
                    type: sequelize.QueryTypes.DELETE,
                });
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    uploadImageProduct: uploadImageProduct,
    uploadDetailImageProduct: uploadDetailImageProduct,
    updateAvatarProduct: updateAvatarProduct,
    updateDetailImagesProduct: updateDetailImagesProduct,

    deleteImages: deleteImages,
    getListImagesDetail: getListImagesDetail,
    uploadAvatar: uploadAvatar
}

/*
"secure_url": {
        "fieldname": "images",
        "originalname": "Sofa-Coastal-3-cho-768x511.jpg",
        "encoding": "7bit",
        "mimetype": "image/jpeg",
        "path": "https://res.cloudinary.com/dckslpcmb/image/upload/v1698041350/furniture_shop_app/iqmlthlvprhtyev3mdpt.jpg",
        "size": 29284,
        "filename": "furniture_shop_app/iqmlthlvprhtyev3mdpt"
    }
*/