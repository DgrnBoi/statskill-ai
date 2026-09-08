import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { apiUrl } from '../../lib/api';
import {
  BookOpen,
  Search,
  FileText,
  Sparkles,
  ArrowRight,
  Filter,
  Download,
  Calendar,
  Layers,
  Award,
  RotateCw,
} from 'lucide-react';

export interface CircularItem {
  id: string;
  division: string;
  cadreTarget: string;
  title: string;
  docNumber: string;
  datePublished: string;
  pages: number;
  summary: string;
  topics: string[];
  sampleContent?: string;
}

export interface KnowledgeLibraryProps {
  onSelectCircularForAssessment: (circular: CircularItem) => void;
  isActionLocked?: boolean;
}

export const KnowledgeLibrary: React.FC<KnowledgeLibraryProps> = ({
  onSelectCircularForAssessment,
  isActionLocked = false,
}) => {
  const [circulars, setCirculars] = useState<CircularItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl('/api/knowledge'))
      .then((res) => res.json())
      .then((data) => {
        setCirculars(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load Amrit Gyaan Kosh:', err);
        setIsLoading(false);
      });
  }, []);

  const divisions = ['ALL', 'Field Operations Division (FOD)', 'Data Processing Division (DPD)', 'National Accounts Division (NAD)', 'Data Informatics & Innovation Division (DIID)'];

  const filteredCirculars = circulars.filter((item) => {
    const matchesDiv = selectedDivision === 'ALL' || item.division === selectedDivision;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDiv && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in font-body">
      {/* Hero Header Card */}
      <Card className="border border-[#0B2E63]/20 bg-gradient-to-br from-slate-900 via-[#0B2E63] to-slate-900 text-white overflow-hidden shadow-lg">
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-400/20 text-amber-300 rounded-md border border-amber-400/30">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </span>
            <Badge variant="saffron" className="text-xs">
              National Statistical Knowledge Repository
            </Badge>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
              Amrit Gyaan Kosh (अमृत ज्ञान कोष)
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-2xl leading-relaxed">
              Curated repository of official MoSPI circulars, survey instruction manuals, and statistical standard operating procedures. Launch instant grounded active-recall assessments from any circular.
            </p>
          </div>

          {/* Search and Division Filter Bar */}
          <div className="pt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search official circulars by keyword, formula, or topic..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-blue-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-xs"
              />
            </div>

            <div>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-xs"
              >
                <option value="ALL">All MoSPI Divisions</option>
                <option value="Field Operations Division (FOD)">FOD (Field Operations)</option>
                <option value="Data Processing Division (DPD)">DPD (Data Processing)</option>
                <option value="National Accounts Division (NAD)">NAD (National Accounts)</option>
                <option value="Data Informatics & Innovation Division (DIID)">DIID (Informatics & AI)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Circulars Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-500 space-y-3">
          <RotateCw className="w-6 h-6 animate-spin mx-auto text-[#0B2E63]" />
          <p className="text-xs font-bold font-mono">Indexing official MoSPI circulars...</p>
        </div>
      ) : filteredCirculars.length === 0 ? (
        <div className="p-8 bg-white border border-slate-200 rounded-xl text-center space-y-2">
          <p className="text-sm font-bold text-slate-800">No circulars matched your filter query.</p>
          <p className="text-xs text-slate-500">Try clearing your search query or selecting "All MoSPI Divisions".</p>
          <Button type="button" size="sm" variant="outline" onClick={() => { setSearchQuery(''); setSelectedDivision('ALL'); }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCirculars.map((item) => (
            <Card
              key={item.id}
              className="bg-white border border-slate-200 hover:border-[#0B2E63]/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-4">
                {/* Card Top Meta */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <Badge variant="neutral" className="text-[10px] font-mono text-[#0B2E63] bg-blue-50 border-blue-200">
                      {item.docNumber}
                    </Badge>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      {item.division}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {item.datePublished}
                  </span>
                </div>

                {/* Title & Summary */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>
                </div>

                {/* Topics Tag List */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.topics.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-semibold text-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Target: <strong className="text-slate-800">{item.cadreTarget}</strong>
                  </span>

                  <Button
                    type="button"
                    size="sm"
                    disabled={isActionLocked}
                    onClick={() => onSelectCircularForAssessment(item)}
                    className="text-xs font-bold bg-[#0B2E63] hover:bg-[#123E82] text-white shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Launch Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
