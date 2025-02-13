// Find a player who has won the highest number of Player of the Match awards for each season

const csvToJson = require("csvtojson");
const path = require("path");
const fs = require("fs");

const matchesFilePath = path.join(__dirname, "../DATA/matches.csv");
const deliveriesFilePath = path.join(__dirname, "../DATA/deliveries.csv");

csvToJson()
  .fromFile(matchesFilePath)

  .then((matches) => {
    let players = {};

    function storehighestAwardWinners(matches) {
      for (let curr of matches) {
        let season = curr.season;
        let player = curr.player_of_match;

        if (!players[season]) {
          players[season] = {};
        }
        if (!players[season][player]) {
          players[season][player] = 1;
        } else {
          players[season][player]++;
        }
      }
      return players;
    }
    let result=storehighestAwardWinners(matches)

    let highestAwardWinners = {};
    for (let season in result) {
      let players = result[season];
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
