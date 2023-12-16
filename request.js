const baseURL = "http://twserver.alunos.dcc.fc.up.pt:8008";
const group = 21
//------------------------------------------------------------------------
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
      // Debugging
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
      console.error("Request error:" + error.message);
      throw error;
  }
}
  //-------------------------------------------------------------------
/*
  async function registerPlayer(nick, password) {
    try {
      const data = {
        nick: nick,
        password: password,
      };
  
      const result = await makeRequest('register',data);
  
      if (result.success) {
        console.log('Player registered successfully!');
      } else {
        console.error('Error in the request:', result.error);
      }
    } catch (error) {
      console.error(error.message);
    }
  }
  */
//---------------------------------------------------------------------------------------
async function registerUser() {
  let nick = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let responseServer = await makeRequest("register",{nick, password});
  if(!("error" in responseServer)){
    document.getElementById("play-button-container").style.display = "block";
    document.getElementById("end-game-button-container").style.display = "block";
    
  }
}
//---------------------------------------------------------------------
  
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

  
//-------------------------------------------------------------------

async function leaveGame(nick, password, game) {
  try {
    const result = await makeRequest("leave", {
      nick: nick,
      password: password,
      game: game,
    });

    console.log("Leave request successful:", result);

    if (result.observation) {
      console.log("Observation:", result.observation);
    }
  } catch (error) {
    console.error("Error during leave request:", error.message);
  }
}



async function notifyMove(nick, password, game, move) {
  try {
    const result = await makeRequest("notify", {
      nick: nick,
      password: password,
      game: game,
      move: { row:row, 
              column: column
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
