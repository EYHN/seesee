import Seesee from './lib/Seesee';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const exampleImage = require('url-loader!./example.jpg');

const MOUNT_NODE = document.getElementById('app');

class App extends React.PureComponent {
  state = {
    open: false
  };
  handleClickImage: React.MouseEventHandler<HTMLImageElement> = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      open: true
    }));
  }
  public render() {
    return (
      <>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <Seesee open={this.state.open} onExit={() => this.setState({open: false})}>
          <img
            style={{background: '#000'}}
            onClick={this.handleClickImage}
            src={exampleImage}
            width='200px'
          />
        </Seesee>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/><br/>
        <br/>
        <br/>
        <br/><br/>
        <br/>
      </>
    );
  }
}

ReactDOM.render(<App />, MOUNT_NODE);
