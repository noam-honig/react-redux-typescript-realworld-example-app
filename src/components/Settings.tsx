import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect, ConnectedProps } from 'react-redux';

import { SettingsFormsState, StateModel, UserModel } from '../models';
import { settingsActions } from '../reducers/settings';
import common, { commonActions } from '../reducers/common';

class SettingsForm extends React.Component<{
  currentUser: UserModel,
  onSubmitForm: (user: SettingsFormsState) => void
}, SettingsFormsState> {
  constructor(p) {
    super(p);

    this.state = {
      image: '',
      username: '',
      bio: '',
      email: '',
      password: ''
    };

  }
  updateState = field => ev => {
    const state = this.state;
    const newState = Object.assign({}, state, { [field]: ev.target.value });
    this.setState(newState);
  };

  submitForm = ev => {
    ev.preventDefault();

    const user = {};
    for (const key in this.state) {
      if (Object.prototype.hasOwnProperty.call(this.state, key)) {
        const element = this.state[key];
        if (!element && key == 'password')
          continue;
        user[key] = element;

      }
    }
    this.props.onSubmitForm(user as SettingsFormsState);
  };

  componentWillMount() {
    if (this.props.currentUser) {
      Object.assign(this.state, {
        image: this.props.currentUser.image || '',
        username: this.props.currentUser.username,
        bio: this.props.currentUser.bio,
        email: this.props.currentUser.email
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser) {
      this.setState(Object.assign({}, this.state, {
        image: nextProps.currentUser.image || '',
        username: nextProps.currentUser.username,
        bio: nextProps.currentUser.bio,
        email: nextProps.currentUser.email
      }));
    }
  }

  render() {
    return (
      <form onSubmit={this.submitForm}>
        <fieldset>

          <fieldset className="form-group">
            <input
              className="form-control"
              type="text"
              placeholder="URL of profile picture"
              value={this.state.image}
              onChange={this.updateState('image')} />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={this.updateState('username')} />
          </fieldset>

          <fieldset className="form-group">
            <textarea
              className="form-control form-control-lg"
              rows={8}
              placeholder="Short bio about you"
              value={this.state.bio}
              onChange={this.updateState('bio')}>
            </textarea>
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.updateState('email')} />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="password"
              placeholder="New Password"
              value={this.state.password}
              onChange={this.updateState('password')} />
          </fieldset>

          <button
            className="btn btn-lg btn-primary pull-xs-right"
            type="submit"
            disabled={this.state.inProgress}>
            Update Settings
          </button>

        </fieldset>
      </form>
    );
  }
}

const mapStateToProps = (state: StateModel) => ({
  ...state.settings,
  currentUser: state.common.currentUser
});

const mapDispatchToProps = ({
  onClickLogout: () => commonActions.logout,
  onSubmitForm: settingsActions.settingsSaved,
  onUnload: () => settingsActions.settingsPageUnloaded,
  onStartRequest: settingsActions.startRequest,
  onError: settingsActions.error,

});

const connector = connect(mapStateToProps, mapDispatchToProps);
class Settings extends React.Component<ConnectedProps<typeof connector>> {
  render() {
    let submitForm = (state: SettingsFormsState) => {
      this.props.onStartRequest();
      agent.Auth.save(state as UserModel).then(this.props.onSubmitForm, this.props.errors);

    }
    return (
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">

              <h1 className="text-xs-center">Your Settings</h1>

              <ListErrors errors={this.props.errors}></ListErrors>

              <SettingsForm
                currentUser={this.props.currentUser}
                onSubmitForm={submitForm} />

              <hr />

              <button
                className="btn btn-outline-danger"
                onClick={this.props.onClickLogout}>
                Or click here to logout.
              </button>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connector(Settings);
