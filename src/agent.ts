import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import { MultipleArticlesModel, SingleArticle } from './models';
import { ArticleModel, Favorites as FavoriteEntity } from "./models/ArticleModel";
import { Context, EntityWhere, getEntityRef, getFields, UserInfo } from '@remult/core';
import jwt_decode from 'jwt-decode';
import { Follows as FollowEntity, ProfileModel } from './models/ProfileModel';
import { set } from '@remult/core/set';
import { actionInfo } from '@remult/core/src/server-action';
const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'https://conduit.productionready.io/api';


const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }
}

actionInfo.runningOnServer = false;

export const context = new Context({
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


const Articles = {
  all: (page?: number) => multipleArticles(undefined, page),

  byAuthor: async (author: string, page?: number) => {
    let auth = await context.for(ProfileModel).getCachedByIdAsync(author);
    return multipleArticles(a => a.author.isEqualTo(auth), page);
  },
  byTag: (tag: string, page?: number) =>
    multipleArticles(a => a.tagList.contains(tag), page),
  del: async (slug: string) =>
    context.for(ArticleModel).findId(slug).then(a => getEntityRef(a).delete()),

  favorite: (slug: string) =>
    context.for(ArticleModel).getCachedByIdAsync(slug).then(async article => {
      if (!article.favoritedRef.exists())
        await getEntityRef(article.favoritedRef.item).save()
      return { article } as SingleArticle
    }),
  favoritedBy: (author: string, page?: number) =>
    context.for(FavoriteEntity).find({ where: f => f.userId.isEqualTo(author) }).then(f => multipleArticles(a => a.slug.isIn(f.map(f => f.articleId)), page)),

  feed: (page?: number) =>
    context.for(FollowEntity).find({ where: f => f.follower.isEqualTo(context.user.id) })
      .then(f => Promise.all(f.map(f => getFields(f).following.load())))
      .then(authors => multipleArticles(a => a.author.isIn(authors), page)),
  get: (slug: string) =>
    context.for(ArticleModel).getCachedByIdAsync(slug).then(loadAllFields).then(async article => ({ article } as SingleArticle)),
  unfavorite: (slug: string) =>
    context.for(ArticleModel).getCachedByIdAsync(slug).then(async article => {
      if (article.favoritedRef.exists())
        await getEntityRef(article.favoritedRef.item).delete();
      return { article } as SingleArticle;
    }),
  update: ({ slug, title, description, body, tagList }: ArticleModel) =>
    context.for(ArticleModel).getCachedByIdAsync(slug).then(a => {
      return getEntityRef(set(a, { title, description, body, tagList })).save();
    }).then(article => ({ article } as SingleArticle))
  ,
  create: ({ slug, title, description, body, tagList }: ArticleModel) =>
    getEntityRef(context.for(ArticleModel).create({ slug, title, description, body, tagList })).save().then(article => ({ article } as SingleArticle))
};



export default {
  Articles,
  setToken: (_token: string) => {
    token = _token;
    let userInfo: UserInfo = undefined;
    if (token)
      userInfo = jwt_decode(token);
    context.setUser(userInfo);
  }
};


async function multipleArticles(where: EntityWhere<ArticleModel>, page: number): Promise<MultipleArticlesModel> {
  let [articles, articlesCount] =
    await Promise.all([
      context.for(ArticleModel).find({ where, limit: 10, page }).then(loadAllItems),
      context.for(ArticleModel).count(where)]);
  return { articles, articlesCount };
}

export async function loadAllFields<T>(e: T) {
  await Promise.all([...getFields(e)].map(x => x.load()));
  return e;
}
export async function loadAllItems<T>(e: T[]) {
  return Promise.all(e.map(x => loadAllFields(x)))
}