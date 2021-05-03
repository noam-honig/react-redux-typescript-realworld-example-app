import React from 'react';
import agent from '../agent';
import { connect, ConnectedProps } from 'react-redux';
import { SET_PAGE } from '../constants/actionTypes';
import { Pager } from '../models';
import { articleList } from '../reducers/articleList';


const mapDispatchToProps =  ({
  onSetPage: articleList.setPage
});

const connector = connect(() => ({}), mapDispatchToProps);
const ListPagination = (props: ConnectedProps<typeof connector> & {
  articlesCount: number,
  pager: Pager,
  currentPage: number
}) => {
  if (props.articlesCount <= 10) {
    return null;
  }

  const range = [];
  for (let i = 0; i < Math.ceil(props.articlesCount / 10); ++i) {
    range.push(i);
  }

  const setPage = page => {
    if (props.pager) {
      props.pager(page).then(articles => props.onSetPage({ page, articles }))
    } else {
      agent.Articles.all(page).then(articles => props.onSetPage({ page, articles }));
    }
  };

  return (
    <nav>
      <ul className="pagination">

        {
          range.map(v => {
            const isCurrent = v === props.currentPage;
            const onClick = ev => {
              ev.preventDefault();
              setPage(v);
            };
            return (
              <li
                className={isCurrent ? 'page-item active' : 'page-item'}
                onClick={onClick}
                key={v.toString()}>

                <a className="page-link" href="">{v + 1}</a>

              </li>
            );
          })
        }

      </ul>
    </nav>
  );
};

export default connector(ListPagination);
