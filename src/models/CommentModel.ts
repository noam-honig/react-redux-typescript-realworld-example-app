import { ProfileModel } from "./ProfileModel";


export interface CommentModel {
    id?: number;
    body?: string;
    createdAt?: string;
    author?: ProfileModel;
}
