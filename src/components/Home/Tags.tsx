import React from 'react';
import { multipleArticles } from '../../agent';
import { articleListActions } from '../../reducers/articleList';

const Tags = (props: {
  onClickTag: typeof articleListActions.applyTagFilter,
  tags: string[]
}) => {
  const tags = props.tags;
  if (tags) {
    return (
      <div className="tag-list">
        {
          tags.map(tag => {
            const handleClick = ev => {
              ev.preventDefault();
              let pager = (page = 0) => multipleArticles(article => article.tagList.contains(tag), page);
              pager(0).then(articles => props.onClickTag({ pager, tag, articles }));
            };

            return (
              <a
                href=""
                className="tag-default tag-pill"
                key={tag}
                onClick={handleClick}>
                {tag}
              </a>
            );
          })
        }
      </div>
    );
  } else {
    return (
      <div>Loading Tags...</div>
    );
  }
};

export default Tags;
