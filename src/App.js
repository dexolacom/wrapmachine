import logo from './logo.svg';
import WrapMachine from './components/WrapMachine/WrapMachine';
import {ConnectButton} from 'tech-web3-connector';
import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
        <ConnectButton/>
      <WrapMachine/>
    </div>
  );
}

export default App;
