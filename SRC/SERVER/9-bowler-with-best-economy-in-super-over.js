//Find the bowler with the best economy in super overs

const csvToJson = require("csvtojson");
const path = require("path");
const fs = require("fs");

const matchesFilePath = path.join(__dirname, "../DATA/matches.csv");
const deliveriesFilePath = path.join(__dirname, "../DATA/deliveries.csv");

csvToJson()
  .fromFile(matchesFilePath)
  .then((matches) => {
    csvToJson()
      .fromFile(deliveriesFilePath)
      .then((deliveries) => {
        const bowlerStats = {};

        deliveries.forEach((curr) => {
          let superOver = curr.is_super_over;
          if (superOver === "1") {
            let bowler = curr.bowler;
            let runsGiven =
              parseInt(curr.total_runs) -
              parseInt(curr.bye_runs) -
              parseInt(curr.legbye_runs);

            if (!bowlerStats[bowler]) {
              bowlerStats[bowler] = { runs: 0, balls: 0 };
            }

            bowlerStats[bowler].runs += runsGiven;

            if (curr.wide_runs === "0" && curr.noball_runs === "0") {
              bowlerStats[bowler].balls += 1;
            }
          }
        });

        const economyRates = {};
        for (let bowler in bowlerStats) {
          if (bowlerStats[bowler].balls > 0) {
            economyRates[bowler] =
              (bowlerStats[bowler].runs * 6) / bowlerStats[bowler].balls;
          }
        }

        const sortedEconomy = Object.entries(economyRates).sort(
          (a, b) => a[1] - b[1]
        );

        let ans = sortedEconomy[0];

        fs.writeFileSync(
          "../IPL_PROJECT/SRC/PUBLIC/OUTPUT/9-bowler-with-best-economy-in-super-over.json",
          JSON.stringify(ans),
          (err) => {
            if (err) throw err;
          }
        );

        console.log(ans);
      });
  });
