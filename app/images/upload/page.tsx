"use client";

import { Protected } from '@/components/protected';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { apiForm } from '@/lib/api';
import { useState } from 'react';

export default function UploadPage() {
	const { token } = useAuth();
	const [file, setFile] = useState<File | null>(null);
	const [caption, setCaption] = useState('');
	const [visibility, setVisibility] = useState<'public' | 'private'>('private');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!file || !token) return;
		setLoading(true);
		setMessage(null);
		setError(null);
		try {
			const form = new FormData();
			form.append('file', file);
			form.append('caption', caption);
			form.append('visibility', visibility);
			await apiForm('/images/upload', form, { token });
			setMessage('Image uploaded successfully');
			setFile(null);
			setCaption('');
			setVisibility('private');
		} catch (e: any) {
			setError(e.message || 'Upload failed');
		} finally {
			setLoading(false);
		}
	}

	return (
		<Protected>
			<div className="mx-auto max-w-xl">
				<h2 className="text-2xl font-semibold mb-4">Upload Image</h2>
				<form onSubmit={onSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label>Image File</Label>
						<Input
							type="file"
							accept="image/*"
							onChange={(e) => setFile(e.target.files?.[0] ?? null)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label>Caption</Label>
						<Input value={caption} onChange={(e) => setCaption(e.target.value)} />
					</div>
					<div className="space-y-2">
						<Label>Visibility</Label>
						<select
							className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
							value={visibility}
							onChange={(e) => setVisibility(e.target.value as any)}
						>
							<option value="private">private</option>
							<option value="public">public</option>
						</select>
					</div>
					{message && <p className="text-sm text-green-600">{message}</p>}
					{error && <p className="text-sm text-destructive">{error}</p>}
					<Button type="submit" disabled={loading || !file}>
						{loading ? 'Uploading...' : 'Upload'}
					</Button>
				</form>
			</div>
		</Protected>
	);
}


