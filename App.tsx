import React, { useState, useMemo, useEffect } from 'react';
import { Search, Sparkles, MapPin, Sun, Moon, Globe, Heart, Database, PhoneForwarded, Key, ExternalLink, ArrowRight, User as UserIcon, Shield, Lock, Activity, Zap, Gauge, Filter, Home, HandHelping, Scale, Building2, LayoutGrid, Handshake, Cpu, X } from 'lucide-react';
import { MapView } from './components/MapView';
import { TableView } from './components/TableView';
import { GeminiChat } from './components/GeminiChat';
import { CodeFixModal } from './components/CodeFixModal';
import { IntroModal } from './components/IntroModal';
import { RemoteSupportModal } from './components/RemoteSupportModal';
import { ReferralModal } from './components/ReferralModal';
import { AboutModal } from './components/AboutModal';
import { PresentationModal } from './components/PresentationModal';
import { RegistryModal } from './components/RegistryModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsOfServiceModal } from './components/TermsOfServiceModal';
import { CreatorLoginModal } from './components/CreatorLoginModal';
import { MobileToolbar } from './components/MobileToolbar';
import { FilterModal } from './components/FilterModal';
import { INITIAL_ORGANIZATIONS, REGION_CONFIG } from './constants';
import { Organization, RegionName, UserSession, UserRole } from './types';

const App: React.FC = () => {
  const [organizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(organizations.map(o => o.category))).sort();
  }, [organizations]);

  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [mobileTab, setMobileTab] = useState<'map' | 'list'>('map');
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeRegion, setActiveRegion] = useState<RegionName>('All');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(uniqueCategories);
  const [showIntro, setShowIntro] = useState(!localStorage.getItem('hide_intro_annotation'));
  const [isRemoteSupportOpen, setIsRemoteSupportOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(true);
  const [aboutInitialTab, setAboutInitialTab] = useState<'about' | 'donate' | 'partners' | 'legal'>('about');
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [referralOrg, setReferralOrg] = useState<Organization | null>(null);
  const [isKeySelected, setIsKeySelected] = useState<boolean | null>(null);
  const [mapKey, setMapKey] = useState(0);
  const [isTraceActive, setIsTraceActive] = useState(false);
  const [traceLogs, setTraceLogs] = useState<string[]>([]);
  const [lcpValue, setLcpValue] = useState<number | null>(null);
  const [chatPrefill, setChatPrefill] = useState<string | null>(null);
  const [isCreatorLoginOpen, setIsCreatorLoginOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<UserSession>({
    id: 'user_1',
    name: 'Гість',
    role: 'Guest'
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    try {
      const po = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) setLcpValue(lastEntry.startTime);
      });
      po.observe({ type: 'largest-contentful-paint', buffered: true });
      return () => po.disconnect();
    } catch (e) {
      console.warn("LCP Monitoring not supported");
    }
  }, []);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const selected = await window.aistudio.hasSelectedApiKey();
        setIsKeySelected(selected);
      } else {
        setIsKeySelected(true);
      }
    };
    checkKey();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleSelectKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setIsKeySelected(true);
      setMapKey(prev => prev + 1);
    }
  };

  const openAbout = (tab: 'about' | 'donate' | 'partners' | 'legal' = 'about') => {
    setAboutInitialTab(tab);
    setIsAboutOpen(true);
  };

  const changeRole = (role: UserRole) => {
    const names: Record<UserRole, string> = {
			'Creator': 'Творець',
      'Guest': 'Відвідувач',
      'Partner': 'Партнер проекту',
      'Manager': 'Кейс-менеджер',
      'Admin': 'Адміністратор Платформи'
    };
    setCurrentUser({ ...currentUser, role, name: names[role] });
    setIsProfileOpen(false);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePerformanceTrace = (data: any) => {
    setIsTraceActive(true);
    const lcpInfo = lcpValue ? ` | LCP: ${(lcpValue / 1000).toFixed(2)}s` : '';
    setTraceLogs(prev => [`[${new Date().toLocaleTimeString()}] TRACE_START: ${data.reason || 'Manual'}${lcpInfo}`, ...prev]);

    setTimeout(() => {
      setIsTraceActive(false);
      setTraceLogs(prev => [`[${new Date().toLocaleTimeString()}] TRACE_COMPLETE: OK`, ...prev]);
    }, 4000);
  };

  // Обробка помилок API
  const handleApiError = (error: any) => {
    if (error?.message?.includes("Requested entity was not found")) {
      console.warn("API Key invalidated or project not found. Resetting key state.");
      setIsKeySelected(false);
    }
  };

  const handleVerifyOrgAI = (org: Organization) => {
    setChatPrefill(`Перевір актуальність даних для організації: ${org.name}, адреса: ${org.address}, телефон: ${org.phone}. Чи працюють вони зараз?`);
    setIsChatOpen(true);
  };

  const handleVerifyBulkAI = (orgs: Organization[]) => {
    const listString = orgs.slice(0, 10).map(o => `- ${o.name} (${o.address})`).join('\n');
    const moreCount = orgs.length > 10 ? ` та ще ${orgs.length - 10} організацій` : '';
    setChatPrefill(`Зроби групову перевірку актуальності даних для наступного списку організацій у поточному регіоні:\n${listString}${moreCount}.\n\nПеревір їх через Google Search та надай короткий звіт про їх статус та можливі зміни у контактах.`);
    setIsChatOpen(true);
  };

	const handleCreatorLogin = (password: string) => {
    if (password === 'TIGUAN') {
      changeRole('Creator');
    }
  };

  const filteredOrgs = useMemo(() => {
    return organizations.filter(o => {
      if (activeRegion !== 'All' && o.region !== activeRegion) return false;
      if (!selectedCategories.includes(o.category)) return false;
      const term = searchTerm.toLowerCase();
      return o.name.toLowerCase().includes(term) || o.address.toLowerCase().includes(term);
    });
  }, [organizations, activeRegion, searchTerm, selectedCategories]);

  const getCategoryIcon = (category: string) => {
    if (category.includes('Прихисток') || category.includes('Житло')) return <Home size={14} />;
    if (category.includes('Гуманітарний')) return <HandHelping size={14} />;
    if (category.includes('Юридична') || category.includes('Захист')) return <Scale size={14} />;
    if (category.includes('Муніципальна')) return <Building2 size={14} />;
    return <LayoutGrid size={14} />;
  };

  if (isKeySelected === false) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 font-sans">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 text-center border border-slate-100 dark:border-slate-800 animate-in-dialog">
          <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 rounded-3xl flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto mb-8">
            <Key size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-4 uppercase tracking-tight text-balance">Потрібна переактивація</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
            Попередній ключ API недійсний для сервісів Карт або ШІ. Будь ласка, оберіть проект з активованими Maps JavaScript API та Gemini API.
          </p>
          <button
            onClick={handleSelectKey}
            className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-teal-700 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl"
          >
            Оновити проект <ArrowRight size={16} />
          </button>
          <div className="mt-6">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase text-slate-400 hover:text-teal-600 transition-colors tracking-widest">
              Документація по лімітах та білінгу <ExternalLink size={10} className="inline ml-1" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
      {showIntro && <IntroModal onComplete={() => setShowIntro(false)} onOpenPrivacy={() => setIsPrivacyOpen(true)} onOpenTerms={() => setIsTermsOpen(true)} />}
      {isAboutOpen && <AboutModal initialTab={aboutInitialTab} onClose={() => setIsAboutOpen(false)} onOpenPresentation={() => setIsPresentationOpen(true)} onOpenPrivacy={() => setIsPrivacyOpen(true)} onOpenTerms={() => setIsTermsOpen(true)} />}
      {isPresentationOpen && <PresentationModal onClose={() => setIsPresentationOpen(false)} />}
      {isRegistryOpen && <RegistryModal organizations={organizations} user={currentUser} onClose={() => setIsRegistryOpen(false)} />}
      {isPrivacyOpen && <PrivacyPolicyModal onClose={() => setIsPrivacyOpen(false)} />}
      {isTermsOpen && <TermsOfServiceModal onClose={() => setIsTermsOpen(false)} />}
      {referralOrg && <ReferralModal organization={referralOrg} onClose={() => setReferralOrg(null)} />}
			{isRemoteSupportOpen && <RemoteSupportModal onClose={() => setIsRemoteSupportOpen(false)} />}
			<CreatorLoginModal
        isOpen={isCreatorLoginOpen}
        onClose={() => setIsCreatorLoginOpen(false)}
        onLogin={handleCreatorLogin}
      />
       <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        categories={uniqueCategories}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
      />


      <header className="h-16 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg cursor-pointer" onClick={() => openAbout('about')}>
            <Heart size={20} fill="currentColor" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-black text-sm uppercase tracking-tight text-slate-800 dark:text-white leading-none">Інклюзивна Мапа</h1>
            <button onClick={() => openAbout('about')} className="text-[10px] font-bold text-teal-600 uppercase flex items-center gap-1 mt-1">
              <MapPin size={10} /> {REGION_CONFIG[activeRegion].label}
            </button>
          </div>
        </div>
				<div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreatorLoginOpen(true)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Вхід для Творця"
          >
            <UserIcon size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </header>

      <main className="flex-1 relative pb-16 sm:pb-0">
        {mobileTab === 'map' ? (
          <div className="absolute inset-0 z-0">
            <MapView
              organizations={filteredOrgs}
              selectedOrgId={selectedOrgId}
              onSelectOrg={setSelectedOrgId}
              onOpenReferral={setReferralOrg}
            />
          </div>
        ) : (
          <div className="h-full overflow-hidden bg-slate-50 dark:bg-slate-900">
            <TableView
              organizations={filteredOrgs}
              selectedOrgId={selectedOrgId}
              onSelectOrg={setSelectedOrgId}
              user={currentUser}
            />
          </div>
        )}
      </main>
      <MobileToolbar
        activeTab={mobileTab}
        onTabChange={setMobileTab}
        onSearch={setSearchTerm}
        onFilterClick={() => setIsFilterModalOpen(true)}
        searchTerm={searchTerm}
      />

      {/* Floating Action Button for Chat */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 sm:bottom-6"
      >
        <Sparkles size={24} />
      </button>

      {isChatOpen && (
        <GeminiChat
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          prefillPrompt={chatPrefill || undefined}
          organizations={organizations}
          user={currentUser}
        />
      )}
    </div>
  );
};

export default App;
