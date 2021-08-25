import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import { Remult, EntityWhere,  UserInfo } from 'remult';
import jwt_decode from 'jwt-decode';
import { actionInfo } from 'remult/src/server-action';
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

export const remult = new Remult({
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
    remult.setUser(userInfo);
  }
};





export async function multipleArticles(where: EntityWhere<ArticleModel>, page: number): Promise<MultipleArticlesModel> {
  let [articles, articlesCount] =
    await Promise.all([
      remult.repo(ArticleModel).find({ where, limit: 10, page }),
      remult.repo(ArticleModel).count(where)]);
  return { articles, articlesCount };
}
