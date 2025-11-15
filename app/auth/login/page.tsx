"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
	const router = useRouter();
	const { login } = useAuth();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const form = new URLSearchParams();
			form.append('username', username);
			form.append('password', password);
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000'}/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: form
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data?.detail ?? `HTTP ${res.status}`);
			}
			const data: { access_token: string; token_type: string } = await res.json();
			login(data.access_token, username);
			router.replace('/images/my-images');
		} catch (err: any) {
			setError(err.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="mx-auto max-w-md">
			<h2 className="text-2xl font-semibold mb-4">Log in</h2>
			<form onSubmit={onSubmit} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="username">Username</Label>
					<Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
				</div>
				<div className="space-y-2">
					<Label htmlFor="password">Password</Label>
					<Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				</div>
				{error && <p className="text-sm text-destructive">{error}</p>}
				<Button type="submit" disabled={loading} className="w-full">
					{loading ? 'Logging in...' : 'Log in'}
				</Button>
			</form>
		</div>
	);
}


