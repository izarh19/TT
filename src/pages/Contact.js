import Header from "../Compheader/Header";
import Footer from "../Compfooter/Footer";
import contactform from "../Formall.json";
import stars from "../Img/stars-removebg-preview.png";
import "../pagescss/Contact.css";
import Home from "../pages/Home";
import write from "../Img/write-removebg-preview (1).png"


export default  function Contact() {
return (
<div>

<Header ></Header>
<h1 >Contact Us</h1>
<img src={write} alt="" id="write"/>
  <div className="warrper3">

<div id="rating">
  <p id="exp">How was your exprince?<br></br>
     <img src={stars} alt="" id="stars"/>
  </p>
</div>

{contactform.contactus.map((cs) => {
 return (
   <div key={cs.id} >
     <input type={cs.type} placeholder={cs.placeholder}  class={cs.class} />
   </div>
   
  )
})}
<a href="./Home" ><button id="send">send</button></a>
</div>
<Footer></Footer>
</div>
)
}
