import express from 'express';

import {
  addProduct,
  browseProducts,
  deleteProducts,
  getAllProducts
} from '../../api/products';

import { isLoggedIn } from '../../libs/middlewares/auth_checker';
import { makeForm } from '../../libs/middlewares/make_form';

const router = express.Router();

router.post('/', makeForm, addProduct);
router.get('/browse', isLoggedIn, browseProducts);
router.get('/', isLoggedIn, getAllProducts);
router.delete('/:id', deleteProducts);

export default router;
