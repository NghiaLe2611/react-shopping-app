import axios from 'axios';

var options = {
  method: 'POST',
  url: 'https://noodlio-pay.p.rapidapi.com/tokens/create',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'x-rapidapi-host': 'noodlio-pay.p.rapidapi.com',
    'x-rapidapi-key': 'c7c99df963msh9dc6182bf1bbd2ap1a7d7bjsn26ac30f0c2f3'
  },
  data: {cvc: '123', exp_month: '08', exp_year: '2020', number: '4242424242424242'}
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});