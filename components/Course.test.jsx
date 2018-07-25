import React from 'react';
import { shallow } from 'enzyme';

import Course from './Course';


describe('A Course', () => {
  it('should render default text without throwing an error', () => {
    const wrapper = shallow(<Course/>);
    expect(wrapper.find('h3').text()).toEqual('Null');
  });

  it('should render title props without throwing an error', () => {
    const wrapper = shallow(<Course title="CMPS 101"/>);
    expect(wrapper.find('h3').text()).toEqual('CMPS 101');
  });
});
