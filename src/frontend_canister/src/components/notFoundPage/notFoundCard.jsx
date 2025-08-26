import { Link } from 'react-router-dom';

function NotFoundCard() {
  return (
    <main className="grid min-h-full place-items-center bg-cream-100 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-gray-500">404</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-balance text-gray-500 sm:text-1xl">
          Comming Soon
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          Sorry, we couldn’t find the page you’re looking for, but exciting things are coming soon!
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-10">
          <Link
            to="/"
            className="rounded-md bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-cream-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream-500 transition-colors"
          >
            Go back home
          </Link>
          <Link
            to="/support"
            className="text-sm font-semibold text-gray-500 hover:text-cream-500"
          >
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
export default NotFoundCard;