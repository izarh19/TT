import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import computersp from "../Img/computerremove.png";
import Login from "./Login";
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
    };
  }
  componentDidMount() {
    fetch("http://localhost:3001/inputs/2")
      .then((response) => response.json())
      .then((data) => this.setState({ signupPage: data }))
      .catch((error) =>
        console.error("Error fetching header page data:", error)
      );
  }
  handleInputChange = (event) => {
    const { name, value } = event.target; //refers to the input field that triggered the change event.
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault(); // prevent the default form submission behavior
    const name = this.state.name;
    const password = this.state.password;
    const gmail = this.state.gmail;
    const gmail_validation = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    const pass_vali = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/);
    let errorMessage = "";

    if (!gmail_validation.test(gmail)) {
      errorMessage = "Please enter a valid email address";
    }

    if (!pass_vali.test(password)) {
      errorMessage = [
        "Please enter a valid password address that includes: minimum 8 characters ",
        "At least one uppercase English letter",
        "At least one lowercase English letter.",
        "At least one digit",
      ];
      return;
    }

    if (gmail === null || gmail === undefined) {
      console.log("the gmail is null");
      return;
    }
    if (errorMessage) {
      this.setState({ error: errorMessage });
    }

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
      })
      .catch((error) => {
        console.error("Error signing up:", error);
        this.setState({ error: "An error occurred while signing up" });
      });
  };

  render() {
    const { signupPage } = this.state;
    const errorMessage = this.state.error;

    return (
      <div>
        <Header />

        <h1>sign up </h1>
        <p id="sentience">Create Story Sketch account </p>
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
              {errorMessage && sp.inputType === "password" && (
                <div style={{ color: "red" }}>{errorMessage}</div>
              )}
              {errorMessage && sp.inputType === "email" && (
                <div style={{ color: "red" }}>{errorMessage}</div>
              )}
            </div>
          ))}
        </div>
        <div id="iconUsp">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <div id="iconKsp">
          {" "}
          <FontAwesomeIcon icon={faKey} />
        </div>
        <div id="iconEsp">
          <FontAwesomeIcon icon={faEnvelope} />
        </div>

        <a href="/Draw">
          <button id="btn1" onClick={this.handleSubmit}>
            sign up{" "}
          </button>
        </a>
        <a href="/Login" id="lnINsp">
          {" "}
          log in{" "}
        </a>

        <Footer></Footer>
      </div>
    );
  }
}
