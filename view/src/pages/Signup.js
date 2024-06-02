import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faEnvelope , faUser} from "@fortawesome/free-solid-svg-icons";
import computersp from "../Img/computerremove.png";
import Login from "./Login";
import "../pagescss/Signup.css";
import Header from "../Compheader/Header";
import Footer from "../Compfooter/Footer";


export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
    signupPage: []
    };
    }
    componentDidMount() {
    fetch('http://localhost:3001/formall/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => this.setState({ signupPage: data }))
    .catch(error => console.error('Error fetching header page data:', error));
    }
    render(){
    
    const { signupPage } = this.state;
    
return (<div>
<Header/>
  
  <h1>sign up </h1>
<p id="sentience">Create Story Sketch account </p>
<div id="thebigwarp"></div>

  <div className="evet">
    
{ signupPage.map((sp)=>
 <div key={sp.id} className="warpper1">
  <div className="formsup">
    <input type={sp.type}  placeholder={sp.placeholder}  id="spinput"></input>
  </div>  
</div>
)}


</div>
<div id="iconUsp"><FontAwesomeIcon   icon={faUser}  /></div>
<div id="iconKsp"> <FontAwesomeIcon  icon={faKey}/></div>
<div id="iconEsp"><FontAwesomeIcon  icon={faEnvelope} /></div>
 

<a href="/Draw"><button id="btn1" >sign up </button></a>
<a href="/Login" id="lnINsp" > log in </a>

<Footer></Footer>
</div>)
}
}


