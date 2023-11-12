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

    //[GET] /api/services/information
    async getInformation(req, res, next) {
        try {
            let result = await otherServices.getInfomation();
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

    //[GET] /api/services/most-product-for-month
    async getMostProductForMonth(req, res, next) {
        let yearMonth = req.query.yearMonth;
        try {
            let result = await otherServices.getMostProductForMonth(yearMonth);
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

    //[GET] /api/services/StatisticalProductByParentCategory
    async statisticalProduct_ParentCategory(req, res, next) {
        try {
            let result = await otherServices.statisticalProduct_ParentCategory();
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

    //[GET] /api/services/StatisticalForMonth?&yearMonth=''
    async statisticalForMonth(req, res, next) {
        let yearMonth = req.query.yearMonth;
        try {
            let result = await otherServices.statisticalForMonth(yearMonth);
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

    //[GET] /api/services/MonthlyRevenueStatisticsByCategory?&yearMonth=''
    async MonthlyRevenueStatisticsByCategory(req, res, next) {
        let yearMonth = req.query.yearMonth;
        try {
            let result = await otherServices.monthlyRevenueStatisticsByCategory(yearMonth);
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

    //[GET] /api/services/order-by-status?&yearMonth=''
    async getOrderByListStatus(req, res, next) {
        let yearMonth = req.query.yearMonth;
        try {
            let result = await otherServices.getOrderByListStatus(yearMonth);
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