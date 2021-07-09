import { Validators, Field, Entity, Context, getEntityRef, getFields, EntityBase } from "@remult/core";
import { CompoundIdField, OneToMany } from '@remult/core/src/column';
import * as slug from "slug";

import { CommentModel } from "./CommentModel";
import { ProfileModel } from "./ProfileModel";



@Entity<ArticleModel>({
    key: 'article',

    defaultOrderBy: article => article.createdAt.descending(),
    allowApiInsert: context => context.isSignedIn(),
    allowApiUpdate: (context, self) => self.author.username == context.user.id,
    allowApiDelete: (context, self) => self.author.username == context.user.id,
    allowApiRead: true,
    saving: async (article) => {
        if (article.context.backend) {
            if (getEntityRef(article).isNew())
                article.author = await article.context.for(ProfileModel).findId(article.context.user.id)
            article.updatedAt = new Date();
            if (getFields(article).title.wasChanged()) {
                article.slug = slug(article.title, { lower: true }) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
            }
        }
    }
})
export class ArticleModel {

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
        return this.context.for(Favorites).findFirst({ createIfNotFound: true, where: f => f.articleId.isEqualTo(this.slug).and(f.userId.isEqualTo(this.context.user.id)) });
    }

    @Field<ArticleModel>({ serverExpression: async self => !(await self.getFavorited()).isNew() })
    favorited?: boolean;
    @Field<ArticleModel>({
        serverExpression: async article => article.context.for(Favorites).count(f => f.articleId.isEqualTo(article.slug))
    })
    favoritesCount?: number;
    @Field<ArticleModel>({
        dataType: ProfileModel,
        allowApiUpdate: false
    })
    author?: ProfileModel;

    comments?= new OneToMany(this.context.for(CommentModel), {
        where: c => c.articleId.isEqualTo(this.slug)
    })

    constructor(private context?: Context) {

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
        await getEntityRef(this).reload();
        return this;
    }


}
@Entity<Favorites>({
    key: 'Favorites',
    id: self => new CompoundIdField(self.userId, self.articleId),
    allowApiInsert: context => context.isSignedIn(),
    allowApiDelete: (context, self) => self.userId == context.user.id,
    allowApiRead: true,
    saving: (self) => {
        if (getEntityRef(self).isNew())
            self.userId = self.context.user.id;
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
    constructor(private context: Context) {
        super();
    }
}

