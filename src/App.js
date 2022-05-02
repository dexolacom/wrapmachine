import logo from './logo.svg';
import WrapMachine from './components/WrapMachine/WrapMachine';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <WrapMachine/>
    </div>
  );
}

export default App;
