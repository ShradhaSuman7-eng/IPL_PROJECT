//Find the strike rate of a batsman for each season
const csvToJson = require("csvtojson");
const path = require("path");
const fs = require("fs");

const matchesFilePath = path.join(__dirname, "../DATA/matches.csv");
const deliveriesFilePath = path.join(__dirname, "../DATA/deliveries.csv");

csvToJson()
  .fromFile(matchesFilePath)

  .then((matches) => {
    let matchSeasonMap = matches.reduce((acc, match) => {
      if (!acc[match.season]) {
        acc[match.season] = [];
      }
      acc[match.season].push(match.id);
      return acc;
    }, {});

    csvToJson()
      .fromFile(deliveriesFilePath)
      .then((deliveries) => {
        let batsmanStats = {};

        deliveries.forEach((curr) => {
          let matchId = curr.match_id;

          for (let season in matchSeasonMap) {
            if (matchSeasonMap[season].includes(matchId)) {
              let batsman = curr.batsman;
              let runsScored = parseInt(curr.batsman_runs);
              let ballsFaced = 1;

              if (!batsmanStats[season]) {
                batsmanStats[season] = {};
              }

              if (!batsmanStats[season][batsman]) {
                batsmanStats[season][batsman] = { runs: 0, balls: 0 };
              }

              batsmanStats[season][batsman].runs += runsScored;
              batsmanStats[season][batsman].balls += ballsFaced;
            }
          }
        });

        let strikeRates = {};

        for (let season in batsmanStats) {
          strikeRates[season] = {};

          for (let batsman in batsmanStats[season]) {
            let stats = batsmanStats[season][batsman];
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
            console.log(data);
          }
        );
        console.log(strikeRates);
      });
  });
