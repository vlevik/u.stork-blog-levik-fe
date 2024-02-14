'use client';
import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import cn from 'classnames';
import Link from 'next/link';
import { useUserStore } from '@/state/user';
import { useRouter } from 'next/navigation';

const formSchema = yup.object({
  username: yup.string().min(3, 'Min length is 3 letters').required('Username is required!'),
  email: yup.string().email('Invalid email').required('Email is required!'),
  password: yup.string().min(6, 'Min length is 6 symbols').required('Password is required!') .matches(
    /^(?=.*[a-z])(?=.*[0-9])(?=.{6,})/,
    'Invalid'
  ),
	confirmPassword: yup.string().required('This field is required').oneOf([yup.ref('password')], 'Passwords must match'),
});

export default function Register() {
	const setUser = useUserStore((state) => state.setUser);
	const router = useRouter();

	const { handleSubmit, handleChange, values, errors, touched } = useFormik<{
		username: string;
		email: string;
		password: string;
		confirmPassword: string;
	}>({
		initialValues: {
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationSchema: formSchema,
		onSubmit: async (values) => {
			try {
				const body = new FormData();
				body.set('username', values.username);
				body.set('email', values.email);
				body.set('password', values.password);
				
				const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local/register`, {
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
		<h1 className="text-5xl font-bold mb-10 text-center">Welcome! Register to start</h1>
		<div className="w-full max-w-xs m-auto">
			<form 
				onSubmit={handleSubmit} 
				className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
			>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
						Username
					</label>
					<input 
						className={cn('shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline',
						{'border-red-500': errors.username && touched.username})}
						id="username" 
						type="text" 
						placeholder="Username"
						onChange={handleChange}
						value={values.username}
					/>
					{errors.username && touched.username && <p className="text-red-500 text-xs italic">{errors.username}</p>}
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
						Email
					</label>
					<input 
						className={cn('shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline',
						{'border-red-500': errors.email && touched.email})}
						id="email" 
						type="email" 
						placeholder="Email"
						onChange={handleChange}
						value={values.email}
					/>
					{errors.email && touched.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
				</div>
				<div className="mb-2">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
						Password
					</label>
					<input 
						className={cn('shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline',
						{'border-red-500': errors.password && touched.password})}
						id="password" 
						type="password" 
						placeholder="**********"
						onChange={handleChange}
						value={values.password}
					/>
					{errors.password && touched.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
						Confirm password
					</label>
					<input 
						className={cn('shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline',
						{'border-red-500': errors.confirmPassword && touched.confirmPassword})}
						id="confirmPassword" 
						type="password" 
						placeholder="**********"
						onChange={handleChange}
						value={values.confirmPassword}
					/>
					{errors.confirmPassword && touched.confirmPassword && <p className="text-red-500 text-xs italic">{errors.confirmPassword}</p>}
				</div>
				<div className="flex items-center justify-between">
					<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
						Register
					</button>
				</div>
					<p className="text-gray-400 text-s italic mt-4 ">Have an account? &nbsp;
						<Link className="inline-block align-baseline font-bold text-s text-blue-500 hover:text-blue-800 not-italic" href="/login">
							Login
						</Link>
					</p>
			</form>
		</div>
	</>
	)
}