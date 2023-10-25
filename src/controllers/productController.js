import productService from '../services/productService';

class ProductController {

    //POST api/products/addProduct
    async createProduct(req, res, next) {
        let idCategory = req.body.idCategory;
        let nameProduct = req.body.nameProduct;
        let price = req.body.price;
        let quantity = req.body.quantity;
        let material = req.body.material;
        let size = req.body.size;
        let description = req.body.description;

        if(!idCategory || !nameProduct || !price || !quantity || !material || !size || !description) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error or missing payload.'
            })
        }

        if(price <= 0 || quantity <= 0) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Giá sản phẩm hoặc số lượng phải lớn hơn 0.'
            })
        }

        let results = await productService.createProduct(req.body)

        return res.status(200).json({
            results
            
        })

    }

    //GET api/products/?page=''&limit=''
    async getProductByPage(req, res, next) {
        let page = req.query.page || 1;
        let limit = req.query.limit || 20;

        let results = await productService.getProductByPage(page, limit, '')

        return res.status(200).json({
            results
            
        })
    }

    //GET api/products/:id
    async getInfoProduct(req, res, next) {
        let id = req.query.id;

        let results = await productService.getInfoProduct(id)

        return res.status(200).json({
            results
            
        })
    }

    //PUT api/products/update/:id
    async updateProduct(req, res, next) {
        let id = req.params.id;
        let idCategory = req.body.idCategory;
        let nameProduct = req.body.nameProduct;
        let price = req.body.price;
        let quantity = req.body.quantity;
        let material = req.body.material;
        let size = req.body.size;
        let description = req.body.description;

        if(!idCategory || !nameProduct || !price || !quantity || !material || !size || !description) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error or missing payload.'
            })
        }

        if(price <= 0 || quantity <= 0) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Giá sản phẩm hoặc số lượng phải lớn hơn 0.'
            })
        }

        let results = await productService.updateProduct(id, req.body);
        return res.status(200).json({
            results
        })
    }

    //DELETE api/products/:id
    async deleteProduct(req, res, next) {
        let id = req.params.id;
        console.log(id)
        let results = await productService.deleteProduct(id)

        return res.status(200).json({
            results
            
        })

    }

}

module.exports = new ProductController;