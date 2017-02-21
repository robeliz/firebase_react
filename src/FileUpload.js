
import React ,{Component} from 'react';

class FileUpload extends Component{
	constructor() {
		super(); //Llama al constructor de Component
		this.state = {
			uploadValue : 0
		};
		
	}
	
	render(){
		return(
			<div>
				<br />
				<progress value={this.state.uploadValue} max="100"></progress>
				<br /><br />
				<input type="file" onChange={ this.props.onUpload } />
			</div>
		);
	}
};

export default FileUpload;

