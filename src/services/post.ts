import { CardPost, ICreatePostResponse, IUser } from "@/types";
import { authFetch } from "."

export const createPost = async (body: FormData) => {
	const post = await authFetch<ICreatePostResponse>('/posts/', {
		method: 'POST',
		body,
	});

	return post;
}

export const getAllPosts = async () => {
	const res = await fetch('http://localhost:1337/api/posts?populate=User')
	const json = await res.json();

	return json.data.map((post: any) => ({
		...post.attributes,
		id: post.id,
		username: post.attributes.User.data.attributes.username,
	})) as CardPost[];
}

export const getMyPosts = async (): Promise<CardPost[]> => {
	const me = await authFetch<IUser>('/users/me?populate=posts');

	return me.posts.map((post) => ({ ...post, username: me.username }));
}

export const updatePost = async (id: string, body: FormData) => {
	const post = await authFetch<ICreatePostResponse>(`/posts/${id}`, {
		method: 'PUT',
		body
	});

	return post;
}

export const deletePost = async (id: string) => {
	const post = await authFetch(`/posts/${id}`, {
		method: 'DELETE',
	});
}