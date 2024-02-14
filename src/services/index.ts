import { USER_KEY } from "@/state/user";

export const authFetch = async <T>(path: string, options?: RequestInit) => {	
	const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}${path}`, {
		...options,
		headers: {
			...options?.headers,
			Authorization: `Bearer ${JSON.parse(localStorage.getItem(USER_KEY) || '{}').state.user.jwt}`,
		}
	});

	const data = await res.json() as T;

	return data;
}