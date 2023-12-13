const baseURL = "http://twserver.alunos.dcc.fc.up.pt:8008";
/*
function register() {
    const data = {
      nick: "zp",
      password: "zp!!"
    };

    fetch(`${base}/register`,{
      method: 'POST',
      body: JSON.stringify(data)
    })
    .then(r => r.json())
    .then(j => console.log(j))
}

register()
*/

async function makeRequest(urlname, data) {
    const url =  `http://twserver.alunos.dcc.fc.up.pt:8008/${urlname}`;
    const config = {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  
    return fetch(url, config)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error in the request ${config.method} ${urlname}: ${response.statusText}`);
        }
  
        console.log(`Successful request:  ${config.method} ${urlname}`);
        return response.json();
      })
      .catch((error) => {
        console.error('Error in the request:', error.message);
        throw error;
      });
  }

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

  async function registerUser() {
    let nick = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let responseServer = await makeRequest('register',{nick, password});

  }