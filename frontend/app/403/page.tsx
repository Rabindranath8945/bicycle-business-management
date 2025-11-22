export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-bold text-red-500">403</h1>
        <p className="text-xl">
          You don’t have permission to access this page.
        </p>
      </div>
    </div>
  );
}
