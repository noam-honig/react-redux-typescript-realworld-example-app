import React from 'react';
import agent from '../../agent';
import { connect, ConnectedProps } from 'react-redux';
import { addComment } from '../../reducers/article';
import { ProfileModel } from '../../models';

const mapDispatchToProps = {
  onSubmit: addComment
};

const connector = connect(() => ({}), mapDispatchToProps);
class CommentInput extends React.Component<ConnectedProps<typeof connector> & {
  slug: string,
  currentUser:ProfileModel
}, { body: string }> {
  constructor(p) {
    super(p);
    this.state = {
      body: ''
    };

  }
  setBody = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ body: ev.target.value });
  }

  createComment = (ev: React.FormEvent) => {
    ev.preventDefault();

    agent.Comments.create(this.props.slug,
      { body: this.state.body }).then(payload => {
        this.setState({ body: '' });
        this.props.onSubmit(payload);
      });
  };

  render() {
    return (
      <form className="card comment-form" onSubmit={this.createComment}>
        <div className="card-block">
          <textarea className="form-control"
            placeholder="Write a comment..."
            value={this.state.body}
            onChange={this.setBody}
            rows={3}>
          </textarea>
        </div>
        <div className="card-footer">
          <img
            src={this.props.currentUser.image}
            className="comment-author-img"
            alt={this.props.currentUser.username} />
          <button
            className="btn btn-sm btn-primary"
            type="submit">
            Post Comment
          </button>
        </div>
      </form>
    );
  }
}

export default connector(CommentInput);
