import { Profile, mapStateToProps } from './Profile';
import React from 'react';
import { Link } from 'react-router-dom';
import { remult, multipleArticles } from '../agent';
import { connect } from 'react-redux';
import { profileActions } from '../reducers/profile';
import { ProfileModel } from '../models/ProfileModel';
import { ArticleModel, Favorites } from '../models/ArticleModel';


const mapDispatchToProps = ({
  onLoad: profileActions.profilePageLoaded,
  onUnload: profileActions.profilePageUnloaded
});

const connector = connect(mapStateToProps, mapDispatchToProps);
class ProfileFavorites extends Profile {
  componentWillMount() {


    let pager = page => multipleArticles(() => ArticleModel.filter.build({ favoritedByUser: this.props.match.params.username }), page);
    Promise.all([
      remult.repo(ProfileModel).findId(this.props.match.params.username),
      pager(0)
    ]).then(data => {
      this.props.onLoad({
        pager,
        data: [data[0], data[1]]
      });
    })
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  renderTabs() {
    return (
      <ul className="nav nav-pills outline-active" >
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
