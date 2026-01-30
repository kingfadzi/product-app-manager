import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { UserProvider } from './context/UserContext';
import Header from './components/layout/Header';
import {
  HomePage,
  Dashboard,
  ProductList,
  ProductDetail,
  ProductCreate,
  AppList,
  AppProfile,
  AppEdit,
  SearchResults,
} from './pages';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <UserProvider>
      <AppProvider>
        <Router>
          <Header />
          <div style={{ paddingTop: '56px' }}>
          <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/search" component={SearchResults} />
          <Route exact path="/stacks" component={Dashboard} />
          <Route exact path="/products" component={ProductList} />
          <Route exact path="/products/new" component={ProductCreate} />
          <Route exact path="/products/:id" component={ProductDetail} />
          <Route exact path="/apps" component={AppList} />
          <Route exact path="/apps/:id" component={AppProfile} />
          <Route exact path="/apps/:id/edit" component={AppEdit} />
          </Switch>
          </div>
        </Router>
      </AppProvider>
    </UserProvider>
  );
}

export default App;
