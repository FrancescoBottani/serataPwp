const express = require('express')
const app = express()

app.listen(3000, () => console.log("listening on port 3000"));
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));



app.post('/sendSondaggio', (request, response) => {
  saveDataInXML(request.body);
  response.json(request.body);
  console.log(request.body);
});

function saveDataInXML(dataFromPost) {
  // Import dependencies
const fs = require("fs");
const { parseString, Builder } = require("xml2js");

// Load the XML
const xml = fs.readFileSync("risultati.xml").toString();
parseString(xml, function (err, dataFromXml) {

  var aut = "Francesco Bottani";
  var name = dataFromPost.soggetto;
  var risposte = dataFromPost.R1+","+dataFromPost.R2+","+dataFromPost.R3+","+dataFromPost.R4+","+dataFromPost.R5+","+dataFromPost.R6;
  console.log(risposte);
  aggiungiValoreAXML(dataFromXml,aut, name, risposte)

    // Saved the XML
    const builder = new Builder();
    const xml = builder.buildObject(dataFromXml);
    fs.writeFileSync("risultati.xml", xml, function (err, file) {
        if (err) throw err;
        console.log("Saved!");
    });

});
}

function aggiungiValoreAXML(fileXML, autore, nome, valori) {
  var arraySondaggio = fileXML.sondaggi.sondaggio;
  for (let i = 0; i < arraySondaggio.length; i++) {
      if (arraySondaggio[i].$.id == autore) {
          for (let j = 0; j < arraySondaggio[i].risposta.length; j++) {
              if (arraySondaggio[i].risposta[j].$.soggetto == nome) {
                  arraySondaggio[i].risposta[j].$.value = valori;
              }
          }
      }
  }

}