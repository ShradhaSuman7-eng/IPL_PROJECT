const csvToJson = require("csvtojson");
const path = require("path");
const fs = require("fs");

const matchesFilePath = path.join(__dirname, "../DATA/matches.csv");
const deliveriesFilePath = path.join(__dirname, "../DATA/deliveries.csv");

csvToJson()
  .fromFile(matchesFilePath)
  .then((matches) => {
    let matchIds2015 = [];
    for (let curr of matches) {
      if (curr.season === "2015") {
        matchIds2015.push(curr.id);
      }
    }
    // console.log(matchIds2015);

    csvToJson()
      .fromFile(deliveriesFilePath)
      .then((deliveries) => {
        const bowlerStats = {};

        function findval(deliveries) {
          for (let curr of deliveries) {
            if (matchIds2015.includes(curr.match_id)) {
              let bowler = curr.bowler;
              let runsGiven =
                parseInt(curr.total_runs) -
                parseInt(curr.bye_runs) -
                parseInt(curr.legbye_runs);

              if (!bowlerStats[bowler]) {
                bowlerStats[bowler] = { runs: 0, balls: 0 };
              }

              bowlerStats[bowler].runs += runsGiven;

              if (curr.wide_runs == 0 && curr.noball_runs == 0) {
                bowlerStats[bowler].balls += 1;
              }
            }
            
          }
          return bowlerStats;
        }

        let FinalbowlerStats = findval(deliveries);

        console.log(FinalbowlerStats);

        const economyRates = {};
        for (let bowler in bowlerStats) {
          economyRates[bowler] =
            (FinalbowlerStats[bowler].runs * 6) /
            FinalbowlerStats[bowler].balls;
        }

        const arr = Object.entries(economyRates);
        let output = arr.sort((a, b) => a[1] - b[1]).slice(0, 10);
        let ans = Object.fromEntries(output);

        fs.writeFile(
          "../IPL_PROJECT/SRC/PUBLIC/OUTPUT/4-top-10Economical-bowler.json",
          JSON.stringify(ans),
          (err, data) => {
            if (err) throw err;
          }
        );

        console.log("Economy Rates in 2015:", ans);
      });
  });
