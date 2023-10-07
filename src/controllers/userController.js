import userService from '../services/userService';

class UserController {

    //[POST] /api/users/login
    async handleLogin(req, res, next) {
        let sdt = req.body.sdt;
        let passwd = req.body.passwd;
        if(!sdt || !passwd){
            return res.status(500).json({
                statusCode: 1,
                message: "Missing input parameter!"
            })
        }
        
        let userData = await userService.handleUserLogin(sdt, passwd);

        return res.status(200).json({
            userData,
        })
    }

    //[POST] /api/users/signup
    async handleSignup(req, res, next) {
        let sdt = req.body.sdt;
        let passwd = req.body.passwd;
        let fullName = req.body.fullName;
        
        if(!sdt || !passwd || !fullName){
            return res.status(500).json({
                statusCode: 1,
                message: "Missing input parameter!"
            })
        }

        let userData = await userService.handleUserSignup(req.body);
        return res.status(200).json({
            userData
        })
    }
}

module.exports = new UserController;
