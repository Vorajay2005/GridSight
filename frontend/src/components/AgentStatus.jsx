import { CheckCircle, Loader, XCircle } from 'lucide-react'

export default function AgentStatus({ steps }) {
  return (
    <div className="mx-6 mb-6 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 p-4">
      <h3 className="text-sm font-semibold text-white mb-3">Agent Status</h3>
      <div className="space-y-2">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            {step.status === 'completed' && (
              <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
            )}
            {step.status === 'in_progress' && (
              <Loader className="text-orange-400 animate-spin flex-shrink-0" size={20} />
            )}
            {step.status === 'error' && (
              <XCircle className="text-red-400 flex-shrink-0" size={20} />
            )}
            <div className="flex-1">
              <span className="text-sm text-gray-300">{step.step}</span>
              {step.time && (
                <span className="text-xs text-gray-500 ml-2">({step.time}s)</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
