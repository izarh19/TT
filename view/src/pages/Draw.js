import React, {Component} from "react";
import "../pagescss/Draw.css";
import canvas from "../Img/thewhite canva.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintBrush, faRobot, faDroplet, faEraser, faShapes ,faFolder} from '@fortawesome/free-solid-svg-icons';



export default class Draw extends Component  {
  constructor(props) {
    super(props);
    this.state = {
    drawPage: []
    };
    }
    componentDidMount() {
    fetch('http://localhost:3001/drawjson/servies' , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => this.setState({drawPage: data }))
    .catch(error => console.error('Error fetching header page data:', error));
    }
    render(){
    
    const { drawPage } = this.state;
    
return(
  <body style={{ backgroundColor: 'rgba(238, 238, 238, 1)' }}>
<div>

  <img  src={canvas} alt=""  id="canva" />

  {drawPage.map((Dr)=>(
    <div key={Dr.id} className="btn3">
        <ul>
          <li><button className={Dr.cssClass}>{Dr.text}</button></li>
        </ul>
    </div>

))}

<div>
<img id="brush" src="https://img.icons8.com/?size=100&id=13437&format=png&color=000000" alt="" />
<img id="eraser" src="https://img.icons8.com/?size=100&id=46514&format=png&color=000000 "alt="" />
<img id="colors" src="https://img.icons8.com/?size=100&id=63814&format=png&color=000000" alt="" />
<img id="shaeps" src="https://img.icons8.com/?size=100&id=dN8m9joMwymk&format=png&color=000000" alt="" />
<img id="ai" src="https://img.icons8.com/?size=100&id=45060&format=png&color=000000" alt="" />;
<img id="featture" src="https://img.icons8.com/?size=100&id=xsmDI5Qkj3wH&format=png&color=000000" alt="" />
</div>

<div>
<img  id="nbrush" src="https://img.icons8.com/?size=100&id=7404&format=png&color=FFFFFF" alt="" ></img>
<img id="neraser" src="https://img.icons8.com/?size=100&id=7404&format=png&color=FFFFFF" alt=""></img>
<img id="ncolors" src="https://img.icons8.com/?size=100&id=7404&format=png&color=FFFFFF" alt=""></img>
<img id="nshaeps" src="https://img.icons8.com/?size=100&id=7404&format=png&color=FFFFFF" alt=""></img>
<img id="nai" src="https://img.icons8.com/?size=100&id=7404&format=png&color=FFFFFF" alt=""></img>
<img id="nfea" src="https://img.icons8.com/?size=100&id=7404&format=png&color=FFFFFF" alt=""></img>
</div>

<div>
<img id="next" src="https://img.icons8.com/?size=100&id=7404&format=png&color=FFFFFF" alt=""></img>
<img id="back" src="https://img.icons8.com/?size=100&id=7404&format=png&color=FFFFFF" alt=""></img>
</div>

<div id="folder"><FontAwesomeIcon icon={faFolder} size="2xl" style={{color: "#FFD43B",}} /><br></br>folder1</div>

</div>
</body>
)}
}
