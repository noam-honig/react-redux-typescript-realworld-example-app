import { Link } from 'react-router-dom';
import ListErrors from './ListErrors';
import React from 'react';
import agent, { context } from '../agent';
import { connect, ConnectedProps } from 'react-redux';
import { StateModel } from '../models';
import { authActions } from '../reducers/auth';
import { runAsync } from '../constants/actionTypes';
import { UserModel } from '../models/UserModel';

const mapStateToProps = (state: StateModel) => ({ ...state.auth });

const mapDispatchToProps = ({
  onChangeEmail: value => authActions.updateField({ key: 'email', value }),
  onChangePassword:
    value => authActions.updateField({ key: 'password', value }),
  onChangeUsername:
    value => authActions.updateField({ key: 'username', value }),
  onSubmit: authActions.register,

  onUnload: authActions.registerPageUnload
});
const connector = connect(mapStateToProps, mapDispatchToProps);
class Register extends React.Component<ConnectedProps<typeof connector>> {
  constructor(p) {
    super(p);
  }
  changeEmail = ev => this.props.onChangeEmail(ev.target.value);
  changePassword = ev => this.props.onChangePassword(ev.target.value);
  changeUsername = ev => this.props.onChangeUsername(ev.target.value);
  submitForm = (username, email, password) => ev => {
    ev.preventDefault();
    let user = context.for(UserModel).create({ username, email, password });
    runAsync(user.saveAndReturnToken(), ({ token }) => this.props.onSubmit([user, token]));
  } 

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const email = this.props.email;
    const password = this.props.password;
    const username = this.props.username;

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign Up</h1>
              <p className="text-xs-center">
                <Link to="/login">
                  Have an account?
                </Link>
              </p>

              <ListErrors errors={this.props.errors} />

              <form onSubmit={this.submitForm(username, email, password)}>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Username"
                      value={this.props.username}
                      onChange={this.changeUsername} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      value={this.props.email}
                      onChange={this.changeEmail} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={this.props.password}
                      onChange={this.changePassword} />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={this.props.inProgress}>
                    Sign up
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

export default connector(Register);
