const express = require('express');
const calendar = require('./calendar.js');

const app = express();
const port = 3001;

// Routing
const router = express.Router();
app.use('/api', router);
router.use('/calendar', calendar);

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
})