import express from 'express';

import users from './v1/users';
import products from './v1/products';

const router = express.Router();

router.use('/users', users);
router.use('/products', products);

export default router;
