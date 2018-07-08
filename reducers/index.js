import { RECEIVE_COURSES, REQUEST_COURSES, } from '../actions';

const courses = (state = {
  isFetching: false,
  items: [],
}, action) => {
  switch (action.type) {
    case REQUEST_COURSES:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_COURSES:
      return {
        ...state,
        isFetching: false,
        items: action.items,
      };
    default:
      return state;
  }
};

export default courses;
