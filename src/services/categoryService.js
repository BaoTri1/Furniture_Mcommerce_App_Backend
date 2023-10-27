import { QueryTypes } from 'sequelize';
import { sequelize } from '../models/index';
import public_method from '../public/public_method';

let getParentCategoryByPage = (page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let total_row;
            let start = (page - 1) * limit;
            let total_page;
            let parCat = await sequelize.query(`SELECT idcatParent, name FROM parentcategorys LIMIT ${start}, ${limit};`, { type: QueryTypes.SELECT });
            if (parCat.length !== 0) {
                total_page = Math.ceil(parCat.length / limit);
                console.log(parCat)
                data.errCode = 0
                data.errMessage = 'Lấy dữ liệu nhóm danh mục thành công.'
                data.total_row = parCat.length
                data.limit = limit
                data.page = page
                data.total_page = total_page
                data.data = parCat
            } else {
                data.errCode = 1
                data.errMessage = 'Không tìm thấy dữ liệu'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let getlistParentCategory = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let parCat = await sequelize.query(`SELECT idcatParent, name FROM parentcategorys;`, { type: QueryTypes.SELECT });
            if (parCat.length !== 0) {
                data.errCode = 0
                data.errMessage = 'Lấy dữ liệu nhóm danh mục thành công.'
                data.data = parCat
            } else {
                data.errCode = 1
                data.errMessage = 'Không tìm thấy dữ liệu'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let getOneParentCategory = (idcatParent) => {
    return new Promise(async (resolve, reject) => {
        let dataParentCategory = {};
        try {
            const query = `SELECT idcatParent, name, parentcategorys.name
                            FROM parentcategorys WHERE idcatParent = '${idcatParent}';`
            const catParent = await sequelize.query(query, { type: QueryTypes.SELECT });
            if (catParent.length !== 0) {
                console.log(catParent);
                console.log(catParent.length);
                dataParentCategory.errCode = 0
                dataParentCategory.errMessage = 'Đã lấy danh mục sản phẩm thành công'
                dataParentCategory.data = catParent
            } else {
                dataParentCategory.errCode = 1,
                    dataParentCategory.errMessage = 'Lấy danh mục sản phẩm thất bại'
            }
            resolve(dataParentCategory);
        } catch (error) {
            reject(error);
        }
    })
}

let createParentCategory = (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataParentCategory = {};
            let idcatParent;
            let check = await checkParentCategory(name);
            if (check) {
                dataParentCategory.errCode = 2;
                dataParentCategory.errMessage = 'Nhóm danh mục đã tồn tại'
            } else {
                const lastcatParent = await sequelize.query("SELECT * FROM parentcategorys ORDER BY createdAt DESC LIMIT 1;", {
                    type: QueryTypes.SELECT
                });
                if (lastcatParent.length === 0) {
                    idcatParent = 'CP1';
                    console.log(idCat);
                } else {
                    //Tao idUser mới bằng cách lấy số cuối của idUser cuối bảng cộng thêm 1 rồi thêm vào chuỗi 'USER'
                    idcatParent = 'CP' + (public_method.parseIdtoInt(lastcatParent[0].idcatParent) + 1);
                    console.log(idcatParent);
                }

                //Insert to database
                try {
                    const query = `INSERT INTO parentcategorys (idcatParent, name, createdAt, updatedAt) 
                                        VALUES(:idcatParent, :name, :createdAt, :updatedAt)`;
                    const values = {
                        idcatParent: idcatParent,
                        name: name,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    const result = await sequelize.query(query, {
                        replacements: values,
                        type: sequelize.QueryTypes.INSERT,
                    });
                    if (result[1] === 0) {
                        dataParentCategory.errCode = 3;
                        dataParentCategory.errMessage = 'Thêm nhóm danh mục thất bại.'
                    } else {
                        dataParentCategory.errCode = 0;
                        dataParentCategory.errMessage = 'Thêm nhóm danh mục thành công.'
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            resolve(dataParentCategory);
        } catch (error) {
            reject(error);
        }
    })
}

let checkParentCategory = (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            let catParent = await sequelize.query("SELECT * FROM parentcategorys WHERE name = '" + name + "';"
                , { type: QueryTypes.SELECT });
            if (catParent.length !== 0) {
                console.log(catParent);
                console.log(catParent.length);
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}

let updateParentCategory = (idcatParent, name) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataCategory = {};
            const query = `UPDATE parentcategorys SET name = :name,  updatedAt = :updatedAt WHERE idcatParent = '${idcatParent}';`;
            const values = {
                name: name,
                updatedAt: new Date(),
            };

            const result = await sequelize.query(query, {
                replacements: values,
                type: sequelize.QueryTypes.UPDATE,
            });

            if (result[1] === 0) {
                dataCategory.errCode = 1;
                dataCategory.errMessage = 'Cập nhật nhóm danh mục thất bại.'
            } else {
                dataCategory.errCode = 0;
                dataCategory.errMessage = 'Cập nhật nhóm danh mục thành công.'
            }
            resolve(dataCategory);
        } catch (error) {
            reject(error);
        }
    })
}

let deleteParentCategory = (idcatParent) => {
    return new Promise(async (resolve, reject) => {
        try {
            let deleteParentCategory = {};
            const query = `DELETE parentcategorys, categorys, products, images FROM parentcategorys
            LEFT JOIN categorys ON parentcategorys.idcatParent = categorys.catParent 
            LEFT JOIN products ON categorys.idCat = products.idCategory
            LEFT JOIN images ON products.idProduct = images.idProduct
            WHERE parentcategorys.idcatParent = '${idcatParent}'`;
            const result = await sequelize.query(query, {
                type: sequelize.QueryTypes.DELETE,
            });
            deleteParentCategory.errCode = 0;
            deleteParentCategory.errMessage = 'Xóa nhóm danh mục thành công.'
            resolve(deleteParentCategory);
        } catch (error) {
            reject(error);
        }
    })
}

let createCategory = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataCategory = {};
            let idCat;
            let check = await checkCategory(data.name, data.idCatParent);
            if (check) {
                dataCategory.errCode = 2;
                dataCategory.errMessage = 'Danh mục đã tồn tại'
            } else {
                const lastcategory = await sequelize.query("SELECT * FROM categorys ORDER BY createdAt DESC LIMIT 1;", {
                    type: QueryTypes.SELECT
                });
                if (lastcategory.length === 0) {
                    idCat = 'C1';
                    console.log(idCat);
                } else {
                    //Tao idCategory mới bằng cách lấy số cuối của idUser cuối bảng cộng thêm 1 rồi thêm vào chuỗi 'USER'
                    idCat = 'C' + (public_method.parseIdtoInt(lastcategory[0].idCat) + 1);
                    console.log(idCat);
                }

                //Insert to database
                try {
                    const query = `INSERT INTO categorys (idCat, nameCat, catParent, createdAt, updatedAt) VALUES
            (:idCat, :nameCat, :catParent, :createdAt, :updatedAt)`;
                    const values = {
                        idCat: idCat,
                        nameCat: data.name,
                        catParent: data.idCatParent,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    const result = await sequelize.query(query, {
                        replacements: values,
                        type: sequelize.QueryTypes.INSERT,
                    });
                    console.log('Inserted record:', result[0]);
                    if (result[1] === 0) {
                        dataCategory.errCode = 3;
                        dataCategory.errMessage = 'Thêm danh mục thất bại.'
                    } else {
                        dataCategory.errCode = 0;
                        dataCategory.errMessage = 'Thêm danh mục thành công.'
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            resolve(dataCategory);
        } catch (error) {
            reject(error);
        }
    })
}

let checkCategory = (name, idCatParent) => {
    return new Promise(async (resolve, reject) => {
        try {
            let category = await sequelize.query(`SELECT * FROM categorys WHERE nameCat = '${name}' AND catParent = '${idCatParent}';`
                , { type: QueryTypes.SELECT });
            if (category.length !== 0) {
                console.log(category);
                console.log(category.length);
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getOneCategory = (idCat) => {
    return new Promise(async (resolve, reject) => {
        let dataCategory = {};
        try {
            const query = `SELECT idCat, nameCat, parentcategorys.name
                            FROM categorys
                                INNER JOIN parentcategorys
                            ON categorys.catParent = parentcategorys.idcatParent WHERE idCat = '${idCat}';`
            const category = await sequelize.query(query, { type: QueryTypes.SELECT });
            if (category.length !== 0) {
                console.log(category);
                console.log(category.length);
                dataCategory.errCode = 0
                dataCategory.errMessage = 'Đã lấy danh mục sản phẩm thành công'
                dataCategory.data = category
            } else {
                dataCategory.errCode = 1,
                    dataCategory.errMessage = 'Lấy danh mục sản phẩm thất bại'
            }
            resolve(dataCategory);
        } catch (error) {
            reject(error);
        }
    })
}

let getCategoryByPage = (page, limit, searchtext) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        let total_row;
        let start = (page - 1) * limit;
        let total_page;

        try {
            const query = `SELECT idCat, nameCat, parentcategorys.name, parentcategorys.idcatParent
            FROM categorys
                 INNER JOIN parentcategorys ON categorys.catParent = parentcategorys.idcatParent 
                 WHERE categorys.nameCat LIKE '%${searchtext}%' || categorys.idCat LIKE '%${searchtext}%'
                  || parentcategorys.name LIKE '%${searchtext}%'
                    ORDER BY categorys.createdAt `
            const rowData = await sequelize.query(query, { type: QueryTypes.SELECT });
            if (rowData.length !== 0) {
                total_row = rowData.length;
            }
            total_page = Math.ceil(total_row / limit);
            const categorys = await sequelize.query(`${query} ASC LIMIT ${start}, ${limit};`, { type: QueryTypes.SELECT });
            if (categorys.length !== 0) {
                console.log(categorys);
                console.log(categorys.length);
                data.errCode = 0
                data.errMessage = 'Đã lấy danh sách danh mục sản phẩm thành công'
                data.total_row = total_row
                data.limit = limit
                data.page = page
                data.total_page = total_page
                data.data = categorys
            } else {
                data.errCode = 1,
                data.errMessage = 'Không tìm thấy danh mục sản'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let getlistCategory = () => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            const query = `SELECT idCat, nameCat, parentcategorys.name, parentcategorys.idcatParent
            FROM categorys
                 INNER JOIN parentcategorys ON categorys.catParent = parentcategorys.idcatParent 
                    ORDER BY categorys.createdAt`
            const categorys = await sequelize.query(`${query}`, { type: QueryTypes.SELECT });
            if (categorys.length !== 0) {
                console.log(categorys);
                console.log(categorys.length);
                data.errCode = 0
                data.errMessage = 'Đã lấy danh sách danh mục sản phẩm thành công'
                data.data = categorys
            } else {
                data.errCode = 1,
                data.errMessage = 'Không tìm thấy danh mục sản'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let updateCategory = (idCat, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataCategory = {};
            let check = await checkCategory(data.name);
            if (check) {
                dataCategory.errCode = 2;
                dataCategory.errMessage = 'Danh mục đã tồn tại'
            } else {
                const query = `UPDATE categorys SET nameCat = :nameCat, catParent = :catParent, updatedAt = :updatedAt WHERE idCat = '${idCat}';`;
                const values = {
                    nameCat: data.name,
                    catParent: data.idCatParent,
                    updatedAt: new Date(),
                };

                const result = await sequelize.query(query, {
                    replacements: values,
                    type: sequelize.QueryTypes.UPDATE,
                });

                console.log('Inserted record:', result[0]);
                if (result[1] === 0) {
                    dataCategory.errCode = 1;
                    dataCategory.errMessage = 'Cập nhật danh mục thất bại.'
                } else {
                    dataCategory.errCode = 0;
                    dataCategory.errMessage = 'Cập nhật danh mục thành công.'
                }
            }
            resolve(dataCategory);
        } catch (error) {
            reject(error);
        }
    })
}

let deleteCategory = (idCat) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataCategory = {};
            const query = `DELETE categorys, products, images FROM categorys
            LEFT JOIN products ON categorys.idCat = products.idCategory 
            LEFT JOIN images ON products.idProduct = images.idProduct
            WHERE categorys.idCat = '${idCat}'`;
            const result = await sequelize.query(query, {
                type: sequelize.QueryTypes.DELETE,
            });
            dataCategory.errCode = 0;
            dataCategory.errMessage = 'Xóa danh mục thành công.'
            resolve(dataCategory);
        } catch (error) {
            reject(error);
        }
    })
}

let getKindOfRoomByPage = (page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let start = (page - 1) * limit;
            let total_page;
            let typerooms = await sequelize.query(`SELECT idRoom, nameRoom FROM kindofrooms LIMIT ${start}, ${limit};`, { type: QueryTypes.SELECT });
            if (typerooms.length !== 0) {
                console.log(typerooms)
                total_page = Math.ceil(typerooms.length / limit);
                data.errCode = 0
                data.errMessage = 'Lấy danh sách loại phòng thành công.'
                data.total_row = typerooms.length
                data.limit = limit
                data.page = page
                data.total_page = total_page
                data.data = typerooms
            } else {
                data.errCode = 1
                data.errMessage = 'Không tìm thấy dữ liệu'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let getListKindOfRoom = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let typerooms = await sequelize.query(`SELECT idRoom, nameRoom FROM kindofrooms`, { type: QueryTypes.SELECT });
            if (typerooms.length !== 0) {
                console.log(typerooms)
                data.errCode = 0
                data.errMessage = 'Lấy danh sách loại phòng thành công.'
                data.data = typerooms
            } else {
                data.errCode = 1
                data.errMessage = 'Không tìm thấy dữ liệu'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    })
}

let getOneTypeRoom = (idRoom) => {
    return new Promise(async (resolve, reject) => {
        let dataTypeRoom = {};
        try {
            const query = `SELECT idRoom, nameRoom FROM kindofrooms WHERE idRoom = '${idRoom}';`
            const typeroom = await sequelize.query(query, { type: QueryTypes.SELECT });
            if (typeroom.length !== 0) {
                console.log(typeroom);
                console.log(typeroom.length);
                dataTypeRoom.errCode = 0
                dataTypeRoom.errMessage = 'Đã lấy loại phòng thành công'
                dataTypeRoom.data = typeroom
            } else {
                dataTypeRoom.errCode = 1,
                    dataTypeRoom.errMessage = 'Lấy loại phòng thất bại'
            }
            resolve(dataTypeRoom);
        } catch (error) {
            reject(error);
        }
    })
}

let updateTypeRoom = (idRoom, name) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataCategory = {};
            const query = `UPDATE kindofrooms SET nameRoom = :nameRoom, updatedAt = :updatedAt WHERE idRoom = '${idRoom}';`;
            const values = {
                nameRoom: name,
                updatedAt: new Date(),
            };

            const result = await sequelize.query(query, {
                replacements: values,
                type: sequelize.QueryTypes.UPDATE,
            });
            if (result[1] === 0) {
                dataCategory.errCode = 1;
                dataCategory.errMessage = 'Cập nhật danh mục thất bại.'
            } else {
                dataCategory.errCode = 0;
                dataCategory.errMessage = 'Cập nhật danh mục thành công.'
            }
            resolve(dataCategory);
        } catch (error) {
            reject(error);
        }
    })
}

let createTypeRoom = (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataTypeRoom = {};
            let idRoom;
            let check = await checkTypeRoom(name);
            if (check) {
                dataTypeRoom.errCode = 2;
                dataTypeRoom.errMessage = 'Loại phòng đã tồn tại'
            } else {
                const lasttyperoom = await sequelize.query("SELECT * FROM kindofrooms ORDER BY createdAt DESC LIMIT 1;", {
                    type: QueryTypes.SELECT
                });
                if (lasttyperoom.length === 0) {
                    idRoom = 'ROOM1';
                    console.log(idRoom);
                } else {
                    //Tao idUser mới bằng cách lấy số cuối của idUser cuối bảng cộng thêm 1 rồi thêm vào chuỗi 'USER'
                    idRoom = 'ROOM' + (public_method.parseIdtoInt(lasttyperoom[0].idRoom) + 1);
                    console.log(idRoom);
                }

                //Insert to database
                try {
                    const query = `INSERT INTO kindofrooms (idRoom, nameRoom, createdAt, updatedAt) VALUES
            (:idRoom, :nameRoom, :createdAt, :updatedAt)`;
                    const values = {
                        idRoom: idRoom,
                        nameRoom: name,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    const result = await sequelize.query(query, {
                        replacements: values,
                        type: sequelize.QueryTypes.INSERT,
                    });

                    if (result[1] === 0) {
                        dataTypeRoom.errCode = 3;
                        dataTypeRoom.errMessage = 'Thêm loại phòng thất bại.'
                    } else {
                        dataTypeRoom.errCode = 0;
                        dataTypeRoom.errMessage = 'Thêm loại phòng thành công.'
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            resolve(dataTypeRoom);
        } catch (error) {
            reject(error);
        }
    })
}

let checkTypeRoom = (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            let typeroom = await sequelize.query("SELECT * FROM kindofrooms WHERE nameRoom = '" + name + "';"
                , { type: QueryTypes.SELECT });
            if (typeroom.length !== 0) {
                console.log(typeroom);
                console.log(typeroom.length);
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}

let deleteTypeRoom = (idTypeRoom) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataCategory = {};
            const queryUpdate = `UPDATE products SET idTypesRoom = :idTypesRoom	, updatedAt = :updatedAt WHERE idTypesRoom = '${idTypeRoom}';`;
            const values = {
                idTypesRoom: null,
                updatedAt: new Date()
            }
            const result = await sequelize.query(queryUpdate, {
                replacements: values,
                type: sequelize.QueryTypes.UPDATE,
            });

            const queryDelete = `DELETE FROM kindofrooms WHERE idRoom = '${idTypeRoom}'`;
            const resultdelete = await sequelize.query(queryDelete, {
                type: sequelize.QueryTypes.DELETE,
            });

            dataCategory.errCode = 0;
            dataCategory.errMessage = 'Xóa danh mục thành công.'
            resolve(dataCategory);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getParentCategoryByPage: getParentCategoryByPage,
    getlistParentCategory: getlistParentCategory,
    getOneParentCategory: getOneParentCategory,
    createParentCategory: createParentCategory,
    updateParentCategory: updateParentCategory,
    deleteParentCategory: deleteParentCategory,

    getOneCategory: getOneCategory,
    getlistCategory: getlistCategory,
    getCategoryByPage: getCategoryByPage,
    createCategory: createCategory,
    updateCategory: updateCategory,
    deleteCategory: deleteCategory,

    getOneTypeRoom: getOneTypeRoom,
    getListKindOfRoom: getListKindOfRoom,
    getKindOfRoomByPage: getKindOfRoomByPage,
    createTypeRoom: createTypeRoom,
    updateTypeRoom: updateTypeRoom,
    deleteTypeRoom: deleteTypeRoom,
}

// SELECT idCat, nameCat, parentcategorys.name, parentcategorys.idcatParent
//     FROM categorys
//          INNER JOIN parentcategorys ON categorys.catParent = parentcategorys.idcatParent
//          WHERE categorys.nameCat LIKE '%C3%' || categorys.idCat LIKE '%C3%' || parentcategorys.name LIKE '%C3%'
//             ORDER BY categorys.createdAt ASC LIMIT 0, 10;