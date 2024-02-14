'use client';
import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import cn from 'classnames';
import { useUserStore } from "@/state/user";
import { createPost } from '@/services/post';
import { CardPost } from '@/types';

const formSchema = yup.object({
	title: yup.string().required('Title is required!'),
	description: yup.string().required('Content is required!'),
});

type Props = {
	setCreating: React.Dispatch<React.SetStateAction<boolean>>;
	setPosts: React.Dispatch<React.SetStateAction<CardPost[]>>;
	posts: CardPost[];
}
export const NewPostForm: React.FC<Props> = ({ setCreating, setPosts, posts}) => {
	const user = useUserStore((state) => state.user);

	const { handleSubmit, handleChange, values, errors, touched, resetForm, setErrors } = useFormik<{
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
				const body = new FormData();
				body.set('data', JSON.stringify({...values, userId: user.id }));

				const post = await createPost(body);

				resetForm();
				setPosts(() => [{
					id: post.data.id,
					title: post.data.attributes.title,
					description: post.data.attributes.description,
					createdAt: post.data.attributes.createdAt,
					publishedAt: post.data.attributes.publishedAt,
					username: user.username
				}, ...posts]);
				setCreating(false);
			} catch (err) {
				console.error(err);
			}
		}
	})

	const onCancel = () => {
		setCreating(false);
		resetForm();
		setErrors({});
	}

	return (
		<>
			<div className="w-full max-w-xs m-auto">
				<form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
					<h1 className="text-5xl font-bold mb-10 text-center">New Post</h1>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
							Title
						</label>
						<input
							className={cn('shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', {
								'border-red-500': touched.title && errors.title
							})}
							id="title"
							type="text"
							placeholder="Title"
							onChange={handleChange}
							value={values.title}
						/>
						{errors.title && touched.title && <p className="text-red-500 text-xs italic">{errors.title}</p>}
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
							Content
						</label>
						<textarea
							className={cn('shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', {
								'border-red-500': touched.description && errors.description
							})}
							rows={8}
							id="description"
							placeholder="Your post content"
							onChange={handleChange}
							value={values.description}
						/>
						{errors.description && touched.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
					</div>
					<div className="flex items-center justify-between">
						<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
							Save
						</button>
						<button onClick={onCancel} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" >
							Cancel
						</button>
					</div>
				</form>
			</div>
		</>
	)
}