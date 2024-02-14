'use client';

import { USER_KEY, useUserStore } from "@/state/user";
import Link from "next/link";

export default function NavBar() {
	const user = useUserStore((state) => state.user);

	const handleLogout = () => {
		localStorage.removeItem(USER_KEY);
		window.location.href = '/login';
	}

	return (
		<nav className="p-5">
			<ul className="flex">
				<li className="mr-6">
					<Link className="inline-block border border-green-500 rounded py-2 px-4 bg-green-500 hover:bg-green-700 text-white" href="/">Home</Link>
				</li>

				{(user && user.username) ? (
					<>
						<li className="mr-6">
							<Link className="inline-block border border-blue-500 rounded py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white" href="/profile">Profile</Link>
						</li>
						<li className="mr-6">
							<button onClick={handleLogout} className="inline-block border border-gray-500 rounded py-2 px-4 bg-gray-500 hover:bg-gray-700 text-white">Logout</button>
						</li>
					</>
				): (
					<>
						<li className="mr-6">
							<Link className="inline-block border border-blue-500 rounded py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white" href="/login">Login</Link>
						</li>
						<li className="mr-6">
							<Link className="inline-block border border-blue-500 rounded py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white" href="/register">Register</Link>
						</li>
					</>
				)}

			</ul>
		</nav>
	)
}