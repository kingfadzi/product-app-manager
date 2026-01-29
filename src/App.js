import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
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
    <AppProvider>
      <Router>
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
      </Router>
    </AppProvider>
  );
}

export default App;
