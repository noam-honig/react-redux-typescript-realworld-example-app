import { ProfileModel } from "./ProfileModel";
import { Field, Context, Entity, UserInfo, Validators, BackendMethod, getEntityRef, getFields } from "@remult/core";

const passwordPlaceholder = 'passwordPlaceholder';

@Entity<UserModel>({
    key: 'user',
    dbName: 'users',
    allowApiCrud: context => context.isSignedIn(),
    allowApiRead: true,
    allowApiInsert: false,
    apiRequireId: true,
    allowApiUpdate: (context, user) =>true,// getFields(user).username.originalValue == context.user.id,
    allowApiDelete: (context, user) => getFields(user).username.originalValue == context.user.id,

    saving: async (user) => {
        if (user.context.backend && user.password) {
            user.hashedPassword = await (await import('argon2')).hash(user.password);
        }
    }
})
export class UserModel extends ProfileModel {
    @Field({
        validate: [Validators.required, Validators.unique],
        inputType: 'email'
    })
    email: string = '';

    @Field({
        inputType: 'password',
        serverExpression: () => passwordPlaceholder,
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
        let user = await context.for(UserModel).findFirst(x => x.email.isEqualTo(email));
        let errorMessage = "email or password is invalid";

        if (!user)
            throw new Error(errorMessage);
        if (user.password && user.password.trim().length > 0)
            if (!await (await import('argon2')).verify(user.hashedPassword, password))
                throw new Error(errorMessage);
        return await user.createToken();
    }
    @BackendMethod({ allowed: true })
    async saveAndReturnToken() {
        let ref = getEntityRef(this)
        if (ref.isNew() || this.username == this.context.user.id) {
            await ref.save();
            return await this.createToken();
        }
        else throw new Error("Invalid operation");
    }
    
    async createToken(): Promise<{ token: string }> {
        let userInfo: UserInfo = {
            id: this.username,
            name: this.username,
            roles: []
        };
        return {
            token: (await import('jsonwebtoken')).sign(userInfo, process.env.TOKEN_SIGN_KEY)
        }
    }



}
