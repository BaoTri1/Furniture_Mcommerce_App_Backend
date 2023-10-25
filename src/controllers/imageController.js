import imageService from '../services/imageService';

class ImageController {

    //[POST] /api/images/uploadavatarproduct
    async uploadAvatarProduct(req, res, next) {
        if (!req.file) {
            next(new Error('No file uploaded!'));
            return;
        }

        let results = await imageService.uploadImageProduct(req.body, req.file);
        return res.status(200).json({
            results
        })
    }

    //[POST] /api/images/updateavatarproduct
    async updateAvatarProduct(req, res, next) {
        if (!req.file) {
            next(new Error('No file uploaded!'));
            return;
        }

        let results = await imageService.updateAvatarProduct(req.body, req.file);
        return res.status(200).json({
            results
        })
    }

    //[POST] /api/images/updatedetailimagesproduct
    async updateDetailImagesProduct(req, res, next) {
        if (!req.files) {
            next(new Error('No file uploaded!'));
            return;
        }

        let results = await imageService.updateDetailImagesProduct(req.body, req.files);
        return res.status(200).json({
            results
        })
    }


    //[POST] /api/images/uploaddetailproduct
    async uploadDetailImageProduct(req, res, next) {
        if (!req.files) {
            next(new Error('No file uploaded!'));
            return;
        }

        let results = await imageService.uploadDetailImageProduct(req.body, req.files);
        return res.status(200).json({
            results
        })
    }
}

module.exports = new ImageController;