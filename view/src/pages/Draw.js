import React, { Component } from "react";
import "../pagescss/Draw.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";


export default class Draw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawPage: [],
      setBrushColor: "#000000",
      setBrushWidth: 5,
      setEraserWidth: 5,
      isDrawing: false,
      isErasing: false,
      selectedShape: "",
      drawings: [],
      motionType: "ROTATE",
      rotate: 0,
      x: 0,
      y: 0,
      speed: 1,
      playAnimation: false,
    };
    this.canvasRef = React.createRef();
    this.shapeRefs = [];
    this.ctx = null;
    this.startX = 0;
    this.startY = 0;
    this.savedImageData = null;
  }

  componentDidMount() {
    fetch("http://localhost:3001/inputs/3")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ drawPage: data });
        this.ctx = this.canvasRef.current.getContext("2d");
        this.ctx.fillStyle = "#fff";
        this.ctx.lineCap = "round";
      })
      .catch((error) => console.error("Error fetching header page data:", error));
  }

  updateBrushSettings = () => {
    if (this.ctx) {
      this.ctx.strokeStyle = this.state.setBrushColor;
      this.ctx.lineWidth = this.state.isErasing
        ? this.state.setEraserWidth
        : this.state.setBrushWidth;
    }
  };

  drawShape = (shape, startX, startY, endX, endY) => {
    const width = endX - startX;
    const height = endY - startY;
    const radius = Math.sqrt(width ** 2 + height ** 2);
    const sideLength = Math.min(Math.abs(width), Math.abs(height));

    const drawing = {
      type: 'shape',
      shape,
      startX,
      startY,
      endX,
      endY,
      width,
      height,
      radius,
      sideLength,
      brushColor: this.state.setBrushColor,
      brushWidth: this.state.setBrushWidth,
    };

    this.setState((prevState) => ({
      drawings: [...prevState.drawings, drawing ],
    }));

    if (this.ctx) {
      this.ctx.fillStyle = this.state.setBrushColor;
      this.ctx.strokeStyle = this.state.setBrushColor;
      this.ctx.lineWidth = this.state.setBrushWidth;

      this.ctx.beginPath();
      switch (shape) {
        case "Circle":
          const radius = Math.sqrt(width * width + height * height); // Dynamic radius
          this.ctx.beginPath();
          this.ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
          this.ctx.fill();
          this.ctx.stroke();
          break;
        case "Rectangle":
          this.ctx.beginPath();
          this.ctx.rect(startX, startY, width, height);
          this.ctx.fill();
          this.ctx.stroke();
          break;
        case "Triangle":
          this.ctx.beginPath();
          this.ctx.moveTo(startX, startY);
          this.ctx.lineTo(endX, endY);
          this.ctx.lineTo(startX - width, endY);
          this.ctx.closePath();
          this.ctx.fill();
          this.ctx.stroke();
          break;
        case "Square":
          const sideLength = Math.min(Math.abs(width), Math.abs(height)); // Ensure square dimensions
          this.ctx.beginPath();
          this.ctx.rect(
            startX,
            startY,
            sideLength * Math.sign(width),
            sideLength * Math.sign(height)
          );
          this.ctx.fill();
          this.ctx.stroke();
          break;
        default:
          break;
      }}
    };
  

  handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (this.ctx) {
      this.ctx.globalCompositeOperation = this.state.isErasing
        ? "destination-out"
        : "source-over";
    }
    this.setState({ isDrawing: true });
    this.startX = offsetX;
    this.startY = offsetY;
    this.savedImageData = this.ctx?.getImageData(
      0,
      0,
      this.canvasRef.current.width,
      this.canvasRef.current.height
    );
  };

  handleMouseUp = (e) => {
    if (this.state.isDrawing) {
      const { offsetX, offsetY } = e.nativeEvent;
      if (this.state.selectedShape) {
        this.drawShape(
          this.state.selectedShape,
          this.startX,
          this.startY,
          offsetX,
          offsetY
        );
      } else {
        const drawing = {
          type: 'freehand',
          path: this.ctx?.getImageData(
            0,
            0,
            this.canvasRef.current.width,
            this.canvasRef.current.height
          ),
          brushColor: this.state.setBrushColor,
          brushWidth: this.state.setBrushWidth,
        };
        this.setState((prevState) => ({
          drawings: [...prevState.drawings, drawing],
        }));
      }
      this.setState({ isDrawing: false });
    }
  };

  handleMouseMove = (e) => {
    if (!this.state.isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const startX = this.startX || offsetX;
    const startY = this.startY || offsetY;
    const endX = offsetX;
    const endY = offsetY;

    this.ctx.globalCompositeOperation = this.state.isErasing
      ? "destination-out"
      : "source-over";
    this.updateBrushSettings();

    if (this.state.selectedShape) {
      this.ctx.putImageData(this.savedImageData, 0, 0);
      this.drawShape(this.state.selectedShape, startX, startY, offsetX, offsetY);
    } else {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(offsetX, offsetY);
      this.ctx.stroke();
      this.startX = offsetX;
      this.startY = offsetY;
      this.setState((prevState) => ({
        drawings: [
          ...prevState.drawings,
          { shape: "Line", startX, startY, endX, endY },
        ],
      }));
    }
  };


  handleShapeChange = (shape) => this.setState({ selectedShape: shape });
  handleEraserClick = () => this.setState({ isErasing: true, selectedShape: "" });
  handleBrushClick = () => this.setState({ isErasing: false, selectedShape: "" });

  handleMotionTypeChange = (event) => {
    const motionType = event.target.value;
    this.setState({ motionType, playAnimation: false });
  };

  handleRotateChange = (event) => {
    this.setState({ rotate: parseInt(event.target.value), playAnimation: false });
  };

  handleXChange = (event) => {
    this.setState({ x: parseInt(event.target.value), playAnimation: false });
  };

  handleYChange = (event) => {
    this.setState({ y: parseInt(event.target.value), playAnimation: false });
  };

  handleSpeedChange = (event) => {
    this.setState({ speed: parseFloat(event.target.value), playAnimation: false });
  };

  handlePlayAnimation = () => {
    this.setState({ playAnimation: true });
  };

  render() {
    const {drawPage,setBrushColor,setBrushWidth,setEraserWidth,motionType,rotate,x,y,speed, playAnimation,drawings, } = this.state;
    const animationProps = playAnimation ? motionType === "ROTATE" ? { rotate: `${rotate}deg` } : { x, y } : {};
    
    return (
      <div>
      <canvas
      ref={this.canvasRef}
      width={900}
      height={470}
      onMouseDown={this.handleMouseDown}
      onMouseUp={this.handleMouseUp}
      onMouseMove={this.handleMouseMove}
      style={{ border: '1px solid #000' }}
    />
  {this.state.drawings.map((drawing, index) => (
  <motion.div
    key={index}
    initial={this.state.motionType === 'ROTATE' ? { rotate: 0 } : { x: 0, y: 0 }}
    animate={this.state.playAnimation ? animationProps : {}}
    transition={{ duration: this.state.speed }}
    style={{
      position: 'absolute',
      left: drawing.startX,
      top: drawing.startY,
      width: drawing.width,
      height: drawing.height,
      borderRadius: drawing.shape === 'Circle' ? '50%' : 0,
      backgroundColor: drawing.brushColor,
      border: `${drawing.brushWidth}px solid ${drawing.brushColor}`,
    }}
  />
))}

          
        <div className="warrpall">
          <label className="select">
            Motion:
            <select value={motionType} onChange={this.handleMotionTypeChange}>
              <option value="ROTATE">Rotate</option>
              <option value="LINEAR">Linear Motion</option>
            </select>
          </label>

          {motionType === "ROTATE" && (
            <div>
              <label htmlFor="input_rotate"> Rotate:
                <input
                  type="number"
                  value={rotate}
                  onChange={this.handleRotateChange}
                  min={-360}
                  max={360}
                />
              </label>
              <label htmlFor="input_speed"> Speed (seconds):
                <input
                  type="number"
                  value={speed}
                  onChange={this.handleSpeedChange}
                  step="0.1"
                  min="0.1"
                />
              </label>
            </div>
          )}

          {motionType === "LINEAR" && (
            <div>
              <label>
                X:
                <input type="number" value={x} onChange={this.handleXChange} />
              </label>
              <label>
                Y:
                <input type="number" value={y} onChange={this.handleYChange} />
              </label>
              <label>
                Speed (seconds):
                <input
                  type="number"
                  value={speed}
                  onChange={this.handleSpeedChange}
                  step="0.1"
                  min="0.1"
                />
              </label>
            </div>
          )}

          <button onClick={this.handlePlayAnimation}>Play Animation</button>
        </div>
        
        {drawPage.map((Dr) => (
          <div key={Dr.inputID} className="btn3">
            <ul>
              <li><button className={Dr.inputCssClass}>{Dr.inputTitle}</button></li>
            </ul>
          </div>
        ))}

        <div className="dropdown">
          <input type="checkbox" id="toggleBrush" />
          <label htmlFor="toggleBrush" onClick={this.handleBrushClick}>
            <img id="brush" src="https://img.icons8.com/?size=100&id=13437&format=png&color=000000" alt="" />
          </label>
          <div className="content">
            <label htmlFor="brushColor">Brush Color:</label>
            <input id="brushColor" type="color" value={setBrushColor} onChange={(e) => this.setState({ setBrushColor: e.target.value })} />
            <label htmlFor="brushWidth">Brush Width:</label>
            <input id="brushWidth" type="range" min="1" max="100" value={setBrushWidth} onChange={(e) => this.setState({ setBrushWidth: e.target.value })} />
          </div>
        </div>

        <div className="eraser-dropdown">
          <input type="checkbox" id="toeraser" />
          <label htmlFor="toeraser" id="eraser" onClick={this.handleEraserClick}>
            <img id="eraser" src="https://img.icons8.com/?size=100&id=46514&format=png&color=000000" alt="" />
          </label>
          <div className="dropdown-content">
            <label htmlFor="eraserWidth">Eraser Width:</label>
            <input id="eraserWidth" type="range" min="1" max="100" value={setEraserWidth} onChange={(e) => this.setState({ setEraserWidth: e.target.value })} />
          </div>
        </div>

        <div className="dropdown-container">
          <input type="checkbox" id="toggleShapes" />
          <label htmlFor="toggleShapes">
            <img id="shapes" src="https://img.icons8.com/?size=100&id=dN8m9joMwymk&format=png&color=000000" alt="Shapes" />
          </label>
          <ul className="theShapes">
            {["Circle", "Rectangle", "Triangle", "Square"].map(shape => (
              <li key={shape} onClick={() => this.handleShapeChange(shape)}>{shape}</li>
            ))}
          </ul>
        </div>

        <div>
          <img id="colors" src="https://img.icons8.com/?size=100&id=63814&format=png&color=000000" alt="" />
          <img id="ai" src="https://img.icons8.com/?size=100&id=45060&format=png&color=000000" alt="" />
          <img id="featture" src="https://img.icons8.com/?size=100&id=xsmDI5Qkj3wH&format=png&color=000000" alt="" />
        </div>

        <div>
          <img id="next" src="https://img.icons8.com/?size=100&id=7404&format=png&color=FFFFFF" alt="" />
          <img id="back" src="https://img.icons8.com/?size=100&id=7404&format=png&color=FFFFFF" alt="" />
        </div>

        <div id="folder">
          <FontAwesomeIcon icon={faFolder} size="2xl" style={{ color: "#FFD43B" }} />
          <br />
          folder1
        </div>
      </div>
    );
  }
}
