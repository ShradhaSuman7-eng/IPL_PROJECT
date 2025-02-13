const csvToJson = require("csvtojson");
const path = require("path");
const fs = require("fs");

const matchesFilePath = path.join(__dirname, "../DATA/matches.csv");
const deliveriesFilePath = path.join(__dirname, "../DATA/deliveries.csv");

csvToJson()
  .fromFile(deliveriesFilePath)
  .then((delivery) => {


    function findDismissalCount(delivery) {
      let storeDismissalCount={};
      for(let curr of delivery){
        let Batsman = curr.batsman;
      let Bowler = curr.bowler;
      let Dismissal = curr.dismissal_kind;
      if (Dismissal != "run out" && curr.player_dismissed !== "") {
        if (!storeDismissalCount[Batsman]) {
          storeDismissalCount[Batsman] = {};
        }
        if (!storeDismissalCount[Batsman][Bowler]) {
          storeDismissalCount[Batsman][Bowler] = 0;
        }
        storeDismissalCount[Batsman][Bowler] += 1;
      }
      }
      return storeDismissalCount;
    }

    let dismissalCounts=findDismissalCount(delivery);


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
      "IPL_PROJECT/SRC/PUBLIC/OUTPUT/8-highest-number-of-times-dismissed-by-another.json",
      JSON.stringify(Details),
      (err, data) => {
        if (err) throw err;
      }
    );

    console.log(Details);
  });
