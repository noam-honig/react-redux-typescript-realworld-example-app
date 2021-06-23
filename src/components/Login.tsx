import { Link } from 'react-router-dom';
import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect, ConnectedProps } from 'react-redux';
import {
  LOGIN_PAGE_UNLOADED
} from '../constants/actionTypes';
import { StateModel } from '../models';
import { authActions } from '../reducers/auth';

const mapStateToProps = (state: StateModel) => ({ ...state.auth });

const mapDispatchToProps = ({
  onChangeEmail: value =>
    authActions.updateField({ key: 'email', value }),
  onChangePassword: value =>
    authActions.updateField({ key: 'password', value }),
  onStartRequest:authActions.startRequest,
  onSubmit: authActions.login,
  onError: authActions.error,
  onUnload: () =>
    ({ type: LOGIN_PAGE_UNLOADED })
});
const connector = connect(mapStateToProps, mapDispatchToProps);
class Login extends React.Component<ConnectedProps<typeof connector>> {
  constructor(p) {
    super(p);
  }
  changeEmail = ev => this.props.onChangeEmail(ev.target.value);
  changePassword = ev => this.props.onChangePassword(ev.target.value);
  submitForm = (email, password) => ev => {
    ev.preventDefault();
    this.props.onStartRequest();
    agent.Auth.login(email, password).then(this.props.onSubmit,
      this.props.onError);
  };

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const email = this.props.email;
    const password = this.props.password;
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center"> 
                <Link to="/register">
                  Need an account?
                </Link>
              </p>

              <ListErrors errors={this.props.errors} />

              <form onSubmit={this.submitForm(email, password)}>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={this.changeEmail} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={this.changePassword} />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={this.props.inProgress}>
                    Sign in
                  </button>

                </fieldset>
              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default connector(Login);
