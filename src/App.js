import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import Navbar from "./components/CustomNavbar";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ImageToCaption from "./components/ImageToCaption";
function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/captions" element={<ImageToCaption />} />
      </Routes>
    </div>
  );
}

export default App;
