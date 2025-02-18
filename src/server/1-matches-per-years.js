const fs = require("fs");
const path = require("path");
const csv = require("csvtojson");

const csvFilePath = path.join(__dirname, "../data/matches.csv");

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
      "/home/shradha/JAVASCRIPT2/IPL_PROJECT/src/public/output/1_match_per_year.json",
      JSON.stringify(matchesPerYear),
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    console.log(matchesPerYear);
  });
