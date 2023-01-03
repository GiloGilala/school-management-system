import React from "react";
import AlbumList from "./components/AlbumList";
import { BrowserRouter, Route } from "react-router-dom";
import AddAlbum from "./components/AddAlbum";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UploadImage from "./components/UploadImage";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <div className="container">
        <Route path="/" exact component={AlbumList} />
        <Route path="/add" exact component={AddAlbum} />
        <Route path="/upload/:id" exact component={UploadImage} />
      </div>
    </BrowserRouter>
  );
}

export default App;
