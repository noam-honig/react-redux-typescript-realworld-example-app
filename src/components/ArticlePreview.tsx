import React from 'react';
import { Link } from 'react-router-dom';
import agent from '../agent';
import { connect, ConnectedProps } from 'react-redux';
import { articleListActions } from '../reducers/articleList';
import { ArticleModel } from "../models/ArticleModel";

const FAVORITED_CLASS = 'btn btn-sm btn-primary';
const NOT_FAVORITED_CLASS = 'btn btn-sm btn-outline-primary';

const mapDispatchToProps = ({

  refreshFavorite: articleListActions.refreshArticleFavorited
});

const connector = connect(() => ({}), mapDispatchToProps);
const ArticlePreview = (props: ConnectedProps<typeof connector> & { art: { article: ArticleModel } }) => {
  const article = props.art.article;
  const favoriteButtonClass = article.favorited ?
    FAVORITED_CLASS :
    NOT_FAVORITED_CLASS;

  const handleClick = ev => {
    ev.preventDefault();
    article.toggleFavorite().then(props.refreshFavorite);
  };
  let { slug, favorited, favoritesCount } = article;
  console.log({ slug, favorited, favoritesCount });
  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`/@${article.author.username}`}>
          <img src={article.author.image} alt={article.author.username} />
        </Link>

        <div className="info">
          <Link className="author" to={`/@${article.author.username}`}>
            {article.author.username}
          </Link>
          <span className="date">
            {new Date(article.createdAt).toDateString()}
          </span>
        </div>

        <div className="pull-xs-right">
          <button className={favoriteButtonClass} onClick={handleClick}>
            <i className="ion-heart"></i> {article.favoritesCount}
          </button>
        </div>
      </div>

      <Link to={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {
            article.tagList.map(tag => {
              return (
                <li className="tag-default tag-pill tag-outline" key={tag}>
                  {tag}
                </li>
              )
            })
          }
        </ul>
      </Link>
    </div>
  );
}

export default connector(ArticlePreview);
