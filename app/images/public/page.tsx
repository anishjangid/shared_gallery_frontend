"use client";

import { Protected } from '@/components/protected';
import { ImageCard } from '@/components/image-card';
import { useAuth } from '@/lib/auth';
import { apiJson } from '@/lib/api';
import { ImageItem } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function PublicImagesPage() {
	const { token } = useAuth();
	const [items, setItems] = useState<ImageItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!token) return;
		setLoading(true);
		apiJson<ImageItem[]>('/images/public', { token })
			.then((data) => setItems(data))
			.catch((e) => setError(e.message || 'Failed to load'))
			.finally(() => setLoading(false));
	}, [token]);

	return (
		<Protected>
			<h2 className="text-2xl font-semibold mb-4">Public Images</h2>
			{loading && <p>Loading...</p>}
			{error && <p className="text-destructive">{error}</p>}
			{!loading && items.length === 0 && <p>No public images.</p>}
			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{items.map((item) => (
					<ImageCard key={item.image_id} item={item} token={token!} />
				))}
			</div>
		</Protected>
	);
}


