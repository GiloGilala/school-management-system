import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchAlbums } from "../_actions/album";

function AlbumList() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAlbums());
  }, []);
  const albumList = useSelector((state) => state.album.albumList);
  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5>Album List</h5>
      </div>
      <div className="card-title p-4">
        <a className="btn btn-success" href="/add">
          Add Album
        </a>
      </div>
      <div className="card-body p-4">
        <table class="table border">
          <thead class="table-dark">
            <tr>
              <td>No</td>
              <td>Album Name</td>
              <td>Description</td>
              <td>Image Count</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {albumList.map((album, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{album.name}</td>
                <td>{album.description}</td>
                <td>{album.images.length}</td>
                <td>
                  <a class="btn btn-info" href={`/upload/${album._id}`}>
                    <i class="fas fa-image"></i>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AlbumList;
