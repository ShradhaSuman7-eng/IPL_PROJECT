//Find the number of times each team won the toss and also won the match
const csvToJson = require("csvtojson");
const path = require("path");
const fs = require("fs");

const matchesFilePath = path.join(__dirname, "../data/matches.csv");
const deliveriesFilePath = path.join(__dirname, "../data/deliveries.csv");

csvToJson()
  .fromFile(matchesFilePath)

  .then((matches) => {
    let result = matches.reduce((acc, curr) => {
      let winner = curr.winner;
      let tossWinner = curr.toss_winner;
      if (winner === tossWinner) {
       if(! acc[winner] ){
        acc[winner]=0;
       }
        acc[winner]++;
      }

      return acc;
    }, {});

    fs.writeFile(
      "src/public/output/5_each_team_won_toss_ans_match.json",
      JSON.stringify(result),
      (err, data) => {
        if (err) throw err;
      }
    );

    console.log(result);
  });
