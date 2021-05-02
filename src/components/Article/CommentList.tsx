import Comment from './Comment';
import React from 'react';
import { CommentModel, ProfileModel } from '../../models';

const CommentList = (props:{
  currentUser:ProfileModel,
  comments:CommentModel[],
  slug:string
}) => {
  return (
    <div>
      {
        props.comments.map(comment => {
          return (
            <Comment
              comment={comment}
              currentUser={props.currentUser}
              slug={props.slug}
              key={comment.id} />
          );
        })
      }
    </div>
  );
};

export default CommentList;
