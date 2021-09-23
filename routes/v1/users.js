import express from 'express';
import {
  userLogin,
  registerUser,
  updateUser,
  getUsers,
  deleteUser
} from '../../api/users';

import { makeForm } from '../../libs/middlewares/make_form';

const router = express.Router();

router.post('/user/register', makeForm, registerUser);
router.post('/user/login', userLogin);
router.put('/user/:id', makeForm, updateUser);
router.get('/', getUsers);
router.delete('/user/:id', deleteUser);

export default router;
