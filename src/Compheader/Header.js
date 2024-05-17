import react,{ Component } from "react";
import "./Header.css";
import headermenu from "../HM";
import logoimg from "../Img/logo2.png";




export default  class Header extends Component{

render() {
  return(

    <header>
    <div className="header">
      <div id="logoimg">
        <img src={logoimg}  url="./img/logo2"/>
      </div>
      <nav >
       <ul className="buttons" >
      {headermenu.map((btn)=>(
         <li><a href={btn.url}>{btn.title}</a></li>
         
      ))}     
             
        
       </ul>
      </nav>
    </div>
  </header>
  
  );
 }
};




