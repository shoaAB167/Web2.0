
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {save_user_information} = require('./model/server_db');
const path = require('path');
const publicPath = path.join(__dirname, './public');
const paypal = require('paypal-rest-sdk');

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
  var fee_amount = amount*0.9;
  var result = await save_user_information({"fee_amount" : amount, "email" : email});


  //paypal
  var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Lottery",
                "sku": "Funding",
                "price": amount,
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": amount
        },
        'payee' : {
          'email' : 'lottery_admin@app.com'
        },
        "description": "Lottery purchase"
    }]

};


paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        console.log("Create Payment Response");
        console.log(payment);
        for(var i = 0; i< payment.links.length; i++){
          if(payment.links[i].rel =='approval_url'){
            return res.send(payment.links[i].href);
          }
        }
    }
});
});

app.get('/success', (req,res)=>{
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  var execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": 100
        }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
          console.log(payment);

      }
  });
  res.redirect('http://localhost:3000');
});

app.get('/get_info',async (req, res) => {
  var result = await get_total_amount();
  res.send(result);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
