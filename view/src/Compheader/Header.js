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
    fetch('http://localhost:3001/hm/-1', {
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
    
    const {headerPage } = this.state;
    return (
      <header>
        <div className="header">
          <a href="./Home">
             <div id="logoimg">
                  <img src={logoimg} alt="logo" />
             </div>
          </a>
          
            <ul className="buttons">
                {headerPage.map((btn) => (
                  <li key={btn.id}><a href={btn.url}>{btn.title}</a></li>
                ))}
            </ul>
         
          
        </div>
      </header>
    );
  }
}
