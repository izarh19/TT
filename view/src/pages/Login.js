import React, { Component } from "react";
import Draw from "../pages/Draw";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import tool from "../Img/toolsremove.png";
import ch from "../Img/mouse-removebg-preview (1).png";
import "../pagescss/Login.css";
import Header from "../Compheader/Header";
import Footer from "../Compfooter/Footer";
import GoogleLogin from "react-google-login";
import { gapi } from "gapi-script";


export default class Login extends Component {
  constructor(props) {
    /* takes the props from the father constractor (componet) */
    super(props); /* calls the father constractor */
    this.state = {
      /* defines empty array that i will put the data from the json in it */
      loginPage: [],
      name: "",
      password: "",
      isLogin: false,
      gmail: "",
      error: "",
      loading: true,
    };

    this.client_id =
      "879215836200-aq3vqd98ocq3ea7emuousrd3an18e9go.apps.googleusercontent.com";
  }
  
  componentDidMount() {
    // Fetch the login page data from your backend
    fetch("http://localhost:3001/inputs/1")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          loginPage: data,
          loading: false,  // Turn off loading after data is loaded
        });
      })
      .catch((error) => {
        console.error("Error fetching login page data:", error);
        this.setState({ error: "Failed to load login page data", loading: false });
      });

    // Google Auth setup
    gapi.load("client:auth2", () => {
      if (!gapi.auth2.getAuthInstance()) {
        gapi.auth2.init({
          clientId: this.client_id,
          scope: "profile email",
        }).then(() => {
          console.log("Google client initialized");
        }).catch((error) => {
          console.error("Error initializing Google client:", error);
        });
      }
    });
  }

  // Handle input change for traditional login
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  // Handle traditional login (username and password)
  handleSubmit = (event) => {
    event.preventDefault();  // Prevent form submission
    const { name, password } = this.state;

    // Fetch API call to traditional login route
    fetch("http://localhost:3001/user/login")
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || "Login failed");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          this.setState({ isLogin: true, error: "" });
          window.location.href = "/Draw";  // Redirect on successful login
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  };

  // Handle Google login success
  onSuccess = (response) => {
    const profile = response.profileObj;
    const googleEmail = profile.email;

    // Fetch API call to Google login route
    fetch("http://localhost:3001/user/login-with-google")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.setState({ isLogin: true, error: "" });
          window.location.href = "/Draw";  // Redirect to the "Draw" page on successful login
        } else {
          this.setState({ error: data.message || "Login failed" });
        }
      })
      .catch((error) => {
        console.error("Error during Google login:", error);
        this.setState({ error: "An error occurred during Google login." });
      });
  };

  // Handle Google login failure
  onFailure = (response) => {
    console.log("Google login failed:", response);
    this.setState({ error: "Google login failed. Please try again." });
  };
  onLogoutSuccess = () => {
    console.log("Logout successful");
    this.setState({ isLogin: false });
    // Optionally, redirect to the login page or perform other actions
  };
  
  render() {
    const { loginPage, error, loading ,isLogin,GoogleLogout } = this.state;
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <Header />
        <div id="login-buttons">
        
        {!isLogin ? (
          // Show Google Login button if not logged in
          <GoogleLogin
            clientId={this.client_id}
            buttonText="Log in with Google"
            onSuccess={this.onSuccess}
            onFailure={this.onFailure}
            cookiePolicy={"single_host_origin"}
          />
        ) : (
          // Show Google Logout button if logged in
          <GoogleLogout
            clientId={this.client_id}
            buttonText="Log out"
            onLogoutSuccess={this.onLogoutSuccess}
          />
        )}

        </div>
        <h1 id="login">Log in</h1>
        <img src={tool} alt="" id="tool" />
        <img src={ch} alt="" id="mouse" />
        <div className="coloful"></div>
        <div className="warrper2">
          {loginPage.map((ln) =>
            ln.inputID === 3 ? (
              <div key={ln.inputID}>
                <a type={ln.inputType} className="googlebtn">
                  {ln.placeholder}
                </a>
                <p className="textor">{ln.inputText}</p>
              </div>
            ) : (
              <div key={ln.inputID} className="lninputs">
                <input
                  type={ln.inputType}
                  placeholder={ln.placeholder}
                  className="lnstyle"
                  name={ln.inputType === "text" ? "name" : "password"}
                  onChange={this.handleInputChange}
                />
              </div>
            )
          )}
        </div>
  
       
        {error && (
  <div className="error-message fade-out">
    {error}
  </div>
)}
  
        <button className="btn2" type="submit" onClick={this.handleSubmit}>
          Log in
        </button>
  
        <div id="iconK">
          <FontAwesomeIcon icon={faKey} />
        </div>
        <div id="iconU">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <div id="iconG">
          <FontAwesomeIcon icon={faGoogle} />
        </div>
        <p id="spINln">
          Don’t have an account?{" "}
          <b>
            <a href="/Signup" id="sp">
              Sign up
            </a>
          </b>
        </p>
        <Footer />
      </div>
    );
  }
}  