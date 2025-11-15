"use client";

import { Protected } from '@/components/protected';
import { useAuth } from '@/lib/auth';
import { apiDelete, apiJson } from '@/lib/api';
import { SharedAccessItem } from '@/lib/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SharedByMePage() {
	const { token } = useAuth();
	const [items, setItems] = useState<SharedAccessItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!token) return;
		setLoading(true);
		apiJson<SharedAccessItem[]>('/sharing/shared-by-me', { token })
			.then((data) => setItems(data))
			.catch((e) => setError(e.message || 'Failed to load'))
			.finally(() => setLoading(false));
	}, [token]);

	async function unshare(imageId: number, sharedWithUserId: number) {
		if (!token) return;
		if (!confirm('Remove access for this user?')) return;
		try {
			await apiDelete(`/sharing/unshare/${imageId}/${sharedWithUserId}`, token);
			setItems((prev) => prev.filter((i) => !(i.image_id === imageId && i.shared_with_user_id === sharedWithUserId)));
		} catch (e: any) {
			alert(e.message || 'Failed to unshare');
		}
	}

	return (
		<Protected>
			<h2 className="text-2xl font-semibold mb-4">Images Shared By Me</h2>
			{loading && <p>Loading...</p>}
			{error && <p className="text-destructive">{error}</p>}
			{!loading && items.length === 0 && <p>No shares yet.</p>}
			<ul className="space-y-3">
				{items.map((i) => (
					<li key={`${i.image_id}-${i.shared_with_user_id}`} className="border rounded-md p-3">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">{i.image_caption ?? 'Untitled'}</p>
								<p className="text-xs text-muted-foreground">
									Shared with: {i.shared_with_username} •{' '}
									{new Date(i.granted_at).toLocaleString()}
								</p>
							</div>
							<div className="flex gap-2">
								<Link href={`/images/${i.image_id}`}>
									<Button variant="secondary" size="sm">View</Button>
								</Link>
								<Button variant="destructive" size="sm" onClick={() => unshare(i.image_id, i.shared_with_user_id)}>
									Unshare
								</Button>
							</div>
						</div>
					</li>
				))}
			</ul>
		</Protected>
	);
}


