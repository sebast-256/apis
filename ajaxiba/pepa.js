function xhttpRequest(){
    let respuesta = document.querySelector("#resultado");
    let html = "";
    let url = "http://gateway.marvel.com/v1/public/characters/1009368?ts=${timestamp}&apikey=${publicKey}&hash=${hash}";
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            let response = JSON.parse(this.responseText);
            console.dir(response);
            html += `<p>${response.Title}</p> <img src="${response.Poster}">`
            respuesta.innerHTML = html;
        }
    }
    xhttp.open("GET", url);
    xhttp.send();
}

async function p() {
const publicKey = 'your-public-key';
const privateKey = 'your-private-key';
const timestamp = new Date().getTime().toString();
const hash = md5(timestamp + privateKey + publicKey);

const apiUrl = `http://gateway.marvel.com/v1/public/characters?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => console.log(data));
}