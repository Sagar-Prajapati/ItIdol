import jwt from 'jsonwebtoken';
import db from '../../db';

import config from '../../config';

export const isLoggedIn = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.unauthorized('Authentication required');
    }

    const token = req.headers.authorization.replace(/Bearer /, '');

    const decoded = jwt.verify(token, config.jwt.secret);

    req.user = {
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      type: decoded.type
    };

    const [userToken] = await db('user_tokens')
      .select('token')
      .where({ token })
      .limit(1);

    if (!userToken) {
      return res.forbidden({ message: 'Token expired!' });
    }
    next();
  } catch (error) {
    return res.unauthorized('Authentication required');
  }
};
