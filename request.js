const baseURL = "http://twserver.alunos.dcc.fc.up.pt:8008";
const group = 21;
var GameID = 0;

async function makeRequest(urlname, data) {
  let url = `${baseURL}/${urlname}`;
  const config = {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
  };

  try {
      console.log("Data:", data);
      console.log("Values:", Object.values(data));

      if (Object.values(data).some(value => value === undefined || value === null || value === '')) {
          throw new Error("Error: Some arguments are omitted.");
      }

      let response = await fetch(url, config);
      let jsonResponse = await response.json();

      if (jsonResponse.error) {
          throw new Error(`Request error: ${jsonResponse.error}`);
      }

      if(jsonResponse.observation){
        console.log(jsonResponse.observation);
      }

      console.log("Successful request.");
      return jsonResponse;
  } catch (error) {
      console.error(error.message);
      //alert(error.message);
      throw error;
  }
}

async function registerUser() {
  let nick = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let responseServer = await makeRequest("register",{nick, password});
  if(!("error" in responseServer)){
    document.getElementById("play-button-container").style.display = "block";
    document.getElementById("end-game-button-container").style.display = "block";
    alert('Player registered successfully!');
  }
}

async function joinGame(rows,cols) {
  let nick = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let size = document.getElementById("board-size").value;
  let row = parseInt(rows), col= parseInt(cols);
  console.log(size);
  try {
    let result = await makeRequest('join', {
      group: group,
      nick: nick,
      password: password,
      size: {rows:row, columns:col},
    });
    if (result.game) {
      console.log("Join request successful:", result);
      console.log("Game ID:", result.game);
      GameID = result.game;
      if (result.observation) {
        console.log("Observation:", result.observation);
        return true;
      }
    }
  } catch (error) {
    console.error("Error during join request:", error.message);
    return false;
  }
}

async function leaveGame() {
  let nick = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  try {
    const result = await makeRequest("leave", {
      nick: nick,
      password: password,
      game: GameID,
    });
    console.log("Leave request successful:", result);
    if (result.observation) {
      console.log("Observation:", result.observation);
    }
  } catch (error) {
    console.error("Error during leave request:", error.message);
  }
}

async function notifyMove(row, col) {
  let nick = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  try {
    const result = await makeRequest("notify", {
      nick: nick,
      password: password,
      game: GameID,
      move: { row: row, 
              column: col
            }
    });
    console.log("Notify request successful:", result);
    if (result.observation) {
      console.log("Observation:", result.observation);
    }
  } catch (error) {
    console.error("Error during notify request:", error.message);
  }
}

async function update() {
  await joinGame(rows, cols);
  let nick = document.getElementById("username").value;
  let url_update = baseURL + "/update?nick=" + nick+ "&game=" + GameID;
  try {
    const eventSource = new EventSource(url_update);
    eventSource.onmessage = function(event) {
      let data = JSON.parse(event.data);
      console.log(data);
      if(data.error){
        console.log("Update Error:" + data.error);
      }
      if(data.winner) {
        console.log("Player " + data.winner +  " won the game!");
        alert("Player " + data.winner +  " won the game!");
        eventSource.close();
        setTimeout(location.reload(), 1500);
      }
   }
  } catch (error) {
    console.log("Error");
  }
}

async function ranking() {
  let row = parseInt(rows), col= parseInt(cols);
  try {
    const result = await makeRequest("ranking", {
      group: group,
      size: { rows: row, columns: col },
    });
    console.log("Ranking request successful:", result);
    if (result && result.ranking && Array.isArray(result.ranking)) {
      result.ranking.sort((a, b) => b.victories - a.victories);
      const limitedResult = result.ranking.slice(0, 10);
      const table = document.createElement("table");
      const headerRow = table.insertRow();
      ['nick', 'games', 'victories'].forEach((key) => {
        const headerCell = headerRow.insertCell();
        headerCell.textContent = key;
      });
      limitedResult.forEach((item) => {
        const row = table.insertRow();
        ['nick', 'games', 'victories'].forEach((key) => {
          const cell = row.insertCell();
          cell.textContent = item[key];
        });
      });
      const container = document.getElementById("table-container");
      container.innerHTML = "";
      container.appendChild(table);
    }
  } catch (error) {
    console.error("Error during ranking request:", error.message);
  }
}



