import CommentInput from './CommentInput';
import CommentList from './CommentList';
import { Link } from 'react-router-dom';
import React from 'react';
import ListErrors from '../ListErrors';
import { CommentModel } from "../../models/CommentModel";
import { ProfileModel } from '../../models/ProfileModel';
import { ArticleModel } from '../../models/ArticleModel';

const CommentContainer = (props: {
  currentUser: ProfileModel,
  errors: {},
  article: ArticleModel,
  comments: CommentModel[]
}) => {
  if (props.currentUser) {
    return (
      <div className="col-xs-12 col-md-8 offset-md-2">
        <div>
          <ListErrors errors={props.errors}></ListErrors>
          <CommentInput article={props.article} currentUser={props.currentUser} />
        </div>

        <CommentList
          comments={props.comments}
          currentUser={props.currentUser} />
      </div>
    );
  } else {
    return (
      <div className="col-xs-12 col-md-8 offset-md-2">
        <p>
          <Link to="/login">Sign in</Link>
          &nbsp;or&nbsp;
          <Link to="/register">sign up</Link>
          &nbsp;to add comments on this article.
        </p>

        <CommentList
          comments={props.comments}
          currentUser={props.currentUser} />
      </div>
    );
  }
};

export default CommentContainer;
