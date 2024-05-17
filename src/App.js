import logo from './logo.svg';
import './App.css';
import Header from './Compheader/Header';
import headermenu from './HM';
import logoimg from "./Img/logo2.png";
import Footer from './Compfooter/Footer';
import footermenu from './FM';

import {fafafacebook ,fafatwitter ,fafainstagram}from "@fortawesome/free-brands-svg-icons";
import {BrowserRouter , Routes,Route} from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Explore from "./pages/Explore";
import HowItWorks from "./pages/HowItWorks";
import Draw from "./pages/Draw";




function App() {
  return (
    <div className="App">
    
      
    
    
    <BrowserRouter>
      <Routes>
          
          <Route index element={<Home/>} />
          <Route path="/Signup" element={<Signup />} /> 
          <Route  path="/Contact" element={<Contact />} />
          <Route  path="/Login" element={< Login/>} />
          <Route  path="/Explore" element={<Explore />} />
          <Route  path="/HowItWorks" element={< HowItWorks/>} />
          <Route  path="/About" element={< About/>} />
          <Route  path="/Home" element={<Home/>} />
          <Route  path="/Draw" element={<Draw/>} />

      </Routes>
    </BrowserRouter>
    
    
  
    </div>
  );
}

export default App;