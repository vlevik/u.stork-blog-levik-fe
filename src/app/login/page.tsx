'use client';
import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import cn from 'classnames';
import Link from 'next/link';
import { useUserStore } from '@/state/user';
import { useRouter } from 'next/navigation';

const formSchema = yup.object({
	username: yup.string().required('Username is required!'),
	password: yup.string().required('Password is required!'),
});

export default function Login() {
	const setUser = useUserStore((state) => state.setUser);
	const router = useRouter();

	const { handleSubmit, handleChange, values, errors, touched } = useFormik<{
		username: string;
		password: string;
	}>({
		initialValues: {
			username: '',
			password: '',
		},
		validationSchema: formSchema,
		onSubmit: async (values) => {
			try {
				const body = new FormData();
				body.set('identifier', values.username);
				body.set('password', values.password);
				
				const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local`, {
					method: 'POST',
					body,
				})
	
				const data = await res.json();
	
				setUser({ ...data.user, jwt: data.jwt });
				router.push('/');
			} catch (err) {
				console.error(err);
			}
		}
	})

	return (
		<>
			<h1 className="text-5xl font-bold mb-10 text-center">Welcome back! Login to your account</h1>
			<div className="w-full max-w-xs m-auto">
				<form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
							Username
						</label>
						<input
							className={cn('shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', {
								'border-red-500': touched.username && errors.username
							})}
							id="username"
							type="text"
							placeholder="Username"
							onChange={handleChange}
							value={values.username}
						/>
						{errors.username && touched.username && <p className="text-red-500 text-xs italic">{errors.username}</p>}
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
							Password
						</label>
						<input
							className={cn('shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', {
								'border-red-500': touched.password && errors.password
							})}
							id="password"
							type="password"
							placeholder="********"
							onChange={handleChange}
							value={values.password}
						/>
						{errors.password && touched.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
					</div>
					<div className="flex items-center justify-between">
						<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
							Login
						</button>
					</div>
					<p className="text-gray-400 text-s italic mt-4 ">Don&apos;t have an account? &nbsp;
						<Link className="inline-block align-baseline font-bold text-s text-blue-500 hover:text-blue-800 not-italic" href="/register">
							Register
						</Link>
					</p>
				</form>
			</div>
		</>
	)
}