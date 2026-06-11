import React, { useState } from 'react';
import { 
  Lightbulb, Target, Zap, AlertCircle, Briefcase, ChevronRight, 
  Loader2, ArrowLeft, Download, TrendingUp, TrendingDown, ShieldAlert, 
  Users, DollarSign, Activity, CheckCircle2, XCircle, BarChart3, 
  Layers, Rocket, Cpu, Map, Scale, Terminal
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reportData, setReportData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    ideaName: '',
    description: '',
    problem: '',
    targetAudience: '',
    features: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ideaName || !formData.description || !formData.problem) {
      setError('Please fill in at least the Idea Name, Description, and Problem Statement.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setReportData(null);

    const prompt = `Act as a highly experienced startup analyst, venture capitalist, and market research expert.

Analyze the following startup idea in a deeply structured and professional manner.

Startup Idea Details:
- Idea Name: ${formData.ideaName}
- Description: ${formData.description}
- Problem Statement: ${formData.problem}
- Target Audience: ${formData.targetAudience || 'Not specified'}
- Key Features: ${formData.features || 'Not specified'}

Provide a comprehensive, highly analytical, and realistic evaluation. Be concise but specific to this idea. Avoid generic advice.`;

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate analysis.');
      }

      setReportData(data);
    } catch (err: any) {
      console.error('Error generating analysis:', err);
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setReportData(null);
    setError(null);
  };

  const handleDownload = () => {
    if (!reportData) return;
    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.ideaName.replace(/\s+/g, '_').toLowerCase()}_analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Radar Chart Data
  const radarData = reportData ? [
    { subject: 'Feasibility', A: reportData.startupScore.feasibility, fullMark: 10 },
    { subject: 'Innovation', A: reportData.startupScore.innovation, fullMark: 10 },
    { subject: 'Profitability', A: reportData.startupScore.profitability, fullMark: 10 },
    { subject: 'Safety', A: 10 - reportData.startupScore.risk, fullMark: 10 },
  ] : [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200 pb-20 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button 
            onClick={() => { setHasStarted(false); resetForm(); }}
            className="flex items-center gap-2 text-slate-900 hover:text-blue-600 transition-colors group"
          >
            <Terminal className="w-6 h-6 text-blue-600 group-hover:rotate-12 transition-transform" />
            <span className="font-black text-xl tracking-tighter">IdeaAnalyst<span className="text-blue-600">Pro</span></span>
          </button>
          {reportData && (
            <button
              onClick={resetForm}
              className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full border border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" /> New Analysis
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 relative">
        <AnimatePresence mode="wait">
          {!hasStarted && (
            <motion.div 
              key="hero"
              exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
              className="flex flex-col items-center justify-center min-h-[85vh] text-center relative z-10"
            >
              {/* Light Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10"></div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8 max-w-5xl mx-auto"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                  className="inline-flex items-center justify-center p-6 bg-blue-100 border border-blue-200 rounded-2xl mb-4 shadow-sm"
                >
                  <Zap className="w-12 h-12 text-blue-600" />
                </motion.div>
                
                <h1 className="text-6xl md:text-8xl lg:text-[120px] font-black text-slate-900 tracking-tighter leading-[0.85] uppercase">
                  Validate <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    The Future
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium tracking-tight">
                  Turn your raw startup ideas into VC-ready, data-backed market analysis in seconds. No fluff, just hard data.
                </p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="pt-12"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 40px -10px rgba(37,99,235,0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setHasStarted(true)}
                    className="bg-blue-600 text-white text-lg font-bold uppercase tracking-widest py-5 px-12 rounded-full transition-all flex items-center gap-3 mx-auto group cursor-pointer border border-blue-500 shadow-xl"
                  >
                    Initialize Analysis 
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {hasStarted && !reportData && !isAnalyzing && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid lg:grid-cols-12 gap-12 items-center min-h-[80vh] relative z-10"
            >
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6">
                    <Terminal className="w-4 h-4" /> System Ready
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-[0.9]">
                    Input <br/>Parameters.
                  </h1>
                  <p className="text-xl text-slate-600 leading-relaxed">
                    Provide the core details of your startup. Our AI engine will run a comprehensive market simulation and risk assessment.
                  </p>
                </div>

                <div className="space-y-6 pt-8 border-t border-slate-200">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-slate-100 border border-slate-200 p-3 rounded-xl text-blue-600">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Market Validation</h3>
                      <p className="text-slate-500 mt-1 text-sm">TAM/SAM/SOM funnels and competitor analysis.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-slate-100 border border-slate-200 p-3 rounded-xl text-indigo-600">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Business Model</h3>
                      <p className="text-slate-500 mt-1 text-sm">Revenue strategy and unit economics breakdown.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                  {/* Decorative glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
                  
                  <form onSubmit={handleAnalyze} className="space-y-6 relative z-10">
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p className="font-medium">{error}</p>
                      </motion.div>
                    )}

                    <div className="space-y-5">
                      <div>
                        <label htmlFor="ideaName" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                          Idea Name <span className="text-blue-600">*</span>
                        </label>
                        <input
                          type="text"
                          id="ideaName"
                          name="ideaName"
                          value={formData.ideaName}
                          onChange={handleInputChange}
                          placeholder="e.g., Uber for Dog Walking"
                          className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                          Description <span className="text-blue-600">*</span>
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Briefly describe what your product does..."
                          rows={3}
                          className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-slate-900 placeholder-slate-400 font-medium"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="problem" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                          Problem Statement <span className="text-blue-600">*</span>
                        </label>
                        <textarea
                          id="problem"
                          name="problem"
                          value={formData.problem}
                          onChange={handleInputChange}
                          placeholder="What specific problem are you solving?"
                          rows={3}
                          className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-slate-900 placeholder-slate-400 font-medium"
                          required
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="targetAudience" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                            Target Audience
                          </label>
                          <input
                            type="text"
                            id="targetAudience"
                            name="targetAudience"
                            value={formData.targetAudience}
                            onChange={handleInputChange}
                            placeholder="e.g., Busy professionals"
                            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium"
                          />
                        </div>

                        <div>
                          <label htmlFor="features" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                            Key Features
                          </label>
                          <input
                            type="text"
                            id="features"
                            name="features"
                            value={formData.features}
                            onChange={handleInputChange}
                            placeholder="e.g., GPS tracking"
                            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isAnalyzing}
                      className="w-full bg-slate-900 text-white font-black uppercase tracking-widest py-5 px-6 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 shadow-lg"
                    >
                      <Zap className="w-5 h-5 fill-current" />
                      Execute Analysis
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              className="flex flex-col items-center justify-center min-h-[70vh] space-y-12"
            >
              <div className="relative w-48 h-48 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-t-2 border-r-2 border-blue-500 rounded-full opacity-50"
                />
                <motion.div 
                  animate={{ rotate: -360 }} 
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 border-b-2 border-l-2 border-indigo-500 rounded-full opacity-50"
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-blue-100 rounded-full blur-xl"
                />
                <Cpu className="w-16 h-16 text-blue-600 relative z-10" />
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Processing Data</h2>
                <div className="flex items-center justify-center gap-2 text-blue-600 font-mono text-sm">
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>[</motion.span>
                  <span>Running market simulations</span>
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}>]</motion.span>
                </div>
              </div>
            </motion.div>
          )}

          {reportData && !isAnalyzing && (
            <motion.div 
              key="report"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {/* Dashboard Header */}
              <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                <div>
                  <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">{formData.ideaName}</h1>
                  <p className="text-slate-500 mt-3 text-lg font-medium max-w-3xl">{formData.description}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-slate-900 text-white hover:bg-blue-600 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-colors shrink-0 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Export JSON
                </motion.button>
              </motion.div>

              {/* Score & Radar Section */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Final Score Card */}
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white flex flex-col justify-center items-center text-center relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
                  
                  <h3 className="text-blue-100 font-bold tracking-widest uppercase text-xs mb-6">System Evaluation Score</h3>
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-56 h-56 transform -rotate-90">
                      <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-black/10" />
                      <motion.circle 
                        initial={{ strokeDashoffset: 2 * Math.PI * 100 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 100 * (1 - reportData.startupScore.finalScore / 100) }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                        cx="112" cy="112" r="100" 
                        stroke="currentColor" strokeWidth="12" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 100} 
                        className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-7xl font-black tracking-tighter">{reportData.startupScore.finalScore}</span>
                      <span className="text-blue-200 font-bold uppercase tracking-widest text-xs mt-1">Out of 100</span>
                    </div>
                  </div>
                  <p className="mt-8 text-blue-50 text-sm leading-relaxed max-w-xs mx-auto font-medium">
                    {reportData.startupScore.reasoning}
                  </p>
                </motion.div>

                {/* Radar Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/2 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                        <Radar name="Score" dataKey="A" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full md:w-1/2 space-y-6">
                    <ScoreBar label="Feasibility" score={reportData.startupScore.feasibility} color="bg-blue-500" />
                    <ScoreBar label="Innovation" score={reportData.startupScore.innovation} color="bg-indigo-500" />
                    <ScoreBar label="Profitability" score={reportData.startupScore.profitability} color="bg-purple-500" />
                    <ScoreBar label="Safety (Inv. Risk)" score={10 - reportData.startupScore.risk} color="bg-emerald-500" />
                  </div>
                </motion.div>
              </div>

              {/* Core Analysis Grid */}
              <motion.div variants={containerVariants} className="grid md:grid-cols-2 gap-8">
                <Card icon={<AlertCircle className="w-6 h-6 text-blue-600" />} title="Problem Validation">
                  <p className="text-slate-600 leading-relaxed">{reportData.problemValidation}</p>
                </Card>
                <Card icon={<CheckCircle2 className="w-6 h-6 text-indigo-600" />} title="Solution Effectiveness">
                  <p className="text-slate-600 leading-relaxed">{reportData.solutionEffectiveness}</p>
                </Card>
                <Card icon={<Zap className="w-6 h-6 text-purple-600" />} title="Unique Value Proposition">
                  <p className="text-slate-600 leading-relaxed">{reportData.uvp}</p>
                </Card>
                <Card icon={<Users className="w-6 h-6 text-emerald-600" />} title="Target Audience">
                  <p className="text-slate-600 leading-relaxed">{reportData.targetAudience}</p>
                </Card>
              </motion.div>

              {/* Market Size & Personas */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Market Size Funnel */}
                <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100"><BarChart3 className="w-6 h-6 text-blue-600" /></div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Market Size</h2>
                  </div>
                  
                  <div className="flex flex-col gap-3 items-center">
                    <div className="w-full bg-blue-50 border border-blue-100 rounded-t-3xl p-8 text-center relative">
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Total Addressable Market (TAM)</div>
                      <div className="text-5xl font-black text-blue-900 tracking-tighter">{reportData.marketSize.tam}</div>
                    </div>
                    <div className="w-[85%] bg-indigo-50 border border-indigo-100 p-6 text-center relative">
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Serviceable Available Market (SAM)</div>
                      <div className="text-4xl font-black text-indigo-900 tracking-tighter">{reportData.marketSize.sam}</div>
                    </div>
                    <div className="w-[70%] bg-purple-50 border border-purple-100 rounded-b-3xl p-5 text-center relative">
                      <div className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">Serviceable Obtainable Market (SOM)</div>
                      <div className="text-3xl font-black text-purple-900 tracking-tighter">{reportData.marketSize.som}</div>
                    </div>
                  </div>
                  <p className="text-slate-600 mt-8 text-center text-sm bg-slate-50 p-5 rounded-2xl border border-slate-100 leading-relaxed">
                    {reportData.marketSize.growthTrends}
                  </p>
                </motion.div>

                {/* Personas */}
                <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100"><Users className="w-6 h-6 text-indigo-600" /></div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Customer Personas</h2>
                  </div>
                  <div className="space-y-4">
                    {reportData.personas?.map((persona: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex gap-5 hover:border-indigo-200 transition-colors">
                        <div className="w-14 h-14 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-black text-2xl shrink-0">
                          {persona.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg">{persona.name}</h4>
                          <p className="text-slate-600 text-sm mt-2 leading-relaxed">{persona.profile}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* SWOT Analysis - 2x2 Grid */}
              <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-3 mb-10">
                  <div className="bg-slate-100 p-3 rounded-xl border border-slate-200"><Layers className="w-6 h-6 text-slate-700" /></div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">SWOT Analysis</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <SWOTBox title="Strengths" items={reportData.swot.strengths} color="emerald" icon={<TrendingUp className="w-5 h-5" />} />
                  <SWOTBox title="Weaknesses" items={reportData.swot.weaknesses} color="rose" icon={<TrendingDown className="w-5 h-5" />} />
                  <SWOTBox title="Opportunities" items={reportData.swot.opportunities} color="blue" icon={<Lightbulb className="w-5 h-5" />} />
                  <SWOTBox title="Threats" items={reportData.swot.threats} color="amber" icon={<ShieldAlert className="w-5 h-5" />} />
                </div>
              </motion.div>

              {/* Competitors */}
              <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 hover:border-orange-200 transition-colors">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-orange-50 p-3 rounded-xl border border-orange-100"><Target className="w-6 h-6 text-orange-600" /></div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Competitor Landscape</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reportData.competitors?.map((comp: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:border-orange-200 transition-colors">
                      <h4 className="font-black text-slate-900 text-lg mb-3 uppercase tracking-tight">{comp.name}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{comp.details}</p>
                    </div>
                  ))}
                </div>
                {reportData.existingProducts && reportData.existingProducts.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Other Existing Products</h4>
                    <div className="flex flex-wrap gap-3">
                      {reportData.existingProducts.map((prod: string, idx: number) => (
                        <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-600 px-4 py-2 rounded-full text-sm font-medium">{prod}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Financials & Economics */}
              <motion.div variants={containerVariants} className="grid lg:grid-cols-3 gap-8">
                <Card icon={<DollarSign className="w-6 h-6 text-emerald-600" />} title="Revenue Model">
                  <p className="text-slate-600 leading-relaxed">{reportData.revenueModel}</p>
                </Card>
                <Card icon={<Activity className="w-6 h-6 text-blue-600" />} title="Cost Structure">
                  <p className="text-slate-600 leading-relaxed">{reportData.costStructure}</p>
                </Card>
                <Card icon={<Scale className="w-6 h-6 text-purple-600" />} title="Unit Economics">
                  <p className="text-slate-600 leading-relaxed">{reportData.unitEconomics}</p>
                </Card>
              </motion.div>

              {/* Risks */}
              <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 hover:border-red-200 transition-colors">
                <div className="flex items-center gap-3 mb-10">
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100"><AlertCircle className="w-6 h-6 text-red-600" /></div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Risk Assessment</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <RiskColumn title="Technical" items={reportData.risks.technical} />
                  <RiskColumn title="Market" items={reportData.risks.market} />
                  <RiskColumn title="Legal" items={reportData.risks.legal} />
                  <RiskColumn title="Financial" items={reportData.risks.financial} />
                </div>
              </motion.div>

              {/* Execution & Strategy */}
              <motion.div variants={containerVariants} className="grid md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <Card icon={<Rocket className="w-6 h-6 text-blue-600" />} title="Go-To-Market Strategy">
                    <p className="text-slate-600 leading-relaxed">{reportData.goToMarket}</p>
                  </Card>
                  <Card icon={<Cpu className="w-6 h-6 text-indigo-600" />} title="Tech Feasibility">
                    <p className="text-slate-600 leading-relaxed">{reportData.techFeasibility}</p>
                  </Card>
                </div>
                <div className="space-y-8">
                  <ListCard icon={<Map className="w-6 h-6 text-teal-600" />} title="Distribution Channels" items={reportData.distribution} />
                  <ListCard icon={<Briefcase className="w-6 h-6 text-cyan-600" />} title="Partnership Opportunities" items={reportData.partnerships} />
                </div>
              </motion.div>

              {/* Roadmap & Improvements */}
              <motion.div variants={containerVariants} className="grid md:grid-cols-2 gap-8">
                <ListCard icon={<TrendingUp className="w-6 h-6 text-blue-600" />} title="Future Roadmap" items={reportData.futureRoadmap} />
                <ListCard icon={<Lightbulb className="w-6 h-6 text-amber-600" />} title="Improvement Suggestions" items={reportData.improvementSuggestions} bg="bg-amber-50 border-amber-100" />
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Helper Components ---

function ScoreBar({ label, score, color, invert = false }: { label: string, score: number, color: string, invert?: boolean }) {
  const displayScore = invert ? 10 - score : score; 
  const displayPercentage = (displayScore / 10) * 100;
  
  return (
    <div>
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-900">{score}/10</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${displayPercentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className={`h-full ${color} rounded-full`} 
        ></motion.div>
      </div>
    </div>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 h-full hover:border-blue-200 hover:shadow-md transition-all group">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function ListCard({ icon, title, items, bg = "bg-white" }: { icon: React.ReactNode, title: string, items: string[], bg?: string }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className={`${bg} rounded-3xl border border-slate-200 shadow-sm p-8 h-full hover:border-blue-200 hover:shadow-md transition-all group`}>
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{title}</h3>
      </div>
      <ul className="space-y-4">
        {items?.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <span className="text-slate-600 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function SWOTBox({ title, items, color, icon }: { title: string, items: string[], color: 'emerald' | 'rose' | 'blue' | 'amber', icon: React.ReactNode }) {
  const colorMap = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-900 marker:text-emerald-500',
    rose: 'bg-rose-50 border-rose-200 text-rose-900 marker:text-rose-500',
    blue: 'bg-blue-50 border-blue-200 text-blue-900 marker:text-blue-500',
    amber: 'bg-amber-50 border-amber-200 text-amber-900 marker:text-amber-500',
  };
  const iconColorMap = {
    emerald: 'text-emerald-600',
    rose: 'text-rose-600',
    blue: 'text-blue-600',
    amber: 'text-amber-600',
  };

  return (
    <div className={`p-6 rounded-2xl border ${colorMap[color]} hover:shadow-md transition-all`}>
      <h4 className="font-black text-slate-900 uppercase tracking-tighter text-lg mb-5 flex items-center gap-3">
        <span className={iconColorMap[color]}>{icon}</span>
        {title}
      </h4>
      <ul className="list-disc pl-5 space-y-3 text-sm leading-relaxed text-slate-700">
        {items?.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function RiskColumn({ title, items }: { title: string, items: string[] }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-slate-300 transition-colors">
      <h4 className="font-black text-slate-900 uppercase tracking-tighter mb-5 border-b border-slate-200 pb-3">{title} Risks</h4>
      <ul className="space-y-4">
        {items?.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
            <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
