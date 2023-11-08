import discountService from '../services/discountService';

class DiscountController {

    //POST api/discounts/addDiscount
    async createDiscount(req, res, next) {
        let idProduct = req.body.idProduct;
        let nameDiscount = req.body.nameDiscount;
        let value = req.body.value;
        let numDiscount = req.body.numDiscount;
        let dayStart = req.body.dayStart;
        let dayEnd = req.body.dayEnd;

        if(!idProduct || !nameDiscount || !value || !numDiscount || !dayStart || !dayEnd) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error or missing payload.'
            })
        }

        if(numDiscount <= 0 || (value < 0 && value > 100)) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Giá trị giảm giá hoặc số lượng phải không hợp lệ.'
            })
        }

        if(dayEnd < dayStart) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Thời gian khuyến mãi không hợp lệ.'
            })
        }

        let results = await discountService.createDiscount(req.body)

        return res.status(200).json({
            results
        })

    }

    //GET api/discounts/?page=''&limit=''&search=''
    async getDiscountByPage(req, res, next) {
        let page = req.query.page || 1;
        let limit = req.query.limit || 20;
        let search = req.query.search || '';

        let results = await discountService.getDiscountByPage(page, limit, search)

        return res.status(200).json({
           ...results,    
        })
    }

    //GET api/discounts/checkQuantity?id=''
    async checkQuantity(req, res, next) {
        let id = req.query.id;

        let results = await discountService.checkQuantity(id)

        return res.status(200).json({
           ...results   
        })
    }

    //GET api/discounts/checkDiscountValid?id=''
    async checkDiscountValid(req, res, next) {
        //id là id của sản phẩm
        let id = req.query.id;

        let results = await discountService.checkDiscountValid(id)

        return res.status(200).json({
           ...results   
        })
    }

    //PUT api/discounts/update/:id
    async updateDiscount(req, res, next) {
        let idDiscount = req.params.id;
        let idProduct = req.body.idProduct;
        let nameDiscount = req.body.nameDiscount;
        let value = req.body.value;
        let numDiscount = req.body.numDiscount;
        let dayStart = req.body.dayStart;
        let dayEnd = req.body.dayEnd;

        if(!idProduct || !nameDiscount || !value || !numDiscount || !dayStart || !dayEnd) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error or missing payload.'
            })
        }

        if(numDiscount <= 0 || (value < 0 && value > 100)) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Giá trị giảm giá hoặc số lượng phải không hợp lệ.'
            })
        }

        if(dayEnd < dayStart) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Thời gian khuyến mãi không hợp lệ.'
            })
        }

        let results = await discountService.updateDiscount(idDiscount, req.body);
        return res.status(200).json({
            results
        })
    }

    //DELETE api/discounts/:id
    async deleteDiscount(req, res, next) {
        let id = req.params.id;
        console.log(id)
        let results = await discountService.deleteDiscount(id)

        return res.status(200).json({
            results
            
        })
    }
}

module.exports = new DiscountController;