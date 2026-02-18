import { ArrowLeftRight, Zap, Target, Shield } from 'lucide-react'

const trustSignals = [
  {
    icon: ArrowLeftRight,
    title: '7-Day Refund',
    description: 'Full refund if not satisfied'
  },
  {
    icon: Zap,
    title: 'Instant Access',
    description: 'Get started immediately'
  },
  {
    icon: Target,
    title: 'MUJ Focused',
    description: 'Tailored for your university'
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure transactions'
  }
]

export function TrustSignals() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {trustSignals.map((signal, index) => (
        <div key={index} className="text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <signal.icon className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{signal.title}</h3>
          <p className="text-sm text-gray-600">{signal.description}</p>
        </div>
      ))}
    </div>
  )
}
