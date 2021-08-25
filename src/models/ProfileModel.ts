import { Field, Remult, Entity, Validators, getFields, getEntityRef, EntityBase, Allow } from "remult";
import { CompoundIdField } from 'remult/src/column';





@Entity<ProfileModel>({
    key: 'profiles',
    dbName: 'users',
    apiRequireId: true
})
export class ProfileModel extends EntityBase {
    @Field({
        validate: [Validators.required, Validators.unique]
    })
    username: string;
    @Field()
    bio: string;
    @Field({ caption: "URL of profile picture" })
    image: string = '';
    followingRel?() {
        return this.remult.repo(Follows).findFirst({ createIfNotFound: true, where: f => f.follower.isEqualTo(this.remult.user.id).and(f.following.isEqualTo(this)) });
    }
    @Field<ProfileModel>({
        serverExpression: async self => !(await self.followingRel()).isNew()
    })
    following: boolean;
    async toggleFollowing() {
        let f = await this.followingRel();
        if (f.isNew()) {
            await f.save();
        }
        else {
            await f.delete();
        }
        await getEntityRef(this).reload();
        return this;
    }
    constructor(protected remult: Remult) {
        super();
    }

}
@Entity<Follows>({
    key: 'follows',
    id: self => new CompoundIdField(self.follower, self.following),
    allowApiInsert: Allow.authenticated,
    allowApiDelete: (context, self) => self.follower == context.user.id,
    allowApiRead: true,
    validation: async follows => {
        if (follows.follower == follows.following.username)
            getFields(follows).following.error = "cannot be same as " + getFields(follows).follower.metadata.caption
    }
}, (options, remult) =>
    options.apiDataFilter = (follows) =>
        follows.follower.isEqualTo(remult.user.id)

)
export class Follows extends EntityBase {
    @Field({
        allowApiUpdate: false
    })
    follower: string = this.remult.user.id;
    @Field()
    following: ProfileModel;
    constructor(private remult: Remult) {
        super();
    }

}
