import crypto from 'crypto';
export const getTransaction = client => {
  return new Promise(res => {
    client.transaction(trx => {
      res(trx);
    });
  });
};

export const getRandomString = len => {
  return crypto.randomBytes(len).toString('hex');
};
