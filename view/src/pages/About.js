import React, { Component } from "react";
import "../pagescss/About.css";
import backgroung from "../Img/lineb.jpg";
import Header from "../Compheader/Header";
import Footer from "../Compfooter/Footer";

export default class About extends Component {

constructor(props) {
super(props);
this.state = {
aboutPage:null
};
}

componentDidMount() {

fetch("http://localhost:3001/text/4") 
.then(response => response.json())
.then(data => this.setState({  aboutPage: data }))
.catch(error => console.error('Error fetching header page data:', error));
}

render() {
const {  aboutPage } = this.state;
console.log(aboutPage);
if (!aboutPage) {
return <div>Error</div>;
}
const pageContent1 = JSON.parse(aboutPage.pageContent);
console.log(pageContent1)
return (

<div>
<Header />
<span>
<h1 id="about">About </h1>
</span>

<img src={backgroung} alt="" className="BGI" />
<div className="theabout">
{pageContent1.map((content, index) => (
<p key={index}>{content.p}</p>
))}
</div>

<Footer />
</div>
);
}
}
