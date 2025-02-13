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
    // Number of matches played per year for all the years in IPL.

    function countMatchesPerYear(source) {
      let matchesPerYear = {};
    
      for (let match of source) {
        let season = match.season;
        matchesPerYear[season] = (matchesPerYear[season] || 0) + 1; 
      }
      
      return matchesPerYear;
    }
    const finalAnswer = countMatchesPerYear(source); 
   
    
    fs.writeFile(
      "../IPL_PROJECT/SRC/PUBLIC/OUTPUT/1-match-per-year-json",
      JSON.stringify(finalAnswer),
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    console.log(finalAnswer);
  });
