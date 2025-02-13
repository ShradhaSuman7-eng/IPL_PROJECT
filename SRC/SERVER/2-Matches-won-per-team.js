const fs = require("fs");
const path = require("path");
const csv = require("csvtojson");

const csvFilePath = path.join(__dirname, "../DATA/matches.csv");

if (!fs.existsSync(csvFilePath)) {
  console.error("Error: CSV file does not exist at path:", csvFilePath);
  process.exit(1);
}

csv()
  .fromFile(csvFilePath)
  .then((source) => {
    let finalOutput = {};

   
    function winCount(source) {
      for (let curr of source) {
        let season = curr.season;
        let winner = curr.winner;
        
        if (!finalOutput[season]) {
          finalOutput[season] = {};
        }
        
        if (!finalOutput[season][winner]) {
          finalOutput[season][winner] = 0;
        }

        finalOutput[season][winner]++; 
      }

      return finalOutput;
    }


    const result = winCount(source);
    fs.writeFile(
      path.join(__dirname, "SRC/PUBLIC/OUTPUT/2-matches-won-per-team.json"),
      JSON.stringify(result),  
      (err) => {
        if (err) {
          console.error("Error writing file:", err);
        } 
      }
    );
    console.log(result);
    
  })
  
