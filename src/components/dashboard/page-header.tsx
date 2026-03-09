interface PageHeaderProps {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
}

export function PageHeader({ title, subtitle, lastUpdated }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {lastUpdated && (
          <span className="text-xs text-gray-400">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
}
