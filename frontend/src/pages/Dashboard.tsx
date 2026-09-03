import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { assessDeviceCapability, DeviceCapability } from '../utils/detectPerformance';

// Assume types from shared/index.ts (which we would bundle or import locally)
interface Competency {
  id: string;
  skillName: string;
  targetLevel: number;
  category: string;
}

export default function Dashboard() {
  const [designation, setDesignation] = useState('Joint Director');
  const [skills, setSkills] = useState<Competency[]>([]);
  const [loading, setLoading] = useState(false);
  const [proficiency, setProficiency] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<any[]>([]);
  const [deviceMode, setDeviceMode] = useState<DeviceCapability | 'LOADING'>('POTATO_DEVICE');
  const [selectedCourseContext, setSelectedCourseContext] = useState<string | null>(null);
  
  // New States for requested features
  const [activeTab, setActiveTab] = useState<'dashboard' | 'discover' | 'competency' | 'analytics'>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [assessmentsTaken, setAssessmentsTaken] = useState(0);

  useEffect(() => {
    // Fetch courses from real backend
    const domainQuery = selectedDomain !== 'All' ? `&domain=${encodeURIComponent(selectedDomain)}` : '';
    fetch(`http://localhost:5000/api/courses/search?q=${encodeURIComponent(searchQuery)}${domainQuery}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.courses) {
          setCourses(data.courses.slice(0, 3)); // Display top 3 results
        }
      })
      .catch(err => console.error("Course fetch error:", err));
  }, [searchQuery, selectedDomain]);

  useEffect(() => {
    assessDeviceCapability().then(setDeviceMode);
  }, []);

  const selectCourseForQuiz = (courseTitle: string) => {
    setSelectedCourseContext(courseTitle);
    setGeneratedQuiz([]); // Fix: clear old generated quiz when selecting new course
    const el = document.getElementById('quiz-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchSkills = async () => {
    setLoading(true);
    try {
      // Mocking the backend response for prototype UI validation
      const mockData = designation === 'Joint Director' 
        ? [
            { id: '1', skillName: 'Sampling Theory', targetLevel: 4, category: 'Statistical' },
            { id: '2', skillName: 'Data Visualization', targetLevel: 3, category: 'Technical' },
            { id: '3', skillName: 'Data Privacy (DPDP)', targetLevel: 3, category: 'Administrative' }
          ]
        : [
            { id: '4', skillName: 'Time Series Analysis', targetLevel: 4, category: 'Statistical' },
            { id: '2', skillName: 'Data Visualization', targetLevel: 3, category: 'Technical' }
          ];
      
      setSkills(mockData);
      
      // Initialize proficiency state
      const initialProf = {};
      mockData.forEach(s => initialProf[s.skillName] = 1);
      setProficiency(initialProf);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [designation]);

  const handleProficiencyChange = useCallback((skillName: string, level: number) => {
    setProficiency(prev => ({ ...prev, [skillName]: level }));
    setAssessmentsTaken(prev => prev + 1);
  }, []);

  const analyticsData = useMemo(() => {
    const numSkills = skills.length || 1;
    const avgLevel = (Object.values(proficiency).reduce((a, b) => a + b, 0) / numSkills).toFixed(1);
    
    let topGapSkill = 'None';
    let maxGap = -1;
    skills.forEach(s => {
      const currentLvl = proficiency[s.skillName] || 1;
      const gap = s.targetLevel - currentLvl;
      if (gap > maxGap) {
        maxGap = gap;
        topGapSkill = s.skillName;
      }
    });

    return { avgLevel, topGapSkill };
  }, [skills, proficiency]);

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-900">
      {/* Official Government Header Style */}
      <header className="bg-gradient-to-r from-primary-900 via-primary-700 to-primary-900 text-white px-4 md:px-10 py-6 shadow-lg relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <div className="text-center md:text-left">
            <div className="text-accent-saffron font-semibold text-xs tracking-wide uppercase mb-1">Mission Karmayogi</div>
            <h1 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-3 tracking-tight">
              <span className="w-6 h-6 border-[3px] border-accent-saffron rounded-full inline-block shadow-sm"></span>
              StatSkill AI 
            </h1>
            <p className="text-primary-100 text-sm mt-1 opacity-90">Empowering India's Statisticians with AI-Driven Intelligence</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 items-center text-sm font-medium">
            <button onClick={() => setActiveTab('dashboard')} className={`cursor-pointer transition-all duration-200 ${activeTab === 'dashboard' ? 'text-accent-saffron border-b-2 border-accent-saffron pb-1 scale-105' : 'hover:text-accent-saffron/80'}`}>Dashboard</button>
            <button onClick={() => setActiveTab('discover')} className={`cursor-pointer transition-all duration-200 ${activeTab === 'discover' ? 'text-accent-saffron border-b-2 border-accent-saffron pb-1 scale-105' : 'hover:text-accent-saffron/80'}`}>Discover (700+ Courses)</button>
            <button onClick={() => setActiveTab('competency')} className={`cursor-pointer transition-all duration-200 ${activeTab === 'competency' ? 'text-accent-saffron border-b-2 border-accent-saffron pb-1 scale-105' : 'hover:text-accent-saffron/80'}`}>Competency Profile</button>
            <button onClick={() => setActiveTab('analytics')} className={`cursor-pointer transition-all duration-200 ${activeTab === 'analytics' ? 'text-accent-saffron border-b-2 border-accent-saffron pb-1 scale-105' : 'hover:text-accent-saffron/80'}`}>Analytics Dashboard</button>
            {!isLoggedIn ? (
              <button onClick={() => setIsLoggedIn(true)} className="bg-white/10 backdrop-blur-sm border-2 border-accent-saffron text-white px-5 py-2 rounded font-bold hover:bg-accent-saffron transition-all duration-300 shadow-sm flex items-center gap-2 active:scale-95 w-full md:w-auto justify-center mt-2 md:mt-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Login via Jan Parichay (SSO)
              </button>
            ) : (
              <button onClick={() => setIsLoggedIn(false)} className="bg-green-600/90 backdrop-blur-sm text-white px-5 py-2 rounded font-bold hover:bg-green-500 transition-all duration-300 shadow-sm flex items-center gap-2 border-2 border-green-400 active:scale-95 w-full md:w-auto justify-center mt-2 md:mt-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Gov.in SSO Active
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Tricolour Stripe */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #F5811F 0%, #F5811F 33%, #FFFFFF 33%, #FFFFFF 66%, #1E8449 66%, #1E8449 100%)' }}></div>

      <div className="max-w-6xl mx-auto py-10 px-4 md:px-10 space-y-8">
        <main className="grid grid-cols-1 gap-6">
        
        {activeTab === 'competency' && (
          <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-neutral-200 pb-4">
            <h2 className="text-2xl font-bold text-primary-900">Competency Mapping</h2>
          <div className="w-full md:w-auto">
            <label className="text-sm text-neutral-700 font-medium mr-3">Current Designation:</label>
            <select 
              value={designation} 
              onChange={(e) => setDesignation(e.target.value)}
              className="px-4 py-2 rounded-md border border-neutral-200 bg-white text-neutral-900 font-medium focus:outline-none focus:border-primary-500 shadow-sm"
            >
              <option value="Joint Director">Joint Director</option>
              <option value="Assistant Director">Assistant Director</option>
              <option value="JSO">JSO</option>
            </select>
          </div>
        </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-primary-900 border-b-2 border-accent-saffron pb-1 inline-block">Skill Matrix Evaluation</h3>
            </div>
            
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                <div className="h-10 bg-neutral-200 rounded"></div>
              </div>
            ) : (
              <div className="space-y-5">
                {skills.map((skill) => (
                  <div key={skill.id} className="bg-neutral-50 p-5 rounded-lg border-l-4 border-primary-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white hover:shadow-md transition-all">
                    <div>
                      <div className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                        {skill.category}
                      </div>
                      <h3 className="font-semibold text-lg text-neutral-900 leading-tight mb-1">{skill.skillName}</h3>
                      <p className="text-sm text-neutral-600">Department Standard: <span className="font-semibold text-primary-900">Level {skill.targetLevel}</span></p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">AI-Assessed Proficiency</span>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <div
                            key={lvl}
                            className={`w-10 h-10 rounded text-sm font-bold transition-all flex items-center justify-center cursor-default ${
                              proficiency[skill.skillName] >= lvl
                                ? 'bg-primary-900 text-white shadow-sm ring-2 ring-primary-900 ring-offset-1'
                                : 'bg-white text-neutral-400 border border-neutral-300'
                            }`}
                          >
                            {lvl}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 mt-6">
            <h3 className="text-lg font-bold text-primary-900 border-b-2 border-accent-saffron pb-1 inline-block mb-6">Your Personalised Learning Pathway</h3>
            <p className="text-sm text-neutral-600 mb-6">Based on your recent AI assessments, the following iGOT courses have been automatically assigned to address your specific competency gaps.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dynamic Mapping: Showing a recommendation if they have a low score */}
              {skills.map(s => {
                const currentLevel = proficiency[s.skillName] || 1;
                if (currentLevel < s.targetLevel) {
                  return (
                    <div key={s.id} className="border border-red-200 bg-red-50/30 rounded-lg p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">Gap: {s.skillName}</span>
                          <span className="text-xs text-neutral-500 font-medium">Level {currentLevel} of {s.targetLevel}</span>
                        </div>
                        <h4 className="font-bold text-primary-900">Foundational {s.skillName} in Practice</h4>
                        <p className="text-sm text-neutral-600 mt-1">iGOT Karmayogi • 4 Hours</p>
                      </div>
                      <a href="https://igotkarmayogi.gov.in/" target="_blank" rel="noreferrer" className="mt-4 bg-accent-saffron text-white text-sm font-bold px-4 py-2 rounded text-center hover:bg-orange-600 transition shadow-sm">
                        Enroll to Close Gap
                      </a>
                    </div>
                  )
                }
                return null;
              })}
              
              {/* Fallback if no gaps exist */}
              {skills.every(s => (proficiency[s.skillName] || 1) >= s.targetLevel) && (
                <div className="col-span-full p-8 text-center border border-green-200 bg-green-50 rounded-lg">
                  <span className="text-green-600 font-black text-xl block mb-2">✓ All Competencies Met</span>
                  <p className="text-sm text-green-800 font-medium">You have no active skill gaps. Keep up the excellent work!</p>
                </div>
              )}
            </div>
          </div>
          </>
        )}
            
        {activeTab === 'discover' && (
          <>
            {/* Phase 2: Course Discovery Section */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-primary-900 flex items-center gap-2">
                  <span className="p-2 bg-neutral-100 rounded-lg text-accent-saffron">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </span>
                  iGOT Course Discovery
                </h2>
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                  Multilingual Search Enabled
                </span>
              </div>
              
              {/* Search Bar */}
              <div className="relative mb-6">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses... (e.g. 'pratichayan', 'shikshak', 'sampling', 'cpi')"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 shadow-sm text-neutral-900"
                />
                <svg className="w-5 h-5 text-neutral-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-8">
                {['All', 'Official Statistics', 'Data & Computing', 'Digital Governance & Law', 'Public Administration & Leadership'].map(filter => (
                  <button 
                    key={filter} 
                    onClick={() => setSelectedDomain(filter)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border ${selectedDomain === filter ? 'bg-primary-900 text-white border-primary-900' : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'}`}>
                    {filter}
                  </button>
                ))}
              </div>

              {/* Course Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.length > 0 ? courses.map((course: any, idx: number) => (
                  <div key={idx} className="border border-neutral-200 rounded-xl p-5 hover:border-primary-400 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 bg-white flex flex-col justify-between">
                    <div className="text-xs font-bold text-accent-saffron uppercase tracking-wider mb-2">{course.domain || "MoSPI Training Unit"}</div>
                    <h3 className="font-bold text-neutral-900 mb-2 leading-snug">{course.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-neutral-500 font-medium mb-4">
                      <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 4 Hours</span>
                      <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> Level {course.targetLevel || 2}</span>
                    </div>
                    <button 
                      onClick={() => selectCourseForQuiz(course.title)}
                      className="w-full bg-primary-50 text-primary-800 font-bold py-2 rounded border border-primary-200 hover:bg-primary-100 transition text-sm">
                      Upload Module PDF
                    </button>
                  </div>
                )) : (
                  <div className="col-span-full py-16 text-center border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50">
                    <svg className="w-12 h-12 text-neutral-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h3 className="text-lg font-bold text-neutral-700">No courses found</h3>
                    <p className="text-neutral-500 mt-1">Try adjusting your search filters or domain selection.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
            
        {activeTab === 'dashboard' && (
          <>
            {/* Sovereign Edge-AI Quiz Generation Section */}
          <div id="quiz-section" className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
            <div className="flex justify-between items-center mb-8 border-b border-neutral-100 pb-5">
              <div>
                <h2 className="text-xl font-bold text-primary-900 flex items-center gap-2">
                  <span className="p-2 bg-neutral-100 rounded-lg text-accent-saffron">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  </span>
                  Sovereign Edge-AI Quiz Generation
                </h2>
                {selectedCourseContext ? (
                  <p className="text-neutral-500 text-sm mt-2 font-medium">Generating assessment for: <span className="text-accent-saffron">{selectedCourseContext}</span></p>
                ) : (
                  <p className="text-neutral-500 text-sm mt-2">Generate offline active-recall fragments directly from MoSPI module PDFs.</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <button 
                  onClick={() => setDeviceMode(prev => prev === 'MODERN_DEVICE' ? 'POTATO_DEVICE' : 'MODERN_DEVICE')}
                  className={`px-2 py-1 text-xs font-bold rounded cursor-pointer transition hover:opacity-80 shadow-sm ${deviceMode === 'MODERN_DEVICE' ? 'bg-green-100 text-green-800 border border-green-200' : deviceMode === 'POTATO_DEVICE' ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-neutral-100 text-neutral-500'}`}>
                  {deviceMode === 'MODERN_DEVICE' ? '☁️ Cloud Live RAG (Real PDF Parsing)' : deviceMode === 'POTATO_DEVICE' ? '⚡ Edge SQLite Cache (Offline/Potato Mode)' : 'Detecting Hardware...'}
                </button>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xs text-neutral-500 font-medium">
                    <span className="text-blue-500 mr-1">⚡ Auto-Detected:</span> 
                    {deviceMode === 'MODERN_DEVICE' ? 'High RAM & 4G/5G Network' : 'Low RAM / Weak Network'}
                  </p>
                </div>
              </div>
            </div>

            <div className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all ${isUploading ? 'border-primary-500 bg-primary-50/50' : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'} group cursor-pointer`}>
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-xl z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors ${isUploading ? 'bg-primary-100 text-primary-600 animate-pulse' : 'bg-neutral-100 text-neutral-500 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
                  {isUploading ? (
                    <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  )}
                </div>
                <h3 className="text-lg text-neutral-900 font-semibold mb-2">
                  {isUploading ? 'Extracting Text & Generating Quizzes...' : 'Upload MoSPI Statistical PDF'}
                </h3>
                <p className="text-sm text-neutral-500 max-w-md mx-auto mb-6">
                  The local LLM will map the document text to your FRAC competency gaps and generate highly specific active-recall questions.
                </p>
                
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden" 
                  id="pdf-upload"
                  disabled={isUploading}
                  onChange={async (e) => {
                    if (!e.target.files || e.target.files.length === 0) return;
                    setIsUploading(true);
                    setGeneratedQuiz([]);
                    
                    const file = e.target.files[0];
                    const formData = new FormData();
                    formData.append('document', file);
                    formData.append('numQuestions', '3');
                    formData.append('difficulty', 'intermediate');
                    
                    try {
                      const response = await fetch(`http://localhost:5000/api/quiz/generate-async?mode=${deviceMode}`, {
                        method: 'POST',
                        body: formData,
                      });
                      
                      const initData = await response.json();
                      if (!initData.jobId) throw new Error("Failed to start job");
                      
                      const pollInterval = setInterval(async () => {
                        try {
                          const statusRes = await fetch(`http://localhost:5000/api/quiz/status/${initData.jobId}`);
                          const statusData = await statusRes.json();
                          
                          if (statusData.status === 'complete') {
                            clearInterval(pollInterval);
                            setIsUploading(false);
                            if (statusData.result && statusData.result.questions) {
                              setGeneratedQuiz(statusData.result.questions);
                            }
                          } else if (statusData.status === 'error') {
                            clearInterval(pollInterval);
                            setIsUploading(false);
                            console.error("Job Error:", statusData.error);
                            alert("LLM Engine Failed: " + statusData.error);
                          }
                        } catch (err) {
                          console.error("Poll err:", err);
                        }
                      }, 2000);
                      
                    } catch (error) {
                      console.error("Sub err:", error);
                      setIsUploading(false);
                    }
                  }}
                />
                <label htmlFor="pdf-upload" className={`px-6 py-2.5 rounded shadow-sm text-sm font-bold transition inline-block ${isUploading ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed' : 'bg-primary-900 text-white hover:bg-primary-800 cursor-pointer hover:shadow-md hover:-translate-y-0.5'}`}>
                  {isUploading ? 'Processing Document' : 'Browse Local Files'}
                </label>
              </div>
            </div>
            
            {/* Generated Quiz Output */}
            {generatedQuiz.length > 0 && (
              <div className="mt-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-6 border-b border-neutral-100 pb-4">
                   <div className="w-8 h-8 rounded bg-green-100 text-green-700 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h3 className="text-lg font-bold text-primary-900">Generated Active-Recall Fragments</h3>
                </div>
                
                <div className="space-y-8">
                  {generatedQuiz.map((q, index) => (
                    <QuizQuestion 
                      key={index} 
                      q={q} 
                      index={index} 
                      handleProficiencyChange={handleProficiencyChange} 
                      skillToUpdate={skills.length > 0 ? skills[0].skillName : 'Sampling Theory'} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          </>
        )}
        
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
            <div className="flex justify-between items-center mb-8 border-b border-neutral-100 pb-5">
              <div>
                <h2 className="text-xl font-bold text-primary-900 flex items-center gap-2">
                  <span className="p-2 bg-neutral-100 rounded-lg text-accent-saffron">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                  </span>
                  Live Analytics Dashboard
                </h2>
                <p className="text-neutral-500 text-sm mt-2">Real-time FRAC competency tracking directly wired to user quiz assessments.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200 text-center transition-all duration-300 transform hover:scale-105">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Total Assessments Logged</p>
                <p className="text-3xl font-black text-primary-900">{assessmentsTaken}</p>
              </div>
              <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200 text-center transition-all duration-300 transform hover:scale-105">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Avg. FRAC Level</p>
                <p className="text-3xl font-black text-primary-900">{analyticsData.avgLevel} <span className="text-sm font-medium text-neutral-400">/ 5.0</span></p>
              </div>
              <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center transition-all duration-300 transform hover:scale-105">
                <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Current Top Gap</p>
                <p className="text-xl font-black text-red-800">{analyticsData.topGapSkill}</p>
              </div>
            </div>

                <div className="space-y-6">
                  <h3 className="font-bold text-neutral-900 mb-4 border-b pb-2">Dynamic Competency Heatmap</h3>
                  
                  {skills.map(s => {
                    const currentLvl = proficiency[s.skillName] || 1;
                    const percent = (currentLvl / 5.0) * 100;
                    const isCritical = currentLvl < s.targetLevel;
                    
                    return (
                      <div key={s.id} className="transition-all duration-500">
                        <div className="flex justify-between text-sm font-bold mb-2 text-neutral-700">
                          <span>{s.skillName}</span>
                          <span className={isCritical ? 'text-red-600' : 'text-green-600'}>
                            Level {currentLvl} (Target: {s.targetLevel})
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-3 rounded-full transition-all duration-700 ease-in-out ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} 
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        {isCritical && (
                          <p className="text-xs text-red-500 font-bold mt-2">Critical Action Required: Assign iGOT mandatory training.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
        )}
          
        </main>
      </div>
    </div>
  );
}

function QuizQuestion({ q, index, handleProficiencyChange, skillToUpdate }: { q: any, index: number, handleProficiencyChange: any, skillToUpdate: string }) {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [recommendation, setRecommendation] = React.useState<any | null>(null);
  const [loadingRec, setLoadingRec] = React.useState(false);
  
  const isCorrect = selectedOption === q.correctAnswer;

  const handleSelect = async (opt: string) => {
    setSelectedOption(opt);
    
    if (opt !== q.correctAnswer) {
      // Degrade competency visually (mock logic: drop skill by 1 level)
      handleProficiencyChange(skillToUpdate, 2);
      
      // Fetch dynamic recommendation
      setLoadingRec(true);
      try {
        const res = await fetch('http://localhost:5000/api/recommend/course', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gapTopic: "General", gapDescription: q.question })
        });
        const data = await res.json();
        if (data.success) {
          setRecommendation(data.recommendation);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRec(false);
      }
    } else {
      // If correct, boost competency
      handleProficiencyChange(skillToUpdate, 4);
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:border-primary-300 transition-colors">
      <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center text-sm font-bold mt-0.5">
            {index + 1}
          </span>
          <p className="text-[15px] text-neutral-900 font-medium leading-relaxed">{q.question}</p>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          {q.options.map((opt: string, i: number) => {
            let btnClass = "text-left px-5 py-4 border border-neutral-200 rounded-lg text-sm transition-all font-medium group ";
            if (!selectedOption) {
              btnClass += "hover:border-primary-500 hover:bg-primary-50 hover:text-primary-800 cursor-pointer";
            } else {
              if (opt === q.correctAnswer) {
                btnClass += "bg-green-50 border-green-500 text-green-800 shadow-sm";
              } else if (opt === selectedOption) {
                btnClass += "bg-red-50 border-red-500 text-red-800 shadow-sm";
              } else {
                btnClass += "opacity-50 cursor-not-allowed bg-neutral-50";
              }
            }
            
            return (
              <button 
                key={i} 
                disabled={!!selectedOption}
                onClick={() => handleSelect(opt)}
                className={btnClass}
              >
                <span className={`inline-block w-6 font-bold mr-2 ${selectedOption && opt === q.correctAnswer ? 'text-green-700' : 'text-neutral-400 group-hover:text-primary-500'}`}>
                  {String.fromCharCode(65 + i)}.
                </span> 
                {opt}
              </button>
            );
          })}
        </div>
        
        {/* Competency Gap Analysis block */}
        {selectedOption && (
          <div className="mt-4 animate-fade-in space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <div>
                <span className="block text-xs font-bold text-blue-800 uppercase tracking-wide mb-1">Source Context</span>
                <p className="text-sm text-blue-900/80 leading-relaxed italic">{q.sourceCitation || "N/A"}</p>
                {q.explanation && <p className="text-sm text-blue-900/90 mt-2"><strong>Explanation:</strong> {q.explanation}</p>}
              </div>
            </div>
            
            {!isCorrect && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  <div className="w-full">
                    <span className="block text-sm font-bold text-red-800">Competency Gap Identified</span>
                    <p className="text-sm text-red-700 mt-1 mb-3">Your response indicates a gap in Technical Standards (FRAC Level degraded).</p>
                    
                    {loadingRec ? (
                      <p className="text-sm text-orange-600 animate-pulse font-medium">Finding best iGOT course...</p>
                    ) : recommendation ? (
                      <div className="bg-white border border-red-200 rounded p-4 shadow-sm flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-neutral-900 text-sm">{recommendation.title}</h4>
                          <p className="text-xs text-neutral-500 font-medium mt-1">{recommendation.provider} • {recommendation.duration}</p>
                        </div>
                        <a href={recommendation.link} target="_blank" rel="noreferrer" className="bg-accent-saffron text-white text-xs font-bold px-4 py-2 rounded shadow hover:bg-orange-600 transition flex items-center gap-2">
                          Enroll in iGOT
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {isCorrect && (
              <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <div className="w-full">
                    <span className="block text-sm font-bold text-green-800">Competency Level Increased</span>
                    <p className="text-sm text-green-700 mt-1 mb-1">Excellent! Your FRAC proficiency level in this domain has been upgraded based on this assessment.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
