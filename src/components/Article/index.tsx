import ArticleMeta from './ArticleMeta';
import CommentContainer from './CommentContainer';
import React from 'react';
import agent, { context, loadAllFields } from '../../agent';
import { connect, ConnectedProps } from 'react-redux';
import marked from 'marked';
import { RouterMatchModel, StateModel } from '../../models';
import { articleActions } from '../../reducers/article';
import { ArticleModel } from '../../models/ArticleModel';

const mapStateToProps = (state: StateModel) => ({
  ...state.article,
  currentUser: state.common.currentUser
});

const mapDispatchToProps = {
  onLoad: articleActions.articlePageLoaded,
  onUnload: articleActions.articlePageUnLoaded
};
const connector = connect(mapStateToProps, mapDispatchToProps);
class Article extends React.Component<ConnectedProps<typeof connector> & RouterMatchModel> {
  componentWillMount() {
    context.for(ArticleModel).getCachedByIdAsync(this.props.match.params.id).then(loadAllFields).then(article => {
      article.comments.load().then(comments => this.props.onLoad([article, comments]))
    });
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    if (!this.props.article) {
      return null;
    }

    const markup = { __html: marked(this.props.article.body || '', { sanitize: true }) };
    const canModify = this.props.currentUser &&
      this.props.currentUser.username === this.props.article.author.username;
    return (
      <div className="article-page">

        <div className="banner">
          <div className="container">

            <h1>{this.props.article.title}</h1>
            <ArticleMeta
              article={this.props.article}
              canModify={canModify} />

          </div>
        </div>

        <div className="container page">

          <div className="row article-content">
            <div className="col-xs-12">

              <div dangerouslySetInnerHTML={markup}></div>

              <ul className="tag-list">
                {
                  this.props.article.tagList.map(tag => {
                    return (
                      <li
                        className="tag-default tag-pill tag-outline"
                        key={tag}>
                        {tag}
                      </li>
                    );
                  })
                }
              </ul>

            </div>
          </div>

          <hr />

          <div className="article-actions">
          </div>

          <div className="row">
            <CommentContainer
              comments={this.props.comments || []}
              errors={this.props.commentErrors}
              article={this.props.article}
              currentUser={this.props.currentUser} />
          </div>
        </div>
      </div>
    );
  }
}

export default connector(Article);
