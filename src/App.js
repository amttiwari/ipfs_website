import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Layout from './hoc/Layout/Layout';
import About from './components/AboutContent/AboutContent';
import Tokenomics from './containers/Tokenomics/Tokenomics';
import Roadmap from './components/Roadmap/Roadmap';
import Team from './components/Team/Team';
import Dapps from './components/Dapps/Dapps';
import Xchange from './components/Xchange/xchange';
import Stake from './containers/Stake/Stake';
import Exchange from './containers/Exchange/Exchange';

function App() {

  return (
    <div className='appwrap'>
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route path='/deficlerk/' exact component={About} />
            <Route path='/deficlerk/Tokenomics' exact component={Tokenomics} />
            <Route path='/deficlerk/Roadmap' component={Roadmap} />
            <Route path='/deficlerk/Team' component={Team} />
            <Route path='/deficlerk/Stake' component={Stake} />
            <Route path='/deficlerk/Dapps' component={Dapps} />
            <Route path='/deficlerk/Exchange' component={Exchange} />
            <Route path='/deficlerk/Xchange' component={Xchange} />

          </Switch>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
