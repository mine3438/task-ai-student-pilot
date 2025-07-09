
import { TrainingDashboard } from '@/components/TrainingDashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const Training = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-red-500">AI Training Dashboard</h1>
            <p className="text-red-400 mt-2">
              Monitor and understand how the AI learns from your study patterns
            </p>
          </div>
          <TrainingDashboard />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Training;
