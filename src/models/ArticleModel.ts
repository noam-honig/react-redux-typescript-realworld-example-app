import { Validators, Field, Entity, getEntityRef, getFields, EntityBase, Allow, CustomFilterBuilder, Filter, AndFilter, Remult, isBackend } from "remult";
import { CompoundIdField, OneToMany } from 'remult/src/column';
import * as slug from "slug";

import { CommentModel } from "./CommentModel";
import { Follows, ProfileModel } from "./ProfileModel";



@Entity<ArticleModel>({
    key: 'article',

    defaultOrderBy: article => article.createdAt.descending(),
    allowApiInsert: Allow.authenticated,
    allowApiUpdate: (remult, self) => self.author.username == remult.user.id,
    allowApiDelete: (remult, self) => self.author.username == remult.user.id,
    allowApiRead: true,
    saving: async (article) => {
        if (isBackend()) {
            if (getEntityRef(article).isNew())
                article.author = await article.remult.repo(ProfileModel).findId(article.remult.user.id)
            article.updatedAt = new Date();
            if (getFields(article).title.valueChanged()) {
                article.slug = slug(article.title, { lower: true }) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
            }
        }
    },
    customFilterBuilder: () => ArticleModel.filter
})
export class ArticleModel extends EntityBase {

    @Field({ allowApiUpdate: false })
    slug?: string;
    @Field({
        caption: 'Article Title',
        validate: Validators.required
    })
    title?: string;
    @Field({
        caption: "What's this article about?",
        validate: Validators.required
    })
    description?: string;
    @Field({
        validate: Validators.required
    })
    body?: string;
    @Field({ defaultValue: () => [] })
    tagList?: string[];

    @Field({ allowApiUpdate: false })
    createdAt?: Date = new Date();
    @Field({ allowApiUpdate: false })
    updatedAt?: Date;
    async getFavorited?() {
        return this.remult.repo(Favorites).findFirst({ createIfNotFound: true, where: f => f.articleId.isEqualTo(this.slug).and(f.userId.isEqualTo(this.remult.user.id)) });
    }

    @Field<ArticleModel>({ serverExpression: async self => !(await self.getFavorited()).isNew() })
    favorited?: boolean;
    @Field<ArticleModel>({
        serverExpression: async article => article.remult.repo(Favorites).count(f => f.articleId.isEqualTo(article.slug))
    })
    favoritesCount?: number;
    @Field<ArticleModel>({
        valueType: ProfileModel,
        allowApiUpdate: false
    })
    author?: ProfileModel;

    comments?= new OneToMany(this.remult.repo(CommentModel), {
        where: c => c.articleId.isEqualTo(this.slug)
    })

    constructor(private remult?: Remult) {
        super();
    }
    async toggleFavorite?() {
        let favorited = await this.getFavorited();

        if (favorited.isNew()) {
            await favorited.save();
            this.favoritesCount++;
        }
        else {
            await favorited.delete();
            this.favoritesCount--;
        }
        return await this._.reload();
    }
    static filter = new CustomFilterBuilder<ArticleModel,
        {
            userFeed?: boolean,
            favoritedByUser?: string
        }>(async (a, c, remult) => {
            let result: Filter[] = [];

            if (c.userFeed) {
                result.push(await remult.repo(Follows).find({ where: f => f.follower.isEqualTo(remult.user.id) })
                    .then(f => Promise.all(f.map(f => getFields(f).following.load())))
                    .then(authors => a.author.isIn(authors)));
            } else if (c.favoritedByUser) {
                let favorites = await remult.repo(Favorites).find({ where: favorite => favorite.userId.isEqualTo(c.favoritedByUser) })
                result.push(a.slug.isIn(favorites.map(f => f.articleId)));
            }
            return new AndFilter(...result);
        });


}
@Entity<Favorites>({
    key: 'Favorites',
    id: self => new CompoundIdField(self.userId, self.articleId),
    allowApiInsert: Allow.authenticated,
    allowApiDelete: (context, self) => self.userId == context.user.id,
    allowApiRead: true,
    saving: (self) => {
        if (getEntityRef(self).isNew())
            self.userId = self.remult.user.id;
    }
})
export class Favorites extends EntityBase {
    @Field({
        allowApiUpdate: false
    })
    userId: string;
    @Field<Favorites>({
        allowApiUpdate: (c, self) => getEntityRef(self).isNew()
    })
    articleId: string;
    constructor(private remult: Remult) {
        super();
    }

}

