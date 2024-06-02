import React from "react";
import jayson from '../Jsons.json';
import "../pagescss/About.css";
import backgroung from '../Img/lineb.jpg';
import Header from "../Compheader/Header";
import Footer from "../Compfooter/Footer";

export default function About () {
return (
<div>

<Header></Header>
<h1>About</h1>
<div className="BGI">
<img src={"background"} alt="" />
</div>


{jayson.map((abt)=>(
<div className="theabout" key={abt.pageId} >
{abt.text&& abt.text.split("\n").map((newabt)=>
<p key={newabt.id} className="aboutext">{newabt}</p>
)}

</div>
))}
<Footer></Footer>
</div>
)
}
