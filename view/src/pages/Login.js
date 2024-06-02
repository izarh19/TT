import React, {Component } from "react";
import Draw from "../pages/Draw";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faUser  } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import tool from "../Img/toolsremove.png";
import ch from "../Img/mouse-removebg-preview (1).png";
import "../pagescss/Login.css";
import Header from "../Compheader/Header";
import Footer from "../Compfooter/Footer";


export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
    loginPage: []
    };
    }
    componentDidMount() {
    fetch('http://localhost:3001/formall/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => this.setState({ loginPage: data }))
    .catch(error => console.error('Error fetching header page data:', error));
    }
    render(){
    
    const { loginPage } = this.state;
    
  return (
 
   
<div>
 
<Header ></Header>

  <h1 id="login">log in</h1>

  <img src={tool} alt="" id="tool" />
  <img src={ch} alt="" id="mouse" />
<div className="coloful"></div>
<div className="warrper2">

{loginPage.map((ln) => {
if (ln.id === 0) {
  return (
   <div key={ln.id}>
      <button className="googlebtn" placeholder={ln.placeholder}> Log in by Google</button>
      <p className="textor"> {ln.text}</p>
   </div>
  );
  } 
  {
    return (
    <div key={ln.id} className="lninputs">
      <input type={ln.type} placeholder={ln.placeholder} className="lnstyle" />
    </div>
  );
  }
})}

</div>
  <a href="/Draw"><button className="btn2">Log in </button></a>
  <div id="iconK"><FontAwesomeIcon icon={faKey}/></div>
  <div id="iconU"><FontAwesomeIcon icon={faUser} /></div>
  <div id="iconG"><FontAwesomeIcon icon={faGoogle} /></div>
      
  <p id="spINln">Don’t have an account? <b><a href="/Signup" id="sp">sign up</a></b></p>
    <Footer></Footer>

    </div>
  );
}}