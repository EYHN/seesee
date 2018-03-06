import Seesee from './lib/seesee';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const exampleImage = require('url-loader!./example.svg');

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
      <Seesee open={this.state.open}>
        <img
          style={{background: '#000'}}
          onClick={this.handleClickImage}
          width='500px'
          src={exampleImage}
        />
      </Seesee>
    );
  }
}

ReactDOM.render(<App />, MOUNT_NODE);
