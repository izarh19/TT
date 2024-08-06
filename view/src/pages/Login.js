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
    /*When a web page is loaded in a browser, the browser parses the HTml code and creates a tree-like structure where each HTml element becomes a node in the tree. */
    fetch("http://localhost:3001/inputs/1")
      .then((response) =>
        response.json()
      ) /*after you cheak if the id is there , return the response from type json */
      .then((data) => {
        this.setState({ loginPage: data, loading: false });
      }) /* return for me the data i want to get from the json in the empty array that i defined, update it by using setstate */
      .catch((error) =>
        console.error("Error fetching header page data:", error)
      ); /* if there is error with the fetch like network or sentax in the fetch return error */

    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          clientId: this.client_id,
          scope: "userGmail",
        })
        .then(() => {
          console.log("Google client initialized");
        })
        .catch((error) => {
          console.error("Error initializing Google client:", error);
        });
    });
  }

  handleInputChange = (event) => {
    const { name, password, value } = event.target;
    this.setState({ [name]: value, [password]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault(); // prevent the default form submission behavior
    const name = this.state.name;
    const password = this.state.password;
    fetch("http://localhost:3001/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ userName: name, userPassword: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ isLogin: true });
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        this.setState({ error: "An error occurred while login" });
      });
  };

  onSuccess = (response) => {
    this.loggoogle(response);
    console.log("Successful :) You are in", response);
  };

  loggoogle = (response) => {
    console.log("this is res:", response);
    const idToken = response.getAuthResponse().id_token;
    fetch("http://localhost:3001/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken: idToken }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ isLogin: true });
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        this.setState({ error: "An error occurred while logging in" });
      });
  };

  onFailure = (response) => {
    console.log("Unsuccessful :( You are not in", response);
  };

  render() {
    const { loginPage, error, loading } = this.state;

    if (loading) {
      /*indicates whether some data is being fetched or processed. If loading is true, it means data is being loaded, so you display a loading message.*/
      return <div>Loading...</div>;
    }

    if (error) {
      return (
        <div>Error {error.message}</div>
      ); /*This indicates if an error occurred during data fetching or processing. If error is present, you display an error message. */
    }

    if (!loginPage) {
      /* if log in page is not found in the node or im returning in  the fetch somthing else */
      return <div>Page not found</div>;
    }
    return (
      <div>
        <Header />
        <div id="login-buttons">
          <GoogleLogin
            clientId={this.client_id}
            buttonText="Log in with Google"
            onSuccess={this.onSuccess}
            onFailure={this.onFailure}
            isSignedIn={true}
            cookiePolicy={"single_host_origin"}
          />
          
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
        <a href="/Draw">
          <button className="btn2" type="submit" onClick={this.handleSubmit}>
            Log in
          </button>
        </a>
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
