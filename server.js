
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {save_user_information} = require('./model/server_db');

const port = 3000

/*handling all the body parsing*/
app.use(bodyParser.json());

app.post('/',async  (req, res) => {
  var email = req.body.email;
  var amount = req.body.amount;

  if(amount <= 1){
    let return_info = {};
    return_info.error = true;
    return_info.message = "The amount should be greater than 1";
    return return_info;
  }
  var result = await save_user_information({"amount" : amount, "email" : email});
  res.send(result);
});

app.get('/get_total_amount',async (req, res) => {
  var result = await get_total_amount();
  res.send(result);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
