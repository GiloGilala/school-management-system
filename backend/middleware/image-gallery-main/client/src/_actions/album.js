import axios from "axios";
import {
  FETCH_ALBUMS,
  FETCH_ALBUM_DETAIL,
  ADD_ALBUM,
  UPLOAD_IMAGE,
  REMOVE_IMAGE,
} from "./types";

export const fetchAlbums = () => {
  const req = axios.get("/galleries").then((res) => res.data);
  return {
    type: FETCH_ALBUMS,
    payload: req,
  };
};

export const fetchAlbumDetail = (id) => {
  const req = axios.get(`/galleries/detail/${id}`).then((res) => res.data);
  console.log("~~~~~albumdetail: ", req);
  return {
    type: FETCH_ALBUM_DETAIL,
    payload: req,
  };
};

export const addAlbum = (data) => {
  const req = axios.post("/galleries/add", data).then((res) => res.data);
  return {
    type: ADD_ALBUM,
    payload: req,
  };
};

export const uploadImages = (id, data, config) => {
  const req = axios
    .put(`/galleries/upload/${id}`, data, config)
    .then((res) => res.data);
  return {
    type: UPLOAD_IMAGE,
    payload: req,
  };
};

export const removeImage = (id, imageName) => {
  const req = axios
    .put(`/galleries/removeImage/${id}`, { fileName: imageName })
    .then((res) => res.data);
  return {
    type: REMOVE_IMAGE,
    payload: req,
  };
};
