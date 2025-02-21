import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect, ConnectedProps } from 'react-redux';
import { RouterMatchModel, StateModel } from '../models';
import { editorActions } from '../reducers/editor';
import { runAsync } from '../constants/actionTypes';

const mapStateToProps = (state: StateModel) => ({
  ...state.editor
});

const mapDispatchToProps = ({
  onAddTag: editorActions.addTag,
  onLoad: editorActions.editorPageLoaded,
  onRemoveTag: editorActions.removeTag,
  onSubmit: editorActions.articleSubmitted,
  onUnload: editorActions.editorPageUnLoaded,
  onUpdateField: editorActions.updateFieldEditor,

});
const connector = connect(mapStateToProps, mapDispatchToProps);
class Editor extends React.Component<ConnectedProps<typeof connector> & RouterMatchModel> {

  updateFieldEvent =
    key => ev => this.props.onUpdateField({ key, value: ev.target.value });
  changeTitle = this.updateFieldEvent('title');
  changeDescription = this.updateFieldEvent('description');
  changeBody = this.updateFieldEvent('body');
  changeTagInput = this.updateFieldEvent('tagInput');

  watchForEnter = ev => {
    if (ev.keyCode === 13) {
      ev.preventDefault(); 
      this.props.onAddTag();
    }
  };

  removeTagHandler = tag => () => {
    this.props.onRemoveTag(tag);
  };

  submitForm = ev => {
    ev.preventDefault();
    const article = {
      title: this.props.title,
      description: this.props.description,
      body: this.props.body,
      tagList: this.props.tagList
    };

    const slug = { slug: this.props.articleSlug };
    const promise = this.props.articleSlug ?
      agent.Articles.update(Object.assign(article, slug)) :
      agent.Articles.create(article);
    runAsync(this.props.onSubmit, promise);
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.slug !== nextProps.match.params.slug) {
      if (nextProps.match.params.slug) {
        this.props.onUnload();
        agent.Articles.get(this.props.match.params.slug).then(this.props.onLoad);
        return;
      }
      this.props.onLoad(null);
    }
  }

  componentWillMount() {
    if (this.props.match.params.slug) {
      agent.Articles.get(this.props.match.params.slug).then(this.props.onLoad);
      return;
    }
    this.props.onLoad(null);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">

              <ListErrors errors={this.props.errors}></ListErrors>

              <form>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Article Title"
                      value={this.props.title}
                      onChange={this.changeTitle} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="What's this article about?"
                      value={this.props.description}
                      onChange={this.changeDescription} />
                  </fieldset>

                  <fieldset className="form-group">
                    <textarea
                      className="form-control"
                      rows={8}
                      placeholder="Write your article (in markdown)"
                      value={this.props.body}
                      onChange={this.changeBody}>
                    </textarea>
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter tags"
                      value={this.props.tagInput}
                      onChange={this.changeTagInput}
                      onKeyUp={this.watchForEnter} />

                    <div className="tag-list">
                      {
                        (this.props.tagList || []).map(tag => {
                          return (
                            <span className="tag-default tag-pill" key={tag}>
                              <i className="ion-close-round"
                                onClick={this.removeTagHandler(tag)}>
                              </i>
                              {tag}
                            </span>
                          );
                        })
                      }
                    </div>
                  </fieldset>

                  <button
                    className="btn btn-lg pull-xs-right btn-primary"
                    type="button"
                    disabled={this.props.inProgress}
                    onClick={this.submitForm}>
                    Publish Article
                  </button>

                </fieldset>
              </form>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connector(Editor);
