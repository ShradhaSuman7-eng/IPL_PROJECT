const fs = require("fs");
const path = require("path");
const csvToJson = require("csvtojson");

const matchesFilePath = path.join(__dirname, "../data/matches.csv");
const deliveriesFilePath = path.join(__dirname, "../data/deliveries.csv");

csvToJson()
  .fromFile(matchesFilePath)
  .then((matches) => {
    let matchIds2016 = matches
      .filter((match) => match.season === "2016")
      .map((match) => match.id);

    csvToJson()
      .fromFile(deliveriesFilePath)
      .then((deliveries) => {
        const extraRunsPerTeam2016 = deliveries.reduce((acc, curr) => {
          if (matchIds2016.includes(curr.match_id)) {
            const totalExtras = parseInt(curr.extra_runs);
            if (!acc[curr.bowling_team]) {
              acc[curr.bowling_team] = 0;
            }
            acc[curr.bowling_team] += totalExtras;
          }
          return acc;
        }, {});

        fs.writeFile(
          "/home/shradha/JAVASCRIPT2/IPL_PROJECT/src/public/output/3_extra_run_conceded.json",
          JSON.stringify(extraRunsPerTeam2016),
          (err, data) => {
            if (err) console.log(err);
          }
        );

        console.log("Extra Runs Per Team in 2016:", extraRunsPerTeam2016);
      });
  });
