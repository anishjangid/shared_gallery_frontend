"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export function Protected({ children }: { children: React.ReactNode }) {
	const { token } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!token) {
			router.replace('/auth/login');
		}
	}, [token, router]);

	if (!token) return null;
	return <>{children}</>;
}


