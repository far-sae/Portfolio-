import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container-x flex min-h-screen flex-col items-center justify-center text-center">
      <div className="text-7xl font-extrabold gradient-text">404</div>
      <p className="mt-4 text-muted">That project doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white"
      >
        Back home
      </Link>
    </main>
  );
}
