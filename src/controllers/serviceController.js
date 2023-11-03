import otherServices from '../services/otherService';

class OtherService {

    //[GET] /api/services/methodShipping
    async getMethodShipping(req, res, next) {
        try {
            let result = await otherServices.getMethodShipping();
            return res.status(200).json({
                ...result
            })
        } catch (error) {
            return res.status(500).json({
                errCode: -1,
                errMessage: 'Internal Server Error'
            })
        }
    }

    //[GET] /api/services/methodPayment
    async getMethodPayment(req, res, next) {
        try {
            let result = await otherServices.getMethodPayment();
            return res.status(200).json({
                ...result
            })
        } catch (error) {
            return res.status(500).json({
                errCode: -1,
                errMessage: 'Internal Server Error'
            })
        }
    }
}

module.exports = new OtherService();