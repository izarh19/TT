/*import React, { Component } from "react";
import "../pagescss/Motion.css";
import { motion } from "framer-motion";
import Draw from "./Draw";

export default class MotionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      motionType: "ROTATE",
      rotate: 0,
      x: 0,
      y: 0,
      speed: 1,
      playAnimation: false,
    };
  }

  handleMotionTypeChange = (event) => {
    const motionType = event.target.value;
    const speed = this.state.speed;
    this.setState({ motionType, speed });
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
    const { motionType, rotate, x, y, speed, playAnimation } = this.state;

    return (
      <div className="warrpall">
        <motion.div
          style={{
            width: 150,
            height: 150,
            borderRadius: 30,
            backgroundColor: "black",
          }}
          animate={playAnimation ? (motionType === "ROTATE" ? { rotate: rotate + "deg" } : { x, y }) : {}}
          transition={{ duration: speed }}
        ></motion.div>

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
              <input type="number" value={rotate} onChange={this.handleRotateChange} min={-360} max={360} id="input_rotate" />
            </label>
            <label>
              Speed (seconds):
              <input
                type="number" value={speed} onChange={this.handleSpeedChange}
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
            <Draw
        motionType={motionType}
        rotate={rotate}
        x={x}
        y={y}
        speed={speed}
      />
          </div>
        )}
        <button onClick={this.handlePlayAnimation}>play animation</button>

      </div>
    );
  }
}*/
/*import React, { Component } from "react";

import { useAnimation } from "framer-motion";
import Draw from "./Draw";

export default class MotionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      motionType: "ROTATE",
      rotate: 0,
      x: 0,
      y: 0,
      speed: 1,
      playAnimation: false,
    };
    this.animation = useAnimation();
  }

  handleMotionTypeChange = (event) => {
    const motionType = event.target.value;
    const speed = this.state.speed;
    this.setState({ motionType, speed });
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
    this.animation.start({
      rotate: this.state.rotate + "deg",
      x: this.state.x,
      y: this.state.y,
      transition: { duration: this.state.speed },
    });
  };

  render() {
    const { motionType, rotate, x, y, speed, playAnimation } = this.state;

    return (
      <div className="warrpall">
        <div
          ref={this.animation}
          style={{
            width: 150,
            height: 150,
            borderRadius: 30,
            backgroundColor: "black",
          }}
        />

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
              <input type="number" value={rotate} onChange={this.handleRotateChange} min={-360} max={360} id="input_rotate" />
            </label>
            <label>
              Speed (seconds):
              <input
                type="number" value={speed} onChange={this.handleSpeedChange}
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
            <Draw
              motionType={motionType}
              rotate={rotate}
              x={x}
              y={y}
              speed={speed}
            />
          </div>
        )}
        <button onClick={this.handlePlayAnimation}>play animation</button>

      </div>
    );
  }
}*/