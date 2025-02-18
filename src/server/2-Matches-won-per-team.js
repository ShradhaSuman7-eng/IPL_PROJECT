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
  //Number of matches won per team per year in IPL.
  .then((source) => {
    let winCount = source
      .map((match) => ({ season: match.season, winner: match.winner }))
      .reduce((final, { season, winner }) => {
        if (!final[season]) {
          final[season] = {};
        }
        if (!final[season][winner]) {
          final[season][winner] = 0;
        }
        final[season][winner]++;
        return final;
      }, {});

    fs.writeFile(
      "/home/shradha/JAVASCRIPT2/IPL_PROJECT/src/public/output/2_matches_won_per_team.json",
      JSON.stringify(winCount),
      (err, data) => {
        (err) => {
          if (err) {
            console.log(err);
          }
        };
      }
    );

    console.log(winCount);
  });
