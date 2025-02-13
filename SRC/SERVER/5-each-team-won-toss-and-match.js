//Find the number of times each team won the toss and also won the match
const csvToJson = require("csvtojson");
const path = require("path");
const fs = require("fs");

const matchesFilePath = path.join(__dirname, "../DATA/matches.csv");
const deliveriesFilePath = path.join(__dirname, "../DATA/deliveries.csv");

csvToJson()
  .fromFile(matchesFilePath)

  .then((matches) => {
    let finalArr = {};

    function findWinnertime(matches) {
      for (let curr of matches) {
        let winner = curr.winner;
        let tossWinner = curr.toss_winner;
        if (winner === tossWinner) {
          if (!finalArr[winner]) {
            finalArr[winner] = 0;
          }
          finalArr[winner]++;
        }
      }
      return finalArr;
    }
    let ans = findWinnertime(matches);
    console.log(ans);

    fs.writeFile(
      "../IPL_PROJECT/SRC/PUBLIC/OUTPUT/5-each-team-won-toss-ans-match.json",
      JSON.stringify(ans),
      (err, data) => {
        if (err) throw err;
      }
    );

    console.log(ans);
  });
