import React, { Component } from "react";
import "./Footer.css";
import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      footerPage: []
    };
  }

  componentDidMount() {
    fetch('http://localhost:3001/hf/-2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())/*if i got response from the json */
      .then(data => this.setState({ footerPage: data }))/* put the data that i responsed in footerpage *//* set state update the footer page in the data it recive */
      .catch(error => console.error('Error fetching footer page data:', error));
  }


  render() {
    const { footerPage } = this.state;
return (

  
<footer>
<ul  className="inside_footer" >
  {Array.isArray(footerPage) &&footerPage.map((ftr)=>(
<li><a href={ftr.menuURL}>{ftr.menuTitle} </a></li>))}
</ul>

<ul >
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
<li><a className="fa fa-facebook"></a></li>
<li><a className="fa fa-twitter"></a></li>
<li><a className="fa fa-instagram"></a></li>
</ul>
</footer>

   );
  }
 }
