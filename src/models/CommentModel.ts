import { ProfileEntity, ProfileModel } from "./ProfileModel";
import { Field, Entity, Context, EntityBase, Validators } from "@remult/core";


export interface CommentModel {
    id?: number;
    body?: string;
    createdAt?: string;
    author?: ProfileModel;
}





@Entity<CommentEntity>({
    key: 'comment',
    dbAutoIncrementId: true,
    allowApiUpdate: (context, comment) => comment.author.username == context.user.id,
    allowApiDelete: (context, comment) => comment.author.username == context.user.id,
    allowApiInsert: context => context.isSignedIn(),
    allowApiRead: true,
    saving: async (c) => {
        if (c.context.backend)
            c.author = await c.context.for(ProfileEntity).findId(c.context.user.id)
    }
})
export class CommentEntity extends EntityBase {
    @Field({
        allowApiUpdate: false
    })
    id: number;
    @Field<CommentEntity>({
        allowApiUpdate: (c, x) => x.isNew()
    })
    articleId: string;
    @Field<CommentEntity, string>({
        validate: Validators.required
    })
    body: string;
    @Field({
        allowApiUpdate: false
    })
    createdAt: Date = new Date();
    @Field<CommentEntity>({
        allowApiUpdate: false
    })
    author: ProfileEntity;

    constructor(private context: Context) {
        super();
    }

}