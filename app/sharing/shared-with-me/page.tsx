"use client";

import { Protected } from '@/components/protected';
import { useAuth } from '@/lib/auth';
import { apiJson } from '@/lib/api';
import { SharedAccessItem } from '@/lib/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SharedWithMePage() {
	const { token } = useAuth();
	const [items, setItems] = useState<SharedAccessItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!token) return;
		setLoading(true);
		apiJson<SharedAccessItem[]>('/sharing/shared-with-me', { token })
			.then((data) => setItems(data))
			.catch((e) => setError(e.message || 'Failed to load'))
			.finally(() => setLoading(false));
	}, [token]);

	return (
		<Protected>
			<h2 className="text-2xl font-semibold mb-4">Images Shared With Me</h2>
			{loading && <p>Loading...</p>}
			{error && <p className="text-destructive">{error}</p>}
			{!loading && items.length === 0 && <p>No shared images.</p>}
			<ul className="space-y-3">
				{items.map((i) => (
					<li key={i.access_id} className="border rounded-md p-3">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">{i.image_caption ?? 'Untitled'}</p>
								<p className="text-xs text-muted-foreground">
									Shared to: {i.shared_with_username} •{' '}
									{new Date(i.granted_at).toLocaleString()}
								</p>
							</div>
							<Link href={`/images/${i.image_id}`}>
								<Button variant="secondary" size="sm">View</Button>
							</Link>
						</div>
					</li>
				))}
			</ul>
		</Protected>
	);
}


