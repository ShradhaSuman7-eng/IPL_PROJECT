// Find a player who has won the highest number of Player of the Match awards for each season

const csvToJson = require("csvtojson");
const path = require("path");
const fs = require("fs");

const matchesFilePath = path.join(__dirname, "../data/matches.csv");
const deliveriesFilePath = path.join(__dirname, "../data/deliveries.csv");

csvToJson()
  .fromFile(matchesFilePath)

  .then((matches) => {
    let result = matches.reduce((acc, match) => {
      let season = match.season;
      let player = match.player_of_match;
      if (!acc[season]) {
        acc[season] = {};
      }
      if (!acc[season][player]) {
        acc[season][player] = 1;
      } else {
        acc[season][player]++;
      }
      return acc;
    }, {});

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
      "src/public/output/6_won_highest_number_player_match.json",
      JSON.stringify(highestAwardWinners),
      (err, data) => {
        if (err) throw err;
      }
    );

    console.log(highestAwardWinners);
  });
