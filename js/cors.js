// URL del recurso al que deseas acceder
var url = 'https://unknwnco.github.io/Price2.html';

// URL del servicio de proxy CORS Anywhere
var proxyUrl = 'https://cors-anywhere.herokuapp.com/';

// Realiza la solicitud a través del proxy
fetch(proxyUrl + url)
  .then(response => response.json())
  .then(data => {
    // Procesa los datos recibidos
    console.log(data);
  })
  .catch(error => {
    // Maneja errores
    console.error('Error fetching data:', error);
  });