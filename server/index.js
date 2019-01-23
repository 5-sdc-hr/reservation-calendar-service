/* eslint-disable-next-line */
const newrelic = require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('../db');

const app = express();

app.use('/restaurants/:id/', express.static(`${__dirname}/../client/dist`));
app.use(bodyParser());

app.get('/api/reservations/restaurantID=:restaurantID&date=:date', (req, res) => {
  db.getReservations(req.params.restaurantID, req.params.date, (err, results) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});

app.post('/api/reservations/', (req, res) => {
  db.addReservation(req.body.restaurantID, req.body.date,
    req.body.time, req.body.partySize, (err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.end('Reservation Created');
      }
    });
});

app.delete('/api/reservations', (req, res) => {
  db.deleteReservation(req.body.restaurantID, req.body.date, req.body.time, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.end('Reservation Deleted');
    }
  });
});

app.patch('/api/reservations', (req, res) => {
  db.updateReservation(req.body.restaurantID, req.body.oldDate,
    req.body.oldTime, req.body.newDate, req.body.newTime, (err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.end('UPDATED');
      }
    });
});

const port = 3002;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
