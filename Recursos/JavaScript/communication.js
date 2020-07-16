function join(groupId, nickname, password) {
	var object = {group: groupId, nick: nickname, pass: password};
	var JSONData = JSON.stringify(object);

	console.log(server + "join");
	const response = fetch(server + "join", {
		method: "POST",
		body: JSONData
	})
	.then(response => response.json())
	.then(data => {
		if(!response.ok && data.error != undefined) {
			window.alert(data.error);
		}
		else {
			gameId = data.game;
			console.log(gameId);
			pecasJogador = data.hand;
			console.log(pecasJogador);
			update(gameId, nickname);
		}
	});
}

function register(nickname, password) {
	var object = {nick: nickname, pass: password};
	var JSONData = JSON.stringify(object);

	const response = fetch(server + "register", {
		method: "POST",
		body: JSONData
	})
	.then(response => response.json())
	.then(data => {
		if(!response.ok && data.error != undefined) {
			window.alert(data.error);
		}
		else {
			const result = response;
		}
	});
}

function leave(gameId, nickname, password) {
	var object = {nick: nickname, pass: password, game: gameId};
	var JSONData = JSON.stringify(object);

	const response = fetch(server + "leave", {
		method: "POST",
		body: JSONData
	})
	.then(response => response.json())
	.then(data => {

	});
}

function notify(nickname, password, gameId, actionSide, piecePlayed, skip) {

	if(piecePlayed == null) {
		var object = {nick: nickname, pass: password, game: gameId, piece: piecePlayed};
		var JSONData = JSON.stringify(object);
	}
	else if(skip == null) {
		var object = {nick: nickname, pass: password, game: gameId, skip: null};
		var JSONData = JSON.stringify(object);
	}
	else {
		var peca = [parseInt(piecePlayed[0]), parseInt(piecePlayed[2])];
		console.log(peca);
		var object = {nick: nickname, pass: password, game: gameId, piece: peca, side: actionSide};
		var JSONData = JSON.stringify(object);
	}

	const response = fetch(server + "notify", {
		method: "POST",
		body: JSONData
	})
	.then(response => response.json())
	.then(data => {
		if(data.error != undefined) {
			window.alert(data.error);
		}
		else if(data.piece != undefined) {
			pecasJogador.push(data.piece);
			construirPecas();

			console.log("Peças em jogo:" + boardLine.length + numPecasJog + numPecasAdvers);
			if(!poderJogarOnline() && (boardLine.length + numPecasJog + numPecasAdvers) < parseInt(28)) {
				botaoMonteDiv.disabled = false;
				botaoMonteDiv.style.backgroundColor = 'green';
			}
			else {
				botaoMonteDiv.disabled = true;
				botaoMonteDiv.style.backgroundColor = 'red';
			}
		}
		else if(skip == null) {
			construirPecas();
		}
		else {
			pecasJogador.splice(pecaSelecionada.getAttribute('index'), 1);
			construirPecas();
		}
	});
}

function update(groupId, nickname) {
	var object = server + "update" + "?nick=" + nickname + "&game=" + gameId;
	console.log(object);
	var encodedData = encodeURIComponent(object);
	console.log(encodedData);

	const eventSource = new EventSource(object);
	eventSource.onmessage = function(event) {
		console.log("aqui");
		const data = JSON.parse(event.data);
		console.log(data);
		turn = data.turn;
		console.log(turn);
		var numPecas;
		if(data.board != undefined) {
			boardLine = data.board.line;
			numPecas = data.board.count;
			boardStock = data.board.stock;

			console.log(boardStock);
			console.log(boardLine);
		}
		//boardLine = data.board.line;
		console.log(boardLine);
		//boardStock = data.board.stock;
		console.log(boardStock);
		//winner = data.winner;

		var keys = Object.keys(numPecas);
		for(i = 0; i < keys.length; i++) {
			console.log(keys[i]);
			if(keys[i] == nomeRegisto) {
				console.log("O meu nº de pecas");
				numPecasJog = numPecas[keys[i]];
			}
			else {
				console.log("Nº de pecas adversario");
				numPecasAdvers = numPecas[keys[i]];
			}
		}

		if(data.piece != undefined) {
			pecasJogador.push(data.piece);
		}
		else if(data.winner === null) {
			var mensagem = document.getElementById('mensagem');
			mensagem.innerHTML = "Fim da partida!"

			var textoInf = document.getElementById('onde_jogar');
			textoInf.innerHTML = "";

			var divMensagens = document.getElementById("caixa_mensagens");
			divMensagens.style.backgroundColor = "white";

			caixaEmpate();
			eventSource.close();
			return;
		}
		else if(data.winner != undefined) {
			var mensagem = document.getElementById('mensagem');
			mensagem.innerHTML = "Fim da partida!"

			var textoInf = document.getElementById('onde_jogar');
			textoInf.innerHTML = "";

			var divMensagens = document.getElementById("caixa_mensagens");
			divMensagens.style.backgroundColor = "white";

			construirPecas();
			if(data.winner == nomeRegisto) {
				caixaHumanoGanhou();
			}
			else if(data.winner === null) {
				console.log("Aqui");
				caixaEmpate();
			}
			else {
				caixaComputadorGanhou();
			}
			console.log("close");
			eventSource.close();
			return;
		}
		// const numPecas = data.board.count;

		console.log("Adversario: " + numPecasAdvers);
		console.log("Eu: " + numPecasJog);
		construirPecas();

		var noPecas = document.getElementById('displayNPecas');
		noPecas.innerHTML = "Nº de Peças no monte: " + data.board.stock;

		if(turn == nomeRegisto) {
			ativarDiv();
			console.log("Peças em jogo:" + boardLine.length + numPecasJog + numPecasAdvers);
			console.log("Stock: " + data.board.stock);

			var caixa = document.getElementById('caixa_mensagens');
			caixa.style.backgroundColor = "#F7DC70";

			var mensagem = document.getElementById('mensagem');
			mensagem.innerHTML = "É a sua vez de jogar!";

			if(!poderJogarOnline() && data.board.stock > parseInt(0)) {
				botaoMonteDiv.disabled = false;
				botaoMonteDiv.style.backgroundColor = 'green';
			}
			else {
				botaoMonteDiv.disabled = true;
				botaoMonteDiv.style.backgroundColor = 'red';

				if(data.board.stock == 0 && !poderJogarOnline()) {
					var botaoPassar = document.getElementById("passar_jogada");
					botaoPassar.disabled = false;
				}
			}
		}
		else {
			var caixa = document.getElementById('caixa_mensagens');
			caixa.style.backgroundColor = "#C6C6C5";

			var encaixa = document.getElementById('onde_jogar');
			encaixa.innerHTML = " "

			var mensagem = document.getElementById('mensagem');
			mensagem.innerHTML = "É a vez do adversário!";
			desativarDiv();
			// poderJogar();
		}
	}
	//eventSource.close();
}

function ranking() {
	var object = {};
	var JSONData = JSON.stringify(object);

	const response = fetch(server + "ranking", {
		method: "POST",
		body: JSONData
	})
	.then(response => response.json())
	.then(data => {
		console.log(data.ranking);

		var nomes = [];
		var vitorias = [];
		var totalJogados = [];

		var keys = Object.keys(data.ranking);
		for(i = 0; i < keys.length; i++) {
			nomes.push(data.ranking[keys[i]].nick);
			vitorias.push(data.ranking[keys[i]].victories);
			totalJogados.push(data.ranking[keys[i]].games);
		}
		atualizarTabelaClassOnline(nomes, vitorias, totalJogados);
	});

}
