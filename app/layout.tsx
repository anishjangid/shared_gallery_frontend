import './globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Navbar } from '@/components/navbar';
import { Providers } from '@/app/providers';

export const metadata = {
	title: 'Shared Gallery',
	description: 'Upload, manage, and share images'
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<Providers>
						<Navbar />
						<main className="container mx-auto px-4 py-6">{children}</main>
					</Providers>
				</ThemeProvider>
			</body>
		</html>
	);
}


