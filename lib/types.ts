export type Visibility = 'public' | 'private';

export interface ImageItem {
	image_id: number;
	user_id: number;
	image_url: string;
	caption: string | null;
	visibility: Visibility;
	created_at: string;
	owner_username?: string | null;
}

export interface SharedAccessItem {
	access_id: number;
	image_id: number;
	shared_with_user_id: number;
	shared_with_username: string;
	image_url: string;
	image_caption: string | null;
	granted_at: string;
}


