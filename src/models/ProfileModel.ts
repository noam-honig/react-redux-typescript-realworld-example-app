import { Field, Context, Entity, Validators, getFields, getEntityRef, EntityBase } from "@remult/core";
import { CompoundIdField } from '@remult/core/src/column';





@Entity<ProfileModel>({
    key: 'profiles',
    dbName: 'users',
    apiRequireId: true
})
export class ProfileModel {
    @Field({
        validate: [Validators.required, Validators.unique]
    })
    username: string;
    @Field()
    bio: string;
    @Field({ caption: "URL of profile picture" })
    image: string = '';
    followingRel?() {
        return this.context.for(Follows).findFirst({ createIfNotFound: true, where: f => f.follower.isEqualTo(this.context.user.id).and(f.following.isEqualTo(this)) });
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
    constructor(protected context: Context) {
    }

}
@Entity<Follows>({
    key: 'follows',
    id: self => new CompoundIdField(self.follower, self.following),
    allowApiInsert: context => context.isSignedIn(),
    allowApiDelete: (context, self) => self.follower == context.user.id,
    allowApiRead: true,
    validation: async follows => {
        if (follows.follower == follows.following.username)
            getFields(follows).following.error = "cannot be same as " + getFields(follows).follower.metadata.caption
    },
    apiDataFilter: (follows, context) =>
        follows.follower.isEqualTo(context.user.id)

})
export class Follows extends EntityBase {
    @Field({
        allowApiUpdate: false
    })
    follower: string = this.context.user.id;
    @Field()
    following: ProfileModel;
    constructor(private context: Context) {
        super();
    }

}
