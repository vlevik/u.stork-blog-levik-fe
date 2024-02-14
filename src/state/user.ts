import { IUser } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const USER_KEY = 'user';

type AuthUser = IUser & { jwt: string }

interface UserState {
	user: AuthUser
	setUser: (user: AuthUser) => void
}

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			setUser: (user) => set(() => ({ user })),
			user: {} as AuthUser // it will automatically load from local storage
		}),
		{ name: USER_KEY }
	)
)