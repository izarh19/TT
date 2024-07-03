import React, { Component } from "react";
import "../pagescss/Draw.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

export default class Draw extends Component {

constructor(props) {
super(props);
this.state = {
drawPage: [],
setBrushColor: 'black',
setBrushWidth: 5,
isDraw: false,
setEraserWidth: 8,
isErase: false,
};
this.canvasRef = React.createRef();
this.ctx = null; 
}

componentDidMount() {
fetch("http://localhost:3001/inputs/3")
.then(response => response.json())
.then(data => {
this.setState({ drawPage: data });

this.ctx = this.canvasRef.current.getContext('2d');
this.ctx.lineCap = "round";
this.ctx.strokeStyle = this.state.setBrushColor;
this.ctx.lineWidth = this.state.setBrushWidth;
})
.catch(error => console.error('Error fetching header page data:', error));
}

componentDidUpdate(prevProps, prevState) {
const { setBrushColor, setBrushWidth, setEraserWidth } = this.state;
if (
setBrushColor !== prevState.setBrushColor ||
setBrushWidth !== prevState.setBrushWidth ||
setEraserWidth !== prevState.setEraserWidth
) {
this.ctx.strokeStyle = this.state.setBrushColor;
this.ctx.lineWidth = this.state.isErase ? setEraserWidth : setBrushWidth;
}
}

setBrushColor = (color) => {
this.setState({ setBrushColor: color });
}

setBrushWidth = (width) => {
this.setState({ setBrushWidth: width });
}

setEraserWidth = (width) => {
  this.setState({ setEraserWidth: width });
}

startDrawing = (e) => {
const { offsetX, offsetY } = e.nativeEvent;
this.ctx.beginPath();
this.ctx.moveTo(offsetX, offsetY);
this.setState({ isDraw: true, isErase: false });
};

endDrawing = () => {
this.setState({ isDraw: false });
this.ctx.closePath();
};

drawing = (e) => {
if (!this.state.isDraw) return;
const { offsetX, offsetY } = e.nativeEvent;
this.ctx.lineTo(offsetX, offsetY);//draw a line from the current drawing position to a new position.
this.ctx.stroke()//a method used to draw the outline of a shape
};

startErasing = (e) => {
const { offsetX, offsetY } = e.nativeEvent;
this.ctx.beginPath();
this.ctx.moveTo(offsetX, offsetY);
this.setState({ isErase: true, isDraw: false });
};

erasing = (e) => {
if (!this.state.isErase) return;
const { offsetX, offsetY } = e.nativeEvent;
this.ctx.lineTo(offsetX, offsetY);
this.ctx.stroke();
this.ctx.globalCompositeOperation = 'destination-out';
};

endErasing = () => {
this.setState({ isErase: false });
this.ctx.closePath();
this.ctx.globalCompositeOperation = 'source-over';
};

render() {
const { drawPage, setBrushColor, setBrushWidth } = this.state;

return (
<body style={{ backgroundColor: 'rgba(238, 238, 238, 1)' }}>
<div>
<canvas
id="borde"
ref={this.canvasRef}      
width={900}
height={470}
onMouseDown={this.state.isErase ? this.startErasing : this.startDrawing}
onMouseUp={this.state.isErase ? this.endErasing : this.endDrawing}
onMouseMove={this.state.isErase ? this.erasing : this.drawing}
style={{ border: '1px solid #000' }}
></canvas>

{drawPage.map((Dr) => (
<div key={Dr.inputID} className="btn3">
  <ul>
    <li><button className={Dr.inputCssClass}>{Dr.inputTitle}</button></li>
  </ul>
</div>
))}

<div className="dropdown">
  <button><img id="brush" src="https://img.icons8.com/?size=100&id=13437&format=png&color=000000" alt=""  /></button>
  <div className="content">
    
<label htmlFor="brush" id="brushscolor">Brush Color:</label>
<input id="brushscolor" type="color" value={setBrushColor} onChange={(e) => this.setBrushColor(e.target.value)} />

<label id="brushwidth" htmlFor="brush_width">Brush Width:</label>
<input id="brushwidth" type="range" min="1" max="100" value={setBrushWidth} onChange={(e) => this.setBrushWidth(e.target.value)} />
</div></div>

<div>
<button id="eraserwidth" onClick={this.startErasing}>Eraser</button>
</div>

<div>

<img id="eraser" src="https://img.icons8.com/?size=100&id=46514&format=png&color=000000" alt="" />
<img id="colors" src="https://img.icons8.com/?size=100&id=63814&format=png&color=000000" alt="" />
<img id="shaeps" src="https://img.icons8.com/?size=100&id=dN8m9joMwymk&format=png&color=000000" alt="" />
<img id="ai" src="https://img.icons8.com/?size=100&id=45060&format=png&color=000000" alt="" />
<img id="featture" src="https://img.icons8.com/?size=100&id=xsmDI5Qkj3wH&format=png&color=000000" alt="" />
</div>



<div>
<img id="next" src="https://img.icons8.com/?size=100&id=7404&format=png&color=FFFFFF" alt="" />
<img id="back" src="https://img.icons8.com/?size=100&id=7404&format=png&color=FFFFFF" alt="" />
</div>

<div id="folder">
<FontAwesomeIcon icon={faFolder} size="2xl" style={{ color: "#FFD43B" }} /><br />folder1
</div>

</div>
</body>
);
}
}
