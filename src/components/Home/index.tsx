import Banner from './Banner';
import MainView from './MainView';
import React from 'react';
import Tags from './Tags';
import agent from '../../agent';
import { connect, ConnectedProps } from 'react-redux';
import { HomeState, StateModel } from '../../models';
import { articleListActions } from '../../reducers/articleList';
import { homeActions } from '../../reducers/home';

const Promise = global.Promise;

const mapStateToProps = (state: StateModel) => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = ({
  onClickTag: articleListActions.applyTagFilter,
  onLoad: homeActions.homePageLoaded,
  onUnload: homeActions.homePageUnloaded
});
const connector = connect(mapStateToProps, mapDispatchToProps);
class Home extends React.Component<ConnectedProps<typeof connector> & HomeState> {
  componentWillMount() {
    const tab = this.props.token ? 'feed' : 'all';
    const articlesPromise = this.props.token ?
      agent.Articles.feed :
      agent.Articles.all;
    Promise.all([agent.Tags.getAll(), articlesPromise()]).then(x => {
      this.props.onLoad({
        tab: tab,
        pager: articlesPromise,
        articles: x[1],
        tags: x[0]
      })
    });

  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="home-page">

        <Banner token={this.props.token} appName={this.props.appName} />

        <div className="container page">
          <div className="row">
            <MainView />

            <div className="col-md-3">
              <div className="sidebar">

                <p>Popular Tags</p>

                <Tags
                  tags={this.props.tags}
                  onClickTag={this.props.onClickTag} />

              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default connector(Home);
