import React, { Component } from 'react';
import './App.css';
import ScatterPlot from './Components/ScatterPlot/ScatterPlot';

class App extends Component {
  state = {
    data: null
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
      .then(res => res.json())
      .then(data => data.map(d => {
        const parsedTime = d.Time.split(':');
        d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1])
        return d
      }))
      .then(data => this.setState({data: data}))
      .catch(err => console.log(err))
  }
  render() {
    return (
      <div className="App">
        {this.state.data ? <ScatterPlot data={this.state.data}/> : null}
      </div>
    );
  }
}

export default App;
