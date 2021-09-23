import http from 'http';

const prepareBody = (statusCode, payload, message, page) => {
  return {
    statusCode,
    message: message || http.STATUS_CODES[statusCode],
    page,
    payload: payload || undefined
  };
};

const respond = (req, res, next) => {
  res.ok = (data = null, message = 'OK', page) => {
    res.status(200);
    return res.json(prepareBody(200, data, message, page));
  };

  res.created = (data = null, message) => {
    res.status(201);
    return res.json(prepareBody(201, data, message));
  };

  res.noContent = (data, message) => {
    res.status(204);
    return res.json(prepareBody(204, null, message));
  };

  res.badRequest = (message) => {
    const output = prepareBody(400, null, message);
    const error = new Error(output.message);
    error.output = output;
    return next(error);
  };

  res.unauthorized = (message) => {
    const output = prepareBody(401, null, message);
    const error = new Error(output.message);
    error.output = output;
    return next(error);
  };

  res.forbidden = (message) => {
    const output = prepareBody(403, null, message);
    const error = new Error(output.message);
    error.output = output;
    return next(error);
  };

  res.notFound = (message) => {
    const output = prepareBody(404, null, message);
    const error = new Error(output.message);
    error.output = output;
    return next(error);
  };

  res.internalServerError = (message) => {
    const output = prepareBody(500, null, message);
    const error = new Error(output.message);
    error.output = output;
    return next(error);
  };
  next();
};

export default respond;
