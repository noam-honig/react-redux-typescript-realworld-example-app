import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import { ListOfTags, MultipleArticlesModel, MultipleComments, SingleArticle, SingleComment, SingleProfile, SingleUser } from './models';
import { CommentEntity, CommentModel } from "./models/CommentModel";
import { UserEntity, UserModel } from "./models/UserModel";
import { ArticleEntity, ArticleModel, Favorites as FavoriteEntity } from "./models/ArticleModel";
import { Context, EntityWhere } from '@remult/core';
import { Follows as FollowEntity, ProfileEntity } from './models/ProfileModel';
import { set } from '@remult/core/set';
import { TagEntity } from './models/tagsModel';
import { actionInfo } from '@remult/core/src/server-action';
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

actionInfo.runningOnServer = false;

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
  all: (page?: number) => multipleArticles(undefined, page),

  byAuthor: async (author: string, page?: number) => {
    let auth = await context.for(ProfileEntity).getCachedByIdAsync(author);
    return multipleArticles(a => a.author.isEqualTo(auth), page);
  },
  byTag: (tag: string, page?: number) =>
    multipleArticles(a => a.tagList.contains(tag), page),
  del: async (slug: string) =>
    context.for(ArticleEntity).findId(slug).then(a => a.delete()),

  favorite: (slug: string) =>
    context.for(ArticleEntity).getCachedByIdAsync(slug).then(async article => {
      if (!article.favoritedRef.exists())
        await article.favoritedRef.item.save()
      return { article } as SingleArticle
    }),
  favoritedBy: (author: string, page?: number) =>
    context.for(FavoriteEntity).find({ where: f => f.userId.isEqualTo(author) }).then(f => multipleArticles(a => a.slug.isIn(f.map(f => f.articleId)), page)),

  feed: (page?: number) =>
    context.for(FollowEntity).find({ where: f => f.follower.isEqualTo(context.user.id) })
      .then(f => Promise.all(f.map(f => f.$.following.load())))
      .then(authors => multipleArticles(a => a.author.isIn(authors), page)),
  get: (slug: string) =>
    context.for(ArticleEntity).getCachedByIdAsync(slug).then(article => ({ article } as SingleArticle)),
  unfavorite: (slug: string) =>
    context.for(ArticleEntity).getCachedByIdAsync(slug).then(async article => {
      if (article.favoritedRef.exists())
        await article.favoritedRef.item.delete();
      return { article } as SingleArticle;
    }),
  update: (article: ArticleModel) =>
    context.for(ArticleEntity).getCachedByIdAsync(article.slug).then(a => {
      let { title, description, body, tagList } = article;
      return set(a, { title, description, body, tagList }).save();
    }).then(article => ({ article } as SingleArticle))
  ,
  create: ({ slug, body, description, tagList, title }: ArticleModel) =>
    context.for(ArticleEntity).getCachedByIdAsync(slug).then(article => set(article, { body, description, tagList, title }).save()).then(article => ({ article } as SingleArticle))
};

const Comments = {
  create: (slug: string, comment: CommentModel) =>
    context.for(ArticleEntity).getCachedByIdAsync(slug).then(article => set(article.comments.create(), { body: comment.body }).save()).then(comment => ({ comment } as SingleComment)),
  delete: (slug: string, commentId: number) =>
    context.for(CommentEntity).findFirst(c => c.articleId.isEqualTo(slug).and(c.id.isEqualTo(commentId))).then(c => c.delete()),

  forArticle: (slug: string) =>
    context.for(ArticleEntity).getCachedByIdAsync(slug).then(article => article.comments.load()).then(comments => ({ comments } as MultipleComments))
};

const Profile = {
  follow: (username: string) =>
    context.for(ProfileEntity).getCachedByIdAsync(username).then(async profile => {
      if (!profile.followingRel.exists())
        await profile.followingRel.item.save()
      return {
        profile
      } as SingleProfile
    }),
  get: (username: string) =>
    context.for(ProfileEntity).getCachedByIdAsync(username).then(profile => ({ profile } as SingleProfile)),
  unfollow: (username: string) =>
    context.for(ProfileEntity).getCachedByIdAsync(username).then(async profile => {
      if (profile.followingRel.exists())
        await profile.followingRel.item.delete();
      return {
        profile
      } as SingleProfile
    }),

};

export default {
  Articles,
  Auth,
  Comments,
  Profile,
  Tags,
  setToken: (_token: string) => { token = _token; }
};


async function multipleArticles(where: EntityWhere<ArticleEntity>, page: number): Promise<MultipleArticlesModel> {
  let [articles, articlesCount] =
    await Promise.all([
      context.for(ArticleEntity).find({ where, limit: 10, page }),
      context.for(ArticleEntity).count(where)]);
  let res = await Promise.all(articles.map(async (a) => a.$.author.load().then(() => a)));
  return { articles: res, articlesCount };
}
