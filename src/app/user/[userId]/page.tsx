"use client";
import { PostsList } from "@/components/PostsList";
import { IUser } from "@/types";
import { useEffect, useState } from "react";

export default function Profile({ params }: { params: { userId: string } }) {
	const [user, setUser] = useState<null | IUser>(null)

	useEffect(() => {
		const fetchPosts = async () => {
			const res = await fetch(`http://localhost:1337/api/users/${params.userId}?populate=posts`)
			const data = await res.json()
			setUser(data)
		}

		fetchPosts();
	}, [params.userId]);

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
					<h2>Your posts</h2>
					<PostsList posts={user.posts.map((post) => ({ ...post, username: user.username }))} />
				</div>
			)}
		</div>
	);
}
