/* eslint-disable no-console */
const redis = require('redis');

const client = redis.createClient({
  host: 'localhost',
  port: 6379,
});

client.on('ready', () => {
  console.log('connected to redis');
});

client.on('error', (err) => {
  console.error(err);
});

const read = (id, cb) => {
  client.get(id, (err, res) => {
    if (err) {
      cb(err);
    } else {
      cb(null, JSON.parse(res));
    }
  });
};

const write = (record, cb) => {
  client.set(record.id, JSON.stringify(record), 'EX', 300, (err) => {
    if (err) {
      cb(err);
    } else {
      read(record.id, cb);
    }
  });
};

module.exports = {
  write,
  read,
};
