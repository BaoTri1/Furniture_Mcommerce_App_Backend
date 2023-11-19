import userService from '../services/userService';

class UserController {

    //[POST] /api/users/login
    async handleLogin(req, res, next) {
        try {
            let sdt = req.body.sdt;
            let passwd = req.body.passwd;
            if (!sdt || !passwd) {
                return res.status(400).json({
                    errCode: -1,
                    errMessage: "Missing input parameter!"
                })
            }

            let userData = await userService.handleUserLogin(sdt, passwd);

            return res.status(200).json({
                ...userData
            })
        } catch (error) {
            return res.status(500).json({
                errCode: -1,
                errMessage: 'Internal Server Error'
            })
        }
    }

    //[POST] /api/users/signup
    async handleSignup(req, res, next) {
        let sdt = req.body.sdt;
        let passwd = req.body.passwd;
        let fullName = req.body.fullName;

        if (!sdt || !passwd || !fullName) {
            return res.status(400).json({
                errCode: -1,
                errMessage: "Missing input parameter!"
            })
        }

        let userData = await userService.handleUserSignup(req.body);
        return res.status(200).json({
            ...userData
        })
    }

    //[GET] /api/users/
    async getInfoUser(req, res, next) {
        console.log(req.account)
        let { idAcc } = req.account;

        let userData = await userService.getInforUser(idAcc);

        try {
            return res.status(200).json({
                errCode: 0,
                errMessage: 'Ok',
                userData
            })
        } catch (error) {
            return res.status(500).json({
                errCode: -1,
                errMessage: 'Internal Server Error'
            })
        }
    }

    //[GET] /api/users/?page=''&limit=''&search=''
    async getListUserByPage(req, res, next) {
        let page = req.query.page || 1;
        let limit = req.query.limit || 20;
        let searchtext = req.query.search || '';

        let results = await userService.getListUserByPage(page, limit, searchtext);

        try {
            return res.status(200).json({
                results
            })
        } catch (error) {
            return res.status(500).json({
                errCode: -1,
                errMessage: 'Internal Server Error'
            })
        }
    }

    //[PUT] /api/users/updateInfo/?id=''
    async updateInfoUser(req, res, next) {
        let id = req.query.id;
        let fullName = req.body.fullName;
        let sdtUser = req.body.sdtUser;
        let email = req.body.email;
        let gender = req.body.gender;
        let dateOfBirth = req.body.dateOfBirth;

        if(!fullName || !sdtUser || !email || !gender || !dateOfBirth){
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error or missing payload.'
            })
        }

        let userData = await userService.updateInfor(req.body, id);

        try {
            return res.status(200).json({
                errCode: 0,
                errMessage: 'Ok',
                userData
            })
        } catch (error) {
            return res.status(500).json({
                errCode: -1,
                errMessage: 'Internal Server Error'
            })
        }
    }
}

module.exports = new UserController;
