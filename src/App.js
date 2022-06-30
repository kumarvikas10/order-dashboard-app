import "./app.scss";
import DataReader from "./components/datareader/DataReader";

function App() {
  return (
    <div className="App">
      <div className="header">
        <div className="logo"><img src="./assets/ODA.png" alt="logo" /></div>
        <div className="heading"><h1>Order Dashboard App</h1></div>
      </div>
      <DataReader />
    </div>
  );
}

export default App;
