import './App.css';
import Canvas from './components/Canvas';


function App() {
  return (
    
    <div className="App">
      <h1 className="app-title">Aneesh's Drawing app</h1>
      <Canvas
          width ={700}
          height = {500}
        /> 
    </div>
  );
}

export default App;
