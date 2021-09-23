import formidable from 'formidable';

import logger from '../logger';

const parseForm = req =>
  new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return resolve({ body: fields, files: Object.values(files) });
    });
  });

export const makeForm = async (req, res, next) => {
  try {
    const { files, body } = await parseForm(req);

    req.body = body;
    req.files = files;

    next();
  } catch (error) {
    logger.error(`[makeForm] error: ${error.stack}`);
    return res.internalServerError(error.message);
  }
};
