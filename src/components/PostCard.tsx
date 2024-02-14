import Link from "next/link";

type Props = {
	post: {
		id: number;
		title: string;
		username: string;
		description: string;
		createdAt: string;
	};
}

export default function PostCard({ post }: Props) {
	return (
		<div className="w-full">
			<div className=" rounded overflow-hidden shadow-lg mb-4 p-4">
				<div className="px-6 py-4">
					<Link href={`/post/${post.id}`} className="font-bold text-3xl mb-2">{post.title}</Link>
					<p className="text-gray-700 truncate text-2xl mb-3">
						{post.description}
					</p>
						<div className="flex justify-between border-t-2 border-gray-300 pt-2">
							<div>
								<p className=" inline-block text-gray-900">{post.username}</p>
							</div>
							<div>
								<p className="inline-block text-gray-600">{post.createdAt.toString().slice(0, 10)}</p>
							</div>
						</div>
				</div>
			</div>
		</div>	
	)
}