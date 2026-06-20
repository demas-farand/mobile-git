import { User } from "./auth";

export interface Comment {
    id: number;
    content: string;
    createAt: string;
    user: User;
}

export interface DetailFeed {
    id: number;
    caption: string;
    image: string;
    imageId: string;
    likeCount: number;
    commentCount: number;
    createAt: string;
    userId: number;
    user: User;
    comments: Comment[];
}