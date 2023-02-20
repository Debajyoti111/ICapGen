import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import FileUpload from "./FileUpload";

const ImageToCaption = () => {
  const [caption, setCaption] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <h1>Image to Caption</h1>
      <FileUpload setCaption={setCaption} setLoading={setLoading} />
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : null}
      {caption ? (
        <>
          <div>
            <h2>Generated Caption</h2>
            <p className="caption-block">{caption}</p>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ImageToCaption;
