import ArticleList from './ArticleList';
import React from 'react';
import { Link } from 'react-router-dom';
import { remult, multipleArticles } from '../agent';
import { connect, ConnectedProps } from 'react-redux';

import { RouterMatchModel, StateModel } from '../models';
import { profileActions } from '../reducers/profile';
import { ProfileModel } from '../models/ProfileModel';


const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <Link
        to="/settings"
        className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-gear-a"></i> Edit Profile Settings
      </Link>
    );
  }
  return null;
};

const FollowUserButton = (props: {
  isUser: boolean,
  user: ProfileModel,
  refreshProfile: typeof profileActions.refreshProfile

}) => {
  if (props.isUser) {
    return null;
  }

  let classes = 'btn btn-sm action-btn';
  if (props.user.following) {
    classes += ' btn-secondary';
  } else {
    classes += ' btn-outline-secondary';
  }

  const handleClick = ev => {
    ev.preventDefault();
    props.user.toggleFollowing().then(p => props.refreshProfile(p));

  };

  return (
    <button
      className={classes}
      onClick={handleClick}>
      <i className="ion-plus-round"></i>
      &nbsp;
      {props.user.following ? 'Unfollow' : 'Follow'} {props.user.username}
    </button>
  );
};

const mapStateToProps = (state: StateModel) => ({
  ...state.articleList,
  currentUser: state.common.currentUser,
  profile: state.profile
});

const mapDispatchToProps = ({
  refreshProfile: profileActions.refreshProfile,
  onLoad: profileActions.profilePageLoaded,
  onUnload: profileActions.profilePageUnloaded
});
const connector = connect(mapStateToProps, mapDispatchToProps);
class Profile extends React.Component<ConnectedProps<typeof connector> & RouterMatchModel> {
  componentWillMount() {
    remult.repo(ProfileModel).findId(this.props.match.params.username).then(author => {
      let pager = (page = 0) => multipleArticles(article => article.author.isEqualTo(author), page);
      pager(0).then(articles => this.props.onLoad({ pager, data: [author, articles] }));
    });
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  renderTabs() {
    return (
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <Link
            className="nav-link active"
            to={`/@${this.props.profile.username}`}>
            My Articles
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link"
            to={`/@${this.props.profile.username}/favorites`}>
            Favorited Articles
          </Link>
        </li>
      </ul>
    );
  }

  render() {
    const profile = this.props.profile;
    if (!profile) {
      return null;
    }

    const isUser = this.props.currentUser &&
      this.props.profile.username === this.props.currentUser.username;

    return (
      <div className="profile-page">

        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">

                <img src={profile.image} className="user-img" alt={profile.username} />
                <h4>{profile.username}</h4>
                <p>{profile.bio}</p>

                <EditProfileSettings isUser={isUser} />
                <FollowUserButton
                  isUser={isUser}
                  user={profile}
                  refreshProfile={this.props.refreshProfile}
                />

              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">

            <div className="col-xs-12 col-md-10 offset-md-1">

              <div className="articles-toggle">
                {this.renderTabs()}
              </div>

              <ArticleList
                pager={this.props.pager}
                articles={this.props.articles}
                articlesCount={this.props.articlesCount}
                state={this.props.currentPage} />
            </div>

          </div>
        </div>

      </div>
    );
  }
}

export default connector(Profile);
export { Profile, mapStateToProps };
