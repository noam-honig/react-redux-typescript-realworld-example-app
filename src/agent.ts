import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import { ListOfTags, MultipleArticlesModel, MultipleComments, SingleArticle, SingleComment, SingleProfile, SingleUser } from './models';
import { CommentModel } from "./models/CommentModel";
import { UserEntity, UserModel } from "./models/UserModel";
import { ArticleModel } from "./models/ArticleModel";
import { Context } from '@remult/core';
import { ProfileEntity } from './models/ProfileModel';
import { set } from '@remult/core/set';
import { TagEntity } from './models/tagsModel';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'https://conduit.productionready.io/api';

const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }
}


const context = new Context({
  delete: (url: string) =>
    superagent.del(`/${url}`).use(tokenPlugin).then(responseBody),
  get: (url: string) =>
    superagent.get(`/${url}`).use(tokenPlugin).then(responseBody),
  put: (url: string, body: any) =>
    superagent.put(`/${url}`, body).use(tokenPlugin),
  post: async (url: string, body: any) => {
    return new Promise(async (res, err) => {
      try {
        let r = await superagent.post(`/${url}`, body).use(tokenPlugin).then(responseBody);
        res(r);
      }
      catch (x) {
        err({ error: x.response.body });
      }
    });
  }
});


class requests {
  static del<T>(url): Promise<T> {
    return superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody);
  }
  static get<T>(url: string): Promise<T> {
    return superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody);
  }
  static put<T>(url, body): Promise<T> {
    return superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody);
  }
  static post<T>(url, body): Promise<T> {
    return superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody);
  }
};

const Auth = {
  current: () => {
    return UserEntity.currentUser();
  },
  login: (email: string, password: string) =>
    UserEntity.signIn(email, password),
  register: async (username: string, email: string, password: string) => {
    let u = context.for(UserEntity).create({ username, email, password });
    return await u.saveAndReturnSingleUser();
  },
  save: async (user: UserModel) => {
    let u = await context.for(UserEntity).findId(context.user.id);
    set(u, user);
    return await u.saveAndReturnSingleUser();
  }
};

const Tags = {
  getAll: async () => ({ tags: await context.for(TagEntity).find().then(x => x.map(x => x.tag)) })
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = article => Object.assign({}, article, { slug: undefined })
const Articles = {
  all: (page?: number) =>
    requests.get<MultipleArticlesModel>(`/articles?${limit(10, page)}`),
  byAuthor: (author: string, page?: number) =>
    requests.get<MultipleArticlesModel>(`/articles?author=${encode(author)}&${limit(5, page)}`),
  byTag: (tag: string, page?: number) =>
    requests.get<MultipleArticlesModel>(`/articles?tag=${encode(tag)}&${limit(10, page)}`),
  del: (slug: string) =>
    requests.del(`/articles/${slug}`),
  favorite: (slug: string) =>
    requests.post<SingleArticle>(`/articles/${slug}/favorite`, {}),
  favoritedBy: (author: string, page?: number) =>
    requests.get<MultipleArticlesModel>(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
  feed: (page?: number) =>
    requests.get<MultipleArticlesModel>('/articles/feed?' + limit(10, page)),
  get: (slug: string) =>
    requests.get<SingleArticle>(`/articles/${slug}`),
  unfavorite: (slug: string) =>
    requests.del<SingleArticle>(`/articles/${slug}/favorite`),
  update: (article: ArticleModel) =>
    requests.put<SingleArticle>(`/articles/${article.slug}`, { article: omitSlug(article) }),
  create: (article: ArticleModel) =>
    requests.post<SingleArticle>('/articles', { article })
};

const Comments = {
  create: (slug: string, comment: CommentModel) =>
    requests.post<SingleComment>(`/articles/${slug}/comments`, { comment }),
  delete: (slug: string, commentId: number) =>
    requests.del(`/articles/${slug}/comments/${commentId}`),
  forArticle: (slug: string) =>
    requests.get<MultipleComments>(`/articles/${slug}/comments`)
};

const Profile = {
  follow: (username: string) =>
    requests.post<SingleProfile>(`/profiles/${username}/follow`, {}),
  get: (username: string) =>
    requests.get<SingleProfile>(`/profiles/${username}`),
  unfollow: (username: string) =>
    requests.del(`/profiles/${username}/follow`)
};

export default {
  Articles,
  Auth,
  Comments,
  Profile,
  Tags,
  setToken: (_token: string) => { token = _token; }
};

