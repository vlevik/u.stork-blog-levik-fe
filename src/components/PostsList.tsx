import { CardPost } from "@/types";
import PostCard from "./PostCard";
import { FC } from "react";

type Props = {
	posts: CardPost[];
}

export const PostsList: FC<Props> = ({ posts }) => {
	return (
		<div>
			{posts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</div>
	)
}