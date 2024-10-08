import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import computersp from "../Img/computerremove.png";
import "../pagescss/Signup.css";
import Header from "../Compheader/Header";
import Footer from "../Compfooter/Footer";

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signupPage: [],
      name: "",
      password: "",
      gmail: "",
      issignup: false,
      error: "",
    };
  }

  componentDidMount() {
    // Fetching signup page data
    fetch("http://localhost:3001/inputs/2")
      .then((response) => response.json())
      .then((data) => this.setState({ signupPage: data }))
      .catch((error) => console.error("Error fetching signup page data:", error));
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { name, password, gmail } = this.state;
    const gmailValidation = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    const passwordValidation = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/);

    let errorMessage = "";

    // Validate email
    if (!gmailValidation.test(gmail)) {
      errorMessage = "Please enter a valid email address.";
    }

    // Validate password
    if (!passwordValidation.test(password)) {
     errorMessage = "Password must be at least 8 characters long,\n" +
      "contain one uppercase letter,\n" +
      "one lowercase letter,\n" +
      "and one digit.";
    
    }
  

    // If there's an error, display it and stop form submission
    if (errorMessage) {
      this.setState({ error: errorMessage });
      return;
    }

    // If validation passes, proceed with signup request
    fetch("http://localhost:3001/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: name,
        userPassword: password,
        userGmail: gmail,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ issignup: true });
        // Redirect to Draw page after successful signup
        window.location.href = "/Draw";
      })
      .catch((error) => {
        console.error("Error signing up:", error);
        this.setState({ error: "An error occurred while signing up" });
      });
  };

  render() {
    const { signupPage, error } = this.state;

    return (
      <div>
        <Header />

        <h1>Sign Up</h1>
        <p id="sentience">Create a Story Sketch account</p>
        <div id="thebigwarp"></div>

        <div className="evet">
          {signupPage.map((sp) => (
            <div key={sp.inputID} className="warpper1">
              <div className="formsup">
                <input
                  type={sp.inputType}
                  name={
                    sp.inputType === "text"
                      ? "name"
                      : sp.inputType === "password"
                      ? "password"
                      : "gmail"
                  }
                  placeholder={sp.placeholder}
                  onChange={this.handleInputChange}
                  id="spinput"
                ></input>
              </div>
            </div>
          ))}
         {error && (
  <div className="error-message">
    {error}
  </div>
)}

        </div>

        <div id="iconUsp">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <div id="iconKsp">
          <FontAwesomeIcon icon={faKey} />
        </div>
        <div id="iconEsp">
          <FontAwesomeIcon icon={faEnvelope} />
        </div>

        {/* Signup button */}
        <button id="btn1" onClick={this.handleSubmit}>
          Sign Up
        </button>

        {/* Link to login page */}
        <a href="/Login" id="lnINsp">
          Log In
        </a>

        <Footer />
      </div>
    );
  }
}
