//Find the number of times each team won the toss and also won the match
const csvToJson = require("csvtojson");
const path = require("path");
const fs = require("fs");

const matchesFilePath = path.join(__dirname, "../DATA/matches.csv");
const deliveriesFilePath = path.join(__dirname, "../DATA/deliveries.csv");

csvToJson()
  .fromFile(matchesFilePath)

  .then((matches) => {
    let totalTimesWin = {};

    matches.forEach((match) => {
      let winner = match.winner;
      let tossWinner = match.toss_winner;

      if (winner === tossWinner) {
        if (!totalTimesWin[winner]) {
          totalTimesWin[winner] = 0;
        }
        totalTimesWin[winner]++;
      }
    });

    fs.writeFile(
      "IPL_PROJECT/SRC/PUBLIC/OUTPUT/5-each-team-won-toss-ans-match.json",
      JSON.stringify(totalTimesWin),
      (err, data) => {
        if (err) throw err;
        console.log(data);
      }
    );

    console.log(totalTimesWin);
  });
