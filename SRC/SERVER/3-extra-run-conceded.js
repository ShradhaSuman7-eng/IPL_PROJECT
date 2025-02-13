const fs = require("fs");
const path = require("path");
const csvToJson = require("csvtojson");

const matchesFilePath = path.join(__dirname, "../DATA/matches.csv");
const deliveriesFilePath = path.join(__dirname, "../DATA/deliveries.csv");

csvToJson()
  .fromFile(matchesFilePath)
  .then((matches) => {
    let newMatchIds = [];
    for (let curr of matches) {
      if (curr.season === "2016") {
        newMatchIds.push(curr.id);
      }
    }

    // console.log(newMatchIds);

    csvToJson()
      .fromFile(deliveriesFilePath)
      .then((deliveries) => {
        let newfunc = function extraRun_conceded(deliveries) {
          let finalAnswer = {};
          for (let curr of deliveries) {
            let newid = curr.match_id;
            if (newMatchIds.includes(newid)) {
              const totalExtras = parseInt(curr.extra_runs);
              if (!finalAnswer[curr.bowling_team]) {
                finalAnswer[curr.bowling_team] = 0;
              }
              finalAnswer[curr.bowling_team] += totalExtras;
            }
          }
          return finalAnswer;
        };

        const result = newfunc(deliveries);

        fs.writeFile(
          path.join(
            __dirname,
            "../SRC/PUBLIC/OUTPUT/3-extra-run-conceded.json"
          ),
          JSON.stringify(result),
          (err) => {
            if (err) {
              console.error("Error writing file:", err);
            } else {
              console.log("File successfully written!");
            }
          }
        );

        console.log("Extra Runs Per Team in 2016:", result);
      });
  });
