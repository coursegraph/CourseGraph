import React from 'react';
import Popup from 'reactjs-popup';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


const lStyle = {
  overflow: 'auto',
  maxHeight: '400px',
};

const pStyle = {
  fontSize: '14px',
  textAlign: 'left',
};

const inStyle = {
  width: '300px',
  fontSize: '14px',
};

function match(query) {
  let q = query.toUpperCase();
  return function(value) {
    return value.toUpperCase().indexOf(q) > -1;
  };
}



class PopMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      unfiltered: props.unfilteredArray.slice(),
      filtered: props.unfilteredArray.slice(),
      visibleElements: 15,
    };

  }


  filter = (event) => {
    let stringArray = new Array(this.state.unfiltered.length);
    for (let i = 0; i < this.state.unfiltered.length; i++) {
      stringArray[i] =
        JSON.stringify(this.state.unfiltered[i].name.toUpperCase())
        + JSON.stringify(this.state.unfiltered[i].title.toUpperCase())
        + JSON.stringify(this.state.unfiltered[i].instructor.toUpperCase());
    }
    //console.log(`get stringArray: ${stringArray}`);
    let indices = [];
    let newArray = [];
    for (let i = 0; i < this.state.unfiltered.length; i++) {
      if (stringArray[i].indexOf(event.target.value.toUpperCase() ) > -1 )  {
        indices.push(i);
      }
    }
    for (let i = 0; i < indices.length; i++) {
      newArray.push(this.state.unfiltered[indices[i]]);
    }
    //let shrunkArray = newArray.slice(0, 10);
    //let result = shrunkArray.join(', ');
    //console.log(`got result: ${result}`);
    //let result = newArray.join(', ');
    //console.log(`got result: ${result}`);

    this.setState({
      filtered: newArray,
      visibleElements: 15,
    });
    //console.log(`filter filtered: ${this.state.filtered}`);
  };

  onListScroll = (event) => {
    const el = document.getElementById('listDiv');
    const max = el.scrollHeight;
    const scrolled = el.scrollTop;
    let newVisibleElements = this.state.visibleElements + 15;

    if ( (max - scrolled) < 410 ) {
      this.setState({
        visibleElements: newVisibleElements});
    }

    //console.log(`max scroll height % : ${max}`);
    //console.log(`amount scrolled? : ${scrolled}`);
  };



  render() {
    const data = this.state.filtered.slice(0, this.state.visibleElements);
    let n = 0;
    //console.log(`in Render, filtered: ${this.state.filtered}`);

    return <div>
      <Popup
        trigger={<div>
          <input style={inStyle} onChange={this.filter} type="text" placeholder="YAY!"/>
        </div>}
        position="bottom left"
        on="click"
        closeOnDocumentClick
        mouseLeaveDelay={300}
        mouseEnterDelay={0}
        contentStyle={{padding: '0px', border: 'none'}}
        arrow={false}
      >
        <div style={lStyle} id="listDiv" onScroll={this.onListScroll}>
          <List>{data.map(({name, title, instructor, terms, description, geCategories, division}) => (

            <Popup trigger={
              <ListItem
                style={pStyle}
                key={name + `${n++}`}
                dense
                divider
                button
              >
                <ListItemText primary={name + ' ' + title} secondary={`Instr: ${instructor}`}/>
              </ListItem>
            } modal>
              {close => (
                <div className="modal">
                  <a className="close" onClick={close}>&times;</a>
                  <div className="header">
                    {`${name} ${title}`}
                  </div>
                  <div className={'content'}>
                    <p>{`Instructor: ${instructor}`}</p>
                    <p>{`Terms: ${terms}`}</p>
                    <p>{`GE: ${geCategories}`}</p>
                    <p>{`Division: ${division}`}</p>
                    <p>{`Description: ${description}`}</p>
                  </div>
                </div>
              )}
            </Popup>
          ))}
          </List>
        </div>
      </Popup>
    </div>;
  }
}


export default PopMenu;
