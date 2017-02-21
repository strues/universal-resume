import 'normalize.css/normalize.css';
import 'isomorphic-fetch';
import React from 'react';
import { injectGlobal, ThemeProvider } from 'styled-components';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';

import '../../styles/main.scss';
import { Footer, Header } from '../../components';
import Home from './Home';
import Error404 from './Error404';
import Contact from './Contact';


injectGlobal`
  body {
    margin: 0;
  }
`;

function App() {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={ Home } />
        <Route path="/contact" component={ Contact } />
        <Route component={ Error404 } />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
