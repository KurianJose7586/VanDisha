import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Database,
  Brain,
  Upload,
  BarChart3,
  Users,
  Sparkles,
  Zap,
  Shield,
  Globe,
  TreePine,
  Leaf,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/serene-indian-forest-with-sunlight-filtering-throu.jpg')`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-green-800/60 to-teal-900/70" />

        {/* Animated particles effect */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-teal-300/40 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-green-400/20 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/2 right-1/2 w-2 h-2 bg-yellow-300/30 rounded-full animate-pulse delay-500"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in-up">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
              <TreePine className="w-8 h-8 text-emerald-300" />
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
              <Brain className="w-8 h-8 text-blue-300" />
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent animate-fade-in-up animation-delay-200">
            Empowering Forest Rights with AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-pretty max-w-4xl mx-auto leading-relaxed text-emerald-50 animate-fade-in-up animation-delay-400">
            VanDisha is an AI-powered Decision Support System that digitizes, maps, and analyzes Forest Rights Act
            claims to accelerate sustainable development for tribal communities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-600">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                Enter the Dashboard
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm bg-transparent"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-8 h-8 text-emerald-600" />
              <h2 className="text-4xl md:text-5xl font-bold text-balance bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent">
                A Unified Platform for Data-Driven Governance
              </h2>
            </div>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Transform decades of paper records into actionable insights with cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50 hover:scale-105 group">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-emerald-800">Digitize & Unify</h3>
                <p className="text-slate-600 leading-relaxed">
                  Transform decades of paper records into a single, verifiable digital atlas with AI-powered data
                  extraction.
                </p>
                <div className="flex items-center justify-center gap-2 mt-4 text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">99% Accuracy Rate</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50 hover:scale-105 group">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-blue-800">Analyze & Visualize</h3>
                <p className="text-slate-600 leading-relaxed">
                  Using AI and satellite imagery, we map forest assets and provide unprecedented insights for better
                  decision-making.
                </p>
                <div className="flex items-center justify-center gap-2 mt-4 text-blue-600">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">Real-time Satellite Data</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50 hover:scale-105 group">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-purple-800">Recommend & Act</h3>
                <p className="text-slate-600 leading-relaxed">
                  Our AI-powered DSS provides targeted recommendations to ensure development schemes reach the right
                  communities.
                </p>
                <div className="flex items-center justify-center gap-2 mt-4 text-purple-600">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">AI-Powered Insights</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Three simple steps to transform forest rights management with AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center animate-bounce">
                  <Upload className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-emerald-800">Upload Claim</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Upload scanned PDFs or shapefiles of forest rights claims with our intuitive interface.
              </p>
              <div className="flex items-center justify-center gap-2 text-emerald-600">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Secure & Encrypted</span>
              </div>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center animate-pulse">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-800">AI Analysis</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Advanced AI extracts data, maps claims, and analyzes land using real-time satellite imagery.
              </p>
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Lightning Fast Processing</span>
              </div>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-spin-slow">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-purple-800">Get Recommendations</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Receive AI-powered recommendations for sustainable development and community empowerment.
              </p>
              <div className="flex items-center justify-center gap-2 text-purple-600">
                <Leaf className="w-4 h-4" />
                <span className="text-sm font-medium">Sustainable Solutions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 to-emerald-900 py-12 px-6 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TreePine className="w-6 h-6 text-emerald-400" />
            <h3 className="text-3xl font-bold">VanDisha</h3>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-emerald-100 text-lg">
            Empowering tribal communities through technology and data-driven governance.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-emerald-300">
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Secure</span>
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <Zap className="w-4 h-4" />
              <span className="text-sm">Fast</span>
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <Leaf className="w-4 h-4" />
              <span className="text-sm">Sustainable</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}