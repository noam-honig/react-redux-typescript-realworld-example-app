import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect, ConnectedProps } from 'react-redux';
import {
  ADD_TAG,
  EDITOR_PAGE_LOADED,
  REMOVE_TAG,
  ARTICLE_SUBMITTED,
  EDITOR_PAGE_UNLOADED,
  UPDATE_FIELD_EDITOR
} from '../constants/actionTypes';
import { RouterMatchModel, StateModel } from '../models';

const mapStateToProps = (state: StateModel) => ({
  ...state.editor
});

const mapDispatchToProps = ({
  onAddTag: () =>
    ({ type: ADD_TAG }),
  onLoad: payload =>
    ({ type: EDITOR_PAGE_LOADED, payload }),
  onRemoveTag: tag =>
    ({ type: REMOVE_TAG, tag }),
  onSubmit: payload =>
    ({ type: ARTICLE_SUBMITTED, payload }),
  onUnload: () =>
    ({ type: EDITOR_PAGE_UNLOADED }),
  onUpdateField: (key, value) =>
    ({ type: UPDATE_FIELD_EDITOR, key, value })
});
const connector = connect(mapStateToProps, mapDispatchToProps);
class Editor extends React.Component<ConnectedProps<typeof connector> & RouterMatchModel> {
  constructor(props) {
    super(props);



  }
  updateFieldEvent =
    key => ev => this.props.onUpdateField(key, ev.target.value);
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

    this.props.onSubmit(promise);
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.slug !== nextProps.match.params.slug) {
      if (nextProps.match.params.slug) {
        this.props.onUnload();
        return this.props.onLoad(agent.Articles.get(this.props.match.params.slug));
      }
      this.props.onLoad(null);
    }
  }

  componentWillMount() {
    if (this.props.match.params.slug) {
      return this.props.onLoad(agent.Articles.get(this.props.match.params.slug));
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
