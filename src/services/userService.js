import { QueryTypes } from 'sequelize';
import db, { sequelize } from '../models/index';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

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
                        let user = await getInforUser(account[0].idAcc);
                        const token = JWT.sign({idAcc: account[0].idAcc, isAdmin: account[0].isAdmin}, process.env.JWT_SECRET, {expiresIn: '1d'});
                        userData.errCode = 0
                        userData.errMessage = 'Đăng nhập thành công.'
                        userData.isAdmin = account[0].isAdmin
                        userData.userInfor = user
                        userData.access_token = `Bearer ${token}`;
                        
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
                const lastaccount = await sequelize.query("SELECT * FROM accounts ORDER BY createdAt DESC LIMIT 1;", {
                    type: QueryTypes.SELECT
                });
                const lastuser = await sequelize.query("SELECT * FROM users ORDER BY createdAt DESC LIMIT 1;", {
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

                if (lastaccount.length === 0) {
                    idAcc = 'ACC1';
                    console.log(idAcc);
                } else {
                    //Tao idAcc mới bằng cách lấy số cuối của idAcc cuối bảng cộng thêm 1 rồi thêm vào chuỗi 'ACC'
                    idAcc = 'ACC' + (pubMethod.parseIdtoInt(lastaccount[0].idAcc) + 1);
                    console.log(idAcc);
                }

                //Insert users vào database
                try {
                    const query = `INSERT INTO users (idUser, idAcc, fullName, createdAt, updatedAt) VALUES
                                    (:idUser, :idAcc, :fullName, :createdAt, :updatedAt)`;
                    const values = {
                        idUser: idUser,
                        idAcc: idAcc,
                        fullName: data.fullName,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    const result = await sequelize.query(query, {
                        replacements: values,
                        type: sequelize.QueryTypes.INSERT,
                    });
                    console.log('Inserted record:', result[0]);
                    if(result[1] === 0){
                        userData.errCode = 5;
                        userData.errMessage = 'Thêm người dùng thất bại.'
                        resolve(userData);
                    }
                } catch (error) {
                    console.log(error);
                }

                //Insert accounts vào database
                try {
                    const query = `INSERT INTO accounts (idAcc, sdt, password, createdAt, updatedAt) VALUES
                                     (:idAcc, :sdt, :password, :createdAt, :updatedAt)`;
                    const values = {
                        idAcc: idAcc,
                        sdt: data.sdt,
                        password: hashPassword,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    const result = await sequelize.query(query, {
                        replacements: values,
                        type: sequelize.QueryTypes.INSERT,
                    });
                    console.log('Inserted record:', result[0]);
                    if(result[1] === 0){
                        userData.errCode = 5;
                        userData.errMessage = 'Thêm tài khoản thất bại.'
                        resolve(userData);
                    }
                } catch (error) {
                    console.log(error);
                }

                try {
                    const query ="SELECT idAcc, isAdmin FROM accounts WHERE idAcc = :idAcc";
                    const result =await sequelize.query(query, {
                        replacements: {idAcc: idAcc},
                        type: sequelize.QueryTypes.SELECT,
                    });
                    console.log(result);
                    if(result.length === 0){
                        userData.errCode = 6;
                        userData.errMessage = 'Đăng ký thất bại.'
                        resolve(userData);
                    }else {
                        let user = await getInforUser(result[0].idAcc);
                        const token = JWT.sign({idAcc: result[0].idAcc, isAdmin: result[0].isAdmin}, process.env.JWT_SECRET, {expiresIn: '1d'});
                        userData.errCode = 0;
                        userData.errMessage = 'Đăng ký thành công.';
                        userData.userInfor = user
                        userData.access_token = `Bearer ${token}`;
                    }
                } catch (error) { 
                    console.log(error);
                }

            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
}

let getInforUser = (idAcc) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await sequelize.query
            ("SELECT idUser, idAcc, fullName, sdtUser, email, gender, dateOfBirth, avatar FROM users WHERE idAcc = '" + idAcc + "';"
                , { type: QueryTypes.SELECT });
            if (user.length !== 0) {
                console.log(user[0]);
                console.log(user.length);
                resolve(user[0]);
            } else {
                console.log('khong co', user[0]);
                resolve(user[0]);
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
    getInforUser: getInforUser,
}