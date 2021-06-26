import { ProfileEntity, ProfileModel } from "./ProfileModel";
import { Field, Entity, Context, EntityBase, Validators } from "@remult/core";


export interface CommentModel {
    id?: number;
    body?: string;
    createdAt?: Date;
    author?: ProfileModel;
}

@Entity<CommentEntity>({
    key: 'comment',
    //dbAutoIncrementId: true,
    allowApiUpdate: (context, comment) => comment.author.username == context.user.id,
    allowApiDelete: (context, comment) => comment.author.username == context.user.id,
    allowApiInsert: context => context.isSignedIn(),
    allowApiRead: true,
    saving: async (self) => {
        if (self.context.backend && self.isNew()) {
            self.author = await self.context.for(ProfileEntity).findId(self.context.user.id);
            let max = await self._.repository.find({
                where: c => c.articleId.isEqualTo(self.articleId),
                orderBy: c => c.id.descending(),
                limit: 1
            });
            if (max.length == 1) {
                self.id = max[0].id + 1;
            } else
                self.id = 1;
        }

    }
})
export class CommentEntity extends EntityBase implements CommentModel {
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
        dataType:ProfileEntity,
        allowApiUpdate: false
    })
    author: ProfileEntity;

    constructor(private context: Context) {
        super();
    }

}