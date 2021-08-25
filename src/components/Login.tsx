import { Link } from 'react-router-dom';
import ListErrors from './ListErrors';
import React from 'react';
import agent, { remult } from '../agent';
import { connect, ConnectedProps } from 'react-redux';
import { StateModel } from '../models';
import { authActions } from '../reducers/auth';
import { runAsync } from '../constants/actionTypes';
import { UserModel } from '../models/UserModel';

const mapStateToProps = (state: StateModel) => ({ ...state.auth });

const mapDispatchToProps = ({
  onChangeEmail: value =>
    authActions.updateField({ key: 'email', value }),
  onChangePassword: value =>
    authActions.updateField({ key: 'password', value }),
  onSubmit: authActions.login,

  onUnload: authActions.loginPageUnloaded
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
    runAsync(UserModel.signIn(email, password).then(async ({ token }) => {
      agent.setToken(token);
      let user = await remult.repo(UserModel).findId(remult.user.id);
      return [token, user];
    }), this.props.onSubmit);
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
