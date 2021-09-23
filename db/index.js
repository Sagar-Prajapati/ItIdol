import knex from 'knex';

import logger from '../libs/logger';
import config from '../config';

const db = knex({
  client: 'postgres',
  connection: {
    hots: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.pass,
    database: config.db.name,
    charset: 'utf8',
    debug: false
  },
  pool: {
    min: 0,
    max: 50
  },
  useNullAsDefault: true
});

db.raw('select 1+1 as result')
  .then(() => {
    logger.info('[db] Connected with DB');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

export default db;
