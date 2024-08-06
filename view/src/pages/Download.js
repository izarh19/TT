import React, { Component } from "react";
import "../pagescss/Download.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Download extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DownloadPage: [],
      animationBlob: null
    };
  }

  componentDidMount() {
    fetch("http://localhost:3001/inputs/6")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ DownloadPage: data });
        // Call createAnimationBlob function when animation data is available
        this.createAnimationBlob(data);//Calling the createAnimationBlob function and passing the fetched data as an argument.
      })
      .catch((error) =>
        console.error("Error fetching header page data:", error)
      );
  }

  createAnimationBlob = (animationData) => {
    try {
      const gifBlob = new Blob([animationData], { type: 'video/mp4' });
      console.log("Blob created:", gifBlob);
      this.setState({ animationBlob: gifBlob });
    } catch (error) {
      console.error("Error creating blob:", error);
    }
  }

  handleDownloadClick = () => {
    try {
      if (this.state.animationBlob) {
        const url = URL.createObjectURL(this.state.animationBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'animation.mp4';
        a.click();
        URL.revokeObjectURL(url);
        console.log("File downloaded successfully!");
      } else {
        console.error("No animation blob available for download.");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }

  render() {
    const { DownloadPage } = this.state;

    return (
      <div>
        <div id="corner"></div>
        <div id="ani_box"></div>

        {DownloadPage.map((dl) =>
          <div key={dl.inputID}>
            <ul className="white_butt">
              <li>
                <button type={dl.inputType} id={dl.inputCssClas}> {dl.placeholder}</button>
              </li>
            </ul>
          </div>
        )}

        <div className="social">
          <p>you can share it on :</p>
          <ul>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
            />
            <li>
              <a className="fa fa-facebook"></a>
            </li>
            <li>
              <a className="fa fa-twitter"></a>
            </li>
            <li>
              <a className="fa fa-user"></a>
            </li>
            <li>
              <a className="fa fa-instagram"></a>
            </li>
            <li>
              <a className="fa fa-youtube"></a>
            </li>
          </ul>
        </div>

        <div id="download">
          <p>or download it by clicking here</p>
          <button onClick={this.handleDownloadClick}>download</button>
        </div>
        <div id="black"> </div>

        <div id="theblack"></div>
      </div>
    )
  }
}