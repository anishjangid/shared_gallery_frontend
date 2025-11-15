import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default function HomePage() {
	return (
		<section className="flex flex-col items-center gap-6 py-16">
			<h1 className="text-4xl font-bold tracking-tight">Shared Gallery</h1>
			<p className="text-muted-foreground text-center max-w-xl">
				Upload, manage, and share your images. Register or log in to get started. Browse public
				images from the community.
			</p>
			<div className="flex gap-3">
				<Link href="/auth/register" className={buttonVariants({ variant: 'default' })}>
					Register
				</Link>
				<Link href="/auth/login" className={buttonVariants({ variant: 'secondary' })}>
					Log in
				</Link>
			</div>
		</section>
	);
}


