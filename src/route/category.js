import express from 'express';
import categoryController from '../controllers/categoryController';
import verifyToken from '../middlewares/verify_token';
import isAdmin from '../middlewares/verify_role';

const router = express.Router();


router.get('/parentCategory/all', categoryController.getParentCategory);
router.get('/parentCategory/:id', categoryController.getOneParentCategory)

router.get('/all', categoryController.getallCategory);
router.get('/one/:id', categoryController.getOneCategory);

router.get('/KindOfRoom/all', categoryController.getallKindOfRoom);
router.get('/KindOfRoom/:id', categoryController.getOneKindOfRoom);

router.use(verifyToken);
router.use(isAdmin);
router.post('/addCategory', categoryController.createCategory);
router.put('/updateCategory/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

router.post('/addKindOfRoom', categoryController.createKindOfRoom);
router.delete('/KindOfRoom/:id', categoryController.deleteKindOfRoom);
router.put('/updateKindOfRoom/:id', categoryController.updateKindOfRoom);

router.post('/addparentCategory', categoryController.createParentCategory);
router.put('/updateParentCategory/:id', categoryController.updateParentCategory);
router.delete('/ParentCategory/:id', categoryController.deleteParentCategory);


module.exports  = router;