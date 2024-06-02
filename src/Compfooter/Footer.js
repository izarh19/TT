import react,{ Component } from "react";
import "./Footer.css";
import footermenu from "../FM";
import {fafafacebook ,fafatwitter ,fafainstagram}from "@fortawesome/free-brands-svg-icons";



export default  class Footer extends Component{ 

  render() { 
  return(

 
    
  
<footer>
<ul  className="inside_footer" >
{footermenu.map((ftr)=>(
<li><a href={ftr.url}>{ftr.title} </a></li>))}
</ul>

<ul >
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
<li><a className="fa fa-facebook"></a></li>
<li><a className="fa fa-twitter"></a></li>
<li><a className="fa fa-instagram"></a></li>
</ul>

</footer>

   );
  }
 }
    
    
  
  
