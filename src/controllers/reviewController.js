import reviewService from '../services/reviewService';

class ReviewController {

    //POST api/reviews/addReview
    async createReview(req, res, next) {
        let idUser = req.body.idUser;
        let idProduct = req.body.idProduct;
        let point = req.body.point;
        let comment = req.body.comment;
        let timeCreate = req.body.timeCreate;

        if(!idUser || !idProduct || !point || !comment || !timeCreate) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error or missing payload.'
            })
        }

        if(point < 0) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Điểm đánh giá không hợp lệ.'
            })
        }

        let results = await reviewService.createReview(req.body)

        return res.status(200).json({
            results
            
        })

    }

    //GET api/reviews/?page=''&limit=''&search=''
    async getProductByPage(req, res, next) {
        let page = req.query.page || 1;
        let limit = req.query.limit || 20;
        let search = req.query.search || '';

        let results = await reviewService.getReviewByPage(page, limit, search)

        return res.status(200).json({
           results,    
        })
    }

    //GET api/reviews/product/?id=''&page=''&limit=''
    async getListReviewForProduct(req, res, next) {
        let idProduct = req.query.id;
        let page = req.query.page || 1;
        let limit = req.query.limit || 6;

        if(!idProduct){
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error or missing payload.'
            })
        }

        let results = await reviewService.getListReviewForProduct(idProduct)
        return res.status(200).json({
            results,    
         })
    }

    //GET api/reviews/rating/:idProduct
    async getRatingProduct(req, res, next) {
        let idProduct = req.params.idProduct;

        if(!idProduct){
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error or missing payload.'
            })
        }

        let results = await reviewService.Rating(idProduct)
        return res.status(200).json({
            results,    
         })
    }

    //PUT api/reviews/update/:id
    async updateReview(req, res, next) {
        let idRat = req.params.id;
        let idUser = req.body.idUser;
        let idProduct = req.body.idProduct;
        let point = req.body.point;
        let comment = req.body.comment;
        let timeCreate = req.body.timeCreate;

        if(!idUser || !idProduct || !point || !comment || !timeCreate) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error or missing payload.'
            })
        }

        if(point < 0) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Điểm đánh giá không hợp lệ.'
            })
        }

        let results = await reviewService.updateReview(idRat, req.body)

        return res.status(200).json({
            results
            
        })

    }

    //DELETE api/reviews/:id
    async deleteReview(req, res, next) {
        let id = req.params.id;
        let results = await productService.deleteReview(id)

        return res.status(200).json({
            results
            
        })

    }
}

module.exports = new ReviewController;