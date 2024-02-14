import { IUser } from "@/types";
import { authFetch } from "."

export const getMe = async () => {
	const me = await authFetch<IUser>('/users/me?populate=posts');

	return me;
}