//Find the strike rate of a batsman for each season
const csvToJson = require("csvtojson");
const path = require("path");
const fs = require("fs");

const matchesFilePath = path.join(__dirname, "../DATA/matches.csv");
const deliveriesFilePath = path.join(__dirname, "../DATA/deliveries.csv");

csvToJson()
  .fromFile(matchesFilePath)

  .then((matches) => {
    let matchSeasonMap = {};
    for (let curr of matches) {
      let season = curr.season;
      if (!matchSeasonMap[season]) {
        matchSeasonMap[season] = [];
      }
      matchSeasonMap[season].push(curr.id);
    }
    // console.log(matchSeasonMap);

    csvToJson()
      .fromFile(deliveriesFilePath)
      .then((deliveries) => {
        function findStrikerate(deliveries) {
          let storeStrikerate = {};

          for (let curr of deliveries) {
            let matchId = curr.match_id;

            
            let season = Object.keys(matchSeasonMap).find((s) =>
              matchSeasonMap[s].includes(matchId)
            );

            if (!season) continue;

            let batsman = curr.batsman;
            let runsScored = parseInt(curr.batsman_runs);
            let totalBalls = curr.wide_runs > 0 || curr.noball_runs > 0 ? 0 : 1;

            if (!storeStrikerate[season]) {
              storeStrikerate[season] = {};
            }

            if (!storeStrikerate[season][batsman]) {
              storeStrikerate[season][batsman] = { runs: 0, balls: 0 };
            }

            storeStrikerate[season][batsman].runs += runsScored;
            storeStrikerate[season][batsman].balls += totalBalls;
          }

          return storeStrikerate;
        }

        let result = findStrikerate(deliveries);

        let strikeRates = {};

        for (let season in result) {
          strikeRates[season] = {};

          for (let batsman in result[season]) {
            let stats = result[season][batsman];
            let strikeRate =
              stats.balls > 0 ? (stats.runs / stats.balls) * 100 : 0;
            strikeRates[season][batsman] = { StrikeRate: strikeRate };
          }
        }

        fs.writeFile(
          "../IPL_PROJECT/SRC/PUBLIC/OUTPUT/7-strike-rate-of-batsman-each-season.json",
          JSON.stringify(strikeRates),
          (err, data) => {
            if (err) throw err;
          }
        );
        console.log(strikeRates);
      });
  });
