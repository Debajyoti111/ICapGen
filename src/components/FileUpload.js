import React, { useState } from "react";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import { getDroppedOrSelectedFiles } from "html5-file-selector";
import Spinner from "react-bootstrap/Spinner";

const FileUploadComponent = ({ setCaption, setLoading }) => {
  const fileParams = ({ meta }) => {
    return { url: "https://httpbin.org/post" };
  };
  const onFileChange = ({ meta, file }, status) => {
    console.log(status, meta, file);
  };
  const getFilesFromEvent = (e) => {
    return new Promise((resolve) => {
      getDroppedOrSelectedFiles(e).then((chosenFiles) => {
        resolve(chosenFiles.map((f) => f.fileObject));
      });
    });
  };
  const selectFileInput = ({ accept, onFiles, files, getFilesFromEvent }) => {
    const textMsg = files.length > 0 ? null : "Select Files";
    return (
      <label className="btn btn-danger mt-4">
        {textMsg}
        <input
          style={{ display: "none" }}
          type="file"
          accept={accept}
          multiple
          onChange={(e) => {
            getFilesFromEvent(e).then((chosenFiles) => {
              onFiles(chosenFiles);
            });
          }}
        />
      </label>
    );
  };
  const handleSubmit = (files) => {
    const formData = new FormData();
    console.log(files);
    formData.append("image", files[0].file);
    console.log(formData);
    const Upload = async () => {
      setLoading(true);
      await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        body: formData,
      }).then((resp) => {
        resp.json().then((data) => {
          console.log(data);
          const text = data["caption"]
            .split("startseq ")[1]
            .split(" endseq")[0];
          setCaption(text);
        });
      });
      setLoading(false);
    };
    Upload();
  };
  return (
    <Dropzone
      onSubmit={handleSubmit}
      onChangeStatus={onFileChange}
      InputComponent={selectFileInput}
      getUploadParams={fileParams}
      getFilesFromEvent={getFilesFromEvent}
      accept="image/*"
      maxFiles={1}
      inputContent="Drop A File"
      styles={{
        dropzone: { width: 400, height: 200 },
        dropzoneActive: { borderColor: "green" },
        overflow: "hidden",
      }}
    />
  );
};
export default FileUploadComponent;
