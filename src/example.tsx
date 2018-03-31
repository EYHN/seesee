import Seesee from './lib/Seesee';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const exampleImage = require('file-loader!./example.jpg');
const exampleImage2 = require('file-loader!./example2.jpg');
const exampleImage3 = require('file-loader!./example3.jpg');

const MOUNT_NODE = document.getElementById('app');

class App extends React.PureComponent {
  state = {
    open: false,
    open2: false,
    open3: false
  };
  handleClickImage: React.MouseEventHandler<HTMLImageElement> = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      open: true
    }));
  }
  handleClickImage2: React.MouseEventHandler<HTMLImageElement> = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      open2: true
    }));
  }
  handleClickImage3: React.MouseEventHandler<HTMLImageElement> = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      open3: true
    }));
  }
  public render() {
    return (
      <>
        <Seesee open={this.state.open} title={'Seesee.js'} onExit={() => this.setState({open: false})}>
          <img
            style={{background: '#000'}}
            onClick={this.handleClickImage}
            src={exampleImage}
            width='200px'
          />
        </Seesee>
        <br/>
        <Seesee open={this.state.open2} title={'Seesee.js'} onExit={() => this.setState({open2: false})}>
          <img
            style={{background: '#000'}}
            onClick={this.handleClickImage2}
            src={exampleImage2}
            width='200px'
          />
        </Seesee>
        <br/>
        <Seesee open={this.state.open3} title={'Seesee.js'} onExit={() => this.setState({open3: false})}>
          <img
            style={{background: '#000'}}
            onClick={this.handleClickImage3}
            src={exampleImage3}
            width='50px'
          />
        </Seesee>
      </>
    );
  }
}

ReactDOM.render(<App />, MOUNT_NODE);
