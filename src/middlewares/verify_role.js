import JWT from 'jsonwebtoken';

const isAdmin = (req, res, next) => {
    const account = req.account
    if(account.isAdmin !== 1){
        return res.status(401).send({
            errCode: -11,
            errMessage: 'Bạn cần có quyền quản trị để thực hiện việc này.'
        })
    }
    next();
}

export default isAdmin
