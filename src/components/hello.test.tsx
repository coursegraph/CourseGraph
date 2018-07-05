import {shallow, ShallowWrapper} from 'enzyme';
import * as React from 'react';

import {Hello} from './hello';

describe('Hello', () => {
  it('renders the correct text when no enthusiasm level is given', () => {
    const wrapper: ShallowWrapper = shallow(<Hello
      name='Daniel'/>);

    expect(wrapper.find('.greeting').text()).toEqual('Hello Daniel!');
  });

  it('renders the correct text with an explicit enthusiasm of 1', () => {
    const wrapper: ShallowWrapper = shallow(<Hello
      name='Daniel'
      enthusiasmLevel={1}/>);

    expect(wrapper.find('.greeting').text()).toEqual('Hello Daniel!');
  });

  it('renders the correct text with an explicit enthusiasm of 5', () => {
    const wrapper: ShallowWrapper = shallow(<Hello
      name='Daniel'
      enthusiasmLevel={5}/>);

    expect(wrapper.find('.greeting').text()).toEqual('Hello Daniel!!!!!');
  });

  it('throws when the enthusiasm level is 0', () => {
    expect(() => {
      shallow(<Hello
        name='Daniel'
        enthusiasmLevel={0}/>);
    }).toThrow();
  });

  it('throws when the enthusiasm level is negative', () => {
    expect(() => {
      shallow(<Hello
        name='Daniel'
        enthusiasmLevel={-1}/>);
    }).toThrow();
  });
});
