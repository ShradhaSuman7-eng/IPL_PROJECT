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

    let seasons = source.map((match) => match.season);
    const matchesPerYear = seasons.reduce((total, season) => {
      if (!total[season]) {
        total[season] = 0;
      }
      total[season]++;
      return total;
    }, {});

    fs.writeFile(
      "../IPL_PROJECT/SRC/PUBLIC/OUTPUT/1-match-per-year-json",
      JSON.stringify(matchesPerYear),
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    console.log(matchesPerYear);
  });
