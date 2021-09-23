import dotenv from 'dotenv';

dotenv.config();

export default {
  baseUrl: {
    url: process.env.BASE_URL
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_KEY
  },
  jwt: {
    secret: 'thisISMySecret'
  }
};
