import React, { Component } from "react";
import "../pagescss/Draw.css";
import anime from "animejs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

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
      x: 0,
      y: 0,
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

    this.setState({
      isDrawing: true,
      initialMousePosition: initialPosition,
      currentDrawing: this.createDrawing(initialPosition.x, initialPosition.y, initialPosition.x, initialPosition.y),
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

      const updatedDrawing = this.createDrawing(
        this.state.initialMousePosition.x,
        this.state.initialMousePosition.y,
        mouseX,
        mouseY
      );

      this.renderAllDrawings([...this.state.drawings, updatedDrawing]);
      this.setState({ currentDrawing: updatedDrawing });
    }
  };

  createDrawing = (startX, startY, currentX, currentY) => {
    const width = currentX - startX;
    const height = currentY - startY;
    const flipVertically = currentY < startY;

    return {
      type: this.state.selectedShape,
      startX: startX,
      startY: startY,
      width: width,
      height: height,
      color: this.state.setBrushColor,
      flipVertically: flipVertically,
      angle: 0, // Ensure the angle starts at 0
    };
  };

  renderAllDrawings = (drawings) => {
    this.ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);

    drawings.forEach((drawing) => {
      this.renderDrawing(drawing);
    });
  };

  renderDrawing = (drawing) => {
    const { startX, startY, width, height, color, type, flipVertically, angle } = drawing;
    const ctx = this.ctx;

    ctx.save();

    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    // Rotate the canvas if needed
    if (type === "Triangle" || type === "Rectangle" || type === "Square") {
      ctx.translate(startX + width / 2, startY + height / 2);
      ctx.rotate(angle);
      ctx.translate(-(startX + width / 2), -(startY + height / 2));
    }

    switch (type) {
      case "Circle":
        const radius = Math.sqrt(width * width + height * height) / 2;
        ctx.beginPath();
        ctx.arc(startX + width / 2, startY + height / 2, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        break;

      case "Rectangle":
        ctx.beginPath();
        ctx.rect(startX, startY, width, height);
        ctx.fill();
        ctx.stroke();
        break;

      case "Square":
        ctx.beginPath();
        const side = Math.min(Math.abs(width), Math.abs(height));
        ctx.rect(startX, startY, width < 0 ? -side : side, height < 0 ? -side : side);
        ctx.fill();
        ctx.stroke();
        break;

      case "Triangle":
        ctx.beginPath();
        if (flipVertically) {
          ctx.moveTo(startX + width / 2, startY);
          ctx.lineTo(startX, startY + height);
          ctx.lineTo(startX + width, startY + height);
        } else {
          ctx.moveTo(startX, startY + height);
          ctx.lineTo(startX + width / 2, startY);
          ctx.lineTo(startX + width, startY + height);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      default:
        break;
    }

    ctx.restore();
  };

  handlePlayAnimation = () => {
    const { motionType, rotate, x, y, speed, drawings } = this.state;

    if (drawings.length > 0) {
      anime({
        targets: drawings,
        duration: speed * 1000,
        easing: "linear",
        update: (anim) => {
          const updatedDrawings = drawings.map((drawing) => {
            const newDrawing = { ...drawing };

            if (motionType === "ROTATE") {
              newDrawing.angle = (rotate * Math.PI / 180) * (anim.progress / 100);
            } else if (motionType === "LINEAR") {
              newDrawing.startX += (x * anim.progress) / 100;
              newDrawing.startY += (y * anim.progress) / 100;
            }

            return newDrawing;
          });

          this.setState({ drawings: updatedDrawings }, () => {
            this.renderAllDrawings(updatedDrawings);
          });
        },
      });
    }
  };

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

  handleShapeChange = (shape) => {
    this.setState({ selectedShape: shape });
  };


  render() {
    const { drawPage, motionType, rotate, x, y, speed } = this.state;

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
              <label htmlFor="input_rotate">Rotate:
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
              <label>X:
                <input type="number" value={x} onChange={this.handleXChange} />
              </label>
              <label>Y:
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
          {this.state.drawings.map((drawing, index) => (
            <React.Fragment key={index}>{this.renderDrawing(drawing)}</React.Fragment>
          ))}
          {this.state.currentDrawing && this.renderDrawing(this.state.currentDrawing)}
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
            <input id="brushColor" type="color" value={this.state.setBrushColor} onChange={(e) => this.setState({ setBrushColor: e.target.value })} />
            <label htmlFor="brushWidth">Brush Width:</label>
            <input id="brushWidth" type="range" min="1" max="100" value={this.state.setBrushWidth} onChange={(e) => this.setState({ setBrushWidth: e.target.value })} />
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
          <FontAwesomeIcon icon={faFolder} size="2xl" style={{ color: "#FFD43B" }} />
          <br />
          folder1
        </div>
      </div>
    );
  }
}
