"use client";

import { Protected } from '@/components/protected';
import { useAuth } from '@/lib/auth';
import { apiJson } from '@/lib/api';
import { ImageItem } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ImageDetailPage() {
	const { token } = useAuth();
	const params = useParams<{ id: string }>();
	const imageId = Number(params.id);
	const [item, setItem] = useState<ImageItem | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!token || !imageId) return;
		setLoading(true);
		apiJson<ImageItem>(`/images/${imageId}`, { token })
			.then((data) => setItem(data))
			.catch((e) => setError(e.message || 'Failed to load'))
			.finally(() => setLoading(false));
	}, [token, imageId]);

	return (
		<Protected>
			{loading && <p>Loading...</p>}
			{error && <p className="text-destructive">{error}</p>}
			{item && (
				<div className="grid gap-4 md:grid-cols-2">
					<div className="relative bg-muted rounded-lg overflow-hidden">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={item.image_url} alt={item.caption ?? ''} className="w-full h-auto" />
					</div>
					<div className="space-y-3">
						<h2 className="text-2xl font-semibold">{item.caption ?? 'Untitled'}</h2>
						<p className="text-sm text-muted-foreground">
							Visibility: <span className="font-medium">{item.visibility}</span>
						</p>
						<p className="text-sm text-muted-foreground">
							Owner: <span className="font-medium">{item.owner_username ?? 'Unknown'}</span>
						</p>
						<p className="text-sm text-muted-foreground">
							Uploaded at: {new Date(item.created_at).toLocaleString()}
						</p>
						<a
							className="text-sm text-primary underline"
							href={item.image_url}
							target="_blank"
							rel="noreferrer"
						>
							Open original
						</a>
					</div>
				</div>
			)}
		</Protected>
	);
}


