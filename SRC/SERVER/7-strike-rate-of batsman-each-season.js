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

        // deliveries.forEach((curr) => {
        //   let matchId = curr.match_id;

        //   for (let season in matchSeasonMap) {
        //     if (matchSeasonMap[season].includes(matchId)) {
        //       let batsman = curr.batsman;
        //       let runsScored = parseInt(curr.batsman_runs);
        //       let ballsFaced = 1;

        //       if (!batsmanStats[season]) {
        //         batsmanStats[season] = {};
        //       }

        //       if (!batsmanStats[season][batsman]) {
        //         batsmanStats[season][batsman] = { runs: 0, balls: 0 };
        //       }

        //       batsmanStats[season][batsman].runs += runsScored;
        //       batsmanStats[season][batsman].balls += ballsFaced;
        //     }
        //   }
        // });


      let result=deliveries.reduce((acc,curr)=>{
        let matchId = curr.match_id;
        for (let season in matchSeasonMap) {
        if (matchSeasonMap[season].includes(matchId)) {
          let batsman = curr.batsman;
          let runsScored = parseInt(curr.batsman_runs);
          let ballsFaced = 1;

          if (!acc[season]) {
            acc[season] = {};
          }

          if (!acc[season][batsman]) {
            acc[season][batsman] = { runs: 0, balls: 0 };
          }

          acc[season][batsman].runs += runsScored;
          acc[season][batsman].balls += ballsFaced;
        }
      }
        return acc;
      },{})
        

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
