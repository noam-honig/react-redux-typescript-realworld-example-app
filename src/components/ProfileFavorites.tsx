import { Profile, mapStateToProps } from './Profile';
import React from 'react';
import { Link } from 'react-router-dom';
import { context, multipleArticles } from '../agent';
import { connect } from 'react-redux';
import { profileActions } from '../reducers/profile';
import { ProfileModel } from '../models/ProfileModel';
import { Favorites } from '../models/ArticleModel';


const mapDispatchToProps = ({
  onLoad: profileActions.profilePageLoaded,
  onUnload: profileActions.profilePageUnloaded
});

const connector = connect(mapStateToProps, mapDispatchToProps);
class ProfileFavorites extends Profile {
  componentWillMount() {



    Promise.all([
      context.for(ProfileModel).getCachedByIdAsync(this.props.match.params.username),
      context.for(Favorites).find({ where: favorite => favorite.userId.isEqualTo(this.props.match.params.username) })
    ]).then(data => {
      let pager = (page = 0) => multipleArticles(article => article.slug.isIn(data[1].map(f => f.articleId)), page);
      pager(0).then(articles =>
        this.props.onLoad({
          pager: pager,
          data: [data[0], articles]
        }));
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
