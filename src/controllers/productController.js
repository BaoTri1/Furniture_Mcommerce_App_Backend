import productService from '../services/productService';

class ProductController {

    //POST api/products/addProduct
    async createProduct(req, res, next) {
        let idCategory = req.body.idCategory;
        let idRoom = req.body.idRoom;
        let nameProduct = req.body.nameProduct;
        let price = req.body.price;
        let quantity = req.body.quantity;
        let material = req.body.material;
        let size = req.body.size;
        let description = req.body.description;
        let images = req.body.images;

        if(!idCategory || !nameProduct || !price || !quantity || !material || !size || !description || !images) {
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

        let results = await productService.createProduct()

        return res.status(200).json({
            idCategory: idCategory,
            idRoom: idRoom,
            nameProduct: nameProduct,
            price: price,
            quantity: quantity,
            material: material,
            size: size,
            description: description,
            images: images,
            results
            
        })

    }

}

module.exports = new ProductController;