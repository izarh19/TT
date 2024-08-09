import React, { Component } from "react";
import "../pagescss/Draw.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

export default class Draw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawPage: [],
      setBrushColor: "black",
      selectedShape: "Rectangle",
      drawings: [],
      isDrawing: false,
      motionType: "ROTATE",
      rotate: 0,
      x: 100,
      y: 100,
      speed: 1,
      playAnimation: false,
      currentDrawing: null,
      initialMousePosition: { x: 0, y: 0 },
    };
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    fetch("http://localhost:3001/inputs/3")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ drawPage: data });
        this.ctx = this.canvasRef.current.getContext("2d");
        this.ctx.fillStyle = this.state.setBrushColor;
        this.ctx.lineCap = "round";
      })
      .catch((error) => console.error("Error fetching header page data:", error));
  }

  handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    const rect = e.target.getBoundingClientRect();
    const initialPosition = { x: clientX - rect.left, y: clientY - rect.top };
    const newDrawing = this.createDrawing(initialPosition.x, initialPosition.y, 0);

    this.setState({
      isDrawing: true,
      initialMousePosition: initialPosition,
      currentDrawing: newDrawing,
    });
  };

  handleMouseUp = () => {
    if (this.state.isDrawing) {
      this.setState((prevState) => ({
        isDrawing: false,
        drawings: [...prevState.drawings, prevState.currentDrawing],
        currentDrawing: null,
      }));
    }
  };

  handleMouseMove = (e) => {
    if (this.state.isDrawing) {
      const { clientX, clientY } = e;
      const rect = this.canvasRef.current.getBoundingClientRect();
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;
      const distance = this.calculateDistance(
        this.state.initialMousePosition.x,
        this.state.initialMousePosition.y,
        mouseX,
        mouseY
      );

      const updatedDrawing = this.createDrawing(
        this.state.initialMousePosition.x,
        this.state.initialMousePosition.y,
        distance
      );

      // Clear canvas and redraw
      this.ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
      this.renderDrawing(updatedDrawing);
      this.setState({ currentDrawing: updatedDrawing });
    }
  };

  calculateDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  createDrawing = (startX, startY, size) => {
    const canvasWidth = this.canvasRef.current.width;
    const canvasHeight = this.canvasRef.current.height;

    let adjustedSize = size;
    if (startX - adjustedSize / 2 < 0) {
      adjustedSize = startX * 2;
    }
    if (startY - adjustedSize / 2 < 0) {
      adjustedSize = startY * 2;
    }
    if (startX + adjustedSize / 2 > canvasWidth) {
      adjustedSize = (canvasWidth - startX) * 2;
    }
    if (startY + adjustedSize / 2 > canvasHeight) {
      adjustedSize = (canvasHeight - startY) * 2;
    }

    return {
      type: this.state.selectedShape,
      startX: Math.max(0, startX - adjustedSize / 2),
      startY: Math.max(0, startY - adjustedSize / 2),
      size: adjustedSize,
      color: this.state.setBrushColor,
    };
  };

  renderDrawing = (drawing) => {
    const { startX, startY, size, color, type } = drawing;
    const ctx = this.ctx;

    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    switch (type) {
      case "Circle":
        
        ctx.beginPath();
        ctx.arc(startX + size / 2, startY + size / 2, size / 2, 0, 2 * Math.PI);
        ctx.fill();
        break;

      case "Rectangle":
      case "Square":
        ctx.beginPath();
        ctx.rect(startX, startY, size, size);
        ctx.fill();
        break;

      case "Triangle":
        ctx.beginPath();
        ctx.moveTo(startX, startY + size);
        ctx.lineTo(startX + size / 2, startY);
        ctx.lineTo(startX + size, startY + size);
        ctx.closePath();
        ctx.fill();
        break;

      default:
        break;
    }
  };
  motion =(sha)=>{
    this.setState({drawing : <motion.div createDrawing></motion.div>})
  }

  handleMotionTypeChange = (event) => {
    this.setState({ motionType: event.target.value });
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

  handleShapeChange = (shape) => {
    this.setState({ selectedShape: shape });
  };

  render() {
    const { sha,drawPage, setBrushColor, motionType, rotate, x, y, speed, playAnimation, drawings, currentDrawing } = this.state;

    return (
      <div style={{ backgroundColor: "rgba(238, 238, 238, 1)", minHeight: "100vh", width: "100vw", overflow: "hidden" }}>
        <canvas
          ref={this.canvasRef}
          width={900}
          height={470}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
          style={{ border: "1px solid #000" }}
          motion={this.sha}
        />
        

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
              <label htmlFor="input_rotate">
                Rotate:
                <input
                  type="number"
                  value={rotate}
                  onChange={this.handleRotateChange}
                  min={-360}
                  max={360}
                  id="input_rotate"
                />
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

        <div>
          {drawings.map((drawing, index) => (
            <React.Fragment key={index}>{this.renderDrawing(drawing)}</React.Fragment>
          ))}
          {currentDrawing && this.renderDrawing(currentDrawing)}
        </div>

        {drawPage.map((Dr) => (
          <div key={Dr.inputID} className="btn3">
            <ul>
              <li>
                <button className={Dr.inputCssClass}>{Dr.inputTitle}</button>
              </li>
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
          </div>
        </div>

        <div className="eraser-dropdown">
          <input type="checkbox" id="toeraser" />
          <label htmlFor="toeraser" id="eraser" onClick={this.handleEraserClick}>
            <img id="eraser" src="https://img.icons8.com/?size=100&id=46514&format=png&color=000000" alt="" />
          </label>
          <div className="dropdown-content">
            <label htmlFor="eraserWidth">Eraser Width:</label>
            <input id="eraserWidth" type="range" min="1" max="100" value={this.state.setEraserWidth} onChange={(e) => this.setState({ setEraserWidth: e.target.value })} />
          </div>
        </div>

        <div className="dropdown-container">
          <input type="checkbox" id="toggleShapes" />
          <label htmlFor="toggleShapes">
            <img id="shapes" src="https://img.icons8.com/?size=100&id=dN8m9joMwymk&format=png&color=000000" alt="Shapes" />
          </label>
          <ul className="theShapes">
            {["Circle", "Rectangle", "Triangle", "Square"].map((shape) => (
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
        
          <br />
          folder1
        </div>
      </div>
    );
  }
}
