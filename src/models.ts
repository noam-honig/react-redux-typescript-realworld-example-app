import { CommentModel } from "./models/CommentModel";
import { ArticleModel } from "./models/ArticleModel";
import { ProfileModel } from "./models/ProfileModel";
import { UserModel } from "./models/UserModel";


export interface MultipleArticlesModel {
    articles: ArticleModel[],
    articlesCount: number
}

export type Pager = (page: number) => Promise<MultipleArticlesModel>;

export interface SettingsFormsState {
    email: string;
    username: string;
    bio: string;
    image: string;
    password: string;
    inProgress?: boolean;
}


export interface StateModel {
    article: ArticleState;
    common: CommonState;
    home: HomeState;
    articleList: ArticleListState;
    profile: ProfileModel;
    editor: EditorState;
    auth: AuthState;
    settings: SettingsState;
};
export interface CommonState {
    currentUser?: UserModel;
    appName?: string;
    token?: string;
    appLoaded?: boolean;
    redirectTo?: string;
    viewChangeCounter?: number;
}
export interface SettingsState {
    inProgress?: boolean;
    errors?: any;
    currentUser?: SettingsFormsState;
}
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
    article?:ArticleModel,
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


export interface RouterMatchModel {
    match: { params: { id?: string, username?: string, slug?: string } }
}

