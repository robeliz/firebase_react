
import React, { Component } from 'react';
import firebase from 'firebase';
import logo from './logo.svg'; //Lo importa como variable y luego podemos usarlo como tal
import FileUpload from './FileUpload'
import './App.css';

class App extends Component {
  //Si el estado es modificado se renderiza de nuevo el componente
  constructor(){
	super();
	this.state = {
		user:null,
		pictures: []
	};
	
	this.handleAuth = this.handleAuth.bind(this);
	this.handleLogOut = this.handleLogOut.bind(this);
	this.handleUpload = this.handleUpload.bind(this);
  }	
	
  componentWillMount(){
	  firebase.auth().onAuthStateChanged(user => {
		  this.setState({
			  user
			  //Si la clave y la var son iguales nos ahorramos escribirlo dos veces user: user
		  });
	  });
	  
	  firebase.database().ref('pictures').on('child_added', snapshot => {
		  this.setState({
			  pictures: this.state.pictures.concat(snapshot.val())
		  });
	  });
  }	
	
  handleAuth(){
	  const provider = new firebase.auth.GoogleAuthProvider();
	  firebase.auth().signInWithPopup(provider)
			/*
			 * Arrow function de es6 es lo mismo que 
			 * .then(function(result){
			 *	return console.log("lo que sea");
			 * })
			 * 
			 * Si solo viene una linea nos cargamos las llaves sino 
			 * {
			 *	console.log(`${result.user.email} ha iniciado sesión`)
			 *	console.log('Otra linea mas')
			 * }
			 * 
			 * Además si solo trae un parametro result nos cargamos tambien los parentesis sino
			 * 
			 * (result, otraVar) => console.log('Lo que sea')
			 */  
			.then(result => console.log(`${result.user.email} ha iniciado sesión`)) //ES6 template string interpola variables y arrow function.
			.catch(error => console.log(`Error ${error.code}: ${error.message}`));
	  
  }
  
  handleLogOut(){
	  firebase.auth().signOut()
		.then(result => console.log(`Has salido`)) //ES6 template string interpola variables y arrow function.
		.catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }
  
  handleUpload(event){
		const file = event.target.files[0];
		const storageRef = firebase.storage().ref(`/Fotos/${file.name}`); //Template string en ES6 van con `lo que sea {var}`
		const task = storageRef.put(file);
		
		task.on('state_changed', snapshot => {
			let pertentage = (snapshot.bytesTransferred / snapshot.TotalBytes) * 100;
			this.setState({
				uploadValue:pertentage
			});
		}, error =>{
			console.log(error.message);
		}, () =>{
			const record = {
				photoURL: this.state.user.photoURL,
				displayName: this.state.user.displayName,
				image: task.snapshot.downloadURL
			};
			
			const dbRef = firebase.database().ref('pictures');
			const newPicture = dbRef.push();
			newPicture.set(record);
			
		});
	}
  
  renderLoginButton(){
	  if(this.state.user){
		  return(
			    <div className="text-center">
				  <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName} />
				  <p>Hola {this.state.user.displayName} ! </p>
				  <button onClick={this.handleLogOut}>Logout</button><br />
				  <FileUpload onUpload={this.handleUpload} />
				  <br /> <br />

				  {
					this.state.pictures.map( picture => (
						<div>
							<img height="400" src={ picture.image } alt=""/>
							<br />
							<img height="50" src={ picture.photoURL } alt={picture.displayName}/>
							<span>{ picture.displayName }</span>
						</div>	
					)).reverse()
				  }
				
				</div>
		  );
	  }else{
		  return(
			<button onClick={this.handleAuth}>Login con Google</button>
		  );
	  }
  }
  
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React App</h2>
        </div>
		<div>
			<p className="App-intro">
				{this.renderLoginButton()}
			</p>
        </div>
      </div>
    );
  }
}

export default App;
