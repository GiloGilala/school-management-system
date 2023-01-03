import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { uploadImages, fetchAlbumDetail, removeImage } from "../_actions/album";

function UploadImage(props) {
  const dispatch = useDispatch();
  const albumId = props.match.params.id;
  //   const [albumInfo, setAlbumInfo] = useState({});
  const albumDetail = useSelector((state) => state.album.albumDetail);

  useEffect(() => {
    dispatch(fetchAlbumDetail(albumId));
  }, []);

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    files.map((file, index) => {
      formData.append("image", file);
    });

    dispatch(uploadImages(albumId, formData, config)).then((res) => {
      if (res.payload.status) {
        toast.success(res.payload.message);
      }
    });
  };

  const handleDelete = (albumId, imageName) => {
    dispatch(removeImage(albumId, imageName)).then((res) => {
      if (res.payload.status) {
        toast.success(res.payload.message);
      }
    });
  };
  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a href="/">Albums</a>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Upload
          </li>
        </ol>
      </nav>
      <div className="card shadow-sm">
        <div className="card-header">
          <h5>Upload Image for Album {albumDetail.name}</h5>
        </div>
        <div className="card-body">
          <Dropzone onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
              <div
                className="m-1"
                style={{
                  width: "350px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <p>Drag and drop files here or click to upload</p>
              </div>
            )}
          </Dropzone>
          <div className="row m-1">
            {albumDetail.images &&
              albumDetail.images.map((image, index) => (
                <div className="card col-md-3 mb-2">
                  <div className="card-header bg-white">
                    <span>{image}</span>
                    <button
                      type="button"
                      className="btn btn-danger float-end"
                      onClick={() => handleDelete(albumId, image)}
                    >
                      <i class="fas fa-backspace"></i>
                    </button>
                  </div>
                  <div className="card-body p-1">
                    <img
                      style={{ width: "100%", maxHeight: "180px" }}
                      class="img-thumbnail"
                      src={`http://localhost:5000/${image}`}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadImage;
