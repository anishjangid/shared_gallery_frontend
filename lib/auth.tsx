"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface AuthContextValue {
	token: string | null;
	username: string | null;
	login: (token: string, username?: string | null) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'sg_token';
const USERNAME_KEY = 'sg_username';

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);

	useEffect(() => {
		const t = window.localStorage.getItem(TOKEN_KEY);
		const u = window.localStorage.getItem(USERNAME_KEY);
		if (t) setToken(t);
		if (u) setUsername(u);
	}, []);

	const login = useCallback((t: string, u?: string | null) => {
		setToken(t);
		window.localStorage.setItem(TOKEN_KEY, t);
		if (u != null) {
			setUsername(u);
			window.localStorage.setItem(USERNAME_KEY, u);
		}
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setUsername(null);
		window.localStorage.removeItem(TOKEN_KEY);
		window.localStorage.removeItem(USERNAME_KEY);
	}, []);

	const value = useMemo(() => ({ token, username, login, logout }), [token, username, login, logout]);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}

export function useRequireAuth() {
	const { token } = useAuth();
	return token;
}


