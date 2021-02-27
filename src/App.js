import './App.css';
import Entry from './components/Entry';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Call from './components/Call';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/entry">
          <Entry />
        </Route>
        <Route
          path="/call"
          render={(props) => <Call {...props} />}
        />
      </Switch>
    </Router>
  );
}

export default App;
