import React from 'react';
import agent, { remult } from '../../agent';
import { connect, ConnectedProps } from 'react-redux';
import { articleActions } from '../../reducers/article';
import { CommentModel } from '../../models/CommentModel';

const mapDispatchToProps = ({
  onClick: articleActions.deleteComment
});

const connector = connect(() => ({}), mapDispatchToProps);
const DeleteButton = (props: ConnectedProps<typeof connector> & {
  comment:CommentModel,
  show: boolean
}) => {
  const del = () => {
    props.comment.delete().then(()=>props.onClick(props.comment.id))
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

