"use client";

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const links = [
	{ href: '/images/upload', label: 'Upload' },
	{ href: '/images/my-images', label: 'My Images' },
	{ href: '/images/public', label: 'Public' },
	{ href: '/sharing/shared-with-me', label: 'Shared With Me' },
	{ href: '/sharing/shared-by-me', label: 'Shared By Me' }
];

export function Navbar() {
	const { token, logout } = useAuth();
	const pathname = usePathname();

	return (
		<header className="border-b">
			<div className="container mx-auto flex items-center justify-between px-4 py-3">
				<Link href="/" className="font-semibold">
					Shared Gallery
				</Link>

				<nav className="hidden gap-4 md:flex">
					{links.map((l) => (
						<Link
							key={l.href}
							href={l.href}
							className={cn(
								'text-sm text-muted-foreground hover:text-foreground',
								pathname === l.href && 'text-foreground font-medium'
							)}
						>
							{l.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-2">
					{token ? (
						<button
							onClick={logout}
							className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
						>
							Logout
						</button>
					) : (
						<>
							<Link
								href="/auth/login"
								className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
							>
								Login
							</Link>
							<Link
								href="/auth/register"
								className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
							>
								Register
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
}


