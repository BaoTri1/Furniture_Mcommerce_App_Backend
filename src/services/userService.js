import { QueryTypes } from 'sequelize';
import db, { sequelize } from '../models/index';
import bcrypt from 'bcryptjs';
import { Types } from 'mysql2';

const salt = bcrypt.genSaltSync(10);
const pubMethod = require('../public/public_method');

let handleUserLogin = (sdt, passwd) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserSDT(sdt);
            if (isExist) {
                //sdt da ton tai
                //so sanh password
                let account = await sequelize.query("SELECT * FROM accounts WHERE sdt = " + sdt + ";"
                    , { type: QueryTypes.SELECT });
                if (account.length !== 0) {
                    let check = await bcrypt.compareSync(passwd, account[0].password);
                    if (check) {
                        userData.errCode = 0
                        userData.errMessage = 'Ok'
                        try {
                            let user = await getInforUser(account[0].idUser);
                            userData.userInfor = user
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        userData.errCode = 3
                        userData.errMessage = 'Sai mật khẩu.'
                    }
                } else {
                    userData.errCode = 2
                    userData.errMessage = 'Không tìm thấy người dùng.'
                }
                resolve(userData);

            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = 'Số điện thoại không tồn tại.'
                resolve(userData);
            }
        } catch (error) {
            reject(error);
        }
    })
}

let checkUserSDT = (sdt) => {
    return new Promise(async (resolve, reject) => {
        try {
            let account = await sequelize.query("SELECT * FROM accounts WHERE sdt = " + sdt + ";"
                , { type: QueryTypes.SELECT });
            if (account.length !== 0) {
                console.log(account);
                console.log(account.length);
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}

let handleUserSignup = async (data) => {
    console.log(data)
    let hashPassword = await hashUserPassword(data.passwd);
    console.log(hashPassword);
    let userData = {};
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await hashUserPassword(data.passwd);
            let idAcc;
            let idUser;
            let isExist = await checkUserSDT(data.sdt);
            if (isExist) {
                //return error
                userData.errCode = 4;
                userData.errMessage = 'Số điện thoại đã tồn tại.'
                resolve(userData);
            } else {
                const lastaccount = await sequelize.query("SELECT * FROM accounts ORDER BY idAcc DESC LIMIT 1;", {
                    type: QueryTypes.SELECT
                });
                const lastuser = await sequelize.query("SELECT * FROM users ORDER BY idUser DESC LIMIT 1;", {
                    type: QueryTypes.SELECT
                });

                if (lastuser.length === 0) {
                    idUser = 'USER1';
                    console.log(idUser);
                } else {
                    //Tao idUser mới bằng cách lấy số cuối của idUser cuối bảng cộng thêm 1 rồi thêm vào chuỗi 'USER'
                    idUser = 'USER' + (pubMethod.parseIdtoInt(lastuser[0].idUser) + 1);
                    console.log(idUser);
                }

                if (lastaccount === 0) {
                    idAcc = 'ACC1';
                    console.log(idAcc);
                } else {
                    //Tao idAcc mới bằng cách lấy số cuối của idAcc cuối bảng cộng thêm 1 rồi thêm vào chuỗi 'ACC'
                    idAcc = 'ACC' + (pubMethod.parseIdtoInt(lastuser[0].idUser) + 1);
                    console.log(idAcc);
                }

                //Insert users vào database
                try {
                    const query = `INSERT INTO users (idUser, fullName, createdAt, updatedAt) VALUES
                                    (:idUser, :fullName, :createdAt, :updatedAt)`;
                    const values = {
                        idUser: idUser,
                        fullName: data.fullName,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    const result = await sequelize.query(query, {
                        replacements: values,
                        type: sequelize.QueryTypes.INSERT,
                    });
                    console.log('Inserted record:', result);
                } catch (error) {
                    console.log(error);
                }

                //Insert accounts vào database
                try {
                    const query = `INSERT INTO accounts (idAcc, idUser, sdt, password, isAdmin, createdAt, updatedAt) VALUES
                                     (:idAcc, :idUser, :sdt, :password, :isAdmin, :createdAt, :updatedAt)`;
                    const values = {
                        idAcc: idAcc,
                        idUser: idUser,
                        sdt: data.sdt,
                        password: hashPassword,
                        isAdmin: false,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    const result = await sequelize.query(query, {
                        replacements: values,
                        type: sequelize.QueryTypes.INSERT,
                    });
                    console.log('Inserted record:', result);
                } catch (error) {
                    console.log(error);
                }

            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

let getInforUser = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await sequelize.query
            ("SELECT idUser, fullName, sdtUser, email, gender, dateOfBirth, avatar FROM users WHERE idUser = '" + idUser + "';"
                , { type: QueryTypes.SELECT });
            if (user.length !== 0) {
                console.log(user[0]);
                console.log(user.length);
                resolve(user[0]);
            } else {
                console.log('ko co');
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    });
}

let hashUserPassword = (passwd) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(passwd, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    handleUserLogin: handleUserLogin,
    handleUserSignup: handleUserSignup,
}