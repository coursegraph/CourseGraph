import React from 'react';
import PopMenu from "../components/PopMenu";

const testingArray = ['applebick', 'chimichanga', 'sicklewickle', 'pickleWart', 'gipple', 'sfdsfisdaf', 'dfgtir', 'sigrerty', 'erieyty', 'poijl', 'eieieo', 'IIIIII', 'IIEEEEE', 'Ihatelyfe']

export default () => (
  <div>
    <PopMenu unfilteredArray={testingArray}/>
  </div>
);