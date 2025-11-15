"use client";

import { Protected } from '@/components/protected';
import { ImageCard } from '@/components/image-card';
import { useAuth } from '@/lib/auth';
import { apiJson } from '@/lib/api';
import { ImageItem } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function MyImagesPage() {
	const { token, username } = useAuth();
	const [items, setItems] = useState<ImageItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!token) return;
		setLoading(true);
		apiJson<ImageItem[]>('/images/my-images', { token })
			.then((data) => setItems(data))
			.catch((e) => setError(e.message || 'Failed to load'))
			.finally(() => setLoading(false));
	}, [token]);

	function onDeleted(id: number) {
		setItems((prev) => prev.filter((i) => i.image_id !== id));
	}

	return (
		<Protected>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-2xl font-semibold">My Images</h2>
				<p className="text-sm text-muted-foreground">Signed in as {username}</p>
			</div>
			{loading && <p>Loading...</p>}
			{error && <p className="text-destructive">{error}</p>}
			{!loading && items.length === 0 && <p>No images yet.</p>}
			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{items.map((item) => (
					<ImageCard
						key={item.image_id}
						item={{ ...item, owner_username: item.owner_username ?? username ?? 'you' }}
						token={token!}
						canDelete
						allowShare
						onDeleted={onDeleted}
					/>
				))}
			</div>
		</Protected>
	);
}


