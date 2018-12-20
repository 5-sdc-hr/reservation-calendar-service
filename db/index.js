const Sequelize = require('sequelize');
const mysqlConfig = require('./config.js');

// 'mysql://{user}:{password}@{IP}/{databaseName}'
const sequelize = new Sequelize(mysqlConfig);

sequelize
  .authenticate()
  .then(() => {
    console.log('Successfully connected to database.');
  })
  .catch((err) => {
    throw err;
  });

const Restaurants = sequelize.define(
  'restaurants',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    restaurantName: Sequelize.STRING,
  },
  {
    timestamps: false,
  },
);

const Reservations = sequelize.define(
  'reservations',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    restaurantID: {
      type: Sequelize.INTEGER,
      references: {
        model: Restaurants,
        key: 'id',
      },
    },
    dateToReserve: Sequelize.INTEGER,
    timeToReserve: Sequelize.INTEGER,
    partySize: Sequelize.INTEGER,
  },
  {
    timestamps: false,
  },
);

const addRestaurant = (restaurantName) => {
  Restaurants.sync().then(() => Restaurants.create({
    restaurantName,
  }));
};

const addReservation = (
  restaurantID,
  dateToReserve,
  timeToReserve,
  partySize,
) => {
  Reservations.sync().then(() => Reservations.create({
    restaurantID,
    dateToReserve,
    timeToReserve,
    partySize,
  }));
};

module.exports = {
  addRestaurant,
  addReservation,
};
