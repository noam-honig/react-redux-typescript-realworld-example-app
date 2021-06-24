import { ProfileModel } from "./ProfileModel";


export interface ArticleModel {
    slug?: string;
    title?: string;
    description?: string;
    body?: string;
    tagList?: string[];
    createdAt?: string;
    updatedAt?: string;
    favorited?: boolean;
    favoritesCount?: number;
    author?: ProfileModel;
}
