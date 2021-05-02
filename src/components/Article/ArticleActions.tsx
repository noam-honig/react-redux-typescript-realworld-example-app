import { Link } from 'react-router-dom';
import React from 'react';
import agent from '../../agent';
import { connect, ConnectedProps } from 'react-redux';
import { DELETE_ARTICLE } from '../../constants/actionTypes';
import { ArticleModel } from '../../models';

const mapDispatchToProps = dispatch => ({
  onClickDelete: payload =>
    dispatch({ type: DELETE_ARTICLE, payload })
});
const connector = connect(() => ({}), mapDispatchToProps);
const ArticleActions = (props: ConnectedProps<typeof connector>&{
  canModify:Boolean,
  article:ArticleModel
}) => {
  const article = props.article;
  const del = () => {
    props.onClickDelete(agent.Articles.del(article.slug))
  };
  if (props.canModify) {
    return (
      <span>

        <Link
          to={`/editor/${article.slug}`}
          className="btn btn-outline-secondary btn-sm">
          <i className="ion-edit"></i> Edit Article
        </Link>

        <button className="btn btn-outline-danger btn-sm" onClick={del}>
          <i className="ion-trash-a"></i> Delete Article
        </button>

      </span>
    );
  }

  return (
    <span>
    </span>
  );
};

export default connector(ArticleActions);
