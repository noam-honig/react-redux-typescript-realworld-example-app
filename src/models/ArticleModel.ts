import { Validators, EntityBase, Field, Entity, Context } from "@remult/core";
import { CompoundIdField, ManyToOne, OneToMany } from '@remult/core/src/column';
import * as slug from "slug";
import { CommentEntity } from "./CommentModel";
import { ProfileEntity, ProfileModel } from "./ProfileModel";


export interface ArticleModel {
    slug?: string;
    title?: string;
    description?: string;
    body?: string;
    tagList?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    favorited?: boolean;
    favoritesCount?: number;
    author?: ProfileModel;
}


@Entity<ArticleEntity>({
    key: 'article',

    defaultOrderBy: article => article.createdAt.descending(),
    allowApiInsert: context => context.isSignedIn(),
    allowApiUpdate: (context, self) => self.author.username == context.user.id,
    allowApiDelete: (context, self) => self.author.username == context.user.id,
    allowApiRead: true,
    saving: async (article) => {
        if (article.context.backend) {
            if (article.isNew())
                article.author = await article.context.for(ProfileEntity).findId(article.context.user.id)
            article.updatedAt = new Date();
            if (article.$.title.wasChanged()) {
                article.slug = slug(article.title, { lower: true }) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
            }
        }
    }
})
export class ArticleEntity extends EntityBase implements ArticleModel {

    @Field({ allowApiUpdate: false })
    slug: string;
    @Field({
        caption: 'Article Title',
        validate: Validators.required
    })
    title: string;
    @Field({
        caption: "What's this article about?",
        validate: Validators.required
    })
    description: string;
    @Field({
        validate: Validators.required
    })
    body: string;
    @Field({ defaultValue: () => [] })
    tagList: string[];

    @Field({ allowApiUpdate: false })
    createdAt: Date = new Date();
    @Field({ allowApiUpdate: false })
    updatedAt: Date;
    favoritedRef = new ManyToOne(this.context.for(Favorites), f => f.articleId.isEqualTo(this.slug).and(f.userId.isEqualTo(this.context.user.id)));
    @Field<ArticleEntity>({ serverExpression: self => self.favoritedRef.exists() })
    favorited: boolean;
    @Field<ArticleEntity>({
        serverExpression: async article => article.context.for(Favorites).count(f => f.articleId.isEqualTo(article.slug))
    })
    favoritesCount: number;
    @Field<ArticleEntity>({ allowApiUpdate: false })
    author: ProfileEntity;

    comments = new OneToMany(this.context.for(CommentEntity), {
        where: c => c.articleId.isEqualTo(this.slug)
    })

    constructor(private context: Context) {
        super()
    }

    async toggleFavorite() {
        await this.favoritedRef.load();

        if (this.favoritedRef.exists()) {
            await this.favoritedRef.item.delete();
            this.favoritesCount--;
        }
        else {
            await this.favoritedRef.item.save();
            this.favoritesCount++;
        }
    }

}
@Entity<Favorites>({
    key: 'Favorites',
    id: self => new CompoundIdField(self.userId, self.articleId),
    allowApiInsert: context => context.isSignedIn(),
    allowApiDelete: (context, self) => self.userId == context.user.id,
    allowApiRead: true,
    saving: (self) => {
        if (self.isNew())
            self.userId = self.context.user.id;
    }
})
export class Favorites extends EntityBase {
    @Field({
        allowApiUpdate: false
    })
    userId: string;
    @Field<Favorites>({
        allowApiUpdate: (c, self) => self.isNew()
    })
    articleId: string;
    constructor(private context: Context) {
        super();
    }
}