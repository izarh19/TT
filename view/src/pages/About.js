import React, { Component} from "react";
import "../pagescss/About.css";
import backgroung from "../Img/lineb.jpg";
import Header from "../Compheader/Header";
import Footer from "../Compfooter/Footer";

export default class About extends Component {
constructor(props) {
super(props);
this.state = {
aboutPage: []
};
}
componentDidMount() {
fetch('http://localhost:3001/text/12', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
})
.then(response => response.json())
.then(data => this.setState({  aboutPage: data }))
.catch(error => console.error('Error fetching header page data:', error));

}
render(){
const { aboutPage } = this.state;
if (!aboutPage || aboutPage.length === 0) {
return <div>err</div>; 
}

return (

<div>

<Header></Header>

<span  >
<h1 id="about">About </h1>
</span >

<img src={backgroung} alt="" className="BGI" />
<div className="theabout">
{aboutPage.text &&aboutPage.text.map((newabt) => (
<p key={newabt.pageName}>{newabt.p}<br></br></p>

))}</div>


<Footer></Footer>
</div>
)
 }
}
