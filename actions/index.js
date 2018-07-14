export const REQUEST_COURSES = 'REQUEST_COURSES';
export const RECEIVE_COURSES = 'RECEIVE_COURSES';

export const requestCourses = (subreddit) => ({
  type: REQUEST_COURSES,
});

/**
 * @param subreddit
 * @param json {{data}}
 * @return {{type: string, subreddit: *, posts: *, receivedAt: *}}
 */
export const receiveCourses = (subreddit, json) => ({
  type: RECEIVE_COURSES,
  courses: json.data.children.map(child => child.data),
  receivedAt: Date.now(),
});

export const fetchCourses = (subreddit) => (dispatch) => {
  dispatch(requestCourses(subreddit));
  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.json())
    .then(json => dispatch(receiveCourses(subreddit, json)));
};
