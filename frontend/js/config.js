window.API_URL = (window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1')
? 'http://localhost:8000/'
: 'https://gen10.alphadocere.cl';

console.log('API_URL configurada como:', window.API_URL);


