
const express = require('express')
const app = express()
const port = 3000

app.post('/', (req, res) => {
  const email = req.body.email;
  const amount = req.body.amount;

  res.send({"amount" : amount, "email" : email});
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
