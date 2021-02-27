import logo from './logo.svg';
import './App.css';
import CodeEditor from './components/CodeEditor'

function App() {
  return (
    <div>
      <CodeEditor filename='../README.md'/>
    </div>
  );
}

export default App;
