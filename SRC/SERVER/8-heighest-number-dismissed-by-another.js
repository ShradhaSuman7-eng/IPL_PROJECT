const csvToJson = require("csvtojson");
const path = require("path");
const fs = require("fs");

const matchesFilePath = path.join(__dirname, "../DATA/matches.csv");
const deliveriesFilePath = path.join(__dirname, "../DATA/deliveries.csv");

csvToJson()
  .fromFile(deliveriesFilePath)
  .then((delivery) => {
    let dismissalCounts = delivery.reduce((acc, ele) => {
      let Batsman = ele.batsman;
      let Bowler = ele.bowler;
      let Dismissal = ele.dismissal_kind;
      if (Dismissal != "run out" && ele.player_dismissed !== "") {
        if (!acc[Batsman]) {
          acc[Batsman] = {};
        }
        if (!acc[Batsman][Bowler]) {
          acc[Batsman][Bowler] = 0;
        }
        acc[Batsman][Bowler] += 1;
      }

      return acc;
    }, {});

    let maxCount = 0;
    let Details = {};

    for (let batsman in dismissalCounts) {
      for (let bowler in dismissalCounts[batsman]) {
        if (dismissalCounts[batsman][bowler] > maxCount) {
          maxCount = dismissalCounts[batsman][bowler];
          Details = { batsman, bowler, count: maxCount };
        }
      }
    }

    fs.writeFileSync(
      "../IPL_PROJECT/SRC/PUBLIC/OUTPUT/8-highest-number-of-times-dismissed-by-another.json",
      JSON.stringify(Details),
      (err, data) => {
        if (err) throw err;
      }
    );

    console.log(Details);
  });
