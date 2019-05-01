import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Header from './components/header';
import LineGraph from './components/linegraph';
import BarGraph from './components/bargraph';
import About from './components/about';
import React, {
  Component
} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        
          <div className="container-fluid">
            <Switch>
              <Route path="/line" render={(props) => <LineGraph {...props} />} />
              <Route path="/bar" render={(props) => <BarGraph {...props} />} />
              <Route path="/about" render={(props) => <About {...props} />} />
            </Switch>
          </div>
      </Router>
    </div>
  );
}

export default App;
