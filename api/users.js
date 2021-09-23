import db from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import path from 'path';
import fs from 'fs';
import logger from '../libs/logger';
import { getTransaction, getRandomString } from '../libs/utils';
import { UserSchema, VerifyLogin, UpdateUserSchema } from '../libs/schemas';

export const registerUser = async (req, res) => {
  const trx = await getTransaction(db);
  try {
    const { files } = req;

    const file = files[0];

    let newUploadedPath = null;

    if (file) {
      const fileExtension = file.name.split('.').pop();
      const filePath = fs.createReadStream(file.path);

      let newPath =
        path.join('uploads/profilePhotos') +
        '/' +
        `${getRandomString(4)}.${fileExtension}`;
      var rawData = fs.readFileSync(filePath.path);

      fs.writeFile(newPath, rawData, function (err) {
        if (err) console.log(err);
      });

      newUploadedPath = newPath.substring(8);
    }

    const { error, value: data } = UserSchema.validate(req.body);
    if (error) {
      await trx.rollback(error);
      return res.badRequest(error.message);
    }

    const {
      firstName,
      lastName,
      gender,
      birthDate,
      email,
      password: pass,
      streetAddress,
      locality,
      postalCode,
      city,
      state,
      country
    } = data;

    const [alredyExistingUser] = await db('users')
      .transacting(trx)
      .select('*')
      .where({ email });

    if (alredyExistingUser) {
      await trx.rollback(new Error('this User alreay exist'));
      return res.badRequest('this User alreay exist');
    }

    const [newUser] = await db('users')
      .transacting(trx)
      .insert({
        firstName,
        lastName,
        gender,
        birthDate,
        email,
        profileImage: newUploadedPath,
        password: bcrypt.hashSync(pass, 8)
      })
      .returning('*');

    await db('addresses').transacting(trx).insert({
      userId: newUser.id,
      streetAddress: streetAddress,
      locality: locality,
      postalCode: postalCode,
      city: city,
      state: state,
      country: country
    });

    await trx.commit();
    return res.ok('registration successfull');
  } catch (error) {
    await trx.rollback(error);
    logger.error(`[registerUser] error: ${error.stack}`);
    return res.internalServerError();
  }
};

export const userLogin = async (req, res) => {
  const trx = await getTransaction(db);
  try {
    const { error, value: data } = VerifyLogin.validate(req.body);

    if (error) {
      await trx.rollback(error);
      return res.badRequest(error.message);
    }

    const { email, password } = data;

    const [userData] = await db('users')
      .transacting(trx)
      .select('*')
      .where({ email });

    if (!userData) {
      await trx.rollback(new Error('no User found'));
      return res.badRequest('No User found');
    }

    if (!bcrypt.compareSync(password, userData.password)) {
      await trx.rollback(new Error('Wrong Password'));
      return res.badRequest('Wrong password');
    }

    const payload = {
      userId: userData.id,
      name: `${userData.firstName} ${userData.lastName}`,
      email: email,
      type: 'user'
    };

    const token = jwt.sign(payload, config.jwt.secret);

    await db('user_tokens')
      .transacting(trx)
      .delete()
      .where({ userId: userData.id });

    await db('user_tokens').transacting(trx).insert({
      userId: userData.id,
      token
    });

    await trx.commit();
    return res.ok({ token, message: 'login success' });
  } catch (error) {
    await trx.rollback(error);
    logger.error(`[userLogin] error: ${error.stack}`);
    return res.internalServerError();
  }
};

export const updateUser = async (req, res) => {
  const trx = await getTransaction(db);
  try {
    const { id } = req.params;

    const { files } = req;

    const file = files[0];

    let uploadedPath = null;

    const [alreadyExistingUser] = await db('users')
      .transacting(trx)
      .select('*')
      .where({ id });

    if (!alreadyExistingUser) {
      await trx.rollback(new Error('no User found'));
      return res.badRequest('no User found');
    }

    const { profileImage } = alreadyExistingUser;

    uploadedPath = profileImage;

    if (file) {
      const fileExtension = file.name.split('.').pop();
      const filePath = fs.createReadStream(file.path);

      let newPath =
        path.join('uploads/profilePhotos') +
        '/' +
        `${getRandomString(4)}.${fileExtension}`;
      var rawData = fs.readFileSync(filePath.path);

      fs.writeFile(newPath, rawData, function (err) {
        if (err) console.log(err);
      });

      uploadedPath = newPath.substring(8);
    }

    const { error, value: data } = UpdateUserSchema.validate(req.body);
    if (error) {
      await trx.rollback(error);
      return res.badRequest(error.message);
    }

    const { firstName, lastName, gender, birthDate } = data;

    await db('users')
      .transacting(trx)
      .update({
        firstName,
        lastName,
        gender,
        birthDate,
        profileImage: uploadedPath
      })
      .where({ id })
      .returning('*');

    await trx.commit();
    return res.ok('update successfull');
  } catch (error) {
    await trx.rollback(error);
    logger.error(`[updateUser] error: ${error.stack}`);
    return res.internalServerError();
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await db('users').select(
      'users.id',
      'users.firstName',
      'users.lastName',
      'users.gender',
      'users.email',
      'users.profileImage',
      'users.birthDate',
      db.raw(`
      (
        SELECT array_to_json(array_agg(row_to_json(ag))) FROM 
        (
          SELECT * FROM addresses
          WHERE "userId" = users.id
        ) ag
      ) "addressess"`)
    );

    return res.ok(users);
  } catch (error) {
    logger.error(`[getUsers] error: ${error.stack}`);
    return res.internalServerError();
  }
};

export const deleteUser = async (req, res) => {
  const trx = await getTransaction(trx);
  try {
    const { id } = req.params;

    const [existingUser] = await db('users').select('*').where({ id });

    if (!existingUser) {
      await trx.rollback(new Error('no user added'));
      return res.badRequest('no users added');
    }

    await db('addresses').delete().where({ userId: id });

    await db('users').delete().where({ id });

    await trx.commit();
    return res.ok();
  } catch (error) {
    await trx.rollback(error);
    logger.error(`[deleteUsers] error: ${error.stack}`);
    return res.internalServerError();
  }
};
