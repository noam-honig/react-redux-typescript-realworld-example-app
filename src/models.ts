export interface ArticleModel {
    slug?: string;
    title?: string;
    description?: string;
    body?: string;
    tagList?: string[];
    createdAt?: string;
    updatedAt?: string;
    favorited?: boolean;
    favoritesCount?: number;
    author?: ProfileModel;
}
export interface MultipleArticlesModel {
    articles: ArticleModel[],
    articlesCount: number
}
export interface SingleArticle {
    article: ArticleModel
}
export type Pager = (page: number) => Promise<MultipleArticlesModel>;

export interface UserModel {

    email: string,
    token: string,
    username: string,
    bio: string,
    image: string

}
export interface SingleUser {
    user: UserModel
}

export interface ProfileModel {
    username?: string;
    bio?: string;
    image?: string;
    following?: boolean;
}
export interface SingleProfile {
    profile?: ProfileModel;
}

export interface CommentModel {
    id?: number;
    body?: string;
    createdAt?: string;
    author?: ProfileModel;
}
export interface SingleComment {
    comment: CommentModel;
}
export interface MultipleComments {
    comments: CommentModel[];
}

export interface StateModel {
    article: ArticleState;
    common: {
        currentUser: UserModel,
        appName: string,
        token: string,
        appLoaded: boolean,
        redirectTo: string
    };
    home: HomeState;
    articleList: ArticleListState;
    profile: ProfileModel;
    editor: EditorState;
    auth:AuthState;
    settings: {
        errors: {},
        currentUser: UserModel

    }
};
export interface AuthState {
    username?: string,
    email?: string,
    password?: string,
    inProgress?: boolean
    errors?: any
}
export interface EditorState extends ArticleModel {
    articleSlug?: string,
    tagInput?: string,
    inProgress?: boolean,
    errors?: any
}
export interface ArticleState {
    article?: ArticleModel;
    comments?: CommentModel[];
    commentErrors?: string;
    currentUser?: ProfileModel;
}
export interface HomeState {
    tags?: string[];
}
export interface ArticleListState {
    articles?: ArticleModel[];
    articlesCount?: number;
    currentPage?: number;
    pager?: Pager;
    tab?: string;
    tag?: string;
    tags?: string[];
}

export interface ListOfTags {
    tags: string[]
}
export interface RouterMatchModel {
    match: { params: { id?: string, username?: string, slug?: string } }
}

