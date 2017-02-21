import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import firebase from 'firebase';

var config = { //Config modificar para subir a github
    apiKey: "AIzaSyCAS_8vQgG4FNZunvV5JZtHH-I1zb9-UFI",
    authDomain: "reactapp-83e0a.firebaseapp.com",
    databaseURL: "https://reactapp-83e0a.firebaseio.com",
    storageBucket: "reactapp-83e0a.appspot.com",
    messagingSenderId: "943525967024"
  };

firebase.initializeApp(config);

ReactDOM.render(
  <App />, //Componente a incrustar
  document.getElementById('root') //Donde lo metemos
);
