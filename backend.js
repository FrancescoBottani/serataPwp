
const express = require('express');
const { stringify } = require('querystring');
const app = express()
var rispostadadebuggare;

app.listen(3000, () => console.log("listening on port 3000"));
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));
app.use((req, res, next) => {
  res.header({"Access-Control-Allow-Origin": "*"});
  next();
}) 

app.post('/sendSondaggio', (request, response) => {
  saveDataInXML(request.body);
  response.json(request.body);
  app.use(express.urlencoded({ extended: true }));
  console.log(request.body);
});

app.post('/postPerPSW', (req, res) => {   
  let psw = req.body.psw;
  if( psw == "smartmf" ){ 
    //res.end('/resultsPermitted.html'); 
    res.end('/resultsPermitted.html'); 
    }
  else{
    res.end('Incorrect Password!');
  } 
  });  

  app.get('/a', (req, res) => {
    res.sendFile(__dirname + '/public/resultsPermitted.html');  
  });

function saveDataInXML(dataFromPost) {
  // Import dependencies
  const fs = require("fs");
  const { parseString, Builder } = require("xml2js");

  // Load the XML
  const xml = fs.readFileSync("risultati.xml").toString();
  parseString(xml, function (err, dataFromXml) {

    var aut = dataFromPost.autore;
    var soggetto = dataFromPost.soggetto;
    var risposte = dataFromPost.R1 + "," + dataFromPost.R2 + "," + dataFromPost.R3 + "," + dataFromPost.R4 + "," + dataFromPost.R5 + "," + dataFromPost.R6;
    var userAgent = dataFromPost.userAgent;
    console.log(risposte);
    aggiungiValoreAXML(dataFromXml, aut, soggetto, risposte, userAgent)

    // Saved the XML
    const builder = new Builder();
    const xml = builder.buildObject(dataFromXml);
    fs.writeFileSync("risultati.xml", xml, function (err, file) {
      if (err) throw err;
      console.log("Saved!");
    });

  });
}

function aggiungiValoreAXML(fileXML, autore, soggetto, valori, userAgent) {
  var arraySondaggio = fileXML.sondaggi.sondaggio;
  let esci = false;
  //arraySondaggio[0].$.useragent = userAgent;

  for (let i = 0; i < arraySondaggio.length; i++) { //cerco se nell'xml c'è lo user agent
    if (arraySondaggio[i].$.useragent == userAgent) {
      for (let j = 0; j < arraySondaggio[i].risposta.length; j++) {
        if (arraySondaggio[i].risposta[j].$.soggetto == soggetto) {
          arraySondaggio[i].risposta[j].$.value = valori;
          esci = true;
        }
      }
    }
    if (esci == false && i == arraySondaggio.length - 1) { //nel caso non ci sia lo useragent nell'xml riscorro tutto il file cercando l'autore = soggetto entro e aggiungo la risposta che dovrebbe essere la prima e l'unica
      for (let m = 0; m< arraySondaggio.length; m++) {
        if (arraySondaggio[m].$.id == soggetto) {
          if(arraySondaggio[m].$.useragent == '')
            arraySondaggio[m].$.useragent = userAgent; // non riesco ad assegnargli la stringa di useragent.
          for (let l = 0; l < arraySondaggio[m].risposta.length; l++) {
            if (arraySondaggio[m].risposta[l].$.soggetto == soggetto) {
              arraySondaggio[m].risposta[l].$.value = valori;
            }
          }
        }
      }
    }
  } 
}


