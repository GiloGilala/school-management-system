import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addAlbum } from "../_actions/album";

function AddAlbum(props) {
  const dispatch = useDispatch();
  const [values, setvalues] = useState({});
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setvalues({
      ...values,
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addAlbum(values)).then((res) => {
      if (res.payload.status) {
        // toast.success(res.payload.message);
        console.log("~~~~data: ", res.payload.result._id);

        props.history.push(`/upload/${res.payload.result._id}`);
      }
    });
  };
  return (
    <Fragment>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a href="/">Albums</a>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Add
          </li>
        </ol>
      </nav>
      <div className="card shadow-sm">
        <div className="card title p-2 bg-light">
          <h5>Add Album</h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Album Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter album name"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="3"
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="form-group">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-success"
            >
              <i class="fas fa-plus"></i> Save and next
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AddAlbum;
