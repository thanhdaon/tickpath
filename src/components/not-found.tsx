export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          404
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Page not found
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
          Sorry, we couldn't find the page you're looking for.
        </p>
      </div>
    </div>
  );
}
