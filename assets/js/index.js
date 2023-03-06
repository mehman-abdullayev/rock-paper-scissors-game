import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, child, get, set, ref, push, remove, onValue } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBIENxgZnjHSBUt9urGtECDocGtK2FxfVo",
    authDomain: "iatc-task.firebaseapp.com",
    databaseURL: "https://iatc-task-default-rtdb.firebaseio.com",
    projectId: "iatc-task",
    storageBucket: "iatc-task.appspot.com",
    messagingSenderId: "261539857862",
    appId: "1:261539857862:web:58a83294a98df4914c9ec7"
};

const app = initializeApp(firebaseConfig), db = getDatabase(app);

document.getElementById('form1').addEventListener('submit', addPlayer); document.getElementById('form2').addEventListener('submit', sendMessage); 

let id = 0, turn = 0, player1 = document.getElementById('player1'), player2 = document.getElementById('player2'), result = document.getElementById('result'), wins1 = document.getElementById('wins1'), wins2 = document.getElementById('wins2'), losses1 = document.getElementById('losses1'), losses2 = document.getElementById('losses2');

function resetScores() {
	document.body.setAttribute('data-wins1', '0'); document.body.setAttribute('data-wins2', '0'); document.body.setAttribute('data-losses1', '0'); document.body.setAttribute('data-losses2', '0'); result.innerHTML = '';
}

resetScores();

onValue(ref(db, '/game'), (snapshot) => {
	let data = snapshot.val(), winner = 0;

	if (data['player1']['name'] !== '' && data['player2']['name'] !== '' && !document.body.hasAttribute('data-player-id')) { 
		let divs = document.querySelectorAll('.hide');
		for (let div of divs) div.style.display = 'none';
		alert('There is no room for another player!');
	} else {
		if (data['player1']['name'] !== '') player1.innerText = data['player1']['name'];
		else player1.innerText = 'Waiting for Player 1';
		if (data['player2']['name'] !== '') player2.innerText = data['player2']['name'];
		else player2.innerText = 'Waiting for Player 2';
		console.log('Id: ', id);
		if (data['player1']['name'] !== '' && data['player2']['name'] !== '' && data['player1']['hand'] === '' && data['player2']['hand'] === '' && (data['player1']['playerId'] == id || !document.body.hasAttribute('data-player-id'))) {
			let div = document.getElementById('choices1'), button = document.createElement('button');
			button.innerText = 'Rock'; button.style.cursor = 'pointer'; button.setAttribute('data-hand', 'rock'); button.setAttribute('data-player', 'player1'); button.addEventListener('click', choice);
			div.append(button, document.createElement('br'), document.createElement('br'));
			button = document.createElement('button');
			button.innerText = 'Paper'; button.style.cursor = 'pointer'; button.setAttribute('data-hand', 'paper'); button.setAttribute('data-player', 'player1'); button.addEventListener('click', choice);
			div.append(button, document.createElement('br'), document.createElement('br'));
			button = document.createElement('button');
			button.innerText = 'Scissor'; button.style.cursor = 'pointer'; button.setAttribute('data-hand', 'scissor'); button.setAttribute('data-player', 'player1'); button.addEventListener('click', choice);
			div.append(button, document.createElement('br'), document.createElement('br'));
			player1.parentNode.insertBefore(div, player1.parentNode.children[1]);
		} else if (data['player1']['name'] !== '' && data['player2']['name'] !== '' && data['player1']['hand'] !== '' && data['player2']['hand'] === '' && (data['player2']['playerId'] == id || !document.body.hasAttribute('data-player-id'))) {
			let div = document.getElementById('choices2'), button = document.createElement('button');
			button.innerText = 'Rock'; button.style.cursor = 'pointer'; button.setAttribute('data-hand', 'rock'); button.setAttribute('data-player', 'player2'); button.addEventListener('click', choice);
			div.append(button, document.createElement('br'), document.createElement('br'));
			button = document.createElement('button');
			button.innerText = 'Paper'; button.style.cursor = 'pointer'; button.setAttribute('data-hand', 'paper'); button.setAttribute('data-player', 'player2'); button.addEventListener('click', choice);
			div.append(button, document.createElement('br'), document.createElement('br'));
			button = document.createElement('button');
			button.innerText = 'Scissor'; button.style.cursor = 'pointer'; button.setAttribute('data-hand', 'scissor'); button.setAttribute('data-player', 'player2'); button.addEventListener('click', choice);
			div.append(button, document.createElement('br'), document.createElement('br')); player2.parentNode.insertBefore(div, player2.parentNode.children[1]);
			
		}
		
		if (data['player1']['name'] !== '' && data['player2']['name'] !== '' && data['player1']['hand'] === '' && data['player2']['hand'] === '') {
			document.getElementById('choices1').parentNode.style.border = '2px solid yellow';
			document.getElementById('choices2').parentNode.style.border = '1px solid black';
		} else if (data['player1']['name'] !== '' && data['player2']['name'] !== '' && data['player1']['hand'] !== '' && data['player2']['hand'] === '') {
			document.getElementById('choices2').parentNode.style.border = '2px solid yellow';
			document.getElementById('choices1').parentNode.style.border = '1px solid black';
		}
		
		let ch1 = document.getElementById('choices1'), ch2 = document.getElementById('choices2');
		
		if (player1.innerText == 'Waiting for Player 1') {
			ch1.parentNode.style.border = '1px solid black'; ch2.parentNode.style.border = '1px solid black'; ch1.innerHTML = ''; ch2.innerHTML = '';
			wins1.innerText = 'Wins: 0'; wins2.innerText = 'Wins: 0'; losses1.innerText = 'Losses: 0'; losses2.innerText = 'Losses: 0'; resetScores();
		}
		if (player2.innerText == 'Waiting for Player 2') { 
			ch2.parentNode.style.border = '1px solid black'; ch1.parentNode.style.border = '1px solid black'; ch2.innerHTML = ''; ch1.innerHTML = '';
			wins1.innerText = 'Wins: 0'; wins2.innerText = 'Wins: 0'; losses1.innerText = 'Losses: 0'; losses2.innerText = 'Losses: 0'; resetScores();
		}
	
		if (data['player1']['hand'] !== '' && data['player2']['hand'] !== '') {
			let player1Hand = data['player1']['hand'], player2Hand = data['player2']['hand'];
			if (player1Hand == player2Hand) { winner = 'none'; }
			else if (player1Hand === 'rock' && player2Hand === 'paper') { winner = 'player2';  }
			else if (player1Hand === 'rock' && player2Hand === 'scissor') { winner = 'player1'; }
			else if (player1Hand === 'paper' && player2Hand === 'scissor') { winner = 'player2'; }
			else if (player1Hand === 'paper' && player2Hand === 'rock') { winner = 'player1'; }
			else if (player1Hand === 'scissor' && player2Hand === 'paper') { winner = 'player1'; }
			else if (player1Hand === 'scissor' && player2Hand === 'rock') { winner = 'player2'; }
		
			if (winner === 'none') { result.innerText = 'Draw!'; }
			else if (data[winner]['playerId'] === parseInt(document.body.getAttribute('data-player-id'))) { result.innerText = 'Won!'; }
			else { { result.innerText = 'Loss!'; } }
		
			if (winner === 'player1') {
				document.body.setAttribute('data-wins1', parseInt(document.body.getAttribute('data-wins1')) + 1);
				wins1.innerText = 'Wins: ' + (document.body.getAttribute('data-wins1')).toString();
			} else if (winner == 'player2') {
				document.body.setAttribute('data-losses1', parseInt(document.body.getAttribute('data-losses1')) + 1);
				losses1.innerText = 'Losses: ' + (document.body.getAttribute('data-losses1')).toString();
			}
			if (winner === 'player2') {
				document.body.setAttribute('data-wins2', parseInt(document.body.getAttribute('data-wins2')) + 1);
				wins2.innerText = 'Wins: ' + (document.body.getAttribute('data-wins2')).toString();
			} else if (winner == 'player1') {
				document.body.setAttribute('data-losses2', parseInt(document.body.getAttribute('data-losses2')) + 1);
				losses2.innerText = 'Losses: ' + (document.body.getAttribute('data-losses2')).toString();
			}
			
			set(ref(db, 'game/player1/hand'), ''); set(ref(db, 'game/player2/hand'), ''); 
		} 
		
	}
});

async function addPlayer(e) {
	e.preventDefault();
	
	if (document.getElementById('name').value === '') { alert('Name is empty!'); }
	else {
	if ((player1.innerText.includes('Waiting for Player') || player2.innerText.includes('Waiting for Player')) && !document.body.hasAttribute('data-player-added')) {
	
		get(child(ref(getDatabase()), `player`)).then((snapshot) => {
			if (snapshot.exists()) {
				let data = snapshot.val();
				if (data == '') id = 1;
				else id = data.length;
				document.body.setAttribute('data-player-id',  id); document.body.setAttribute('data-player-added', 'true');
			
				console.log('id1 is: ', id);
				set(ref(db, '/player/' + id), {
					id: id,
					userName: document.getElementById('name').value
				});
			
				
				if (player1.innerText.includes('Waiting for Player')) {
					console.log('id is: ', id);
					set(ref(db, '/game/player1'), {
						name: document.getElementById('name').value,
						hand: '',
						playerId: id
					});				
				} else {
					set(ref(db, '/game/player2'), {
						name: document.getElementById('name').value,
						hand: '',
						playerId: id
					});
				}
			} else {
				console.log("No data available");
			}
		}).catch((error) => {
			console.error(error);
		});
	} else { alert('There is no room for another player!') }
	}
}

function choice(e) {
	console.log(e.currentTarget.getAttribute('data-hand'), e.currentTarget.getAttribute('data-player'));
	if (document.body.hasAttribute('data-player-id')) {
		set(ref(db, '/game/' + e.currentTarget.getAttribute('data-player') + '/hand'), e.currentTarget.getAttribute('data-hand'));
	}
	
	e.currentTarget.parentNode.parentNode.style.border = '1px solid black';
	e.currentTarget.parentNode.innerHTML = '';
}

function reset1() {
	get(child(ref(getDatabase()), `game`)).then((snapshot) => {
		let data = snapshot.val();
	
		if (data['player1']['playerId'] === parseInt(document.body.getAttribute('data-player-id'))) {
			set(ref(db, '/game/player1'), {
				name: '',
				hand: '',
				playerId: 0
			});	
		} else {
			set(ref(db, '/game/player2'), {
				name: '',
				hand: '',
				playerId: 0
			});
		}
		
		set(ref(db, '/message'), '');
	});
	
	return "Do you want to leave the game?";
}

async function sendMessage(e) {
	e.preventDefault();
	
	if (document.getElementById('message').value === '') { alert('Message is empty!'); }
	else if (document.body.hasAttribute('data-player-id')) {
		get(child(ref(getDatabase()), `message`)).then((snapshot) => {
			if (snapshot.exists()) {
				let messages = snapshot.val(), messageId = 0;
				if (messages == '') messageId = 1;
				else messageId = messages.length;
				
				get(child(ref(getDatabase()), `game`)).then((snp1) => {
					let game = snp1.val(), player = 0;
					
					if (game['player1']['playerId'] === parseInt(document.body.getAttribute('data-player-id'))) {
						player = 1;
					} else { player = 2; }
					
					set(ref(db, '/message/' + messageId), {
						player: player,
						message: document.getElementById('message').value
					});
				});
			} else {
				console.log("No data available");
			}
		}).catch((error) => {
			console.error(error);
		});
	}
}

onValue(ref(db, '/message'), (snapshot) => {
	let messages = snapshot.val(), messagesContainer = document.getElementById('messages');
	
	messagesContainer.innerHTML = '';
	
	for (let message of messages.slice(-4)) {
		if (message !== undefined) {
			let p = document.createElement('p'); p.innerText = 'Player ' + message['player'] + ': ' + message['message'];
			messagesContainer.append(p);
		};
	}
});	
	
window.onbeforeunload = function() {
    reset1();
}
