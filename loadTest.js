/* eslint-disable*/
import http from "k6/http";

export const options = {
  vus: 100,
  duration: '5m',
};

export default function () {
  // const randomRestaurant = Math.floor(Math.random() * 10e6);
  const randomRestaurant = Math.floor((Math.random() * 10) + 1) > 3 ? Math.floor(Math.random() * (200 - 100 + 1)) + 100 : Math.floor(Math.random() * (10000000 - 100 + 1)) + 100;
  const dateChoices = ['011419', '011519', '011619', '011719', '011819', '011919', '012019', '012119', '012219', '012319'];
  const randomDate = dateChoices[Math.floor(Math.random() * dateChoices.length)];
  http.get(`http://localhost:3002/api/reservations/restaurantID=${randomRestaurant}&date=${randomDate}`);
}
