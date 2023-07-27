const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://weatherapi-com.p.rapidapi.com/current.json',
  params: {q: '53.1,-0.13'},
  headers: {
    'X-RapidAPI-Key': '1d0fe5cd7cmshfacc63fd8cb7723p192bccjsnaf6b60222410',
    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
  }
};

const func = async() => {
    const response = await axios.request(options);
	console.log(response.data);
}

try {
	func();
} catch (error) {
	console.error(error);
}