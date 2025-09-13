export default function LoadingSpinner({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 50 50">
        <circle
          className="opacity-25"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
        />
        <circle
          className="opacity-75"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
          strokeDasharray="100"
          strokeDashoffset="60"
        />
      </svg>
    </div>
  );
}
