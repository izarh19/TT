import React from "react";
import signupform from "../Formall.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faEnvelope , faUser} from "@fortawesome/free-solid-svg-icons";
import computersp from "../Img/computerremove.png";
import Login from "./Login";
import "../pagescss/Signup.css";
import Header from "../Compheader/Header";
import Footer from "../Compfooter/Footer";


export default  function signup() {
return (<div>
<Header></Header>
  <img src={computersp} alt="" id="compbackg"></img>
  <h1>sign up </h1>


  
{signupform.signup.map((sp)=>
 <div key={sp.id} className="warpper1">
  <div className="formsup">
    <input   type={sp.type}  placeholder={sp.placeholder}  id="spinput"></input>
  </div>  
  

</div>
)}


<div id="iconUsp"><FontAwesomeIcon   icon={faUser}  /></div>
<div id="iconKsp"> <FontAwesomeIcon   icon={faKey}/></div>
<div id="iconEsp"><FontAwesomeIcon   icon={faEnvelope} /></div>
 

<a href="/Draw"><button id="btn1" >sign up </button></a>
<a href="/Login" id="lnINsp" > log in </a>

<Footer></Footer>
</div>)
}



