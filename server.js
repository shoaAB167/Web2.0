
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {save_user_information} = require('./model/server_db');
const path = require('path');
const publicPath = path.join(__dirname, './public');
const paypal = require('paypal-rest-sdl');

const port = 3000

/*handling all the body parsing*/
app.use(bodyParser.json());
app.use(express.static(publicPath));

//paypal configuration
paypal.configure({
 'mode': 'sandbox', //sandbox or live
 'client_id': 'AZ8OdCuJ9OyQqCsSVKyExCwAwbDqJXMEn-SLs4e8dmM9XBffCEQgsbZF3EDw02_SbJd5jK8MgczrEQK7',
 'client_secret': 'ELpBE54aX-xr1zh6nymhnR9OZqbg_bRjtkhFsldyDJ-Tq7jX2PMPCz5tZGuCLlLiBC5cfZ1n1YQYCeu2'
});

app.post('/post_info',async  (req, res) => {
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

app.get('/get_info',async (req, res) => {
  var result = await get_total_amount();
  res.send(result);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
