module.exports.update = {};

module.exports.remember = function(response, game) {
    if (game in update) {
        update[game].push(response);
    }
    else {
        update[game] = [response];
    }
}

module.exports.forget = function(response,game) {
    let pos = update[game].findIndex((r) => r === response);
    if (pos > -1) {
        update[game].splice(pos,1);
    }
}

module.exports.send = function(body,game) {
    console.log(body);
    for (let response in update[game]) {
        response.write('data: ' + JSON.stringify(body) +'\n');
    }
}
