var numPecasHumano = 0;
var numPecasComputador = 0;
var divPecasHumano = [];
var divPecasComputador = [];
var pecasJogadas = [];
var pecaSelecionada = 0;
var monte = [];

var nomeJogador;
var sequenciaPecas = "";
var dificuldade;

var humanoPassouJogada = 0;
var computadorPassouJogada = 0;

if(localStorage.getItem("savedNames") === null) {
	var nomes = new Array(1000);
	var vitorias = new Array(1000);
	var totalJogados = new Array(1000);
	var nJogadores = parseInt(0);

	localStorage.setItem("savedNames", JSON.stringify(nomes));
	localStorage.setItem("savedVictories", JSON.stringify(vitorias));
	localStorage.setItem("savedNumGames", JSON.stringify(totalJogados));
	localStorage.setItem("nPlayers", nJogadores);
}

var nJogadores = 0;

var nomeRegisto = "";
var passwordRegisto = "";
var groupId = "TomasSantiagoMamede";
//var groupId = "555";
var gameId;
var server = "http://twserver.alunos.dcc.fc.up.pt:8143/";
//var server = "http://localhost:8143/";
var pecasJogador = [];
var rankingOnline;

var turn;
var boardLine = [];
var boardStock;
var winner;
var numPecasAdvers;
var numPecasJog;

var modoJogo;

document.getElementById("entrar_login").onclick = function() {
	nomeRegisto = document.getElementById("username").value;
	passwordRegisto = document.getElementById("password").value;

	if(nomeRegisto == "" || passwordRegisto == "") {
		nomeRegisto = "";
		passwordRegisto = "";
		window.alert("Nome de utilizador ou palavra-passe inválidos.");
	}
	else {
		document.getElementById("username").value = "";
		document.getElementById("password").value = "";

		register(nomeRegisto, passwordRegisto);

		console.log(nomeRegisto);
		console.log(passwordRegisto);
		desaparecerCaixa("login", "fundo_preto_opaco_botoes");
	}
}

document.getElementById("novo_jogo").onclick = function() {

}

function sortClassifications() {

	var savedNames = localStorage.getItem("savedNames");
	var nomes = JSON.parse(savedNames);

	var savedVictories = localStorage.getItem("savedVictories");
	var vitorias = JSON.parse(savedVictories);

	var savedNumGames = localStorage.getItem("savedNumGames");
	var totalJogados = JSON.parse(savedNumGames);

	var nJogadores = parseInt(localStorage.getItem("nPlayers"));

	for(i = 0; i < nJogadores; i++) {
		for(j = 0; j < nJogadores; j++) {
			if(vitorias[i] > vitorias[j]) {
				var tempV = vitorias[i];
				vitorias[i] = vitorias[j];
				vitorias[j] = tempV;

				var tempN = nomes[i];
				nomes[i] = nomes[j];
				nomes[j] = tempN;
			}
			else if(vitorias[i] == vitorias[j] && nomes[i] < nomes[j]) {
				var tempV = vitorias[i];
				vitorias[i] = vitorias[j];
				vitorias[j] = tempV;

				var tempN = nomes[i];
				nomes[i] = nomes[j];
				nomes[j] = tempN;

				var tempJ = totalJogados[i];
				totalJogados[i] = totalJogados[j];
				totalJogados[j] = tempJ;
			}
		}
	}
}

var tabHumano = document.getElementById('bottom');
var tabComputador= document.getElementById('top');
var linhaJogo = document.getElementById('jogo');
var botaoJogarEsquerda = document.getElementById('jogar_esquerda');
var botaoJogarDireita = document.getElementById('jogar_direita');
var montePecas = document.getElementById('monte_pecas');
var caixaMensagens = document.getElementById('caixa_mensagens');
var mensagem = document.getElementById('mensagem');
var ondeJogar = document.getElementById('onde_jogar');
var botaoPassarJogada = document.getElementById('passar_jogada');
var botaoMostrarClassificacoes = document.getElementById('classificacoes_jogo');
var botaoMostrarInstrucoes = document.getElementById('instrucoes_jogo');
var botaoDesistirJogo = document.getElementById('desistir_jogo');
var noPecas = document.getElementById('displayNPecas');

document.getElementById("guardar_alteracoes").onclick = function() {
	dificuldade = document.forms.form_dificuldade.dificuldade.value;
	console.log(dificuldade);

	desaparecerCaixa("dificuldade", "fundo_preto_opaco_botoes");
};

document.getElementById("jogar_esquerda").onclick = function() {
	jogarEsquerda();
}

document.getElementById("jogar_direita").onclick = function() {
	jogarDireita();
}

document.getElementById("comecar_jogo").onclick = function() {
	nomeJogador = document.getElementById("nome_jogador").value;
	console.log(nomeJogador);

	desaparecerCaixa("novo_jogo", "fundo_preto_opaco_botoes");

	var menu = document.getElementById("conjunto_botoes");
	menu.style.visibility = "hidden";

	tabHumano.style.visibility = "visible";
	tabComputador.style.visibility = "visible";
	linhaJogo.style.visibility = "visible";

	botaoJogarEsquerda.style.visibility = "visible";
	botaoJogarDireita.style.visibility = "visible";
	montePecas.style.visibility = "visible";
	caixaMensagens.style.visibility = "visible";
	botaoPassarJogada.style.visibility = "visible";
	botaoMostrarClassificacoes.style.visibility = "visible";
	botaoMostrarInstrucoes.style.visibility = "visible";
	botaoDesistirJogo.style.visibility = "visible";

	botaoPassarJogada.disabled = true;

	sequenciaPecas = "";
	divPecasHumano = [];
	divPecasComputador = [];
	pecasJogadas = [];
	monte = [];

	tabComputador.innerHTML = "";
	tabHumano.innerHTML = "";
	linhaJogo.innerHTML = "";
	mensagem.innerHTML = "";
	ondeJogar.innerHTML = "";
	noPecas.innerHTML = "Nº de Peças no monte: " + 14;
	montePecas.disabled = true;
	montePecas.style.backgroundColor = "red";

	ativarDiv();
	comecarJogo();
}

document.getElementById("botao_fecho_login").onclick = function() {
	desaparecerCaixa("login", "fundo_preto_opaco_botoes");
}

document.getElementById("botao_fecho_novo_jogo").onclick = function() {
	desaparecerCaixa("novo_jogo", "fundo_preto_opaco_botoes");
}

document.getElementById("botao_fecho_dificuldade").onclick = function() {
	desaparecerCaixa("dificuldade", "fundo_preto_opaco_botoes");
}

document.getElementById('botao_fecho_classificacoes').onclick = function() {
	document.getElementById('tabela_classificacoes').innerHTML = "";
	desaparecerCaixa("classificacoes", "fundo_preto_opaco_botoes");
}

document.getElementById('desistir_jogo_nao').onclick = function() {
	desaparecerCaixa("painel_desistir", "fundo_preto_opaco_botoes");
}

document.getElementById('botao_fecho_instrucoes').onclick = function() {
	desaparecerCaixa("instrucoes", "fundo_preto_opaco_botoes");
}

document.getElementById('fechar_instrucoes').onclick = function() {
	desaparecerCaixa("instrucoes", "fundo_preto_opaco_botoes");
}

document.getElementById("desistir_jogo").onclick = function() {
	mostrarCaixa("painel_desistir", "fundo_preto_opaco_botoes");
}

document.getElementById("botao_login").onclick = function() {
	mostrarCaixa("login", "fundo_preto_opaco_botoes");
}

document.getElementById("botao_caixa_novo_jogo").onclick = function() {
	mostrarCaixa("novo_jogo", "fundo_preto_opaco_botoes");
}

document.getElementById('botao_caixa_instrucoes').onclick = function() {
	mostrarCaixa("instrucoes", "fundo_preto_opaco_botoes");
}

document.getElementById('instrucoes_jogo').onclick = function() {
	mostrarCaixa("instrucoes", "fundo_preto_opaco_botoes");
}

document.getElementById("botao_caixa_dificuldade").onclick = function() {
	mostrarCaixa("dificuldade", "fundo_preto_opaco_botoes");
}

document.getElementById("botao_caixa_classificacoes").onclick = function() {
	sortClassifications();
	atualizarTabelaClass();
	mostrarCaixa("classificacoes", "fundo_preto_opaco_botoes");
}

document.getElementById("classificacoes_jogo").onclick = function() {
	if(modoJogo == "online") {
		ranking();
		mostrarCaixa("classificacoes", "fundo_preto_opaco_botoes");
		return;
	}

	sortClassifications();
	atualizarTabelaClass();
	mostrarCaixa("classificacoes", "fundo_preto_opaco_botoes");
}

function atualizarTabelaClassOnline(nomes, vitorias, totalJogados) {
	console.log("Class online");
	console.log(nomes);
	console.log(vitorias);
	console.log(totalJogados);

	var divTabela = document.getElementById('tabela_classificacoes');
	var tabela = document.createElement("table");

	tabela.style.width = ('70%');
	tabela.style.height = ('40%');
  	tabela.setAttribute('border', '1');

	var tr = tabela.insertRow();
	var cellOne = tr.insertCell(0);
	var cellTwo = tr.insertCell(1);
	var cellThree = tr.insertCell(2);

	cellOne.innerHTML = "<b>Posição</b>";
	cellTwo.innerHTML = "<b>Nome</b>";
	cellThree.innerHTML = "<b>Nº de vitórias</b>";
	//classificacoes.appendChild(tabela);

	//return;

	for(i = 0; i < nomes.length; i++) {
		var row = tabela.insertRow(i+1);

		var cellOne = row.insertCell(0);
		var cellTwo = row.insertCell(1);
		var cellThree = row.insertCell(2);

		cellOne.innerHTML = i+1;
		cellTwo.innerHTML = nomes[i];
		cellThree.innerHTML = vitorias[i] + "/" + totalJogados[i];
	}

	divTabela.appendChild(tabela);
	tabela.style.margin = "0 auto";
	tabela.style.border = "2px solid black";
	tabela.style.borderCollapse = "collapse";
	tabela.style.fontFamily = "Avenir Next";
	// var classificacoes = document.getElementById("classificacoes");
	// classificacoes.innerHTML = "";
	// classificacoes.appendChild(tabela);
}

function atualizarTabelaClass() {
	var savedNames = localStorage.getItem("savedNames");
	var nomes = JSON.parse(savedNames);

	var savedVictories = localStorage.getItem("savedVictories");
	var vitorias = JSON.parse(savedVictories);

	var savedNumGames = localStorage.getItem("savedNumGames");
	var totalJogados = JSON.parse(savedNumGames);

	var nJogadores = localStorage.getItem("nPlayers");

	var divTabela = document.getElementById('tabela_classificacoes');
	var tabela = document.createElement("table");

	tabela.style.width = ('70%');
	tabela.style.height = ('40%');
  	tabela.setAttribute('border', '1');

	var tr = tabela.insertRow();
	var cellOne = tr.insertCell(0);
	var cellTwo = tr.insertCell(1);
	var cellThree = tr.insertCell(2);

	cellOne.innerHTML = "<b>Posição</b>";
	cellTwo.innerHTML = "<b>Nome</b>";
	cellThree.innerHTML = "<b>Nº de vitórias</b>";
	//classificacoes.appendChild(tabela);

	//return;

	for(i = 0; i < nJogadores; i++) {
		var row = tabela.insertRow(i+1);

		var cellOne = row.insertCell(0);
		var cellTwo = row.insertCell(1);
		var cellThree = row.insertCell(2);

		cellOne.innerHTML = i+1;
		cellTwo.innerHTML = nomes[i];
		cellThree.innerHTML = vitorias[i] + "/" + totalJogados[i];
	}

	divTabela.appendChild(tabela);
	tabela.style.margin = "0 auto";
	tabela.style.border = "2px solid black";
	tabela.style.borderCollapse = "collapse";
	tabela.style.fontFamily = "Avenir Next";
	// var classificacoes = document.getElementById("classificacoes");
	// classificacoes.innerHTML = "";
	// classificacoes.appendChild(tabela);
}



document.getElementById("passar_jogada").onclick = function() {
	var botaoPassar = document.getElementById("passar_jogada");
	if(modoJogo == "online") {
		notify(nomeRegisto, passwordRegisto, gameId, "start", 1, null);
		botaoPassar.disabled = true;
		return;
	}

	var caixa = document.getElementById('caixa_mensagens');
	caixa.style.backgroundColor = "#C6C6C5";

	var ondeJogou = document.getElementById('onde_jogar');
	ondeJogou.innerHTML = "";

	var mensagem = document.getElementById('mensagem');
	mensagem.innerHTML = "É a vez do computador!";
	desativarDiv();

	setTimeout(function() {
		if(dificuldade == "medio") {
			jogadaComputadorMedio();
		}
		else if(dificuldade == 'dificil') {
			jogadaComputadorDificil();
		}
		else {
			jogadaComputador();
		}
    }, 4000);
	botaoPassar.disabled = true;
}

function mostrarCaixa(idOne, idTwo) {
	var box = document.getElementById(idOne);
	var view = document.getElementById(idTwo);
	box.style.visibility = "visible";
	view.style.visibility = "visible";
}

function desaparecerCaixa(idOne, idTwo) {
	var box = document.getElementById(idOne);
	var view = document.getElementById(idTwo);
	box.style.visibility = "hidden";
	view.style.visibility = "hidden";
}

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if((new Date().getTime() - start) > milliseconds){
    		break;
    	}
  	}
}

document.getElementById('fechar_ganhar').onclick = function voltarGanhar() {
	document.getElementById('final_jogo_ganhar').style.visibility = "hidden";
	document.getElementById('fundo_preto_opaco_botoes').style.visibility = "hidden";
	//location.reload(true);

	var menu = document.getElementById("conjunto_botoes");
	menu.style.visibility = "visible";

	tabHumano.style.visibility = "hidden";
	tabComputador.style.visibility = "hidden";
	linhaJogo.style.visibility = "hidden";

	botaoJogarEsquerda.style.visibility = "hidden";
	botaoJogarDireita.style.visibility = "hidden";
	montePecas.style.visibility = "hidden";
	caixaMensagens.style.visibility = "hidden";
	botaoPassarJogada.style.visibility = "hidden";
	botaoMostrarClassificacoes.style.visibility = "hidden";
	botaoMostrarInstrucoes.style.visibility = "hidden";
	botaoDesistirJogo.style.visibility = "hidden";

	var campoNome = document.getElementById('nome_jogador');
	campoNome.innerHTML = "";

	// for(i = 0; i < nomes.length; i++) {
	// 	console.log(nomes[i] + " " + vitorias[i]);
	// }
};

document.getElementById('fechar_perder').onclick = function voltarPerder() {
	document.getElementById('final_jogo_perder').style.visibility = "hidden";
	document.getElementById('fundo_preto_opaco_botoes').style.visibility = "hidden";
	//location.reload(true);

	var menu = document.getElementById("conjunto_botoes");
	menu.style.visibility = "visible";

	tabHumano.style.visibility = "hidden";
	tabComputador.style.visibility = "hidden";
	linhaJogo.style.visibility = "hidden";

	botaoJogarEsquerda.style.visibility = "hidden";
	botaoJogarDireita.style.visibility = "hidden";
	montePecas.style.visibility = "hidden";
	caixaMensagens.style.visibility = "hidden";
	botaoPassarJogada.style.visibility = "hidden";
	botaoMostrarClassificacoes.style.visibility = "hidden";
	botaoMostrarInstrucoes.style.visibility = "hidden";
	botaoDesistirJogo.style.visibility = "hidden";

	var campoNome = document.getElementById('nome_jogador');
	campoNome.innerHTML = "";

	// for(i = 0; i < nomes.length; i++) {
	// 	console.log(nomes[i] + " " + vitorias[i]);
	// }
};

document.getElementById('fechar_empatar').onclick = function voltarEmpatar() {
	document.getElementById('final_jogo_empate').style.visibility = "hidden";
	document.getElementById('fundo_preto_opaco_botoes').style.visibility = "hidden";
	//location.reload(true);

	var menu = document.getElementById("conjunto_botoes");
	menu.style.visibility = "visible";

	tabHumano.style.visibility = "hidden";
	tabComputador.style.visibility = "hidden";
	linhaJogo.style.visibility = "hidden";

	botaoJogarEsquerda.style.visibility = "hidden";
	botaoJogarDireita.style.visibility = "hidden";
	montePecas.style.visibility = "hidden";
	caixaMensagens.style.visibility = "hidden";
	botaoPassarJogada.style.visibility = "hidden";
	botaoMostrarClassificacoes.style.visibility = "hidden";
	botaoMostrarInstrucoes.style.visibility = "hidden";
	botaoDesistirJogo.style.visibility = "hidden";

	var campoNome = document.getElementById('nome_jogador');
	campoNome.innerHTML = "";

	// for(i = 0; i < nomes.length; i++) {
	// 	console.log(nomes[i] + " " + vitorias[i]);
	// }
};

document.getElementById('desistir_jogo_sim').onclick = function voltarDesistir() {
	if(modoJogo == "online") {
		leave(gameId, nomeRegisto, passwordRegisto);
	}
	else {
		adicionarAClass(0);
	}

	document.getElementById('painel_desistir').style.visibility = "hidden";
	document.getElementById('fundo_preto_opaco_botoes').style.visibility = "hidden";
	//location.reload(true);


	var menu = document.getElementById("conjunto_botoes");
	menu.style.visibility = "visible";

	tabHumano.style.visibility = "hidden";
	tabComputador.style.visibility = "hidden";
	linhaJogo.style.visibility = "hidden";

	botaoJogarEsquerda.style.visibility = "hidden";
	botaoJogarDireita.style.visibility = "hidden";
	montePecas.style.visibility = "hidden";
	caixaMensagens.style.visibility = "hidden";
	botaoPassarJogada.style.visibility = "hidden";
	botaoMostrarClassificacoes.style.visibility = "hidden";
	botaoMostrarInstrucoes.style.visibility = "hidden";
	botaoDesistirJogo.style.visibility = "hidden";

	var campoNome = document.getElementById('nome_jogador');
	campoNome.innerHTML = "";

}

function caixaHumanoGanhou() {
	var box = document.getElementById("final_jogo_ganhar");
	box.style.visibility = "visible";

	var fundoOpaco = document.getElementById('fundo_preto_opaco_botoes');
	fundoOpaco.style.visibility = "visible";
}

function caixaComputadorGanhou() {
	var box = document.getElementById("final_jogo_perder");
	box.style.visibility = "visible";

	var fundoOpaco = document.getElementById('fundo_preto_opaco_botoes');
	fundoOpaco.style.visibility = "visible";
}

function caixaEmpate() {
	var box = document.getElementById("final_jogo_empate");
	box.style.visibility = "visible";

	var fundoOpaco = document.getElementById('fundo_preto_opaco_botoes');
	fundoOpaco.style.visibility = "visible";
}

function removeBorder() {
	for(i = 0; i < divPecasHumano.length; i++) {
		divPecasHumano[i].style.border = ""
		divPecasHumano[i].style.backgroundColor = "white";
	}
}

function desativarDiv() {
	var esq = document.getElementById('jogar_esquerda');
	esq.disabled = true;

	var dir = document.getElementById('jogar_direita');
	dir.disabled = true;
}

function ativarDiv() {
	var esq = document.getElementById('jogar_esquerda');
	esq.disabled = false;

	var dir = document.getElementById('jogar_direita');
	dir.disabled = false;
}

function criarDivPecaJogo(pintasEsquerda, pintasDireita) {
	var newDiv = document.createElement('div');
	newDiv.id = 'divPeca';
	newDiv.className = 'peca';

	console.log("Pintas Esqueda: " + pintasEsquerda + " Pintas Direita: " + pintasDireita);

	var pecaId = calcularPecaId(pintasEsquerda, pintasDireita);
	console.log("PecaId = " + pecaId);

	var p = document.createTextNode(String.fromCodePoint(pecaId));
	var lista = [pintasEsquerda, pintasDireita];
	newDiv.setAttribute('lista_pintas', lista);

	newDiv.appendChild(p);
	return newDiv;
}

function atualizartabHumano() {

	tabHumano.innerHTML = "";
	for(i = 0; i < divPecasHumano.length; i++) {
		tabHumano.appendChild(divPecasHumano[i]);
	}
	return;
}

function atualizarTabComputador() {
	//var tabComputador = document.getElementById('top');
	tabComputador.innerHTML = "";
	for(i = 0; i < divPecasComputador.length; i++) {
		var newDiv = document.createElement('div');
		newDiv.id = 'divPeca';
		newDiv.className = 'peca';

		var p = document.createTextNode(String.fromCodePoint(127024));
		newDiv.appendChild(p);
		tabComputador.appendChild(newDiv);
	}
	return;
}

function reduzirIndexPecasHumano(index) {
	console.log("aqui");
	for(i = 0; i < divPecasHumano.length; i++) {
		console.log("Antes: " + divPecasHumano[i].getAttribute('index'));
		divPecasHumano[i].setAttribute('index', parseInt(i));
		console.log("Depois " + divPecasHumano[i].getAttribute('index'));
	}
}

function reduzirIndexPecasComputador(index) {
	console.log("aqui");
	for(i = 0; i < divPecasComputador.length; i++) {
		console.log("Antes: " + divPecasComputador[i].getAttribute('index'));
		divPecasComputador[i].setAttribute('index', parseInt(i));
		console.log("Depois " + divPecasComputador[i].getAttribute('index'));
	}
}

function adicionarAClass(type) {
	console.log("A adicionar às classificacoes");

	var savedNames = localStorage.getItem("savedNames");
	var nomes = JSON.parse(savedNames);

	var savedVictories = localStorage.getItem("savedVictories");
	var vitorias = JSON.parse(savedVictories);

	var savedNumGames = localStorage.getItem("savedNumGames");
	var totalJogados = JSON.parse(savedNumGames);

	var nJogadores = parseInt(localStorage.getItem("nPlayers"));

	// if(nomes.length == 0) {
	// 	nomes[0] = nomeJogador;
	// 	if(type == 1) vitorias[0] = parseInt(1);
	// 	else vitorias[0] = parseInt(0);
	// 	totalJogados[0] = parseInt(1);
	// 	nJogadores += 1;
	// 	for(i = 0; i < nomes.length; i++) {
	// 		console.log(nomes[i] + " " + vitorias[i]);
	// 	}
	//
	// 	return;
	// }
	console.log(nomes);

	for(i = 0; i < 1000; i++) {
		if(nomes[i] === null) {
			break;
		}

		if(nomes[i] == nomeJogador) {
			if(type == 1) {
				vitorias[i] = parseInt(vitorias[i]) + parseInt(1);
				totalJogados[i] = parseInt(totalJogados[i]) + parseInt(1);
				console.log(nomes[i] + " " + vitorias[i]);
				console.log("O nome já existe");
			}
			else {
				totalJogados[i] = parseInt(totalJogados[i]) + parseInt(1);
			}

			for(i = 0; i < nJogadores; i++) {
				console.log(nomes[i] + " " + vitorias[i]);
			}
			localStorage.setItem("savedNames", JSON.stringify(nomes));
			localStorage.setItem("savedVictories", JSON.stringify(vitorias));
			localStorage.setItem("savedNumGames", JSON.stringify(totalJogados));
			return;
		}
	}

	nomes[nJogadores] = nomeJogador;
	if(type == 1) {
		vitorias[nJogadores] = parseInt(1);
		totalJogados[nJogadores] = parseInt(1);
	}
	else {
		vitorias[nJogadores] = parseInt(0);
		totalJogados[nJogadores] = parseInt(1);
	}

	for(i = 0; i < nJogadores; i++) {
		console.log(nomes[i] + " " + vitorias[i]);
	}

	localStorage.setItem("savedNames", JSON.stringify(nomes));
	localStorage.setItem("savedVictories", JSON.stringify(vitorias));
	localStorage.setItem("savedNumGames", JSON.stringify(totalJogados));
	localStorage.setItem("nPlayers", parseInt(nJogadores + 1));

	return;
}

function verificarVitoria() {
	if(divPecasHumano.length == 0) {
		adicionarAClass(1);
		return 1; //Humano ganhou; -- Aparecer Painel!
	}
	else if(divPecasComputador.length == 0) {
		adicionarAClass(0);
		return -1; //Computador ganhou -- Aparecer Painel!
	}
	return;
}

var botaoMonteDiv = document.getElementById('monte_pecas');
botaoMonteDiv.addEventListener("click", function() {
	humanoRetirarPecaMonte();
}, false);

function determinarvencedor() {
	var pontosHumano = 0;
	var pontosComputador = 0;

	for(i = 0; i < divPecasHumano.length; i++) {
		var peca = divPecasHumano[i].getAttribute('listaPintas');
		pontosHumano = pontosHumano + parseInt(peca[0]) + parseInt(peca[2]);
	}

	for(i = 0; i < divPecasComputador.length; i++) {
		var peca = divPecasComputador[i].getAttribute('listaPintas');
		pontosComputador = pontosComputador + parseInt(peca[0]) + parseInt(peca[2]);
	}

	if(parseInt(pontosHumano) < parseInt(pontosComputador)) {
		console.log(pontosComputador + " " + pontosHumano);
		adicionarAClass(1);
		caixaHumanoGanhou();
		return;
	}
	else if(parseInt(pontosComputador) < parseInt(pontosHumano)) {
		console.log(pontosComputador + " " + pontosHumano);
		adicionarAClass(0);
		caixaComputadorGanhou();
		return;
	}
	else {
		console.log(pontosComputador + " " + pontosHumano);
		adicionarAClass(0);
		caixaEmpate();
	}
}

function poderJogar() {
	var botaoMonteDiv = document.getElementById('monte_pecas');

	if(pecasJogadas.length == 0) {
		return;
	}

	var pecaMaisEsquerda = pecasJogadas[0].getAttribute('listaPintas');
	var pecaMaisDireita = pecasJogadas[pecasJogadas.length - 1].getAttribute('listaPintas');

	for(i = 0; i < divPecasHumano.length; i++) {
		var pecaAtual = divPecasHumano[i].getAttribute('listaPintas');
		if(parseInt(pecaAtual[0]) == parseInt(pecaMaisEsquerda[0])) {
			return 1;
		}
		else if(parseInt(pecaAtual[2]) == parseInt(pecaMaisEsquerda[0])) {
			return 1;
		}
		else if(parseInt(pecaAtual[0]) == parseInt(pecaMaisDireita[2])) {
			return 1;
		}
		else if(parseInt(pecaAtual[2]) == parseInt(pecaMaisDireita[2])) {
			return 1;
		}
	}

	humanoPassouJogada = 1;
	if(monte.length == 0 && computadorPassouJogada == 0) {
		var botaoPassar = document.getElementById("passar_jogada");
		botaoPassar.disabled = true;
		botaoMonteDiv.style.backgroundColor = "red";

		var mensagem = document.getElementById('mensagem');
		mensagem.innerHTML = "Pode passar a jogada."

		var passarBotao = document.getElementById("passar_jogada");
		passarBotao.disabled = false;
		humanoPassouJogada = 1;
		return 0;
	}
	else if(monte.length == 0 && computadorPassouJogada == 1 && humanoPassouJogada == 1) {
		var mensagem = document.getElementById('mensagem');
		mensagem.innerHTML = "Fim da partida!"

		var textoInf = document.getElementById('onde_jogar');
		textoInf.innerHTML = "";

		var divMensagens = document.getElementById("caixa_mensagens");
		divMensagens.style.backgroundColor = "white";

		setTimeout(function() {
    		determinarvencedor(); //Decidir vencedor
    	}, 4000);
    	return 0;
	}

	console.log("Aqui");
	botaoMonteDiv.disabled = false;
	botaoMonteDiv.style.backgroundColor = 'green';
	return 0;
}

function poderJogarComputador() {
	if(pecasJogadas.length == 0) {
		return 1;
	}

	var pecaMaisEsquerda = pecasJogadas[0].getAttribute('listaPintas');
	var pecaMaisDireita = pecasJogadas[pecasJogadas.length - 1].getAttribute('listaPintas');

	for(i = 0; i < divPecasComputador.length; i++) {
		var pecaAtual = divPecasComputador[i].getAttribute('listaPintas');
		if(parseInt(pecaAtual[0]) == parseInt(pecaMaisEsquerda[0])) {
			return 1;
		}
		else if(parseInt(pecaAtual[2]) == parseInt(pecaMaisEsquerda[0])) {
			return 1;
		}
		else if(parseInt(pecaAtual[0]) == parseInt(pecaMaisDireita[2])) {
			return 1;
		}
		else if(parseInt(pecaAtual[2]) == parseInt(pecaMaisDireita[2])) {
			return 1;
		}
	}
	return 0;
}

function computadorRetirarPecaMonte() {
	var botaoMonte = document.getElementById('monte_pecas');

	if(monte.length > 0) {
		var ondeJogou = document.getElementById('onde_jogar');
		ondeJogou.innerHTML = "O computador foi ao monte.";

		divPecasComputador.push(criarDivPecaHumano(monte[0][0], monte[0][1], parseInt(divPecasComputador[divPecasComputador.length - 1].getAttribute('index')) + 1, 1));
		monte.shift();

		var noPecas = document.getElementById('displayNPecas');
		noPecas.innerHTML = "Nº de Peças no monte: " + monte.length;

		atualizarTabComputador();
		console.log("Retirou peça");

		setTimeout(function() {
    		jogadaComputadorDificil();
    	}, 4000);
    	return;
	}

	computadorPassouJogada = 1;
	if(monte.length == 0 && humanoPassouJogada == 0) {

		var caixa = document.getElementById('caixa_mensagens');
		caixa.style.backgroundColor = "#F7DC70";

		var mensagem = document.getElementById('mensagem');
		mensagem.innerHTML = "É a sua vez de jogar!";

		var ondeJogou = document.getElementById('onde_jogar');
		ondeJogou.innerHTML = "O computador passou a jogada.";
		computadorPassouJogada = 1;
		ativarDiv();
		poderJogar();
		return;
	}
	else if(monte.length == 0 && humanoPassouJogada == 1 && computadorPassouJogada == 1) {
		var mensagem = document.getElementById('mensagem');
		mensagem.innerHTML = "Fim da partida!"

		var ondeJogou = document.getElementById('onde_jogar');
		ondeJogou.innerHTML = "";

		var divMensagens = document.getElementById("caixa_mensagens");
		divMensagens.style.backgroundColor = "white";

		setTimeout(function() {
    		determinarvencedor(); //Decidir vencedor
    	}, 4000);
    	return;
	}
}

function humanoRetirarPecaMonte() {
	if(modoJogo == "online") {
		notify(nomeRegisto, passwordRegisto, gameId, "start", null, 1);
		return;
	}


	var botaoMonte = document.getElementById('monte_pecas');

	if(monte.length > 0) {
		divPecasHumano.push(criarDivPecaHumano(monte[0][0], monte[0][1], parseInt(divPecasHumano[divPecasHumano.length - 1].getAttribute('index')) + 1, 0));
		monte.shift();

		var noPecas = document.getElementById('displayNPecas');
		noPecas.innerHTML = "Nº de Peças no monte: " + monte.length;

		atualizartabHumano();
	}

	if(poderJogar() == 1) {
		console.log("Já pode jogar");
		botaoMonte.disabled = true;
		botaoMonte.style.backgroundColor = "red";
	}
	console.log("Ainda não pode jogar");
}

function jogarEsquerda() {

	if(modoJogo == "online") {
		var listaPintasSelecionada = pecaSelecionada.getAttribute('listaPintas');
		notify(nomeRegisto, passwordRegisto, gameId, "start", listaPintasSelecionada, 1);
		return;
	}

	var botaoMonte = document.getElementById('monte_pecas');
	var tabJogo = document.getElementById('jogo');
	var seq;

	var listaPintas = pecaSelecionada.getAttribute('listaPintas');
	console.log(divPecasHumano.length);

	console.log("Comprimento fila: " + pecasJogadas.length);
	if(pecasJogadas.length == 0) {
		var melhorPeca = 0;
		var valorMelhorPeca = -1;

		for(i = 0; i < divPecasHumano.length; i++) {
			var peca = divPecasHumano[i].getAttribute('listaPintas');
			var sum = parseInt(peca[0]) + parseInt(peca[2]);
			console.log(sum);
			if(sum > valorMelhorPeca) {
				valorMelhorPeca = sum;
				melhorPeca = parseInt(i);
			}
		}

		var peca = divPecasHumano[melhorPeca].getAttribute('listaPintas');
		if(peca[0] == listaPintas[0] && peca[2] == listaPintas[2]) {
			var pecaId = calcularPecaId(parseInt(listaPintas[0]), parseInt(listaPintas[2]));
			sequenciaPecas = sequenciaPecas + String.fromCodePoint(parseInt(pecaId));
			console.log(sequenciaPecas);
		}
		else {
			var mensagem = document.getElementById('onde_jogar');
			mensagem.innerHTML = "Não pode jogar esta peça.";
			mensagem.style.color = "red";
			return;
		}
	}
	else {
		var pecaMaisEsquerda = pecasJogadas[0];
		var listaPintas = pecaMaisEsquerda.getAttribute('listaPintas');

		var listaPintasSelecionada = pecaSelecionada.getAttribute('listaPintas');
		console.log("Lista: " + listaPintasSelecionada[0] + " " + listaPintasSelecionada[2]);

		if(listaPintas[0] == listaPintasSelecionada[0]) {
			console.log("aqui1");
			var pecaId = calcularPecaId(parseInt(listaPintasSelecionada[2]), parseInt(listaPintasSelecionada[0]));

			console.log(pecaSelecionada.getAttribute('listaPintas'));
			var novaOrdem = new Array(2);
			novaOrdem[0] = parseInt(listaPintasSelecionada[2]);
			novaOrdem[1] = parseInt(listaPintasSelecionada[0]);
			pecaSelecionada.setAttribute('listaPintas', novaOrdem);
			console.log(pecaSelecionada.getAttribute('listaPintas'));

			sequenciaPecas = String.fromCodePoint(parseInt(pecaId)) + sequenciaPecas;
			console.log(sequenciaPecas);
		}
		else if(listaPintas[0] == listaPintasSelecionada[2]) {
			console.log("aqui2");
			var pecaId = calcularPecaId(parseInt(listaPintasSelecionada[0]), parseInt(listaPintasSelecionada[2]));

			sequenciaPecas = String.fromCodePoint(parseInt(pecaId)) + sequenciaPecas;
			console.log(sequenciaPecas);
		}
		else {
			var ondeJogou = document.getElementById('onde_jogar');
			ondeJogou.innerHTML = "Não pode jogar essa peça.";
			ondeJogou.color = "red";
			return;
		}
	}
	pecasJogadas.unshift(pecaSelecionada);
	divPecasHumano.splice(pecaSelecionada.getAttribute('index'), 1);
	reduzirIndexPecasHumano(pecaSelecionada.getAttribute('index'));

	tabJogo.innerHTML = "";
	seq = document.createTextNode(String.fromCodePoint(160) + sequenciaPecas + String.fromCodePoint(160));
	tabJogo.appendChild(seq);
	atualizartabHumano();

	var divMensagens = document.getElementById("caixa_mensagens");
	var textoCaixa = document.getElementById("onde_jogar");
	var mensagem = document.getElementById('mensagem');
	if(parseInt(verificarVitoria()) == 1) {
		mensagem.innerHTML = "Fim da partida!";
		divMensagens.style.backgroundColor = "white";
		textoCaixa.innerHTML = "";
		setTimeout(function() {
    		caixaHumanoGanhou();
    	}, 2500);
		return;
	}

	var caixa = document.getElementById('caixa_mensagens');
	caixa.style.backgroundColor = "#C6C6C5";

	var ondeJogou = document.getElementById('onde_jogar');
	ondeJogou.innerHTML = "";

	var mensagem = document.getElementById('mensagem');
	mensagem.innerHTML = "É a vez do computador!";
	desativarDiv();
	humanoPassouJogada = 0;

	setTimeout(function() {
		if(dificuldade == "medio") {
			jogadaComputadorMedio();
		}
		else if(dificuldade == 'dificil') {
			jogadaComputadorDificil();
		}
		else {
			jogadaComputador();
		}
    }, 4000);

	return;
}

function jogarDireita() {

	if(modoJogo == "online") {
		var listaPintasSelecionada = pecaSelecionada.getAttribute('listaPintas');
		//console.log(notify(nomeRegisto, passwordRegisto, gameId, "end", listaPintasSelecionada));
		notify(nomeRegisto, passwordRegisto, gameId, "end", listaPintasSelecionada, 1);
		// 	pecasJogador.splice(pecaSelecionada.getAttribute('index'), 1);
		// 	console.log("notify direita");
		// 	// reduzirIndexPecasHumano(pecaSelecionada.getAttribute('index'));
		// }

		return;
	}

	var botaoMonte = document.getElementById('monte_pecas');

	var tabJogo = document.getElementById('jogo');
	var seq;

	var listaPintas = pecaSelecionada.getAttribute('listaPintas');

	if(pecasJogadas.length == 0) {
		var melhorPeca = 0;
		var valorMelhorPeca = -1;

		for(i = 0; i < divPecasHumano.length; i++) {
			var peca = divPecasHumano[i].getAttribute('listaPintas');
			var sum = parseInt(peca[0]) + parseInt(peca[2]);
			console.log(sum);
			if(sum > valorMelhorPeca) {
				valorMelhorPeca = sum;
				melhorPeca = parseInt(i);
			}
		}

		console.log("Valor de i: " + melhorPeca);

		var peca = divPecasHumano[melhorPeca].getAttribute('listaPintas');
		if(peca[0] == listaPintas[0] && peca[2] == listaPintas[2]) {
			var pecaId = calcularPecaId(parseInt(listaPintas[0]), parseInt(listaPintas[2]));
			sequenciaPecas = sequenciaPecas + String.fromCodePoint(parseInt(pecaId));
			console.log(sequenciaPecas);
		}
		else {
			var mensagem = document.getElementById('onde_jogar');
			mensagem.innerHTML = "Não pode jogar esta peça.";
			mensagem.color = "red";
			return;
		}
	}
	else {
		var pecaMaisDireita = pecasJogadas[pecasJogadas.length - 1];
		var listaPintas = pecaMaisDireita.getAttribute('listaPintas');
		console.log("Pintas +direita: " + listaPintas[0] + " " + listaPintas[0]);

		var listaPintasSelecionada = pecaSelecionada.getAttribute('listaPintas');
		console.log("Lista: " + listaPintasSelecionada[0] + " " + listaPintasSelecionada[2]);

		if(listaPintas[2] == listaPintasSelecionada[0]) {
			console.log("aqui1");
			var pecaId = calcularPecaId(parseInt(listaPintasSelecionada[0]), parseInt(listaPintasSelecionada[2]));

			sequenciaPecas = sequenciaPecas + String.fromCodePoint(parseInt(pecaId));
			console.log(sequenciaPecas);
		}
		else if(listaPintas[2] == listaPintasSelecionada[2]) {
			console.log("aqui2");
			var pecaId = calcularPecaId(parseInt(listaPintasSelecionada[2]), parseInt(listaPintasSelecionada[0]));

			console.log(pecaSelecionada.getAttribute('listaPintas'));
			var novaOrdem = new Array(2);
			novaOrdem[0] = parseInt(listaPintasSelecionada[2]);
			novaOrdem[1] = parseInt(listaPintasSelecionada[0]);
			pecaSelecionada.setAttribute('listaPintas', novaOrdem);
			console.log(pecaSelecionada.getAttribute('listaPintas'));

			sequenciaPecas = sequenciaPecas + String.fromCodePoint(parseInt(pecaId));
			console.log(sequenciaPecas);
		}
		else {
			console.log(listaPintas[2] + " " + listaPintasSelecionada[0] + " " + listaPintasSelecionada[2]);
			var ondeJogou = document.getElementById('onde_jogar');
			ondeJogou.innerHTML = "Não pode jogar essa peça.";
			ondeJogou.color = "red";
			return;
		}
	}
	pecasJogadas.push(pecaSelecionada);
	divPecasHumano.splice(pecaSelecionada.getAttribute('index'), 1);
	reduzirIndexPecasHumano(pecaSelecionada.getAttribute('index'));

	tabJogo.innerHTML = "";
	seq = document.createTextNode(String.fromCodePoint(160) + sequenciaPecas + String.fromCodePoint(160));
	tabJogo.appendChild(seq);
	atualizartabHumano();


	var divMensagens = document.getElementById("caixa_mensagens");
	var textoCaixa = document.getElementById("onde_jogar");
	var mensagem = document.getElementById('mensagem');
	if(parseInt(verificarVitoria()) == 1) {
		mensagem.innerHTML = "Fim da partida!";
		divMensagens.style.backgroundColor = "white";
		textoCaixa.innerHTML = "";
		setTimeout(function() {
    		caixaHumanoGanhou();
    	}, 2500);
		return;
	}

	var caixa = document.getElementById('caixa_mensagens');
	caixa.style.backgroundColor = "#C6C6C5";

	var ondeJogou = document.getElementById('onde_jogar');
	ondeJogou.innerHTML = "";

	var mensagem = document.getElementById('mensagem');
	mensagem.innerHTML = "É a vez do computador!";
	desativarDiv();
	humanoPassouJogada = 0;

	setTimeout(function() {
		if(dificuldade == "medio") {
			jogadaComputadorMedio();
		}
		else if(dificuldade == 'dificil') {
			jogadaComputadorDificil();
		}
		else {
			jogadaComputador();
		}
    }, 4000);

	return;
}

function jogadaComputador() {
	console.log("A jogar em fácil.");
	var tabJogo = document.getElementById('jogo');
	var ladoEscolhido;

	var pecaEscolhida = divPecasComputador[0].getAttribute('listaPintas');

	if(pecasJogadas.length == 0) {
		var pecaId = calcularPecaId(parseInt(pecaEscolhida[0]), parseInt(pecaEscolhida[2]));
		sequenciaPecas = String.fromCodePoint(pecaId) + sequenciaPecas;
		ladoEscolhido = 0;

		pecasJogadas.unshift(divPecasComputador[0]);
		var index = divPecasComputador[0].getAttribute('index');
		divPecasComputador.splice(divPecasComputador[0].getAttribute('index'), 1);
		reduzirIndexPecasComputador(index);

		tabJogo.innerHTML = "";
		var seq = document.createTextNode(String.fromCodePoint(160) + sequenciaPecas + String.fromCodePoint(160));
		tabJogo.appendChild(seq);
		atualizarTabComputador();
	}
	else {
		if(parseInt(poderJogarComputador()) == 0) {
			setTimeout(function() {
	    		computadorRetirarPecaMonte();
	    	}, 2000);
	    	return;
		}

		var pecaMaisEsquerda = pecasJogadas[0].getAttribute('listaPintas');
		var pecaMaisDireita = pecasJogadas[pecasJogadas.length - 1].getAttribute('listaPintas');

		for(i = 0; i < divPecasComputador.length; i++) {
			var pecaEscolhida = divPecasComputador[i].getAttribute('listaPintas');

			if(parseInt(pecaEscolhida[0]) == parseInt(pecaMaisEsquerda[0])) {
				ladoEscolhido = "esquerda.";
				var pecaId = calcularPecaId(parseInt(pecaEscolhida[2]), parseInt(pecaEscolhida[0]));
				sequenciaPecas = String.fromCodePoint(pecaId) + sequenciaPecas;

				var novaOrdem = new Array(2);
				novaOrdem[0] = parseInt(pecaEscolhida[2]);
				novaOrdem[1] = parseInt(pecaEscolhida[0]);
				divPecasComputador[i].setAttribute('listaPintas', novaOrdem);

				pecasJogadas.unshift(divPecasComputador[i]);
				var index = divPecasComputador[i].getAttribute('index');
				divPecasComputador.splice(divPecasComputador[i].getAttribute('index'), 1);
				reduzirIndexPecasComputador(index);

				tabJogo.innerHTML = "";
				var seq = document.createTextNode(String.fromCodePoint(160) + sequenciaPecas + String.fromCodePoint(160));
				tabJogo.appendChild(seq);
				atualizarTabComputador();
			}
			else if(parseInt(pecaEscolhida[2]) == parseInt(pecaMaisEsquerda[0])) {
				ladoEscolhido = "esquerda.";
				var pecaId = calcularPecaId(parseInt(pecaEscolhida[0]), parseInt(pecaEscolhida[2]));
				sequenciaPecas = String.fromCodePoint(pecaId) + sequenciaPecas;

				pecasJogadas.unshift(divPecasComputador[i]);
				var index = divPecasComputador[i].getAttribute('index');
				divPecasComputador.splice(divPecasComputador[i].getAttribute('Index'), 1);
				reduzirIndexPecasComputador(index);

				tabJogo.innerHTML = "";
				var seq = document.createTextNode(String.fromCodePoint(160) + sequenciaPecas + String.fromCodePoint(160));
				tabJogo.appendChild(seq);
				atualizarTabComputador();
			}
			else if(parseInt(pecaEscolhida[0]) == parseInt(pecaMaisDireita[2])) {
				ladoEscolhido = "direita.";
				var pecaId = calcularPecaId(parseInt(pecaEscolhida[0]), parseInt(pecaEscolhida[2]));
				sequenciaPecas = sequenciaPecas + String.fromCodePoint(pecaId);

				pecasJogadas.push(divPecasComputador[i]);
				var index = divPecasComputador[i].getAttribute('index');
				divPecasComputador.splice(divPecasComputador[i].getAttribute('Index'), 1);
				reduzirIndexPecasComputador(index);

				tabJogo.innerHTML = "";
				var seq = document.createTextNode(String.fromCodePoint(160) + sequenciaPecas + String.fromCodePoint(160));
				tabJogo.appendChild(seq);
				atualizarTabComputador();
			}
			else if(parseInt(pecaEscolhida[2]) == parseInt(pecaMaisDireita[2])) {
				ladoEscolhido = "direita."
				var pecaId = calcularPecaId(parseInt(pecaEscolhida[2]), parseInt(pecaEscolhida[0]));
				sequenciaPecas = sequenciaPecas + String.fromCodePoint(pecaId);

				var novaOrdem = new Array(2);
				novaOrdem[0] = parseInt(pecaEscolhida[2]);
				novaOrdem[1] = parseInt(pecaEscolhida[0]);
				divPecasComputador[i].setAttribute('listaPintas', novaOrdem);

				pecasJogadas.push(divPecasComputador[i]);
				var index = divPecasComputador[i].getAttribute('index');
				divPecasComputador.splice(divPecasComputador[i].getAttribute('Index'), 1);
				reduzirIndexPecasComputador(index);

				tabJogo.innerHTML = "";
				var seq = document.createTextNode(String.fromCodePoint(160) + sequenciaPecas + String.fromCodePoint(160));
				//seq.setAttribute("style", "")
				tabJogo.appendChild(seq);
				atualizarTabComputador();
			}
		}
	}

	var divMensagens = document.getElementById("caixa_mensagens");
	var textoCaixa = document.getElementById("onde_jogar");
	var mensagem = document.getElementById('mensagem');
	if(parseInt(verificarVitoria()) == -1) {
		mensagem.innerHTML = "Fim da partida!";
		divMensagens.style.backgroundColor = "white";
		textoCaixa.innerHTML = "";
		setTimeout(function() {
    		caixaComputadorGanhou();
    	}, 2500);
		return;
	}

	var noPecas = document.getElementById('displayNPecas');
	noPecas.innerHTML = "Nº de Peças no monte: " + monte.length;

	var caixa = document.getElementById('caixa_mensagens');
	caixa.style.backgroundColor = "#F7DC70";

	var mensagem = document.getElementById('mensagem');
	mensagem.innerHTML = "É a sua vez de jogar!";

	var ondeJogou = document.getElementById('onde_jogar');
	if(parseInt(ladoEscolhido) == 0) {
		ondeJogou.innerHTML = "";
	}
	else {
		ondeJogou.innerHTML = "O computador jogou à " + ladoEscolhido;
	}
	computadorPassouJogada = 0;
	ativarDiv();
	poderJogar();
}

function jogadaComputadorMedio() {
	console.log("A jogar em médio.");

	var tabJogo = document.getElementById('jogo');

	var double = -1;
	var pecaId = 0;
	var div;
	var index;
	var ladoEscolhido;

	for(i = 0; i < divPecasComputador.length; i++) {
		var pintas = divPecasComputador[i].getAttribute('listaPintas');

		if(pintas[0] == pintas[2]) {
			if(pecasJogadas.length == 0 && parseInt(pintas[0]) > double) {
				double = parseInt(pintas[0]);
				div = divPecasComputador[i];
				index = i;
			}
			else if(pecasJogadas.length > 0) {
				var pecaMaisEsquerda = pecasJogadas[0].getAttribute('listaPintas');
				var pecaMaisDireita = pecasJogadas[pecasJogadas.length - 1].getAttribute('listaPintas');

				var pintaEsq = pecaMaisEsquerda[0];
				var pintaDir = pecaMaisDireita[2];

				if(pintas[0] == pintaEsq && parseInt(pintas[0]) > double) {
					double = parseInt(pintas[0]);
					div = divPecasComputador[i];
					index = i;
				}
				else if(pintas[0] == pintaDir && parseInt(pintas[0]) > double) {
					double = parseInt(pintas[0]);
					div = divPecasComputador[i];
					index = i;
				}
			}
		}
	}

	if(parseInt(double) != -1) {

		if(pecasJogadas.length == 0) {
			var pecaId = calcularPecaId(parseInt(double), parseInt(double));
			sequenciaPecas = String.fromCodePoint(pecaId) + sequenciaPecas;
			ladoEscolhido = 0;

			pecasJogadas.unshift(divPecasComputador[index]);
			var index = divPecasComputador[index].getAttribute('index');
			divPecasComputador.splice(divPecasComputador[index].getAttribute('index'), 1);
			reduzirIndexPecasComputador(index);

			tabJogo.innerHTML = "";
			var seq = document.createTextNode(String.fromCodePoint(160) + sequenciaPecas + String.fromCodePoint(160));
			tabJogo.appendChild(seq);
			atualizarTabComputador();

			var divMensagens = document.getElementById("caixa_mensagens");
			var textoCaixa = document.getElementById("onde_jogar");
			var mensagem = document.getElementById('mensagem');
			if(parseInt(verificarVitoria()) == -1) {
				mensagem.innerHTML = "Fim da partida!";
				divMensagens.style.backgroundColor = "white";
				textoCaixa.innerHTML = "";
				setTimeout(function() {
		    		caixaComputadorGanhou();
		    	}, 2500);
				return;
			}

			var noPecas = document.getElementById('displayNPecas');
			noPecas.innerHTML = "Nº de Peças no monte: " + monte.length;

			var caixa = document.getElementById('caixa_mensagens');
			caixa.style.backgroundColor = "#F7DC70";

			var mensagem = document.getElementById('mensagem');
			mensagem.innerHTML = "É a sua vez de jogar!";

			var ondeJogou = document.getElementById('onde_jogar');
			if(parseInt(ladoEscolhido) == 0) {
				ondeJogou.innerHTML = "";
			}
			else {
				ondeJogou.innerHTML = "O computador jogou à " + ladoEscolhido;
			}
			ativarDiv();
			poderJogar();
			return;
		}

		var pecaMaisEsquerda = pecasJogadas[0].getAttribute('listaPintas');
		var pecaMaisDireita = pecasJogadas[pecasJogadas.length - 1].getAttribute('listaPintas');

		if(pecaMaisEsquerda[0] == double) {
			ladoEscolhido = "esquerda.";
			var pecaId = calcularPecaId(parseInt(double), parseInt(double));
			sequenciaPecas = String.fromCodePoint(pecaId) + sequenciaPecas;

			pecasJogadas.unshift(div);
			var i = div.getAttribute('index');
			divPecasComputador.splice(i, 1);
			reduzirIndexPecasComputador(i);

			tabJogo.innerHTML = "";
			var seq = document.createTextNode(String.fromCodePoint(160) + sequenciaPecas + String.fromCodePoint(160));
			tabJogo.appendChild(seq);
			atualizarTabComputador();

			var divMensagens = document.getElementById("caixa_mensagens");
			var textoCaixa = document.getElementById("onde_jogar");
			var mensagem = document.getElementById('mensagem');
			if(parseInt(verificarVitoria()) == -1) {
				mensagem.innerHTML = "Fim da partida!";
				divMensagens.style.backgroundColor = "white";
				textoCaixa.innerHTML = "";
				setTimeout(function() {
		    		caixaComputadorGanhou();
		    	}, 2500);
				return;
			}

			var noPecas = document.getElementById('displayNPecas');
			noPecas.innerHTML = "Nº de Peças no monte: " + monte.length;

			var caixa = document.getElementById('caixa_mensagens');
			caixa.style.backgroundColor = "#F7DC70";

			var mensagem = document.getElementById('mensagem');
			mensagem.innerHTML = "É a sua vez de jogar!";

			var ondeJogou = document.getElementById('onde_jogar');
			if(parseInt(ladoEscolhido) == 0) {
				ondeJogou.innerHTML = "";
			}
			else {
				ondeJogou.innerHTML = "O computador jogou à " + ladoEscolhido;
			}
			ativarDiv();
			poderJogar();
		}
		else if(pecaMaisDireita[2] == double) {
			ladoEscolhido = "direita.";
			var pecaId = calcularPecaId(parseInt(double), parseInt(double));
			sequenciaPecas = sequenciaPecas + String.fromCodePoint(pecaId);

			pecasJogadas.push(div);
			var i = div.getAttribute('index');
			divPecasComputador.splice(i, 1);
			reduzirIndexPecasComputador(i);

			tabJogo.innerHTML = "";
			var seq = document.createTextNode(String.fromCodePoint(160) + sequenciaPecas + String.fromCodePoint(160));
			tabJogo.appendChild(seq);
			atualizarTabComputador();

			var divMensagens = document.getElementById("caixa_mensagens");
			var textoCaixa = document.getElementById("onde_jogar");
			var mensagem = document.getElementById('mensagem');
			if(parseInt(verificarVitoria()) == -1) {
				mensagem.innerHTML = "Fim da partida!";
				divMensagens.style.backgroundColor = "white";
				textoCaixa.innerHTML = "";
				setTimeout(function() {
		    		caixaComputadorGanhou();
		    	}, 2500);
				return;
			}

			var noPecas = document.getElementById('displayNPecas');
			noPecas.innerHTML = "Nº de Peças no monte: " + monte.length;

			var caixa = document.getElementById('caixa_mensagens');
			caixa.style.backgroundColor = "#F7DC70";

			var mensagem = document.getElementById('mensagem');
			mensagem.innerHTML = "É a sua vez de jogar!";

			var ondeJogou = document.getElementById('onde_jogar');
			if(parseInt(ladoEscolhido) == 0) {
				ondeJogou.innerHTML = "";
			}
			else {
				ondeJogou.innerHTML = "O computador jogou à " + ladoEscolhido;
			}
			computadorPassouJogada = 0;
			ativarDiv();
			poderJogar();

		}
		else {
			jogadaComputador();
		}
	}
	else {
		jogadaComputador();
	}
}

function jogarPeca(divPeca, lado) {
	var tabJogo = document.getElementById('jogo');
	var ladoEscolhido;
	if(parseInt(lado) == 0) {
		ladoEscolhido = "esquerda.";
	}
	else {
		ladoEscolhido = "direita.";
	}

	var peca = divPeca.getAttribute('listaPintas');
	var index = divPeca.getAttribute('index');

	if(pecasJogadas.length == 0) {
		var pecaId = calcularPecaId(peca[0], peca[2]);
		sequenciaPecas = String.fromCodePoint(pecaId) + sequenciaPecas;
		ladoEscolhido = -1;
		pecasJogadas.unshift(divPeca);
	}
	else if(parseInt(lado) == 0) {
		var pecaMaisEsquerda = pecasJogadas[0].getAttribute('listaPintas');

		if(pecaMaisEsquerda[0] == peca[2]) {
			var pecaId = calcularPecaId(peca[0], peca[2]);
			sequenciaPecas = String.fromCodePoint(pecaId) + sequenciaPecas;
		}
		else {
			var pecaId = calcularPecaId(peca[2], peca[0]);
			sequenciaPecas = String.fromCodePoint(pecaId) + sequenciaPecas;

			var novaOrdem = new Array(2);
			novaOrdem[0] = parseInt(peca[2]);
			novaOrdem[1] = parseInt(peca[0]);
			divPeca.setAttribute('listaPintas', novaOrdem);
		}
		pecasJogadas.unshift(divPeca);
	}
	else {
		var pecaMaisDireita = pecasJogadas[pecasJogadas.length - 1].getAttribute('listaPintas');

		if(pecaMaisDireita[2] == peca[0]) {
			var pecaId = calcularPecaId(peca[0], peca[2]);
			sequenciaPecas = sequenciaPecas + String.fromCodePoint(pecaId);
		}
		else {
			var pecaId = calcularPecaId(peca[2], peca[0]);
			sequenciaPecas = sequenciaPecas + String.fromCodePoint(pecaId);

			var novaOrdem = new Array(2);
			novaOrdem[0] = parseInt(peca[2]);
			novaOrdem[1] = parseInt(peca[0]);
			divPeca.setAttribute('listaPintas', novaOrdem);

		}
		pecasJogadas.push(divPeca);
	}

	divPecasComputador.splice(index, 1);
	reduzirIndexPecasComputador(index);

	tabJogo.innerHTML = "";
	var seq = document.createTextNode(String.fromCodePoint(160) + sequenciaPecas + String.fromCodePoint(160));
	tabJogo.appendChild(seq);
	atualizarTabComputador();

	var divMensagens = document.getElementById("caixa_mensagens");
	var textoCaixa = document.getElementById("onde_jogar");
	var mensagem = document.getElementById('mensagem');
	if(parseInt(verificarVitoria()) == -1) {
		mensagem.innerHTML = "Fim da partida!";
		divMensagens.style.backgroundColor = "white";
		textoCaixa.innerHTML = "";
		setTimeout(function() {
    		caixaComputadorGanhou();
    	}, 2500);
		return;
	}

	var noPecas = document.getElementById('displayNPecas');
	noPecas.innerHTML = "Nº de Peças no monte: " + monte.length;

	var caixa = document.getElementById('caixa_mensagens');
	caixa.style.backgroundColor = "#F7DC70";

	var mensagem = document.getElementById('mensagem');
	mensagem.innerHTML = "É a sua vez de jogar!";

	var ondeJogou = document.getElementById('onde_jogar');
	if(parseInt(ladoEscolhido) == -1) {
		ondeJogou.innerHTML = "";
	}
	else {
		ondeJogou.innerHTML = "O computador jogou à " + ladoEscolhido;
	}
	ativarDiv();
	poderJogar();
}

function jogadaComputadorDificil() {
	console.log("A jogar em difícil.");
	if(parseInt(poderJogarComputador()) == 0) {
		setTimeout(function() {
    		computadorRetirarPecaMonte();
    	}, 2000);
    	return;
	}

	var pecasSeis = [];
	var pecasCinco = [];
	var pecasQuatro = [];
	var pecasTres = [];
	var pecasDois = [];
	var pecasUm = [];
	var doubles = [];

	var nPecasComp = divPecasComputador.length;

	for(i = 0; i < divPecasComputador.length; i++) {
		var peca = divPecasComputador[i].getAttribute('listaPintas');
		if(peca[0] == peca[2]) doubles.push(divPecasComputador[i]);
		if(peca[0] == 6 || peca[2] == 6) pecasSeis.push(divPecasComputador[i]);
		if(peca[0] == 5 || peca[2] == 5) pecasCinco.push(divPecasComputador[i]);
		if(peca[0] == 4 || peca[2] == 4) pecasQuatro.push(divPecasComputador[i]);
		if(peca[0] == 3 || peca[2] == 3) pecasTres.push(divPecasComputador[i]);
		if(peca[0] == 2 || peca[2] == 2) pecasDois.push(divPecasComputador[i]);
		if(peca[0] == 1 || peca[2] == 1) pecasUm.push(divPecasComputador[i]);
	}

	if(doubles.length > 0) {
		console.log("Vai jogar double.");
		var pecaMaisEsquerda = pecasJogadas[0].getAttribute('listaPintas');
		var pecaMaisDireita = pecasJogadas[pecasJogadas.length - 1].getAttribute('listaPintas');
		for(i = 0; i < doubles.length; i++) {
			var pecaDouble = doubles[i].getAttribute('listaPintas');
			if(parseInt(pecaMaisEsquerda[0]) == parseInt(pecaDouble) && pecaDouble > 2) {
				console.log(1023);
				computadorPassouJogada = 0;
				jogarPeca(doubles[i], 0);
				return;
			}
			else if(parseInt(pecaMaisDireita[2]) == parseInt(pecaDouble) && pecaDouble > 2) {
				console.log(1028);
				computadorPassouJogada = 0;
				jogarPeca(doubles[i], 1);
				return;
			}
		}
	}

	var filaPecas = [];

	for(i = 0; i < pecasSeis.length; i++) {
		if(pecasCinco.length > 1) {
			filaPecas.unshift(pecasSeis[i]);
		}
		else {
			filaPecas.push(pecasSeis[i]);
		}
	}

	for(i = 0; i < pecasCinco.length; i++) {
		if(pecasCinco.length > 1) {
			filaPecas.unshift(pecasCinco[i]);
		}
		else {
			filaPecas.push(pecasCinco[i]);
		}
	}

	for(i = 0; i < pecasQuatro.length; i++) {
		if(pecasQuatro.length > 1) {
			filaPecas.unshift(pecasQuatro[i]);
		}
		else {
			filaPecas.push(pecasQuatro[i]);
		}
	}

	for(i = 0; i < pecasTres.length; i++) {
		if(pecasTres.length > 1) {
			filaPecas.unshift(pecasTres[i]);
		}
		else {
			filaPecas.push(pecasTres[i]);
		}
	}

	for(i = 0; i < pecasDois.length; i++) {
		if(pecasDois.length > 1) {
			filaPecas.unshift(pecasDois[i]);
		}
		else {
			filaPecas.push(pecasDois[i]);
		}
	}

	for(i = 0; i < pecasUm.length; i++) {
		if(pecasUm.length > 1) {
			filaPecas.unshift(pecasUm[i]);
		}
		else {
			filaPecas.push(pecasUm[i]);
		}
	}

	for(i = 0; i < doubles.length; i++) {
		if(doubles.length > 1) {
			filaPecas.unshift(doubles[i]);
		}
		filaPecas.push(doubles[i]);
	}

	var podeJogar = [];

	var pecaMaiorPontuacao;
	var maior;
	var totalPontosMaior = -1

	var pecaDouble = [];

	var pecaMaisEsquerda = pecasJogadas[0].getAttribute('listaPintas');
	var pecaMaisDireita = pecasJogadas[pecasJogadas.length - 1].getAttribute('listaPintas');

	console.log(filaPecas.length);
	for(i = 0; i < filaPecas.length; i++) {
		var peca = filaPecas[i].getAttribute('listaPintas');
		if(parseInt(pecaMaisEsquerda[0]) == parseInt(peca[0])) {
			if(parseInt(pecaMaisDireita[2]) == parseInt(peca[2])) {
				console.log(1107);
				computadorPassouJogada = 0;
				jogarPeca(filaPecas[i], 0);
				return;
			}

			if(peca[0] == peca[2]) {
				pecaDouble.push(filaPecas[i]);
			}

			if(totalPontosMaior < parseInt(peca[0]) + parseInt(peca[2])) {
				pecaMaiorPontuacao = filaPecas[i];
				maior = pecaMaiorPontuacao.getAttribute('listaPintas');
				console.log(maior);
				totalPontosMaior = parseInt(maior[0]) + parseInt(maior[2]);
			}
			podeJogar.push(filaPecas[i]);
		}

		if(parseInt(pecaMaisEsquerda[0]) == parseInt(peca[2])) {
			if(parseInt(pecaMaisDireita[2]) == parseInt(peca[0])) {
				console.log(1126);
				computadorPassouJogada = 0;
				jogarPeca(filaPecas[i], 0);
				return;
			}

			if(peca[0] == peca[2]) {
				pecaDouble.push(filaPecas[i]);
			}

			if(totalPontosMaior < parseInt(peca[0]) + parseInt(peca[2])) {
				pecaMaiorPontuacao = filaPecas[i];
				maior = pecaMaiorPontuacao.getAttribute('listaPintas');
				console.log(maior);
				totalPontosMaior = parseInt(maior[0]) + parseInt(maior[2]);
			}
			podeJogar.push(filaPecas[i]);
		}

		if(parseInt(pecaMaisDireita[2]) == parseInt(peca[0])) {
			if(parseInt(pecaMaisEsquerda[0]) == parseInt(peca[2])) {
				console.log(1145);
				computadorPassouJogada = 0;
				jogarPeca(filaPecas[i], 1);
				return;
			}

			if(peca[0] == peca[2]) {
				pecaDouble.push(filaPecas[i]);
			}

			if(totalPontosMaior < parseInt(peca[0]) + parseInt(peca[2])) {
				pecaMaiorPontuacao = filaPecas[i];
				maior = pecaMaiorPontuacao.getAttribute('listaPintas');
				console.log(maior);
				totalPontosMaior = parseInt(maior[0]) + parseInt(maior[2]);
			}
			podeJogar.push(filaPecas[i]);
		}

		if(parseInt(pecaMaisDireita[2]) == parseInt(peca[2])) {
			if(parseInt(pecaMaisEsquerda[0]) == parseInt(peca[0])) {
				console.log(1164);
				computadorPassouJogada = 0;
				jogarPeca(filaPecas[i], 1);
				return;
			}

			if(peca[0] == peca[2]) {
				pecaDouble.push(filaPecas[i]);
			}

			if(totalPontosMaior < parseInt(peca[0]) + parseInt(peca[2])) {
				pecaMaiorPontuacao = filaPecas[i];
				maior = pecaMaiorPontuacao.getAttribute('listaPintas');
				console.log(maior);
				totalPontosMaior = parseInt(maior[0]) + parseInt(maior[2]);
			}
			podeJogar.push(filaPecas[i]);
		}
		console.log(i);
	}

	if(pecaDouble.length > 0) {
		var divMaiorDouble = pecaDouble[0];
		var peca = divMaiorDouble.getAttribute('listaPintas');
		var total = parseInt(peca[0]) + parseInt(peca[2]);

		for(i = 1; i < pecaDouble.length; i++) {
			var p = pecaDouble[i].getAttribute('listaPintas');
			if(parseInt(p[0]) + parseInt(p[2]) > total) {
				divMaiorDouble = pecaDouble[i];
				peca = divMaiorDouble.getAttribute('listaPintas');
				total = parseInt(p[0]) + parseInt(p[2]);
			}
		}

		var lado;

		if(parseInt(peca[0]) == parseInt(pecaMaisEsquerda[0])) {
			lado = 0;
		}
		else if(parseInt(peca[0]) == parseInt(pecaMaisDireita[2])) {
			lado = 1;
		}

		if(total >= 6) {
			console.log(1207);
			computadorPassouJogada = 0;
			jogarPeca(divMaiorDouble, parseInt(lado));
			return;
		}
	}

	if(pecaMaisEsquerda[0] == maior[0]) {
		console.log(maior);
		console.log(1217);
		computadorPassouJogada = 0;
		jogarPeca(pecaMaiorPontuacao, 0);
		return;
	}
	else if(pecaMaisEsquerda[0] == maior[2]) {
		console.log(maior);
		console.log(1222);
		computadorPassouJogada = 0;
		jogarPeca(pecaMaiorPontuacao, 0);
		return;
	}
	else if(pecaMaisDireita[2] == maior[2]) {
		console.log(maior);
		console.log(1227);
		computadorPassouJogada = 0;
		jogarPeca(pecaMaiorPontuacao, 1);
		return;
	}
	else if(pecaMaisDireita[2] == maior[0]) {
		console.log(maior);
		console.log(1232);
		computadorPassouJogada = 0;
		jogarPeca(pecaMaiorPontuacao, 1);
		return;
	}
}

var jogarInicioPC;

function iniciarPartida() {
	var melhorPecaHumano = -1;
	var melhorPecaComputador = -1;

	var melhorDivHumano;
	var melhorDivComputador;

	for(i = 0; i < 7; i++) {
		var pecaHumano = divPecasHumano[i].getAttribute('listaPintas');
		var pecaComputador = divPecasComputador[i].getAttribute('listaPintas');

		var sumPecaHum = parseInt(pecaHumano[0]) + parseInt(pecaHumano[2]);
		var sumPecaComputador = parseInt(pecaComputador[0]) + parseInt(pecaComputador[2]);

		if(sumPecaHum > melhorPecaHumano) {
			melhorPecaHumano = sumPecaHum;
			melhorDivHumano = divPecasHumano[i];
		}

		if(sumPecaComputador > melhorPecaComputador) {
			melhorPecaComputador = sumPecaComputador;
			melhorDivComputador = divPecasComputador[i];
		}
	}

	if(melhorPecaHumano > melhorPecaComputador) {
		return 0;
	}
	jogarInicioPC = melhorDivComputador;
	return 1;
}

function jogoDomino(pecas) {
	for(i = 0; i < 7; i++) {
		divPecasHumano.push(criarDivPecaHumano(pecas[0][0], pecas[0][1], i, 0));
		numPecasHumano += 1;
		pecas.shift();
	}

	for(i = 0; i < 7; i++) {
		divPecasComputador.push(criarDivPecaHumano(pecas[0][0], pecas[0][1], i, 1));
		numPecasComputador += 1;
		pecas.shift();
	}

	configurarTab(tabHumano, divPecasHumano);
	configurarTab(tabComputador, divPecasComputador);

	monte = pecas;
	console.log(monte.length);

	if(parseInt(iniciarPartida()) == 0) {
		//Começa o humano
		console.log("Começa o humano.")
		var caixa = document.getElementById('caixa_mensagens');
		caixa.style.backgroundColor = "#F7DC70";

		var mensagem = document.getElementById('mensagem');
		mensagem.innerHTML = "Você inicia a partida!";

	}
	else {
		console.log("Começa o computador");
		var caixa = document.getElementById('caixa_mensagens');
		caixa.style.backgroundColor = "#C6C6C5";

		var mensagem = document.getElementById('mensagem');
		mensagem.innerHTML = "O computador inicia a partida...";
		setTimeout(function() {
    		jogarPeca(jogarInicioPC, 0);
    	}, 2000);
    	return;
	}
	return;
}

function calcularPecaId(pintasEsquerda, pintasDireita) {
	if(pintasEsquerda == pintasDireita) {
		return 127075 + parseInt(pintasEsquerda) * 7 + parseInt(pintasDireita);
	}
	return 127025 + parseInt(pintasEsquerda) * 7 + parseInt(pintasDireita);
}

function criarDivPecaHumano(pintasEsquerda, pintasDireita, index, tipo) {
	var newDiv = document.createElement('div');
	newDiv.id = 'divPeca';
	newDiv.className = 'peca';

	var pecaId = calcularPecaId(parseInt(pintasEsquerda), parseInt(pintasDireita));
	var p = document.createTextNode(String.fromCodePoint(pecaId));

	var lista = new Array(2);
	lista[0] = parseInt(pintasEsquerda);
	lista[1] = parseInt(pintasDireita);

	newDiv.setAttribute('listaPintas', lista);

	var index = parseInt(index);
	newDiv.setAttribute('index', index);

	if(parseInt(tipo) == 0) {
		newDiv.style.cursor = 'pointer';

		newDiv.addEventListener("click", function() {
			pecaSelecionada = newDiv;
			removeBorder();
			newDiv.style.border = "solid 2px black";
			newDiv.style.backgroundColor = "#cccccc";

			if(pecasJogadas.length == 0 && modoJogo != "online") {
				var encaixa = document.getElementById('onde_jogar');
				// encaixa.style.color = "black";
				encaixa.innerHTML = "Encaixa em ambos os lados."
			}
			else if (pecasJogadas.length > 0 || boardLine.length > 0){
				var encaixa = document.getElementById('onde_jogar');
				// encaixa.style.color = "black";

				if(modoJogo == "online") {
					var pecaMaisEsquerda = boardLine[0][0];
					var pecaMaisDireita = boardLine[boardLine.length - 1][1];
				}
				else {
					var pecaMaisEsquerda = pecasJogadas[0].getAttribute('listaPintas');
					pecaMaisEsquerda = pecaMaisEsquerda[0];
					var pecaMaisDireita = pecasJogadas[pecasJogadas.length - 1].getAttribute('listaPintas');
					pecaMaisDireita = pecaMaisDireita[2];
				}

				if((lista[0] == pecaMaisEsquerda || lista[1] == pecaMaisEsquerda) && (lista[0] == pecaMaisDireita || lista[1] == pecaMaisDireita)) {
					encaixa.innerHTML = "Encaixa à esquerda e à direita.";
				}
				else if(lista[0] == pecaMaisEsquerda || lista[1] == pecaMaisEsquerda) {
					encaixa.innerHTML = "Encaixa à esquerda.";
				}
				else if(lista[0] == pecaMaisDireita || lista[1] == pecaMaisDireita) {
					encaixa.innerHTML = "Encaixa à direita."
				}
				else {
					encaixa.innerHTML = "Não pode jogar essa peça."
				}
			}
		}, false);
	}

	newDiv.appendChild(p);
	newDiv.scrollIntoView();

	return newDiv;
}

function configurarTab(tab, pecas) {

	for(i = 0; i < pecas.length; i++) {
		if(tab == tabComputador) {
			var newDiv = document.createElement('div');
			newDiv.id = 'divPeca';
			newDiv.className = 'peca';

			var p = document.createTextNode(String.fromCodePoint(127024));
			newDiv.appendChild(p);
			tab.appendChild(newDiv);
		}
		else {
			tab.appendChild(pecas[i]);
		}
	}
}

function comecarJogo() {
 	//let tipoJogo = document.getElementById("adversario").value;
	//console.log(parseInt(tipoJogo.length));
	//console.log(tipoJogo);

	if(document.getElementById("computador").checked) {
		modoJogo = "offline";
		var pecasBaralhadas = shuffle();
		jogoDomino(pecasBaralhadas);
	}
	else if(document.getElementById("humano").checked) {
		modoJogo = "online";
		console.log("aqui");
		if(nomeRegisto == "" || passwordRegisto == "") {
			nomeRegisto = "";
			passwordRegisto = "";
			window.alert("Nome de utilizador ou palavra-passe inválidos.");
		}
		else {
			join(groupId, nomeRegisto, passwordRegisto);

			setTimeout(function() {
				console.log(pecasJogador);
				for(i = 0; i < pecasJogador.length; i++) {
					console.log(pecasJogador[i]);
				}

				console.log(boardLine);
				console.log(boardStock);
				console.log(turn);
				//construirTabuleiro();

	    	}, 1000);
		}
	}
}


function construirPecas() {
	console.log("construindo pecas");
	divPecasHumano = [];
	console.log(pecasJogador.length);
	atualizarTabAdversario();
	for(i = 0; i < pecasJogador.length; i++) {
		divPecasHumano.push(criarDivPecaHumano(pecasJogador[i][0], pecasJogador[i][1], i, 0));
	}
	atualizartabHumano();
	//atualizarTabAdversario();
	atualizarTabJogo();
}

function atualizarTabAdversario() {
	//var tabComputador = document.getElementById('top');
	console.log("Peças advers: " + numPecasAdvers);
	tabComputador.innerHTML = "";
	for(i = 0; i < numPecasAdvers; i++) {
		var newDiv = document.createElement('div');
		newDiv.id = 'divPeca';
		newDiv.className = 'peca';

		var p = document.createTextNode(String.fromCodePoint(127024));
		newDiv.appendChild(p);
		tabComputador.appendChild(newDiv);
	}
	return;
}

function atualizarTabJogo() {
	var tabJogo = document.getElementById('jogo');
	tabJogo.innerHTML = "";

	var seqTab = "";
	for(i = 0; i < boardLine.length; i++) {
		var id = calcularPecaId(boardLine[i][0], boardLine[i][1]);
		console.log("ID: " + id);
		seqTab = seqTab + String.fromCodePoint(parseInt(id));
	}
	seqTab = document.createTextNode(String.fromCodePoint(160) + seqTab + String.fromCodePoint(160));
	console.log(seqTab);
	tabJogo.appendChild(seqTab);

	return;
}

function poderJogarOnline() {

	if(boardLine.length == 0) {
		return 1;
	}

	for(i = 0; i < divPecasHumano.length; i++) {
		var pecaAtual = divPecasHumano[i].getAttribute('listaPintas');
		console.log(pecaAtual[0] + " " + boardLine[0][0]);
		console.log(pecaAtual[2] + " " + boardLine[0][0]);
		console.log(parseInt(pecaAtual[0]) == parseInt(boardLine[boardLine.length-1][1]));
		console.log(parseInt(pecaAtual[2]) == parseInt(boardLine[boardLine.length-1][1]));

		if(parseInt(pecaAtual[0]) == parseInt(boardLine[0][0])) {
			return 1;
		}
		else if(parseInt(pecaAtual[2]) == parseInt(boardLine[0][0])) {
			return 1;
		}
		else if(parseInt(pecaAtual[0]) == parseInt(boardLine[boardLine.length-1][1])) {
			return 1;
		}
		else if(parseInt(pecaAtual[2]) == parseInt(boardLine[boardLine.length-1][1])) {
			return 1;
		}
	}

	return 0;
}

function shuffle() {
	var pecas = configurarPecas();
	var temp = 0;
	l = pecas.length;
	i = 0;
	while(l) {
		i = Math.floor(Math.random() * l--);
		temp = pecas[l];
		pecas[l] = pecas[i];
		pecas[i] = temp;
	}

	for(i = 0; i < pecas.length; i++) {
		console.log(pecas[i]);
	}
	console.log(pecas.length);

	return pecas;
}

function configurarPecas() {
	var pecas = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [3, 3], [3, 4], [3, 5], [3, 6], [4, 4], [4, 5], [4, 6], [5, 5], [5, 6], [6, 6]];
	return pecas;
}
