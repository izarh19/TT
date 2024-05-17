import React from "react";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import background from'../Img/lineb.jpg';
import "../pagescss/Home.css";
import Header from "../Compheader/Header";
import Footer from "../Compfooter/Footer";

export default  function Home(){
return(
<div>
  <Header></Header>
  <div id="bd">
    < img  src={"background"} alt=""/>
  </div>

<div className="warrper">
  <h1>Story Sketcher</h1>
    
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