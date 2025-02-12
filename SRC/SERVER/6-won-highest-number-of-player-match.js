// Find a player who has won the highest number of Player of the Match awards for each season

const csvToJson = require("csvtojson");
const path = require("path");
const fs = require("fs");

const matchesFilePath = path.join(__dirname, "../DATA/matches.csv");
const deliveriesFilePath = path.join(__dirname, "../DATA/deliveries.csv");

csvToJson()
  .fromFile(matchesFilePath)

  .then((matches) => {
    let seasonWiseData = {};

    matches.forEach((match) => {
      let season = match.season;
      let player = match.player_of_match;

      if (!seasonWiseData[season]) {
        seasonWiseData[season] = {};
      }

      if (!seasonWiseData[season][player]) {
        seasonWiseData[season][player] = 1;
      } else {
        seasonWiseData[season][player] += 1;
      }
    });

    let highestAwardWinners = {};
    for (let season in seasonWiseData) {
      let players = seasonWiseData[season];
      //   console.log(players);

      let maxAwards = 0;
      let bestPlayer = "";

      for (let player in players) {
        if (players[player] > maxAwards) {
          maxAwards = players[player];
          bestPlayer = player;
        }
      }

      highestAwardWinners[season] = { player: bestPlayer, awards: maxAwards };
    }





    fs.writeFile(
      "../IPL_PROJECT/SRC/PUBLIC/OUTPUT/6-won-highest-number-player-match.json",
      JSON.stringify(highestAwardWinners),
      (err, data) => {
        if (err) throw err;
        
      }
    );


    console.log(highestAwardWinners);
  });
