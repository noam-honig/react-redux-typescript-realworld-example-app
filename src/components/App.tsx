import agent, { context } from '../agent';
import Header from './Header';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Route, Switch } from 'react-router-dom';
import Article from './Article';
import Editor from './Editor';
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import ProfileFavorites from './ProfileFavorites';
import Register from './Register';
import Settings from './Settings';
import { store } from '../store';
import { push } from 'react-router-redux';
import { SingleUser, StateModel } from '../models';
import { commonActions } from '../reducers/common';
import { UserEntity } from '../models/UserModel';

const mapStateToProps = (state: StateModel) => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo
  }
};

const mapDispatchToProps = ({
  onLoad: commonActions.appLoad,
  onRedirect: commonActions.redirect
});
const connector = connect(mapStateToProps, mapDispatchToProps);
class App extends React.Component<ConnectedProps<typeof connector>> {
  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      // this.context.router.replace(nextProps.redirectTo);
      store.dispatch(push(nextProps.redirectTo));
      this.props.onRedirect();
    }
  }

  componentWillMount() {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
    }
    let promise: Promise<SingleUser> = Promise.resolve(undefined);;
    if (token)
      promise = UserEntity.currentUser();
    promise.then(user => {
      this.props.onLoad({ user: user, token });
    })
  }

  render() {
    if (this.props.appLoaded) {
      return (
        <div>
          <Header
            appName={this.props.appName}
            currentUser={this.props.currentUser} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/editor/:slug" component={Editor} />
            <Route path="/editor" component={Editor} />
            <Route path="/article/:id" component={Article} />
            <Route path="/settings" component={Settings} />
            <Route path="/@:username/favorites" component={ProfileFavorites} />
            <Route path="/@:username" component={Profile} />
          </Switch>
        </div>
      );
    }
    return (
      <div>
        <Header
          appName={this.props.appName}
          currentUser={this.props.currentUser} />
      </div>
    );
  }
}

// App.contextTypes = {
//   router: PropTypes.object.isRequired
// };

export default connector(App);
