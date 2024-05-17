import "../pagescss/Draw.css";
import React from 'react';
import canvas from "../Img/canvasss.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintBrush, faRobot, faDroplet, faEraser, faShapes ,faFolder} from '@fortawesome/free-solid-svg-icons';
import drjson from "../Drawjson.json" 




function Draw() {
return(
<div>
  <img  src={canvas} alt=""  id="canva"/>

{drjson.map((Dr)=>(
 <div key={Dr.id} className="btn3">
<ul>
  <li><button className={Dr.cssClass}>{Dr.text}</button></li>
</ul>
</div>

))}

<ul className="alltheicons">
    <li><FontAwesomeIcon icon={faRobot} style={{color: "#74C0FC",}} /></li><br></br>  
    <li><FontAwesomeIcon icon={faPaintBrush} style={{color: "#FFD43B",}} /></li><br></br>
    <li><FontAwesomeIcon icon={faDroplet} style={{color: "#74C0FC",}} /></li><br></br>
    <li><FontAwesomeIcon icon={faEraser} style={{"--fa-primary-color": "#f4b3ef", "--fa-secondary-color": "#6f02a2"}} /></li><br></br>
    <li><FontAwesomeIcon icon={faShapes} style={{"--fa-primary-color": "#40f000", "--fa-secondary-color": "#f00000",}} /></li><br></br>
</ul>

<div id="folder"><FontAwesomeIcon icon={faFolder} size="2xl" style={{color: "#FFD43B",}} /><br></br>folder1</div>

</div>)}
export default Draw;
