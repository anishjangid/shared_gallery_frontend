"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { apiJson } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
	const router = useRouter();
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await apiJson('/auth/register', {
				method: 'POST',
				body: JSON.stringify({ username, email, password })
			});
			router.push('/auth/login');
	+	} catch (err: any) {
			setError(err.message || 'Registration failed');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="mx-auto max-w-md">
			<h2 className="text-2xl font-semibold mb-4">Create an account</h2>
			<form onSubmit={onSubmit} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="username">Username</Label>
					<Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
				</div>
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				</div>
				<div className="space-y-2">
					<Label htmlFor="password">Password</Label>
					<Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				</div>
				{error && <p className="text-sm text-destructive">{error}</p>}
				<Button type="submit" disabled={loading} className="w-full">
					{loading ? 'Creating...' : 'Register'}
				</Button>
			</form>
		</div>
	);
}


