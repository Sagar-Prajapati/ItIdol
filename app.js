import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes';
import logger from './libs/logger';
import path from 'path';
import apiResponses from './libs/middlewares/api_responses';

const app = express();

app.use(express.static(path.resolve('uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,GET,POST,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

app.use((req, res, next) => {
  logger.info(`[app] [${req.method}] ${req.url}`);
  next();
});

app.use(apiResponses);

app.use('/v1', routes);

app.use((err, req, res, next) => {
  if (!err.output) {
    return res.status(500).json({
      statusCode: 500
    });
  }
  return res.status(err.output.statusCode).json(err.output);
});

export default app;
