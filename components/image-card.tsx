"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ImageItem } from '@/lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { apiJson, apiDelete } from '@/lib/api';

export function ImageCard({
	item,
	token,
	canDelete,
	allowShare,
	onDeleted
}: {
	item: ImageItem;
	token: string;
	canDelete?: boolean;
	allowShare?: boolean;
	onDeleted?: (imageId: number) => void;
}) {
	const [expanded, setExpanded] = useState(false);
	const [shareTo, setShareTo] = useState('');
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);

	async function onShare() {
		setBusy(true);
		setMessage(null);
		setError(null);
		try {
			await apiJson(`/sharing/share/${item.image_id}`, {
				method: 'POST',
				token,
				body: JSON.stringify({ shared_with_username: shareTo })
			});
			setMessage('Shared successfully');
			setShareTo('');
		} catch (e: any) {
			setError(e.message || 'Share failed');
		} finally {
			setBusy(false);
		}
	}

	async function onDelete() {
		if (!confirm('Delete this image?')) return;
		try {
			await apiDelete(`/images/${item.image_id}`, token);
			onDeleted?.(item.image_id);
		} catch (e: any) {
			alert(e.message || 'Delete failed');
		}
	}

	return (
		<div className="rounded-lg border overflow-hidden">
			<div className="relative aspect-video bg-muted">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src={item.image_url} alt={item.caption ?? ''} className="h-full w-full object-cover" />
			</div>
			<div className="p-3 space-y-2">
				<div className="flex items-center justify-between">
					<p className="text-sm font-medium">{item.caption ?? 'Untitled'}</p>
					<span className="text-xs px-2 py-0.5 rounded-full border">
						{item.visibility}
					</span>
				</div>
				<p className="text-xs text-muted-foreground">
					By {item.owner_username ?? 'you'} • {new Date(item.created_at).toLocaleString()}
				</p>
				<div className="flex gap-2">
					<Link href={`/images/${item.image_id}`}>
						<Button variant="secondary" size="sm">View</Button>
					</Link>
					{canDelete && (
						<Button variant="destructive" size="sm" onClick={onDelete}>
							Delete
						</Button>
					)}
					{allowShare && (
						<Button variant="outline" size="sm" onClick={() => setExpanded((v) => !v)}>
							{expanded ? 'Close share' : 'Share'}
						</Button>
					)}
				</div>
				{allowShare && expanded && (
					<div className="space-y-2 pt-2 border-t">
						<div className="flex gap-2">
							<Input
								placeholder="Username to share with"
								value={shareTo}
								onChange={(e) => setShareTo(e.target.value)}
							/>
							<Button onClick={onShare} disabled={busy || !shareTo}>
								Share
							</Button>
						</div>
						{message && <p className="text-xs text-green-600">{message}</p>}
						{error && <p className="text-xs text-destructive">{error}</p>}
					</div>
				)}
			</div>
		</div>
	);
}


