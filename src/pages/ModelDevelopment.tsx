
import { ModelDevelopmentDiagram } from '@/components/ModelDevelopmentDiagram';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const ModelDevelopment = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-red-500">AI Model Development</h1>
            <p className="text-red-400 mt-2">
              Understand how the AI learns and improves from your study patterns
            </p>
          </div>
          <ModelDevelopmentDiagram />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ModelDevelopment;
