import * as express from 'express';
import { initExpress } from '@remult/core/server';
import * as expressJwt from 'express-jwt';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { config } from 'dotenv';

import "../models/ProfileModel";
import "../models/ArticleModel";
import "../models/UserModel";
import "../models/CommentModel";
import "../models/tagsModel";
config();
let app = express();
app.use(expressJwt({
    secret: process.env.TOKEN_SIGN_KEY,
    credentialsRequired: false,
    algorithms: ['HS256']
}));
app.use(helmet());
app.use(compression());
initExpress(app);
app.listen(3002, () => console.log("Server started"));
