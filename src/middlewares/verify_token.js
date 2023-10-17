import JWT from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization
    if(!token){
        return res.status(401).send({
            errCode: -1,
            errMessage: 'Internal Server Error'
        })
    }else {
        const access_token = token.split(' ')[1];
        JWT.verify(access_token, process.env.JWT_SECRET, (err, decode) => {
            if(err){
                return res.status(401).send({
                    errCode: -10,
                    errMessage: 'Chưa có xác thực. Hãy đăng nhập để thực hiện xác thực'
                })
            }
            else {
                req.account = decode
                next()
            }
        });
    }
}

export default verifyToken
