const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export function authHeader(token?: string) {
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiJson<T>(
	path: string,
	options: RequestInit & { token?: string } = {}
): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {}),
			...authHeader(options.token)
		},
		cache: 'no-store'
	});
	if (!res.ok) {
		const msg = await safeError(res);
		throw new Error(msg);
	}
	return res.json() as Promise<T>;
}

export async function apiForm<T>(
	path: string,
	formData: FormData,
	options: RequestInit & { token?: string } = {}
): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, {
		...options,
		method: options.method ?? 'POST',
		headers: {
			...(options.headers || {}),
			...authHeader(options.token)
		},
		body: formData,
		cache: 'no-store'
	});
	if (!res.ok) {
		const msg = await safeError(res);
		throw new Error(msg);
	}
	return res.json() as Promise<T>;
}

export async function apiDelete(path: string, token: string): Promise<void> {
	const res = await fetch(`${API_BASE}${path}`, {
		method: 'DELETE',
		headers: {
			...authHeader(token)
		}
	});
	if (!res.ok) {
		const msg = await safeError(res);
		throw new Error(msg);
	}
}

async function safeError(res: Response) {
	try {
		const data = await res.json();
		return data?.detail ?? `HTTP ${res.status}`;
	} catch {
		return `HTTP ${res.status}`;
	}
}


