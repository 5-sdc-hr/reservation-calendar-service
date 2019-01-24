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

client.set('maxmemory', '100mb', (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`config set: ${res}`);
  }
});
client.set('maxmemory-policy', 'allkeys-lru', (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`config set: ${res}`);
  }
});

const readCache = (id, cb) => {
  client.get(id, (err, res) => {
    if (err) {
      cb(err);
    } else {
      cb(null, JSON.parse(res));
    }
  });
};

const writeCache = (record) => {
  client.set(record[0].restaurantid, JSON.stringify(record), 'EX', 15, (err) => {
    if (err) {
      throw err;
    }
  });
};

module.exports = {
  writeCache,
  readCache,
};
