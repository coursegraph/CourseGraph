import React from 'react';
import { shallow } from 'enzyme';

import HomePanel from './HomePanel';

describe('A HomePanel', () => {
  it('should render default header without throwing an error', () => {
    const wrapper = shallow(<HomePanel/>);
    expect(wrapper.text()).toEqual('<HomePanel />');
  });
});
