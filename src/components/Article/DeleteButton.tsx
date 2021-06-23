import React from 'react';
import agent from '../../agent';
import { connect, ConnectedProps } from 'react-redux';
import { deleteComment } from '../../reducers/article';

const mapDispatchToProps = ({
  onClick: deleteComment
});

const connector = connect(() => ({}), mapDispatchToProps);
const DeleteButton = (props: ConnectedProps<typeof connector> & {
  slug: string,
  commentId: number,
  show: boolean
}) => {
  const del = () => {
    agent.Comments.delete(props.slug, props.commentId).then(() => {

      props.onClick(props.commentId);
    });
  };

  if (props.show) {
    return (
      <span className="mod-options">
        <i className="ion-trash-a" onClick={del}></i>
      </span>
    );
  }
  return null;
};

export default connector(DeleteButton);
