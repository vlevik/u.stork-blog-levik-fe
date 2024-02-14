"use client";

import { NewPostForm } from "@/components/NewPostForm";
import { PostsList } from "@/components/PostsList";
import { getAllPosts, getMyPosts } from "@/services/post";
import { useUserStore } from "@/state/user";
import { CardPost } from "@/types";
import { useEffect, useState } from "react";

export default function Home() {
	const [posts, setPosts] = useState<CardPost[]>([]);
	const [selectedFilter, setSelectedFilter] = useState('all');
	const [creating, setCreating] = useState(false);
	const user = useUserStore((state) => state.user);

	useEffect(() => {
		const fetchPosts = async () => {
			const res = selectedFilter === 'all' ? await getAllPosts() : await getMyPosts();

			setPosts(res)
		}

		fetchPosts();
	}, [selectedFilter]);

  return (
		<div className="w-full p-5">
			<h1 className="text-5xl font-bold mb-5 text-center">Discover new!</h1>
			{creating && (
				<NewPostForm setCreating={setCreating} setPosts={setPosts} posts={posts}/>
			)}
			{user && user.username && (
				<div className="flex mb-5">
					<div className="inline-block relative w-64 mr-5">
						<select 
							value={selectedFilter}
							onChange={(e) => setSelectedFilter(e.target.value)} 
							className=" block appearance-none w-full bg-white-200 border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
						>
							<option value="all">All posts</option>
							<option value="my">My posts</option>
						</select>
						<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
							<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
						</div>
					</div>
					<button onClick={() => setCreating(true)} className="mr-5 inline-block border border-green-500 rounded py-2 px-4 bg-green-500 hover:bg-green-700 text-white">Add new post</button>
				</div>
			)}
			<PostsList posts={posts} />
		</div>
  );
}
