"use client";
import { useUserStore } from "@/state/user";
import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import cn from 'classnames';
import { deletePost, updatePost } from "@/services/post";
import { CardPost } from "@/types";
import { useRouter } from "next/navigation";

const formSchema = yup.object({
	title: yup.string().required('Title is required!'),
	description: yup.string().required('Content is required!'),
});

export default function PostDetails({ params }: { params: { id: string } }) {
	const [post, setPost] = useState<null | CardPost>(null);
	const [isEditing, setIsEditing] = useState(false);
	const user = useUserStore((state) => state.user);
	const router = useRouter();

	useEffect(() => {
		const fetchPosts = async () => {
			const res = await fetch(`http://localhost:1337/api/posts/${params.id}?populate=User`)
			const data = await res.json()
			setPost({
				...data.data.attributes,
				id: data.data.id,
				username: data.data.attributes.User.data.attributes.username
			})

			setValues({
				title: data.data.attributes.title,
				description: data.data.attributes.description
			})
		}

		fetchPosts();
	}, [params.id]);

	const { submitForm, handleChange, values, errors, touched, resetForm, setErrors, setValues } = useFormik<{
		title: string;
		description: string;
	}>({
		initialValues: {
			title: '',
			description: '',
		},
		validationSchema: formSchema,
		onSubmit: async (values) => {
			try {
				if (!post) {
					return;
				}

				const body = new FormData();
				body.set('data', JSON.stringify({...values, userId: user.id }));
				
				const updatedPost = await updatePost((post.id).toString(), body);

				setValues({
					title: updatedPost.data.attributes.title,
					description: updatedPost.data.attributes.description
				})
				setPost({
					...post,
					title: updatedPost.data.attributes.title,
					description: updatedPost.data.attributes.description
				});
				setIsEditing(false);
			} catch (err) {
				console.error(err);
			}
		}
	})

	const onCancel = () => {
		setIsEditing(false);
		setValues( post ? {
			title: post.title,
			description: post.description
		} : {
			title: '',
			description: ''
		});
	}

	const onDelete = async () => {
		if (!post) {
			return;
		}
		const res = await deletePost(post?.id.toString());
		router.push('/');
	}

  return (
		<div>
			{post && (
				<div>
					<div className="w-1/2 p-5 m-auto">
							<h1 className="text-5xl font-bold mb-5">Post Details</h1>
							{user && post.username === user.username && (
								<div className="flex mb-5 justify-between">
									<button onClick={() => setIsEditing(true)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Update post</button>
									<button onClick={onDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete post</button>
								</div>
							)}
							{isEditing && (
								<div className="flex mb-5 justify-between">
									<button onClick={submitForm} type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Save changes</button>
									<button onClick={onCancel} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Cancel</button>
								</div>
							)}
							<div className="flex mb-5 justify-between">
								<h3 className="text-2xl font-bold">Title:&nbsp;</h3>
								{isEditing ? (
									<>
										<input
											className={cn('shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', {
												'border-red-500': touched.title && errors.title
											})}
											id="title"
											name="title"
											type="text"
											placeholder="Username"
											onChange={handleChange}
											value={values.title}
										/>
										{errors.title && touched.title && (<p className="text-red-500 text-xs italic">{errors.title}</p>)}
									</>
								): (
									<h3 className="text-2xl"> {post.title}</h3>
								)}
							</div>
							<div className="flex mb-5 justify-between">
								<h3 className="text-2xl font-bold">Content:&nbsp;</h3>
								{isEditing ? (
									<>
										<textarea
											className={cn('shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', {
												'border-red-500': touched.description && errors.description
											})}
											id="description"
											name="description"
											rows={8}
											placeholder="Username"
											onChange={handleChange}
											value={values.description}
										/>
										{errors.description && touched.description && (<p className="text-red-500 text-xs italic">{errors.description}</p>)}
									</>
								): (
									<h3 className="text-2xl"> {post.description}</h3>
								)}
							</div>
							<div className="flex mb-5 justify-between">
								<h3 className="text-2xl font-bold">Created:&nbsp;</h3>
								<h3 className="text-2xl"> {post.createdAt.toString().slice(0, 10)}</h3>
							</div>
						<h1 className="text-5xl font-bold mb-5 mt-10">Author Details</h1>
						<div className="flex mb-5 justify-between">
							<h3 className="text-2xl font-bold">Username:&nbsp;</h3>
							<h3 className="text-2xl"> {user.username}</h3>
						</div>
						<div className="flex mb-5 justify-between">
							<h3 className="text-2xl font-bold">Email:&nbsp;</h3>
							<h3 className="text-2xl"> {user.email}</h3>
						</div>
					</div>
				</div>
			)}
		</div>
  );
}
