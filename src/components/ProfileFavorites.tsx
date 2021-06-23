import { Profile, mapStateToProps } from './Profile';
import React from 'react';
import { Link } from 'react-router-dom';
import agent from '../agent';
import { connect } from 'react-redux';
import { profileActions } from '../reducers/profile';


const mapDispatchToProps = ({
  onLoad: profileActions.profilePageLoaded,
  onUnload: profileActions.profilePageUnloaded
});

const connector = connect(mapStateToProps, mapDispatchToProps);
class ProfileFavorites extends Profile {
  componentWillMount() {
    Promise.all([
      agent.Profile.get(this.props.match.params.username),
      agent.Articles.favoritedBy(this.props.match.params.username)
    ]).then(data => {

      this.props.onLoad({
        pager: page => agent.Articles.favoritedBy(this.props.match.params.username, page),
        data
      });
    })
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  renderTabs() {
    return (
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <Link
            className="nav-link"
            to={`/@${this.props.profile.username}`}>
            My Articles
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link active"
            to={`/@${this.props.profile.username}/favorites`}>
            Favorited Articles
          </Link>
        </li>
      </ul>
    );
  }
}

export default connector(ProfileFavorites);
