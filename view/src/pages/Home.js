import React from "react";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import background from'../Img/lineb.jpg';
import "../pagescss/Home.css";
import Header from "../Compheader/Header";
import Footer from "../Compfooter/Footer";
import logohome from "../Img/logo.png"

export default  function Home(){
return(

<div >
  <Header></Header>
  <div id="bd">
    < img  src={"background"} alt="" />
  </div>

<div className="warrper">
  <img src={logohome} alt="" id="logohome"/>
    <p id="text"><b> Unleash your creativity in Story Sketch.<br></br>The perfect place to create your own Story by drawing! </b> </p>
      <ul className="theb">
        <li><a href="/Login" ><button >Log in</button></a> </li>
        <li><a href="/Signup"><button >Sign up</button></a></li>
       </ul>
    

    
    <a href="draw" id="skipbtn">skip</a>
   

 </div>
<Footer></Footer>
</div>
)
}