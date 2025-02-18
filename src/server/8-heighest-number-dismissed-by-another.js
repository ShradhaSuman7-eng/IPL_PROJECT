const csvToJson = require("csvtojson");
const path = require("path");
const fs = require("fs");

const matchesFilePath = path.join(__dirname, "../data/matches.csv");
const deliveriesFilePath = path.join(__dirname, "../data/deliveries.csv");

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
      "src/public/output/8_highest_number_of_times_dismissed_by_another.json",
      JSON.stringify(Details),
      (err, data) => {
        if (err) throw err;
      }
    );

    console.log(Details);
  });
