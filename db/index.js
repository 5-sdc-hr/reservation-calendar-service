const { Pool } = require('pg');
const config = require('./config.js');
const { writeCache, readCache } = require('./redis/index');

const pool = new Pool(config);

const addReservation = (restaurantID, dateToReserve, timeToReserve, partySize, callback) => {
  pool.query(`INSERT INTO reservations (restaurantid, date, time, party) VALUES (${restaurantID}, '${dateToReserve}', '${timeToReserve}', ${partySize});`)
    .then(result => callback(null, result))
    .catch(err => callback(err));
};

/*
 *
 * Try to get the reservations from the Cache
 * If the reservation does not exist in the cache,
 * pull the result from the postgres db
 * then on successfull get request, write that to the cache
 *
 */

const getReservations = (restaurantID, dateToReserve, callback) => {
  readCache(restaurantID, (err, res) => {
    if (err || res === null) {
      // Either cache failed or doesn't have it
      pool.query(`SELECT * FROM reservations WHERE restaurantid = ${restaurantID} AND date = '${dateToReserve}'`)
        .then((results) => {
          callback(null, results.rows);
          writeCache(results.rows);
        })
        .catch(err => callback(err));
    } else {
      callback(null, res);
    }
  });
};

const deleteReservation = (restaurantID, dateToDelete, timeToDelete, callback) => {
  pool.query(`DELETE FROM reservations WHERE restaurantid = ${restaurantID} AND date = '${dateToDelete}' AND time = '${timeToDelete}'`)
    .then(() => callback(null))
    .catch(err => callback(err));
};

const updateReservation = (restaurantID, oldDate, oldTime, newDate, newTime, callback) => {
  pool.query(`UPDATE reservations SET date = '${newDate}', time = ${newTime} WHERE restaurantid = ${restaurantID} AND date = '${oldDate}' AND time = '${oldTime}'`)
    .then(response => callback(null, response))
    .catch(err => callback(err));
};

module.exports = {
  addReservation,
  getReservations,
  deleteReservation,
  updateReservation,
};
