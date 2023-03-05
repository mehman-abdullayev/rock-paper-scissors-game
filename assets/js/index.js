import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, get, set, ref, push, remove, onValue } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

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

document.getElementById('form').addEventListener('submit', addPlayer());

function addPlayer(e) {
	e.preventDefault();
	set(ref(db, '/' + 'user'), {
		userName: 'mehman',
		phone: '0508619691'
	});
	
	console.log('data sent');
}
