import { Play } from 'lucide-react'

export function ProductDemo() {
  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          See Inside the Smart Kit
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Take a 2-minute tour of how NotesNinja helps you ace your exams with smart revision tools
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-6 cursor-pointer hover:bg-white transition-colors inline-block">
                <Play className="w-12 h-12 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-white text-xl font-semibold">Product Demo Video</h3>
                <p className="text-white/80 text-sm mt-2">Click to play 2-minute walkthrough</p>
              </div>
            </div>
          </div>
          
          {/* Video placeholder overlay */}
          <div className="absolute inset-0 bg-black/10">
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">Live Demo Available</span>
                <span className="text-xs text-gray-600 ml-auto">2:45</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video features highlights */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <div className="bg-emerald-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-1">Smart Dashboard</h4>
              <p className="text-sm text-gray-600">Track progress easily</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-emerald-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-1">Interactive Content</h4>
              <p className="text-sm text-gray-600">Engaging study materials</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-emerald-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-1">Real-time Analytics</h4>
              <p className="text-sm text-gray-600">Monitor your improvement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
