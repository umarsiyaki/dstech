
const express = require('express');
const router = express.Router();
const db = require('./db');
const validateForm = require('./validation');

const db = require('./db');

router.post('/submit-form', (req, res) => {
  const formData = req.body;
  const sql = `INSERT INTO forms (name, email, data) VALUES (?, ?, ?)`;
  const params = [formData.name, formData.email, JSON.stringify(formData.data)];

  db.run(sql, params, function(err) {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error submitting form' });
    } else {
      const activitySql = `INSERT INTO activity (type, data) VALUES (?, ?)`;
      const activityParams = ['form_submission', JSON.stringify(formData)];

      db.run(activitySql, activityParams, function(err) {
        if (err) {
          console.error(err);
        }
      });

      res.send({ message: 'Form submitted successfully' });
    }
  });
});

router.post('/submit-form', (req, res) => {
const formData = req.body;
const errors = validateForm(formData);

if (Object.keys(errors).length > 0) {
res.status(400).send({ errors });
} else {
const sql = `INSERT INTO forms (name, email, data) VALUES (?, ?, ?)`;
const params = [formData.name, formData.email, JSON.stringify(formData.data)];

db.run(sql, params, function(err) {
if (err) {
console.error(err);
res.status(500).send({ message: 'Error submitting form' });
} else {
const activitySql = `INSERT INTO activity (type, data) VALUES (?, ?)`;
const activityParams = ['form_submission', JSON.stringify(formData)];

db.run(activitySql, activityParams, function(err) {
if (err) {
console.error(err);
}
});

res.send({ message: 'Form submitted successfully' });
}
});
}
});

module.exports = router;