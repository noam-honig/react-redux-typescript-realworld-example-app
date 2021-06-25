import { ManyToOne, Field, Context, Entity, EntityBase, Validators } from "@remult/core";
import { CompoundIdField } from '@remult/core/src/column';
export interface ProfileModel {
    username?: string;
    bio?: string;
    image?: string;
    following?: boolean;
}



@Entity<ProfileEntity>({
    key: 'profiles',
    dbName: 'users',
    apiRequireId: true
})
export class ProfileEntity extends EntityBase implements ProfileModel {
    @Field({
        validate: [Validators.required, Validators.unique]
    })
    username: string;
    @Field()
    bio: string;
    @Field({ caption: "URL of profile picture" })
    image: string = '';
    followingRel = new ManyToOne(this.context.for(Follows), f => f.follower.isEqualTo(this.context.user.id).and(f.following.isEqualTo(this)));
    @Field<ProfileEntity>({
        serverExpression: async self => {
            await self.followingRel.load();
            return self.followingRel.exists();
        }
    })
    following: boolean;
    constructor(protected context: Context) {
        super()
    }
    async toggleFollowing() {
        await this.followingRel.load();
        if (!this.followingRel.exists()) {
            await this.followingRel.item.save();
        }
        else {
            await this.followingRel.item.delete();
        }
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
            follows.$.following.error = "cannot be same as " + follows.$.follower.metadata.caption
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
    following: ProfileEntity;
    constructor(private context: Context) {
        super()
    }

}
