import { QueryTypes } from 'sequelize';
import db, { sequelize } from '../models/index';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import public_method from '../public/public_method';

const salt = bcrypt.genSaltSync(10);

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
                        const token = JWT.sign({ idAcc: account[0].idAcc, isAdmin: account[0].isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
                        userData.errCode = 0
                        userData.errMessage = 'Đăng nhập thành công.'
                        userData.isAdmin = account[0].isAdmin
                        userData.user = user
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
            let idAcc = 'ACC' + public_method.formatDate() + public_method.generateRandomString();;
            let idUser = 'USER' + public_method.formatDate() + public_method.generateRandomString();;
            let isExist = await checkUserSDT(data.sdt);
            if (isExist) {
                //return error
                userData.errCode = 4;
                userData.errMessage = 'Số điện thoại đã tồn tại.'
                resolve(userData);
            } else {
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
                    if (result[1] === 0) {
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
                    if (result[1] === 0) {
                        userData.errCode = 5;
                        userData.errMessage = 'Thêm tài khoản thất bại.'
                        resolve(userData);
                    }
                } catch (error) {
                    console.log(error);
                }

                try {
                    const query = "SELECT idAcc, isAdmin FROM accounts WHERE idAcc = :idAcc";
                    const result = await sequelize.query(query, {
                        replacements: { idAcc: idAcc },
                        type: sequelize.QueryTypes.SELECT,
                    });
                    console.log(result);
                    if (result.length === 0) {
                        userData.errCode = 6;
                        userData.errMessage = 'Đăng ký thất bại.'
                        resolve(userData);
                    } else {
                        let user = await getInforUser(result[0].idAcc);
                        const token = JWT.sign({ idAcc: result[0].idAcc, isAdmin: result[0].isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
                        userData.errCode = 0;
                        userData.errMessage = 'Đăng ký thành công.';
                        userData.user = user
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
                const [path, name] = user[0].avatar.split(' ');
                user[0].avatar = path;
                if(user[0].gender !== null)
                    user[0].gender = user[0].gender == 1 ? 'Nam' : 'Nữ';
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

let getListUserByPage = (page, limit, search) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let total_row;
            let start = (page - 1) * limit;
            let total_page;

            const query = `SELECT idUser, fullName, sdtUser, email, gender, dateOfBirth, 
                        accounts.sdt AS 'username', accounts.createdAt AS 'dayCreateAccount'
                            FROM users INNER JOIN accounts ON users.idAcc = accounts.idAcc
                            WHERE users.fullName LIKE '%${search}%' OR users.idUser = '${search}' 
                            OR users.sdtUser LIKE '%${search}%' OR accounts.sdt LIKE '%${search}%' ORDER BY users.createdAt`
            const rowData = await sequelize.query(query, { type: QueryTypes.SELECT });
            if (rowData.length !== 0) {
                total_row = rowData.length;
            }
            total_page = Math.ceil(total_row / limit);
            const users = await sequelize.query(`${query} ASC LIMIT ${start}, ${limit};`, { type: QueryTypes.SELECT });
            if (users.length !== 0) {
                console.log(users);
                console.log(users.length);
                data.errCode = 0
                data.errMessage = 'Đã lấy danh sách người dùng thành công'
                data.total_row = total_row
                data.limit = limit
                data.page = page
                data.total_page = total_page
                data.data = users
            } else {
                data.errCode = 1,
                    data.errMessage = 'Không tìm thấy danh sách người dùng'
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
}

let updateInfor= (data, idUser) => {
    return new Promise(async (resolve, reject) => {
        let dataUser = {};
        try {
            const query = `UPDATE users SET fullName = :fullName,  sdtUser = :sdtUser,
             email = :email, gender = :gender, dateOfBirth = :dateOfBirth, updatedAt = :updatedAt
                WHERE idUser = '${idUser}'`;

             const values = {
                fullName: data.fullName,
                sdtUser: data.sdtUser,
                email: data.email,
                gender: data.gender === 'Nam' ? true : false,
                dateOfBirth: new Date(data.dateOfBirth),
                updatedAt: new Date(),
            };
            const result = await sequelize.query(query, {
                replacements: values,
                type: sequelize.QueryTypes.UPDATE,
            });
            if (result[1] === 0) {
                dataUser.errCode = 1;
                dataUser.errMessage = 'Cập nhật thông tin thất bại.'
            } else {
                dataUser.errCode = 0;
                dataUser.errMessage = 'Cập nhật thông tin thành công.'
            }
            resolve(dataUser);
        } catch (error) {
            reject(error);
        }
    });
}


/*
SELECT idUser, fullName, sdtUser, email, gender, dateOfBirth, accounts.sdt, accounts.createdAt
FROM `users` INNER JOIN `accounts` ON users.idAcc = accounts.idAcc
WHERE users.fullName LIKE '%USER1%' OR users.idUser = 'USER1' OR users.sdtUser LIKE '%USER1%' OR accounts.sdt LIKE '%USER1%' 
*/

module.exports = {
    handleUserLogin: handleUserLogin,
    handleUserSignup: handleUserSignup,
    getInforUser: getInforUser,
    getListUserByPage: getListUserByPage,

    updateInfor: updateInfor,
}