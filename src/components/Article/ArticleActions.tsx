import { Link } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { ArticleModel } from "../../models/ArticleModel";
import { commonActions } from '../../reducers/common';

const mapDispatchToProps = ({
  onClickDelete: commonActions.deleteArticle
});
const connector = connect(() => ({}), mapDispatchToProps);
const ArticleActions = (props: ConnectedProps<typeof connector> & {
  canModify: Boolean,
  article: ArticleModel
}) => {
  const article = props.article;
  const del = () => {
    article.delete().then(props.onClickDelete);
  };
  if (props.canModify) {
    return (
      <span>

        <Link
          to={`/editor/${article.slug}`}
          className="btn btn-outline-secondary btn-sm">
          <i className="ion-edit"></i> Edit Article
        </Link>

        <button className="btn btn-outline-danger btn-sm" onClick={del}>
          <i className="ion-trash-a"></i> Delete Article
        </button>

      </span>
    );
  }

  return (
    <span>
    </span>
  );
};

export default connector(ArticleActions);
