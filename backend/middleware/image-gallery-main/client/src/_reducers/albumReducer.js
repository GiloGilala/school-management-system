import * as ACTION_TYPES from "../_actions/types";

const initialState = {
  albumList: [],
  albumDetail: {},
  addedAlbum: {},
};
const albumReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_ALBUMS:
      return {
        albumList: [...action.payload.result],
      };
    case ACTION_TYPES.FETCH_ALBUM_DETAIL:
      return {
        albumDetail: action.payload.result,
      };
    case ACTION_TYPES.ADD_ALBUM:
      return {
        ...state,
        addedAlbum: action.payload,
      };
    case ACTION_TYPES.UPLOAD_IMAGE:
      return {
        albumDetail: action.payload.result,
      };
    case ACTION_TYPES.REMOVE_IMAGE:
      return {
        albumDetail: action.payload.result,
      };
    default:
      return state;
  }
};
export default albumReducer;
