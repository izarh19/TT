import React, { Component } from "react";
import "../pagescss/Draw.css";
import anime from "animejs";
import FireBase from "./firebase";

export default class Draw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawPage: [],
      setBrushColor: "black",
      selectedShape: "Rectangle",
      setBrushWidth:"10",
      drawings: [],
      isDrawing: false,
      isErase:false,
      motionType: "ROTATE",
      rotate: 0,
      x: 0,
      y: 0,
      speed: 1,
      playAnimation: false,
      currentDrawing: null,
      imageUrls: [],
      videoUrls: [],
      isMotionApplied: false,
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
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = this.state.setBrushColor ? this.setBrushColor :this.setEraserColor ;
        this.ctx.lineWidth = this.state.setBrushWidth ? this.setBrushColor : this.setEraserWidth;

      })
      .catch((error) => console.error("Error fetching header page data:", error));
  }

  handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    this.startX = clientX;
    this.startY = clientY;
    this.ctx.beginPath();
    this.ctx.moveTo(clientX, clientY);
    this.setState({ isDrawing: true });
    const rect = e.target.getBoundingClientRect();
    const Position = { x: clientX - rect.left, y: clientY - rect.top };
  
    this.setState({
      isDrawing: true,
      initialMousePosition: Position,
    });
  };
  
  handleMouseUp = () => {
    if(this.state.isDrawing) {
      this.ctx.closePath();
      if (this.state.selectedShape) {
        this.setState((prevState) => ({
          isDrawing: false,
          isDraw: false,
          drawings: [...prevState.drawings, {
            type: this.state.selectedShape,
            startX: this.startX,
            startY: this.startY,
            width: this.endX - this.startX,
            height: this.endY - this.startY,
          }],
          currentDrawing: null,
        }));
      } else {
        this.setState((prevState) => ({
          isDrawing: false,
          isDraw: false,
          drawings: [...prevState.drawings, prevState.currentDrawing],
          currentDrawing: null,
        }));
      }
    }
    this.setState({ isErase: false, selectedShape: null });
  };

  handleMouseMove = (e) => {
    if (!this.state.isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
  
    this.ctx.globalCompositeOperation = this.state.isErase
     ? "destination-out"
      : "source-over";
    this.ctx.lineWidth = this.state.isErase
     ? this.state.setEraserWidth
      : this.state.setBrushWidth;
    this.ctx.strokeStyle = this.state.setBrushColor;
  
    if (this.state.selectedShape) {
      this.ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
      this.renderAllDrawings(this.state.drawings);
      const updatedDrawing = {
        type: this.state.selectedShape,
        startX: this.state.initialMousePosition.x,
        startY: this.state.initialMousePosition.y,
        width: offsetX - this.state.initialMousePosition.x,
        height: offsetY - this.state.initialMousePosition.y,
        color: this.state.setBrushColor,
      };
      this.renderDrawing(updatedDrawing);
    } else {
      if (this.startX && this.startY) {
        this.ctx.lineTo(offsetX, offsetY);
        this.ctx.stroke();
      }
      this.startX = offsetX;
      this.startY = offsetY;
    }
  };

  renderAllDrawings = (drawings) => {
    
    drawings.forEach((drawing) => {
      // Check if drawing is not null or undefined
      if (drawing) {
        this.renderDrawing(...drawing);
      }
    });
  };

  renderDrawing = (drawing) => {
    // Safely destructure properties, making sure drawing is valid
    if (!drawing) return;

  const { startX, startY, width, height, color, type, flipVertically, angle } = drawing;
  const ctx = this.ctx;

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  
    // Drawing logic for different shapes
    switch (type) {
      case "Circle":
        const radius = Math.sqrt(width * width + height * height) / 2;
        ctx.beginPath();
        ctx.arc(startX + width / 2, startY + height / 2, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        break;
  
      case "Rectangle":
      case "Square":
        ctx.beginPath();
        const side = type === "Square" ? Math.min(Math.abs(width), Math.abs(height)) : null;
        ctx.rect(startX, startY, type === "Square" ? (width < 0 ? -side : side) : width, type === "Square" ? (height < 0 ? -side : side) : height);
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

  handleButtonClick = async (inputID) => {
    console.log(`Button with inputID ${inputID} clicked`);
    const canvas = this.canvasRef.current;
    if (inputID === 9) {
      if (this.state.isMotionApplied ) {
        this.mediaRecorder.stop();
      } else {
        this.saveAsImage(canvas);
      }

      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.setState({ drawings: [], isMotionApplied: false });
    }
  };

  saveAsImage = (canvas) => {
    canvas.toBlob(async (blob) => {
      const file = new File([blob], "canvas-drawing.png", { type: "image/png" });
      const firebase = new FireBase();
      const downloadURL = await firebase.uploadImage(file);

      this.setState((prevState) => ({
        imageUrls: [...prevState.imageUrls, downloadURL],
      }));
    });
  };

  handlePlayAnimation = () => {
    const {drawings}=this.state;
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

        
        const videoURL = await this.uploadFiles( videoFile);

        this.setState((prevState) => ({
          videoUrls: [...prevState.videoUrls, videoURL],
        }));
      };

      this.mediaRecorder.start();
      this.animation();

    }
 }

 animation =()=>{
  const { motionType, rotate, x, y, speed, drawings } = this.state;
 anime({ 
  targets: drawings,
  duration: speed * 1000,
  easing: "Rotate",
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
  
})
}

  uploadFiles = async ( videoFile) => {
    const firebase = new FireBase();
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
    this.setState({ selectedShape: shape, isDrawing: false });
  };
  setBrushColor = (color) => {
    this.setState({ setBrushColor: color }, () => {
      console.log('Brush color changed to:', this.state.setBrushColor);
    });
  }

  setBrushWidth = (width) => {
    this.setState({ setBrushWidth: width }, () => {
      console.log('Brush width changed to:', this.state.setBrushWidth);
    });
  }
  setEraserWidth=(width)=>{
    this.setState({setEraserWidth:width},()=>
    console.log("erase :",this.state.setEraserWidth))
   
  }
  setEraserColor = (color) => {
    this.setState({ eraserColor: color }, () => {
      console.log('Eraser color changed to:', this.state.setEraserColor);
    });
  }
  startDrawing = () => {
    this.setState({ isErase: false, isDrawing: true });
  };

  startErasing = (er) => {
    const { offsetX, offsetY } = er.nativeEvent;
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX, offsetY);
    this.setState({ isErase: true, isDrawing: false });
  };

  Erasing = (er) => {
    if (!this.state.isErase && !this.state.isDrawing) return;
    const { offsetX, offsetY } = er.nativeEvent;
   this.ctx.strokeStyle = this.state.isErase ? this.state.setEraserColor: this.state.setBrushColor;
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillStyle = 'white';
    this.ctx.lineWidth = this.state.setEraserWidth;
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
  }
  
  
  endErasing = () => {
    this.setState({ isErase: false });
    this.ctx.closePath();
  }


  render() {
    const { drawPage, motionType, rotate, x, y, speed, imageUrls, videoUrls ,drawings} = this.state;

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
                <input type="number" value={rotate} onChange={this.handleRotateChange} min={-360} max={360} id="input_rotate"/>
              </label>
              <label>
                Speed (seconds):
                <input type="number" value={speed} onChange={this.handleSpeedChange} step="0.1" min="0.1" />
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
                <input  type="number"  value={speed} onChange={this.handleSpeedChange} step="0.1"  min="0.1"/>
              </label>
            </div>
          )}

          <button onClick={this.handlePlayAnimation}>Play Animation</button>
        </div>

        <div>
          {this.state.drawings.map((drawing, index) => (
            <div key={index}>{this.renderDrawing(drawing)}</div>
          ))}
          {this.state.currentDrawing && this.renderDrawing(this.state.currentDrawing)}
        </div>
        
        {drawPage.map((Dr) => (
          <div key={Dr.inputID} className="btn3">
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
                <div className="uploaded-files-container" style={{ display: 'flex', gap: '5px' }}>
                  {imageUrls.map((url, index) => (
                    <img 
                      key={index}
                      src={url} 
                      style={{ width: "134px", height: "68px", cursor: "pointer", backgroundColor: "white" }}
                    />
                  ))}
                  {videoUrls.map((url, index) => (
                    <video 
                      key={index} 
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
          <label htmlFor="toeraser" id="eraser"  onClick={(e) => this.startErasing(e)}>
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
            <li key={shape} onClick={(e) => this.handleShapeChange(shape)}>{shape}</li>
          ))}
        </ul>
        </div>

        <div>
          <img id="colors" src="https://img.icons8.com/?size=100&id=63814&format=png&color=000000" alt="Colors" />
          <img id="ai" src="https://img.icons8.com/?size=100&id=45060&format=png&color=000000" alt="AI" />
          <img id="featture" src="https://img.icons8.com/?size=100&id=xsmDI5Qkj3wH&format=png&color=000000" alt="Feature" />
        </div>
      </div>
    );
  }
}