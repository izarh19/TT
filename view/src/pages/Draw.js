import React, { Component } from "react";
import "../pagescss/Draw.css";
import anime from "animejs";
import FireBase from "./firebase";
import Download from "./Download";

export default class Draw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawPage: [],
      setBrushColor: "black",
      setBrushWidth: 5, // Brush width state
      selectedShape: null, // Default to null for freehand drawing
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
      imageUrls: [],
      videoUrls: [],
      isMotionApplied: false,
      isRecording: false,
      chunks: [],
    };
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    fetch("http://localhost:3001/inputs/3")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ drawPage: data });
        this.ctx = this.canvasRef.current.getContext("2d");
        this.ctx.fillStyle = "#fff";
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = this.state.setBrushColor;
        this.ctx.lineWidth = this.state.setBrushWidth;

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
      startX: initialPosition.x,
      startY: initialPosition.y,
    });

    // Save current canvas state for shape drawing
    this.savedImageData = this.ctx.getImageData(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
  };

  handleMouseUp = () => {
    if (this.state.isDrawing) {
      this.setState((prevState) => ({
        isDrawing: false,
        drawings: [...prevState.drawings, prevState.currentDrawing],
        currentDrawing: null,
      }));
      this.ctx.beginPath(); // Resets the path for freehand drawing
    }
  };

  handleMouseMove = (e) => {
    if (!this.state.isDrawing) return;

    const { clientX, clientY } = e;
    const rect = this.canvasRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    const { setBrushColor, setBrushWidth, selectedShape, startX, startY } = this.state;

    this.ctx.strokeStyle = setBrushColor;
    this.ctx.lineWidth = setBrushWidth;
    this.ctx.lineJoin = "round"; // Join lines with rounded edges
    this.ctx.lineCap = "round"; // End lines with rounded edges

    if (selectedShape) {
        this.ctx.putImageData(this.savedImageData, 0, 0);
        this.drawShape(selectedShape, startX, startY, offsetX, offsetY);
    } else {
        const midX = (startX + offsetX) / 2;
        const midY = (startY + offsetY) / 2;

        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.quadraticCurveTo(startX, startY, midX, midY); // Draw a smooth curve to the midpoint
        this.ctx.lineTo(offsetX, offsetY);
        this.ctx.stroke();
        this.ctx.closePath();

        // Update startX and startY for the next segment of the line
        this.setState({
            startX: offsetX,
            startY: offsetY,
        });
    }
};


  drawShape = (shape, startX, startY, offsetX, offsetY) => {
    const width = offsetX - startX;
    const height = offsetY - startY;

    this.ctx.fillStyle = this.state.setBrushColor; // Set the fill style before filling the shape

    switch (shape) {
        case "Rectangle":
            this.ctx.strokeRect(startX, startY, width, height);
            this.ctx.fillRect(startX, startY, width, height); // Fill the rectangle
            break;
        case "Square":
            const side = Math.min(Math.abs(width), Math.abs(height));
            this.ctx.strokeRect(startX, startY, side * Math.sign(width), side * Math.sign(height));
            this.ctx.fillRect(startX, startY, side * Math.sign(width), side * Math.sign(height)); // Fill the square
            break;
        case "Circle":
            const radius = Math.sqrt(width * width + height * height) / 2;
            this.ctx.beginPath();
            this.ctx.arc(startX + width / 2, startY + height / 2, radius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.fill(); // Fill the circle
            break;
        case "Triangle":
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY + height);
            this.ctx.lineTo(startX + width / 2, startY);
            this.ctx.lineTo(startX + width, startY + height);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.fill(); // Fill the triangle
            break;
        default:
            break;
    }
};


  handlePlayAnimation = () => {
    const { motionType, rotate, x, y, speed, drawings } = this.state;

    if (drawings.length > 0) {
      this.setState({ isMotionApplied: true });

      const canvasStream = this.canvasRef.current.captureStream();
      this.mediaRecorder = new MediaRecorder(canvasStream, { mimeType: "video/webm" });
      this.chunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        const videoBlob = new Blob(this.chunks, { type: "video/webm" });
        const videoFile = new File([videoBlob], "canvas-animation.webm", { type: "video/webm" });

        const thumbnailFile = await this.generateThumbnail(videoBlob);
        const videoURL = await this.uploadFiles(thumbnailFile, videoFile);

        this.setState((prevState) => ({
          videoUrls: [...prevState.videoUrls, videoURL],
        }));
      };

      this.mediaRecorder.start();
      this.setState({ isRecording: true });

      anime({
        targets: drawings,
        duration: speed * 1000,
        easing: "linear",
        update: (anim) => {
          const updatedDrawings = drawings.map((drawing) => {
            const newDrawing = { ...drawing };

            if (motionType === "ROTATE") {
              newDrawing.angle = (rotate * Math.PI) / 180 * (anim.progress / 100);
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
        complete: () => {
          console.log('Animation complete.');
          // Don't stop recording here; let the user manually save it.
        },
      });
    }
  };

  generateThumbnail = (videoBlob) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(videoBlob);

      video.addEventListener("loadeddata", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => resolve(new File([blob], "thumbnail.png", { type: "image/png" })));
      });
    });
  };

  uploadFiles = async (thumbnailFile, videoFile) => {
    const firebase = new FireBase();

    const thumbnailURL = await firebase.uploadImage(thumbnailFile);
    const videoURL = await firebase.uploadImage(videoFile);

    return videoURL;
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

  handleBrushClick = () => {
    this.setState({ selectedShape: null }); // Reset selectedShape to null for freehand drawing
  };

  render() {
    const { drawPage, motionType, rotate, x, y, speed, imageUrls, videoUrls, setBrushColor, setBrushWidth, setEraserWidth } = this.state;

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

        {drawPage.map((Dr) => (
          <div key={Dr.inputID} className="btn3" >
            <ul>
              <li>
                <button 
                  onClick={() => this.handleButtonClick(Dr.inputID)} 
                  className={Dr.inputCssClass}
                >
                  {Dr.inputTitle}
                </button>
              </li>
            </ul>
            {Dr.inputID === 12 && (
              <div className="bt3_save">
                <div className="uploaded-files-container" style={{ display: 'flex', gap: '10px'}}>
                  {imageUrls.map((url, index) => (
                    <img 
                      key={index}
                      src={url} 
                      alt={`Saved drawing ${index + 1}`} 
                      style={{ width: "134px", height: "68px", cursor: "pointer", backgroundColor: "white"}}
                    />
                  ))}
                  {videoUrls.map((url, index) => (
                    <video 
                      key={index} 
                      alt={`Saved video ${index + 1}`}
                      style={{ width: "134px", height: "68px", backgroundColor: "white" }} 
                      controls muted
                    >
                      <source src={url} type="video/webm" />
                    </video>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="dropdown">
          <input type="checkbox" id="toggleBrush" />
          <label htmlFor="toggleBrush" onClick={this.handleBrushClick}>
            <img id="brush" src="https://img.icons8.com/?size=100&id=13437&format=png&color=000000" alt="Brush Icon" />
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
            <img id="eraser" src="https://img.icons8.com/?size=100&id=46514&format=png&color=000000" alt="Eraser Icon" />
          </label>
          <div className="dropdown-content">
            <label htmlFor="eraserWidth">Eraser Width:</label>
            <input id="eraserWidth" type="range" min="1" max="100" value={this.state.setEraserWidth} onChange={(e) => this.setState({ setEraserWidth: e.target.value })} />
          </div>
        </div>

        <div className="dropdown-container">
          <input type="checkbox" id="toggleShapes" />
          <label htmlFor="toggleShapes">
            <img id="shapes" src="https://img.icons8.com/?size=100&id=dN8m9joMwymk&format=png&color=000000" alt="Shapes Icon" />
          </label>
          <ul className="theShapes">
            {["Circle", "Rectangle", "Triangle", "Square"].map((shape) => (
              <li key={shape} onClick={() => this.handleShapeChange(shape)}>{shape}</li>
            ))}
          </ul>
        </div>

        <div>
          <img id="colors" src="https://img.icons8.com/?size=100&id=63814&format=png&color=000000" alt="Colors Icon" />
          <img id="ai" src="https://img.icons8.com/?size=100&id=45060&format=png&color=000000" alt="AI Icon" />
          <img id="featture" src="https://img.icons8.com/?size=100&id=xsmDI5Qkj3wH&format=png&color=000000" alt="Feature Icon" />
        </div>

        <div>
          <img id="next" src="https://img.icons8.com/?size=100&id=7404&format=png&color=FFFFFF" alt="Next Icon" />
          <img id="back" src="https://img.icons8.com/?size=100&id=7404&format=png&color=FFFFFF" alt="Back Icon" />
        </div>
      </div>
    );
  }
}
