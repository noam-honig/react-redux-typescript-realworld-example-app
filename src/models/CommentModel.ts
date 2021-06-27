import {  ProfileModel } from "./ProfileModel";
import { Field, Entity, Context, Validators, getEntityRef } from "@remult/core";




@Entity<CommentModel>({
    key: 'comment',
    //dbAutoIncrementId: true,
    allowApiUpdate: (context, comment) => comment.author.username == context.user.id,
    allowApiDelete: (context, comment) => comment.author.username == context.user.id,
    allowApiInsert: context => context.isSignedIn(),
    allowApiRead: true,
    saving: async (self) => {
        if (self.context.backend && getEntityRef(self).isNew()) {
            self.author = await self.context.for(ProfileModel).findId(self.context.user.id);
            let max = await getEntityRef(self).repository.find({
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
export class CommentModel  {
    @Field({
        allowApiUpdate: false
    })
    id: number;
    @Field<CommentModel>({
        allowApiUpdate: (c, x) => getEntityRef(x).isNew()
    })
    articleId: string;
    @Field<CommentModel, string>({
        validate: Validators.required
    })
    body: string;
    @Field({
        allowApiUpdate: false
    })
    createdAt: Date = new Date();
    @Field<CommentModel>({
        dataType: ProfileModel,
        allowApiUpdate: false
    })
    author: ProfileModel;
    constructor(private context: Context) {

    }


}
