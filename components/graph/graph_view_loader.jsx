import React from 'react';
import { GraphViewAssembly } from '../graph/graph_view_assembly'

class LoadingMessage extends React.Component {
  render () {
    return (
      <div>
        <h2>Loading...</h2>
        <a href={this.props.url}>{this.props.url}</a>
      </div>
    );
  }
}
class LoadErrorMessage extends React.Component {
  render () {
    return (
      <div>
        <h2>Failed to load data from:</h2>
        <a href={""+this.props.url}>{this.props.url}</a>
        <p>{""+this.props.error}</p>
      </div>
    );
  }
}

export class GraphViewLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      dataLoadError: null,
    };
  }
  setData (data) {
    this.setState({
      data: {
        nodes: data.nodes,
        edges: data.edges,
      },
    });
  }
  setDataError (error) {
    this.setState({
      data: null,
      dataLoadError: error,
    });
    // alert(error);
  }
  componentDidMount () {
    console.log("Fetching data...");
    fetch(this.props.jsonDataUrl)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      console.log("Got response");
      return response.json();
    })
    .then((data) => {
      console.log("Got json data");
      this.setData(data);
    })
    .catch((error) => {
      console.log("Got error: "+error);
      this.setDataError(error);
    });
  }
  render () {
    if (this.state.dataLoadError) {
      return <LoadErrorMessage 
        url={this.state.jsonDataUrl} 
        error={this.state.dataLoadError} />;
    }
    if (!this.state.data) {
      return <LoadingMessage url={this.state.jsonDataUrl} />;
    }
    return <GraphViewAssembly data={this.state.data} />;
  }
}
