
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000

/*handling all the body parsing*/
app.use(bodyParser.json());

app.post('/', (req, res) => {
  var email = req.body.email;
  var amount = req.body.amount;
  if(amount <= 1){
    return_info = {};
    return_info.error = true;
    return_info.message = "The amount should be greater than 1";
    return res.send(return_info)
  }
  res.send({"amount" : amount, "email" : email});
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
