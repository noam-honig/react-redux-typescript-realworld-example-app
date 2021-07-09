import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import { Context, EntityWhere, getFields, UserInfo } from '@remult/core';
import jwt_decode from 'jwt-decode';
import { actionInfo } from '@remult/core/src/server-action';
import { ArticleModel } from './models/ArticleModel';
import { MultipleArticlesModel } from './models';
import { Follows } from './models/ProfileModel';
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
    superagent.put(`/${url}`, body).use(tokenPlugin).then(responseBody),
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
export default {
  setToken: (_token: string) => {
    token = _token;
    let userInfo: UserInfo = undefined;
    if (token)
      userInfo = jwt_decode(token);
    context.setUser(userInfo);
  }
};





export async function multipleArticles(where: EntityWhere<ArticleModel>, page: number): Promise<MultipleArticlesModel> {
  let [articles, articlesCount] =
    await Promise.all([
      context.for(ArticleModel).find({ where, limit: 10, page }),
      context.for(ArticleModel).count(where)]);
  return { articles, articlesCount };
}
export function userArticleFeed(page = 0) {
  return context.for(Follows).find({ where: f => f.follower.isEqualTo(context.user.id) })
    .then(f => Promise.all(f.map(f => getFields(f).following.load())))
    .then(authors => multipleArticles(a => a.author.isIn(authors), page));
}