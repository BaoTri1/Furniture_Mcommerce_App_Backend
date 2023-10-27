import categoryService from '../services/categoryService';

class CategoryController {

    //GET api/categories/parentCategory/?page=''&limit=''
    async getParentCategoryByPage(req, res, next) {
        let page = req.query.page || 1;
        let limit = req.query.limit || 6;
        let results = await categoryService.getParentCategoryByPage(page, limit);
        return res.status(200).json({
            results
        })
    }

    //GET api/categories/parentCategory/all
    async getlistParentCategory(req, res, next) {
        let results = await categoryService.getlistParentCategory();
        return res.status(200).json({
            results
        })
    }

    //GET api/categories/parentCategory/:id
    async getOneParentCategory(req, res, next) {
        let idCatParent = req.params.id;
        let results = await categoryService.getOneParentCategory(idCatParent);
        return res.status(200).json({
            results
        })
    }

    //POST api/categories/addparentCategory
    async createParentCategory(req, res, next) {
        let name = req.body.name;

        if (!name) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error'
            })
        }
        let results = await categoryService.createParentCategory(name);
        return res.status(200).json({
            results
        })
    }

    //PUT api/categories/updateParentCategory/:id
    async updateParentCategory(req, res, next) {
        let idCatParent = req.params.id;
        let name = req.body.name;

        if (!name || !idCatParent) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error'
            })
        }

        let results = await categoryService.updateParentCategory(idCatParent, name);
        return res.status(200).json({
            results
        })
    }

    //DELETE api/categories/ParentCategory/:id
    async deleteParentCategory(req, res, next) {
        let idCatParent = req.params.id;

        if (!idCatParent) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error'
            })
        }

        let results = await categoryService.deleteParentCategory(idCatParent);
        return res.status(200).json({
            results
        })
    }

    //POST api/categories/addCategory
    async createCategory(req, res, next) {
        let name = req.body.name;
        let idCatParent = req.body.idCatParent;

        if (!name || !idCatParent) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error'
            })
        }
        let results = await categoryService.createCategory(req.body);
        return res.status(200).json({
            results
        })
    }

    //PUT api/categories/updateCategory/:id
    async updateCategory(req, res, next) {
        let idCat = req.params.id;
        let name = req.body.name;
        let idCatParent = req.body.idCatParent;

        if (!name || !idCatParent || !idCat) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error'
            })
        }

        let results = await categoryService.updateCategory(idCat, req.body);
        return res.status(200).json({
            results
        })
    }

    //DELETE api/categories/:id
    async deleteCategory(req, res, next) {
        let idCat = req.params.id;

        if (!idCat) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error'
            })
        }
        let results = await categoryService.deleteCategory(idCat);
        return res.status(200).json({
            results
        })
    }

    //GET api/categories/:id
    async getOneCategory(req, res, next) {
        let idCat = req.params.id;
        let results = await categoryService.getOneCategory(idCat);
        return res.status(200).json({
            results
        })
    }

    // //GET api/categories/all
    // async getallCategory(req, res, next) {
    //     let results = await categoryService.getallCategory();
    //     return res.status(200).json({
    //         results
    //     })
    // }

    //GET api/categories/?page=''&limit=''&search=''
    async getCategoryByPage(req, res, next) {
        let page = req.query.page || 1;
        let limit = req.query.limit || 6;
        let searchtext = req.query.search || '';

        let results = await categoryService.getCategoryByPage(page, limit, searchtext);
        return res.status(200).json({
            results
        })
    }

    //GET api/categories/all
    async getlistCategory(req, res, next) {
        let results = await categoryService.getlistCategory();
        return res.status(200).json({
            results
        })
    }

    //GET api/categories//KindOfRoom/:id
    async getOneKindOfRoom(req, res, next) {
        let idRoom = req.params.id;
        let results = await categoryService.getOneTypeRoom(idRoom);
        return res.status(200).json({
            results
        })
    }

    //GET api/categories/KindOfRoom/?page=''&limit=''
    async getKindOfRoomByPage(req, res, next) {
        let page = req.query.page || 1;
        let limit = req.query.limit || 6;
        let results = await categoryService.getKindOfRoomByPage(page, limit);
        return res.status(200).json({
            results
        })
    }

    //GET api/categories/KindOfRoom/all
    async getListKindOfRoom(req, res, next) {
        let results = await categoryService.getListKindOfRoom();
        return res.status(200).json({
            results
        })
    }

    //POST api/categories/addKindOfRoom
    async createKindOfRoom(req, res, next) {
        let name = req.body.name;

        if (!name) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error'
            })
        }
        let results = await categoryService.createTypeRoom(name);
        return res.status(200).json({
            results
        })
    }

    //DELETE api/categories/KindOfRoom/:id
    async deleteKindOfRoom(req, res, next) {
        let idRoom = req.params.id;

        if (!idRoom) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error'
            })
        }

        let results = await categoryService.deleteTypeRoom(idRoom);
        return res.status(200).json({
            results
        })
    }

    //PUT api/categories/updateaddKindOfRoom/:id
    async updateKindOfRoom(req, res, next) {
        let idRoom = req.params.id;
        let name = req.body.name;

        if (!name || !idRoom) {
            return res.status(400).json({
                errCode: -1,
                errMessage: 'Internal Server Error'
            })
        }

        let results = await categoryService.updateTypeRoom(idRoom, name);
        return res.status(200).json({
            results
        })
    }
}

module.exports = new CategoryController;