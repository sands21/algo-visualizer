import { PropsWithChildren } from 'react';

interface AlgorithmWorkspaceProps extends PropsWithChildren {
  title: string;
  description: string;
}

export const AlgorithmWorkspace = ({
  title,
  description,
  children,
}: AlgorithmWorkspaceProps) => {
  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}; 