import React from 'react';
import agent from '../../agent';
import { articleList } from '../../reducers/articleList';

const Tags = (props: {
  onClickTag: typeof articleList.applyTagFilter,
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
              agent.Articles.byTag(tag).then(articles =>
                props.onClickTag({
                  tag,
                  pager: page => agent.Articles.byTag(tag, page),
                  articles
                }))
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
