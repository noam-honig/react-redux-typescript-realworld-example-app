import ArticleList from '../ArticleList';
import React from 'react';

import { connect, ConnectedProps } from 'react-redux';

import { StateModel } from '../../models';
import { articleListActions } from '../../reducers/articleList';
import { ArticleModel } from '../../models/ArticleModel';
import { multipleArticles, userArticleFeed } from '../../agent';

const YourFeedTab = (props: {
  token: string,
  tab: string,
  onTabClick: typeof articleListActions.changeTab
}) => {
  if (props.token) {
    const clickHandler = ev => {
      ev.preventDefault();
      userArticleFeed(0).then(articles =>
        props.onTabClick({
          tab: 'feed', pager: userArticleFeed, articles
        }));
    }

    return (
      <li className="nav-item">
        <a href=""
          className={props.tab === 'feed' ? 'nav-link active' : 'nav-link'}
          onClick={clickHandler}>
          Your Feed
        </a>
      </li>
    );
  }
  return null;
};

const GlobalFeedTab = (props: {
  onTabClick: typeof articleListActions.changeTab,
  tab: string
}) => {
  const clickHandler = ev => {
    ev.preventDefault();
    let pager = (page = 0) => multipleArticles(undefined, page);
    pager(0).then(articles => props.onTabClick({ tab: 'all', pager, articles }));
  };
  return (
    <li className="nav-item">
      <a
        href=""
        className={props.tab === 'all' ? 'nav-link active' : 'nav-link'}
        onClick={clickHandler}>
        Global Feed
      </a>
    </li>
  );
};

const TagFilterTab = props => {
  if (!props.tag) {
    return null;
  }

  return (
    <li className="nav-item">
      <a href="" className="nav-link active">
        <i className="ion-pound"></i> {props.tag}
      </a>
    </li>
  );
};

const mapStateToProps = (state: StateModel) => ({
  ...state.articleList,
  tags: state.home.tags,
  token: state.common.token
});

const mapDispatchToProps = ({
  onTabClick: articleListActions.changeTab
});

const connector = connect(mapStateToProps, mapDispatchToProps);
const MainView = (props: ConnectedProps<typeof connector> & { loading?: boolean }) => {
  return (
    <div className="col-md-9">
      <div className="feed-toggle">
        <ul className="nav nav-pills outline-active">

          <YourFeedTab
            token={props.token}
            tab={props.tab}
            onTabClick={props.onTabClick} />

          <GlobalFeedTab tab={props.tab} onTabClick={props.onTabClick} />

          <TagFilterTab tag={props.tag} />

        </ul>
      </div>

      <ArticleList
        pager={props.pager}
        articles={props.articles}
        loading={props.loading}
        articlesCount={props.articlesCount}
        currentPage={props.currentPage} />
    </div>
  );
};

export default connector(MainView);
