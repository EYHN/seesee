import Seesee from './lib/Seesee';
import SeeseeList from './lib/SeeseeList';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const exampleImage = require('file-loader!./example.jpg');
const exampleImage2 = require('file-loader!./example2.jpg');
const exampleImage3 = require('file-loader!./example3.jpg');

const MOUNT_NODE = document.getElementById('app');

class App extends React.PureComponent {
  state = {
    openList: 1 as number
  };
  handleClickImage: React.MouseEventHandler<HTMLImageElement> = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      openList: 1
    }));
  }
  handleClickImage2: React.MouseEventHandler<HTMLImageElement> = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      openList: 2
    }));
  }
  handleClickImage3: React.MouseEventHandler<HTMLImageElement> = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      openList: 3
    }));
  }

  handleExit: React.ReactEventHandler<HTMLButtonElement> = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      openList: undefined
    }));
  }

  handleNext = () => {
    this.setState((prevState) => ({
      ...prevState,
      openList: this.state.openList + 1
    }));
  }

  handlePrev = () => {
    this.setState((prevState) => ({
      ...prevState,
      openList: this.state.openList - 1
    }));
  }

  public render() {
    return (
      <SeeseeList open={this.state.openList} onExit={this.handleExit} onNext={this.handleNext} onPrev={this.handlePrev}>
        <Seesee title={'Seesee.js'} identifier={1}>
          <img
            style={{background: '#000'}}
            onClick={this.handleClickImage}
            src={exampleImage}
            width='200px'
          />
        </Seesee>
        <Seesee title={'Seesee.js'} identifier={2}>
          <img
            style={{background: '#000'}}
            onClick={this.handleClickImage2}
            src={exampleImage2}
            width='200px'
          />
        </Seesee>
        <Seesee title={'Seesee.js'} identifier={3}>
          <img
            style={{background: '#000'}}
            onClick={this.handleClickImage3}
            src={exampleImage3}
            width='50px'
          />
        </Seesee>
      </SeeseeList>
    );
  }
}

ReactDOM.render(<App />, MOUNT_NODE);
