const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const game = require('./page.js');
const updater = require('./updater.js');
const headers = {
    plain: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Methoids' : 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Origin': '*'
    },
    sse: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
    }
}

let games = {};
let logins = {};
let rankings = {'{"rows":6,"columns":5}':{'ranking':[]},'{"rows":5,"columns":6}':{'ranking':[]},'{"rows":6,"columns":6}':{'ranking':[]},'{"rows":7,"columns":6}':{'ranking':[]}};
let waiting = {};

const server = http.createServer(function (request, response) {
    const parsedUrl = url.parse(request.url,true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query; //JSON object
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    response.write('Method: '+ request.method +'\n');
    response.write('URL: '+ request.url +'\n');
    response.write(String(pathname)+'\n')
    response.write(JSON.stringify(query)+'\n')
    response.end();
    console.log(request.method);
    console.log(pathname);
    switch(request.method) {
        case 'GET':
            response.writeHead(200,headers[sse]);
            switch(pathname) {
                case '/update':
                    let nick = query.nick;
                    let game = atob(query.game);
                    remember(response,game);
                    request.on('close', () =>  { console.log("SSE closes"); 
                                                forget(response,game)} );
                    setImmediate(() => { send({},game); }); 
                break;
            }
            break;
        case 'OPTIONS':
            response.writeHead(200, headers[plain]);
            response.end();
            break;
        case 'POST' :
            let body = '';
            switch(pathname) { 
                case '/register':
                    request
                        .on('data', (chunk) => {body += chunk; })
                        .on('end', () => {
                            try { 
                            let data = JSON.parse(body);   
                            let nick = data.nick;   
                            let password = data.password
                            console.log(nick);
                            console.log(password);
                            let found = false;
                            let valid = true;
                            for (let nicks in logins){
                                if (nick === nicks){
                                    encontrei=true;
                                    valid = (logins[nicks] === password);
                                    break;
                                }
                            }   
                            if (!found){
                                logins[nick]= password;
                            }
                            
                            response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8','Access-Control-Allow-Origin': '*'});
                            if (valid) {
								response.write(JSON.stringify({}));
							}
                            else {
                                response.write(JSON.stringify({"error": "Incorrect password"}));
                            }
                            response.end();
                            return;
                        }
                            catch(err) {  
                                console.log(err); 
                            }
                        })
                        .on('error', (err) => { console.error(err.message); });
                    break;
                case "/ranking":
                    request
                        .on('data', (chunk) => {body += chunk;  })
                        .on('end', () => {
                            try{
                                let data = JSON.parse(body);  
                                let size = data.size;
                                let rows = size.rows;
                                let columns = size.columns;
                                let size_string = JSON.stringify(size);
								rankings[size_string]['ranking'].sort(function(a, b) { return b['victories'] - a['victories'] });
								let max = Math.min(10,rankings[size_string]['ranking'].length);
								let list = rankings[size_string]['ranking'].slice(0,max);
								response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8','Access-Control-Allow-Origin': '*'});
								response.write(JSON.stringify({'ranking':list}));
								response.end();
                            }
                            catch(err){
                                console.log(err);
                            }
                        })
                        break;
                case "/join":
                    request
                        .on('data', (chunk) => {body += chunk;  })
                        .on('end', () => {
                            try { 
                                let data = JSON.parse(body); 
                                let nick = data.nick;
                                let password = data.password;
                                let size = data.size;
                                let rows = size.rows;
                                let columns = size.columns;
                                let size_string = JSON.stringify(size);
                                if (logins[nick] != password) {
                                    response.writeHead(200,headers[plain]);
                                    response.write(JSON.stringify({"error": "User registered with a different password"}));
                                    response.end();
                                    return;
                                }
                                if (size_string in waiting) {
                                    if (waiting[size_string].length > 0) {
                                        let waiter = waiting[size_string].pop();
                                        let game_id = waiter.game;
                                        let player_1 = waiter.nick;
                                        let encoded_game_id = btoa(game_id);
                                        response.writeHead(200,headers[plain]);
                                        response.write(JSON.stringify({'game':encoded_game_id}));
                                        response.end();
                                        let game = games[game_id];
                                        game.join_player_2(nick);
                                        setTimeout(() => send(game.object_to_update(),game_id), 1000); // se for tudo seguido, ele n tem tempo de iniciar o sse e receber o 1º update, assim, ele entra, recebe q o jogo começou, epsra 1 segundo(provavelmente pudemos diminuir isso) e só depois é q recebe o 1º update
										if (!(size_string in rankings)){
											rankings[size_string] = {'ranking':[]};
											for (let nicks in logins){
												rankings[size_string]['ranking'].push({'nick': nicks,'victories': 0,'games': 0});
											}
										}
										let found_1 = false;
										let found_2 = false;
										for (let player of rankings[size_string]['ranking']) {
											if (player['nick'] == player_1) {
                                                found_1 = true;
                                            }
											if (player['nick'] == nick) {
                                                found_2 = true;
                                            } 
										}
										if (!found_1) {
                                            rankings[size_string]['ranking'].push({'nick':player_1,'victories':0,'games':0});
                                        }
										if (!found_2) {
                                            rankings[size_string]['ranking'].push({'nick':nick,'victories':0,'games':0});
                                        }
										for (let player of rankings[size_string]['ranking']){
											if (player.nick == player_1) {
                                                player['games']++;
                                            }
											if (player.nick == nick) {
                                                player['games']++;
                                            }
										}
										return;
                                    }
                                }
                            }
                            catch(err){
                                console.log(err);
                            }
                        })
                    break;
                case "/leave":
                    request
                        .on('data', (chunk) => {body += chunk;  })
                        .on('end', () => {
                            try{
                                let data = JSON.parse(body); 
                                let nick = data.nick;
                                let password = data.password;
                                let game_id = atob(data.game);
                                if (logins[nick] != password){
                                    response.writeHead(200,headers[plain]);
                                    response.write(JSON.stringify({"error": "Incorrect password"}));
                                    response.end();
                                    return;
                                }
                                if (!(game_id in games)) {
                                    response.writeHead(200,headers[plain]);
                                    response.write(JSON.stringify({"error": "This game is invalid"}));
                                    response.end();
                                    return;
                                }
                                response.writeHead(200,headers[plain]);
                                response.write(JSON.stringify({}));
                                response.end();
                                let game = games[game_id];
                                if (waiting[game.size].length > 0) { 
                                    if (waiting[game.size][0].nick == nick) {
                                        waiting[game.size].pop();
                                        updater.send({'winner':null}, game_id);
										delete games[game_id];
                                        return;
                                    }
                                }
                                game.giveUp(nick);
								let winner;
								if(nick == game.player_1) {
                                    winner = game.player_2;
                                }
								else { 
                                    winner = game.player_1;
                                }
								let size_string = game.size;
								console.log(rankings);
								console.log(winner);
								for (let player of rankings[size_string]['ranking']){
									console.log(player);
									if (player['nick'] == winner) {
                                        console.log("hey");player['victories']++;
                                    }
								}
                                updater.send(game.object_to_update(), game_id);
								delete games[game_id];
                                return;
                            }
                            catch(err) { 
                                console.log(err);
                            }
                        })
                    break;
                case "/notify":
                    request
                        .on('data', (chunk) => {body += chunk; })
                        .on('end', () => {
                            try{
                                let data = JSON.parse(body); 
                                let nick = data.nick;
                                let password = data.password;
                                let game_id = atob(data.game);
                                let move = data.move;
                                let row = parseInt(move.row);
                                let column = parseInt(move.column);
                                if (logins[nick] != password) {
                                    response.writeHead(200,defaultCorsHeaders);
                                    response.write(JSON.stringify({"error": "User registered with a different password"}));
                                    response.end();
                                    return;
                                }
                                if (!(game_id in games)) {
                                    response.writeHead(200,defaultCorsHeaders);
                                    response.write(JSON.stringify({"error": "This game is invalid"}));
                                    response.end();
                                    return;
                                }
                                let game = games[game_id];
                                let error = game.canDothis(row,column,nick);
                                if (error!='valid'){
                                    //manda uma mensagem com o erro
                                    response.writeHead(200,headers[plain]);
                                    response.write(JSON.stringify({'error': error}));
                                    response.end();
                                    return;
                                }
                                game.Dothis(row,column,nick);
                                response.writeHead(200,defaultCorsHeaders);
                                response.write(JSON.stringify({}));
                                response.end();
                                updater.send(games[game_id].object_to_update(), game_id);
								if (games[game_id].board.winner != 0) {
									let winner;
									if(game.winner == 1) {
                                        winner = game.player_1;
                                    }
									else { 
                                        winner = game.player_2;
                                    }
									for (let player in rankings[size_string]['ranking']) {
										if (player.nick == winner){ 
                                            player['victories']++;
                                        }
									}
									delete games[game_id];
								}
                                return;
                            }
                            catch(err) {
                                console.error(err);
                            }
                        })
                    break;
            }
            break;
            
    }
});

const crypto = require('crypto');
const hash = crypto
               .createHash('md5')
               .update(value)
               .digest('hex');

server.listen(8008);
