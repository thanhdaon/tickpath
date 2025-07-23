export function FullscreenLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-primary">Loading...</p>
      </div>
    </div>
  );
}
