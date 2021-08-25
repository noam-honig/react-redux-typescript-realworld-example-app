import { ProfileModel } from "./ProfileModel";
import { Field, Entity, Validators, getEntityRef, Allow, Remult, isBackend, EntityBase } from "remult";




@Entity<CommentModel>({
    key: 'comment',
    //dbAutoIncrementId: true,
    allowApiUpdate: (remult, comment) => comment.author.username == remult.user.id,
    allowApiDelete: (remult, comment) => comment.author.username == remult.user.id,
    allowApiInsert: Allow.authenticated,
    allowApiRead: true,
    saving: async (self) => {
        if (isBackend() && getEntityRef(self).isNew()) {
            self.author = await self.remult.repo(ProfileModel).findId(self.remult.user.id);
            let max = await getEntityRef(self).repository.find({
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
export class CommentModel extends EntityBase {
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
        valueType: ProfileModel,
        allowApiUpdate: false
    })
    author: ProfileModel;
    constructor(private remult: Remult) { 
        super();
    }


}
