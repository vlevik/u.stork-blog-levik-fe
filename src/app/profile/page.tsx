"use client";
import { PostsList } from "@/components/PostsList";
import { getMe } from "@/services/user";
import { useUserStore } from "@/state/user";
import { CardPost, IUser } from "@/types";
import { useEffect, useState } from "react";

const Profile = () => {
	const [posts, setPosts] = useState<CardPost[]>([]);
	const user = useUserStore((state) => state.user);

	useEffect(() => {		
		const fetchPosts = async () => {
			const res = await getMe();

			setPosts(res.posts.map((post) => ({ ...post, username: res.username })));
		}

		fetchPosts();
	}, [user?.id]);

	return (
		<div>
			{user && (
				<div className="w-1/2 p-5 m-auto">
					<h1 className="text-5xl font-bold mb-5 text-center">{`Hello, ${user.username}`}</h1>
					<div className="flex mb-5 justify-between">
						<h3 className="text-2xl font-bold">Email: </h3>
						<h3 className="text-2xl"> {user.email}</h3>
					</div>
					<div className="flex mb-5 justify-between">
						<h3 className="text-2xl font-bold">Since: </h3>
						<h3 className="text-2xl"> {user.createdAt.slice(0, 10)}</h3>
					</div>
					<h2 className="text-4xl font-bold mb-5 text-center">Your posts</h2>
					<PostsList posts={posts.map((post) => ({ ...post, username: user.username }))} />
				</div>
			)}
		</div>
	);
}

export default Profile;