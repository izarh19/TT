import React, { Component } from "react";
import "./Header.css";
import logoimg from "../Img/logo2.png";

export default class Header extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      headerPage: []
    };
  }

  componentDidMount() {
    fetch('http://localhost:3001/hf/-1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => this.setState({ headerPage: data }))
      .catch(error => console.error('Error fetching header page data:', error));
  }


  render() {
    
    const {headerPage} = this.state;
    return (
      <header>
        <div className="header">
          <a href="./Home">
             <div id="logoimg">
                  <img src={logoimg} alt="logo" />
             </div>
          </a>
          
            <ul className="buttons">
                {Array.isArray(headerPage) &&headerPage.map((btn) => (
                  <li key={btn.MID}><a href={btn.menuURL}>{btn.menuTitle}</a></li>
                ))}
            </ul>
         
          
        </div>
      </header>
    );
  }
}
