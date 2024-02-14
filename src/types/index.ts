export interface IPost {
	id: number
	title: string
	description: string
	createdAt: string
	publishedAt: string
}

export interface ICreatePostResponse {
	data: {
		attributes: Omit<IPost, 'id'>
		id: number,
	},
}

export interface IUser {
	username: string
	email: string
	provider: string
	id: number;
	confirmed: boolean;
	blocked: boolean;
	createdAt: string;
	posts: IPost[]
}

export type CardPost = IPost & { username: string };
