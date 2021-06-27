import { ManyToOne, Field, Context, Entity, Validators, getFields, getEntityRef } from "@remult/core";
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
    username?: string;
    @Field()
    bio?: string;
    @Field({ caption: "URL of profile picture" })
    image?: string = '';
    followingRel?= new ManyToOne(this.context.for(Follows), f => f.follower.isEqualTo(this.context.user.id).and(f.following.isEqualTo(this)));
    @Field<ProfileModel>({
        serverExpression: async self => {
            await self.followingRel.load();
            return self.followingRel.exists();
        }
    })
    following?: boolean;
    async toggleFollowing?() {
        await this.followingRel.load();
        if (!this.followingRel.exists()) {
            await getEntityRef(this.followingRel.item).save();
        }
        else {
            await getEntityRef(this.followingRel.item).delete();
        }
        await getEntityRef(this).reload();
        return this;
    }
    constructor(protected context?: Context) {
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
export class Follows {
    @Field({
        allowApiUpdate: false
    })
    follower: string = this.context.user.id;
    @Field()
    following: ProfileModel;
    constructor(private context: Context) {

    }

}
