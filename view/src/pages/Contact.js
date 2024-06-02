import React, { Component } from "react";
import Header from "../Compheader/Header";
import Footer from "../Compfooter/Footer";
import "../pagescss/Contact.css";
import write from "../Img/write-removebg-preview (1).png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faStar } from '@fortawesome/free-solid-svg-icons';


export default class Contact extends Component {

  constructor(props) {
    super(props);
    this.state = {
      contactPage: []
    };
    }

    componentDidMount() {
    fetch('http://localhost:3001/formall/contactus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => this.setState({contactPage: data }))
    .catch(error => console.error('Error fetching header page data:', error));
    }
    render(){
    
    const { contactPage } = this.state;

  return (
    <div>
      <Header></Header>
      <h1>Contact Us</h1>
      <img src={write} alt="" id="write" />
      <div className="warrper3">
        
      <p id="exp">How was your experience?<br /></p>
      <div className="star-rating">
         
         <input type="radio" id="star5" name="rating" value="5" />
         <label htmlFor="star5"><FontAwesomeIcon icon={faStar} /></label>
         <input type="radio" id="star4" name="rating" value="4" />
         <label htmlFor="star4"><FontAwesomeIcon icon={faStar} /></label>
         <input type="radio" id="star3" name="rating" value="3" />
         <label htmlFor="star3"><FontAwesomeIcon icon={faStar} /></label>
         <input type="radio" id="star2" name="rating" value="2" />
         <label htmlFor="star2"><FontAwesomeIcon icon={faStar} /></label>
         <input type="radio" id="star1" name="rating" value="1" />
        <label htmlFor="star1"><FontAwesomeIcon icon={faStar} /></label>
        </div>

        {contactPage.map((cs) => (
          <div key={cs.id}>
            <input type={cs.type} placeholder={cs.placeholder} className={cs.class} />
          </div>
        ))}
        <a href="./Home"><button id="send">Send</button></a>
      </div>
      <Footer></Footer>
      
      </div>
)}}