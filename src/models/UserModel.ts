import { ProfileModel } from "./ProfileModel";
import { Field, Context, Entity, UserInfo, Validators, BackendMethod, getEntityRef, getFields } from "@remult/core";
import { SingleUser } from "../models";

export interface UserModel extends ProfileModel {
    token: string;
    password: string;
    email:string;
}


const passwordPlaceholder = 'passwordPlaceholder';

@Entity<UserEntity>({
    key: 'user',
    dbName: 'users',
    allowApiCrud: context => context.isSignedIn(),
    allowApiRead: true,
    allowApiInsert: false,
    apiRequireId: true,
    allowApiUpdate: (context, user) => getFields(user).username.originalValue == context.user.id,
    allowApiDelete: (context, user) => getFields(user).username.originalValue == context.user.id,

    saving: async (user) => {
        if (user.context.backend && user.password) {
            user.hashedPassword = await (await import('argon2')).hash(user.password);
        }
    }
})
export class UserEntity extends ProfileModel {
    @Field({
        validate: [Validators.required, Validators.unique],
        inputType: 'email'
    })
    email: string = '';

    @Field({
        inputType: 'password',
        serverExpression: () => 'passwordPlaceholder',
        validate: Validators.required
    })
    password: string = '';
    @Field({
        includeInApi: false,
        dbName: 'password'
    })
    hashedPassword: string = '';

    @BackendMethod({ allowed: true })
    static async signIn(email: string, password: string, context?: Context) {
        let user = await context.for(UserEntity).findFirst(x => x.email.isEqualTo(email));
        let errorMessage = "email or password is invalid";

        if (!user)
            throw new Error(errorMessage);
        if (user.password && user.password.trim().length > 0)
            if (!await (await import('argon2')).verify(user.hashedPassword, password))
                throw new Error(errorMessage);
        return await user.createSingleUserInterface();
    }
    @BackendMethod({ allowed: true })
    async saveAndReturnSingleUser() {
        let ref = getEntityRef(this)
        if (ref.isNew() || this.username == this.context.user.id) {
            await ref.save();
            return await this.createSingleUserInterface();
        }
        else throw new Error("Invalid operation");
    }
    @BackendMethod({ allowed: context => context.isSignedIn() })
    static async currentUser(context?: Context) {
        let u = await context.for(UserEntity).findId(context.user.id);
        return await u.createSingleUserInterface();
    }
    async createSingleUserInterface(): Promise<SingleUser> {
        let userInfo: UserInfo = {
            id: this.username,
            name: this.username,
            roles: []
        };
        let r: SingleUser = {
            user: {
                bio: this.bio,
                email: this.email,
                image: this.image,
                password: undefined,
                token: (await import('jsonwebtoken')).sign(userInfo, process.env.TOKEN_SIGN_KEY),
                username: this.username
            }
        }
        return r;
    }



}
