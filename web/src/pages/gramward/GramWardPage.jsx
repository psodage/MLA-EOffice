import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, Plus, MapPin, Home, Building2, Building, Vote, ClipboardList, HardHat, Users, X, Eye, RotateCcw } from 'lucide-react';
import useLangStore from '../../store/langStore.js';
import './GramWardPage.css';

const SAMPLE_TALUKAS = [
  {
    nameEn: 'Karveer Taluka',
    nameMr: 'करवीर तालुका',
    countText: '22 areas · 92 booths',
    areas: [
      {
        id: 'wadgaon',
        nameEn: 'Wadgaon',
        nameMr: 'वडगाव',
        type: 'village',
        parent: 'GP: Wadgaon · Karveer Taluka',
        complaints: 8,
        resolved: 5,
        devWorks: 3,
        workers: 24,
        booths: 6,
        voters: 4812,
        allPramukhsAssigned: true,
        boothsList: [
          { id: 12, title: 'Booth 12 — ZP School Wadgaon', pramukh: 'Vishnu Gaikwad', voters: 845 },
          { id: 13, title: 'Booth 13 — Gram Panchayat Office', pramukh: 'Anil Shinde', voters: 912 },
          { id: 14, title: 'Booth 14 — Community Hall', pramukh: 'Suresh Pawar', voters: 738 },
        ],
        recentNivedans: [
          { id: 'NIV/2026/0345', title: 'Road repair near ZP School', date: '28 Jul 2026', status: 'pending', statusText: 'Pending' },
          { id: 'NIV/2026/0312', title: 'Water supply pipeline leakage', date: '22 Jul 2026', status: 'progress', statusText: 'In Progress' },
          { id: 'NIV/2026/0289', title: 'Street light installation request', date: '15 Jul 2026', status: 'resolved', statusText: 'Resolved' },
        ],
        activeDevWorks: [
          { title: 'Road widening — Wadgaon to NH-4', fund: 'MLALAD', budget: '₹45 Lakhs', progress: '60%' },
          { title: 'Community hall construction', fund: 'ZP Fund', budget: '₹28 Lakhs', progress: '35%' },
        ],
        keyWorkers: [
          { name: 'Vishnu Gaikwad', initials: 'VG' },
          { name: 'Anil Shinde', initials: 'AS' },
          { name: 'Suresh Pawar', initials: 'SP' },
          { name: 'Meena Kale', initials: 'MK' },
          { name: 'Ravi Jadhav', initials: 'RJ' },
          { name: 'Deepak Thorat', initials: 'DT' },
        ],
      },
      {
        id: 'rajarampuri-ward-5',
        nameEn: 'Rajarampuri (Ward 5)',
        nameMr: 'राजारामपूरी (वॉर्ड ५)',
        type: 'ward',
        parent: 'Karveer Taluka · Urban',
        complaints: 14,
        resolved: 9,
        devWorks: 5,
        workers: 38,
        booths: 12,
        voters: 10245,
        allPramukhsAssigned: true,
        boothsList: [
          { id: 145, title: 'Booth 145 — Rajarampuri ZP School', pramukh: 'Ramesh Patil', voters: 920 },
          { id: 146, title: 'Booth 146 — Ward Office Hall', pramukh: 'Mangesh Jadhav', voters: 880 },
          { id: 148, title: 'Booth 148 — Community Center', pramukh: 'Priya Deshmukh', voters: 950 },
        ],
        recentNivedans: [
          { id: 'NIV/2026/0401', title: 'Drainage blockage in Ward 5', date: '01 Aug 2026', status: 'progress', statusText: 'In Progress' },
          { id: 'NIV/2026/0388', title: 'Public park LED lighting', date: '29 Jul 2026', status: 'resolved', statusText: 'Resolved' },
        ],
        activeDevWorks: [
          { title: 'Rajarampuri Main Road Widening', fund: 'State PWD', budget: '₹2.45 Cr', progress: '72%' },
        ],
        keyWorkers: [
          { name: 'Ramesh Patil', initials: 'RP' },
          { name: 'Mangesh Jadhav', initials: 'MJ' },
          { name: 'Priya Deshmukh', initials: 'PD' },
        ],
      },
      {
        id: 'shivaji-peth-ward-1',
        nameEn: 'Shivaji Peth (Ward 1)',
        nameMr: 'शिवाजी पेठ (वॉर्ड १)',
        type: 'ward',
        parent: 'Karveer Taluka · Urban',
        complaints: 6,
        resolved: 4,
        devWorks: 2,
        workers: 18,
        booths: 8,
        voters: 6720,
        allPramukhsAssigned: true,
        boothsList: [
          { id: 110, title: 'Booth 110 — Shivaji Peth High School', pramukh: 'Sunil More', voters: 840 },
          { id: 111, title: 'Booth 111 — Taaluka Sports Complex', pramukh: 'Vijay Bhosale', voters: 890 },
        ],
        recentNivedans: [
          { id: 'NIV/2026/0290', title: 'Garbage collection vehicle timing', date: '16 Jul 2026', status: 'resolved', statusText: 'Resolved' },
        ],
        activeDevWorks: [
          { title: 'Ward 1 Drinking water tank renovation', fund: 'Municipal Fund', budget: '₹18 Lakhs', progress: '90%' },
        ],
        keyWorkers: [
          { name: 'Sunil More', initials: 'SM' },
          { name: 'Vijay Bhosale', initials: 'VB' },
        ],
      },
      {
        id: 'uchgaon',
        nameEn: 'Uchgaon',
        nameMr: 'उचगाव',
        type: 'village',
        parent: 'GP: Uchgaon · Karveer Taluka',
        complaints: 3,
        resolved: 2,
        devWorks: 1,
        workers: 12,
        booths: 4,
        voters: 2340,
        allPramukhsAssigned: false,
        missingPramukhCount: 1,
        boothsList: [
          { id: 3, title: 'Booth 3 — Uchgaon ZP Primary School', pramukh: 'Anand Kamble', voters: 580 },
          { id: 4, title: 'Booth 4 — Samaj Mandir Uchgaon', pramukh: 'Mahesh Powar', voters: 610 },
        ],
        recentNivedans: [
          { id: 'NIV/2026/0360', title: 'School building roof repair', date: '25 Jul 2026', status: 'progress', statusText: 'In Progress' },
        ],
        activeDevWorks: [
          { title: 'ZP School Building Repair', fund: 'Education Dept', budget: '₹42 Lakhs', progress: '35%' },
        ],
        keyWorkers: [
          { name: 'Anand Kamble', initials: 'AK' },
          { name: 'Mahesh Powar', initials: 'MP' },
        ],
      },
      {
        id: 'mudshingi',
        nameEn: 'Mudshingi',
        nameMr: 'मुडशिंगी',
        type: 'village',
        parent: 'GP: Mudshingi · Karveer Taluka',
        complaints: 5,
        resolved: 3,
        devWorks: 2,
        workers: 16,
        booths: 5,
        voters: 3580,
        allPramukhsAssigned: true,
        boothsList: [
          { id: 25, title: 'Booth 25 — Mudshingi Gram Panchayat', pramukh: 'Dipak Gurav', voters: 710 },
          { id: 26, title: 'Booth 26 — ZP Kanya Shala', pramukh: 'Sujata Mane', voters: 690 },
        ],
        recentNivedans: [
          { id: 'NIV/2026/0310', title: 'Internal cement road construction', date: '18 Jul 2026', status: 'progress', statusText: 'In Progress' },
        ],
        activeDevWorks: [
          { title: 'Gutting and drainage works', fund: 'Gram Vikas', budget: '₹15 Lakhs', progress: '50%' },
        ],
        keyWorkers: [
          { name: 'Dipak Gurav', initials: 'DG' },
          { name: 'Sujata Mane', initials: 'SM' },
        ],
      },
    ],
  },
  {
    nameEn: 'Kagal Taluka',
    nameMr: 'कागल तालुका',
    countText: '18 areas · 64 booths',
    areas: [
      {
        id: 'kagal-town',
        nameEn: 'Kagal Municipal Area',
        nameMr: 'कागल नगरपरिषद क्षेत्र',
        type: 'ward',
        parent: 'Kagal Town · Kagal Taluka',
        complaints: 7,
        resolved: 4,
        devWorks: 4,
        workers: 22,
        booths: 16,
        voters: 14200,
        allPramukhsAssigned: true,
        boothsList: [
          { id: 201, title: 'Booth 201 — Kagal Municipal School 1', pramukh: 'Deepak Patil', voters: 910 },
          { id: 202, title: 'Booth 202 — Town Hall Kagal', pramukh: 'Prakash Ghatge', voters: 890 },
        ],
        recentNivedans: [
          { id: 'NIV/2026/0410', title: 'Street light repair near Bus Stand', date: '03 Aug 2026', status: 'pending', statusText: 'Pending' },
        ],
        activeDevWorks: [
          { title: 'Kagal Stadium Beautification', fund: 'State Sports Grant', budget: '₹1.2 Cr', progress: '40%' },
        ],
        keyWorkers: [
          { name: 'Deepak Patil', initials: 'DP' },
          { name: 'Prakash Ghatge', initials: 'PG' },
        ],
      },
      {
        id: 'vathar',
        nameEn: 'Vathar',
        nameMr: 'वाठार',
        type: 'village',
        parent: 'GP: Vathar · Kagal Taluka',
        complaints: 4,
        resolved: 3,
        devWorks: 2,
        workers: 14,
        booths: 8,
        voters: 6500,
        allPramukhsAssigned: true,
        boothsList: [
          { id: 180, title: 'Booth 180 — Vathar High School', pramukh: 'Shivaji Kadam', voters: 820 },
        ],
        recentNivedans: [
          { id: 'NIV/2026/0320', title: 'Drinking water pipeline replacement', date: '20 Jul 2026', status: 'resolved', statusText: 'Resolved' },
        ],
        activeDevWorks: [
          { title: 'Vathar Primary Health Center Upgrade', fund: 'NRHM', budget: '₹35 Lakhs', progress: '80%' },
        ],
        keyWorkers: [
          { name: 'Shivaji Kadam', initials: 'SK' },
        ],
      },
    ],
  },
  {
    nameEn: 'Radhanagari Taluka',
    nameMr: 'राधानगरी तालुका',
    countText: '17 areas · 58 booths',
    areas: [
      {
        id: 'radhanagari-village',
        nameEn: 'Radhanagari',
        nameMr: 'राधानगरी',
        type: 'village',
        parent: 'GP: Radhanagari · Radhanagari Taluka',
        complaints: 5,
        resolved: 3,
        devWorks: 2,
        workers: 16,
        booths: 6,
        voters: 4120,
        allPramukhsAssigned: true,
        boothsList: [
          { id: 301, title: 'Booth 301 — Radhanagari ZP School', pramukh: 'Sanjay Patil', voters: 820 },
          { id: 302, title: 'Booth 302 — Dam Office Hall', pramukh: 'Nitin Kamble', voters: 780 },
        ],
        recentNivedans: [
          { id: 'NIV/2026/0390', title: 'Tourism approach road repair', date: '30 Jul 2026', status: 'progress', statusText: 'In Progress' },
        ],
        activeDevWorks: [
          { title: 'Radhanagari Eco-Park Development', fund: 'Tourism Dept', budget: '₹85 Lakhs', progress: '55%' },
        ],
        keyWorkers: [
          { name: 'Sanjay Patil', initials: 'SP' },
          { name: 'Nitin Kamble', initials: 'NK' },
        ],
      },
      {
        id: 'rashivade-village',
        nameEn: 'Rashivade',
        nameMr: 'राशीवडे',
        type: 'village',
        parent: 'GP: Rashivade · Radhanagari Taluka',
        complaints: 3,
        resolved: 2,
        devWorks: 1,
        workers: 12,
        booths: 4,
        voters: 3200,
        allPramukhsAssigned: true,
        boothsList: [
          { id: 310, title: 'Booth 310 — Rashivade ZP School', pramukh: 'Santosh Chaugule', voters: 800 },
        ],
        recentNivedans: [
          { id: 'NIV/2026/0375', title: 'Substation transformer upgrade', date: '26 Jul 2026', status: 'resolved', statusText: 'Resolved' },
        ],
        activeDevWorks: [
          { title: 'Bhogawati Riverbank Protection Wall', fund: 'Water Resources', budget: '₹50 Lakhs', progress: '45%' },
        ],
        keyWorkers: [
          { name: 'Santosh Chaugule', initials: 'SC' },
        ],
      },
    ],
  },
];

const GramWardPage = () => {
  const { lang } = useLangStore();
  const isMr = lang === 'MR';

  const [activeTab, setActiveTab] = useState('ALL');

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    taluka: 'ALL',
    gp: 'ALL',
    areaType: 'ALL',
    status: 'ALL',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setActiveTab('ALL');
    setFilters({
      search: '',
      taluka: 'ALL',
      gp: 'ALL',
      areaType: 'ALL',
      status: 'ALL',
    });
  };

  // Flattened total areas list
  const allAreasList = useMemo(() => {
    return SAMPLE_TALUKAS.flatMap((t) => t.areas);
  }, []);

  // Dynamic Tab Counts
  const counts = useMemo(() => {
    return {
      all: allAreasList.length,
      villages: allAreasList.filter((a) => a.type === 'village').length,
      wards: allAreasList.filter((a) => a.type === 'ward').length,
      gps: allAreasList.filter((a) => a.parent.includes('GP:') || a.type === 'gp').length,
    };
  }, [allAreasList]);

  // Compute Filtered Talukas & Areas based on Tab + Filters
  const filteredTalukas = useMemo(() => {
    return SAMPLE_TALUKAS.map((talukaGroup) => {
      // Taluka Filter
      if (filters.taluka !== 'ALL' && !talukaGroup.nameEn.toLowerCase().includes(filters.taluka.toLowerCase())) {
        return { ...talukaGroup, areas: [] };
      }

      const matchingAreas = talukaGroup.areas.filter((area) => {
        // Tab Filter
        if (activeTab === 'VILLAGES' && area.type !== 'village') return false;
        if (activeTab === 'WARDS' && area.type !== 'ward') return false;
        if (activeTab === 'GPS' && !area.parent.includes('GP:') && area.type !== 'gp') return false;

        // Search Filter
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase().trim();
          const matchEn = area.nameEn.toLowerCase().includes(q);
          const matchMr = area.nameMr.toLowerCase().includes(q);
          const matchParent = area.parent.toLowerCase().includes(q);
          if (!matchEn && !matchMr && !matchParent) return false;
        }

        // GP Filter
        if (filters.gp !== 'ALL') {
          const gpTarget = filters.gp.replace(' GP', '').toLowerCase();
          if (!area.parent.toLowerCase().includes(gpTarget) && !area.nameEn.toLowerCase().includes(gpTarget)) {
            return false;
          }
        }

        // Area Type Filter
        if (filters.areaType !== 'ALL' && area.type !== filters.areaType) return false;

        // Complaint Status Filter
        if (filters.status === 'PENDING' && area.complaints <= area.resolved) return false;
        if (filters.status === 'RESOLVED' && area.complaints !== area.resolved) return false;

        return true;
      });

      return {
        ...talukaGroup,
        areas: matchingAreas,
      };
    }).filter((talukaGroup) => talukaGroup.areas.length > 0);
  }, [activeTab, filters]);

  // Currently selected area for the drawer
  const [selectedArea, setSelectedArea] = useState(SAMPLE_TALUKAS[0].areas[0]);

  // Auto-synchronize selectedArea when tabs or filters change
  useEffect(() => {
    const visibleAreas = filteredTalukas.flatMap((t) => t.areas);
    if (visibleAreas.length > 0) {
      if (!selectedArea || !visibleAreas.some((a) => a.id === selectedArea.id)) {
        setSelectedArea(visibleAreas[0]);
      }
    } else {
      setSelectedArea(null);
    }
  }, [filteredTalukas]);

  return (
    <div className="gramward-page-container">
      {/* ── Breadcrumb ───────────────────────────────────────── */}
      <div className="breadcrumb">
        <Link to="/dashboard">{isMr ? 'डॅशबोर्ड' : 'Dashboard'}</Link>
        <span style={{ color: 'var(--t4)' }}>/</span>
        <span>{isMr ? 'मतदारसंघ' : 'Constituency'}</span>
        <span style={{ color: 'var(--t4)' }}>/</span>
        <span>{isMr ? 'ग्राम व वॉर्ड' : 'Gram & Ward'}</span>
      </div>

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="ph">
        <div>
          <h1 className="title">
            {isMr ? 'ग्राम व वॉर्ड रचना' : 'Gram / Ward Organization'}
          </h1>
          <p className="sub">
            {isMr
              ? 'भौगोलिक रचना — क्षेत्रनिहाय फिल्टरिंग व मतदारसंघ व्यवस्थापन'
              : 'Geographical hierarchy — area-wise filtering and constituency management'}
          </p>
        </div>

        <div className="gramward-actions">
          <button className="btn-o" onClick={() => alert(isMr ? 'Excel इन्पोर्ट करत आहे...' : 'Importing Excel...')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={14} /> {isMr ? 'इम्पोर्ट Excel' : 'Import Excel'}
          </button>
          <button className="btn-o" onClick={() => alert(isMr ? 'PDF एक्सपोर्ट होत आहे...' : 'Exporting PDF...')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={14} /> {isMr ? 'एक्सपोर्ट PDF' : 'Export PDF'}
          </button>
          <button className="btn-p" onClick={() => alert(isMr ? 'नवीन क्षेत्र जोडा फॉर्म उघडत आहे...' : 'Add Area form...')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} /> {isMr ? 'क्षेत्र जोडा' : 'Add Area'}
          </button>
        </div>
      </div>

      {/* ── 6 KPI Summary Stats ─────────────────────────────── */}
      <div className="stats">
        <div className="stat">
          <div className="stat-val" style={{ color: 'var(--t1)' }}>3</div>
          <div className="stat-label">{isMr ? 'तालुके' : 'Talukas'}</div>
        </div>
        <div className="stat">
          <div className="stat-val" style={{ color: 'var(--pu, #7c3aed)' }}>18</div>
          <div className="stat-label">{isMr ? 'ग्रामपंचायती (ग्रा.पं.)' : 'Gram Panchayats'}</div>
        </div>
        <div className="stat">
          <div className="stat-val" style={{ color: 'var(--ok, #16a34a)' }}>47</div>
          <div className="stat-label">{isMr ? 'गावे' : 'Villages'}</div>
        </div>
        <div className="stat">
          <div className="stat-val" style={{ color: 'var(--in, #2563eb)' }}>12</div>
          <div className="stat-label">{isMr ? 'शहर वॉर्ड' : 'City Wards'}</div>
        </div>
        <div className="stat">
          <div className="stat-val" style={{ color: 'var(--wr, #d97706)' }}>156</div>
          <div className="stat-label">{isMr ? 'बूथ' : 'Booths'}</div>
        </div>
        <div className="stat">
          <div className="stat-val" style={{ color: 'var(--er, #dc2626)' }}>34</div>
          <div className="stat-label">{isMr ? 'प्रलंबित निवेदने' : 'Pending Nivedans'}</div>
        </div>
      </div>

      {/* ── Category Tabs ───────────────────────────────────── */}
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveTab('ALL')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <MapPin size={14} /> {isMr ? 'सर्व क्षेत्रे' : 'All Areas'} <span className="tab-count">{counts.all}</span>
        </div>
        <div
          className={`tab ${activeTab === 'VILLAGES' ? 'active' : ''}`}
          onClick={() => setActiveTab('VILLAGES')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Home size={14} /> {isMr ? 'गावे' : 'Villages'} <span className="tab-count">{counts.villages}</span>
        </div>
        <div
          className={`tab ${activeTab === 'WARDS' ? 'active' : ''}`}
          onClick={() => setActiveTab('WARDS')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Building2 size={14} /> {isMr ? 'शहर वॉर्ड' : 'City Wards'} <span className="tab-count">{counts.wards}</span>
        </div>
        <div
          className={`tab ${activeTab === 'GPS' ? 'active' : ''}`}
          onClick={() => setActiveTab('GPS')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Building size={14} /> {isMr ? 'ग्रामपंचायती' : 'Gram Panchayats'} <span className="tab-count">{counts.gps}</span>
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────── */}
      <div className="filter-bar">
        <div className="fg">
          <span className="fl">{isMr ? 'शोध' : 'Search'}</span>
          <input
            className="fi"
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder={isMr ? 'गाव, वॉर्ड नाव शोधा...' : 'Village, ward name...'}
            style={{ minWidth: '180px' }}
          />
        </div>

        <div className="fg">
          <span className="fl">{isMr ? 'तालुका' : 'Taluka'}</span>
          <select className="fi" name="taluka" value={filters.taluka} onChange={handleFilterChange}>
            <option value="ALL">{isMr ? 'सर्व तालुके' : 'All Talukas'}</option>
            <option value="Karveer">Karveer</option>
            <option value="Kagal">Kagal</option>
            <option value="Radhanagari">Radhanagari</option>
          </select>
        </div>

        <div className="fg">
          <span className="fl">{isMr ? 'ग्रामपंचायत' : 'Gram Panchayat'}</span>
          <select className="fi" name="gp" value={filters.gp} onChange={handleFilterChange}>
            <option value="ALL">{isMr ? 'सर्व ग्रा.पं.' : 'All GPs'}</option>
            <option value="Wadgaon GP">Wadgaon GP</option>
            <option value="Uchgaon GP">Uchgaon GP</option>
            <option value="Mudshingi GP">Mudshingi GP</option>
            <option value="Radhanagari GP">Radhanagari GP</option>
          </select>
        </div>

        <div className="fg">
          <span className="fl">{isMr ? 'क्षेत्र प्रकार' : 'Area Type'}</span>
          <select className="fi" name="areaType" value={filters.areaType} onChange={handleFilterChange}>
            <option value="ALL">{isMr ? 'सर्व प्रकार' : 'All Types'}</option>
            <option value="village">Village (गाव)</option>
            <option value="ward">Ward (वॉर्ड)</option>
          </select>
        </div>

        <div className="fg">
          <span className="fl">{isMr ? 'तक्रार स्थिती' : 'Complaint Status'}</span>
          <select className="fi" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="ALL">{isMr ? 'कोणतीही' : 'Any'}</option>
            <option value="PENDING">{isMr ? 'प्रलंबित आहे' : 'Has Pending'}</option>
            <option value="RESOLVED">{isMr ? 'सर्व मार्गी' : 'All Resolved'}</option>
          </select>
        </div>

        {(filters.search || filters.taluka !== 'ALL' || filters.gp !== 'ALL' || filters.areaType !== 'ALL' || filters.status !== 'ALL' || activeTab !== 'ALL') && (
          <button className="btn-o" onClick={resetFilters} style={{ height: '30px', padding: '0 10px', fontSize: '11px', alignSelf: 'flex-end' }}>
            <RotateCcw size={12} /> {isMr ? 'फिल्टर रिसेट करा' : 'Reset Filters'}
          </button>
        )}
      </div>

      {/* ── 2-Column Layout (List Panel + Sticky Detail Drawer) ── */}
      <div className="layout">
        <div className="list-panel">
          {filteredTalukas.length > 0 ? (
            filteredTalukas.map((talukaGroup, tIdx) => (
              <div key={tIdx} className="taluka-group">
                <div className="taluka-header">
                  <div className="taluka-icon"><MapPin size={16} /></div>
                  <span className="taluka-name">{talukaGroup.nameEn}</span>
                  <span className="taluka-name-mr">{talukaGroup.nameMr}</span>
                  <span className="taluka-count">{talukaGroup.areas.length} {isMr ? 'क्षेत्रे' : 'areas'}</span>
                </div>

                <div className="area-grid">
                  {talukaGroup.areas.map((area) => {
                    const isSelected = selectedArea?.id === area.id;
                    const resPct = area.complaints > 0 ? Math.round((area.resolved / area.complaints) * 100) : 100;

                    return (
                      <div
                        key={area.id}
                        className={`area-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedArea(area)}
                      >
                        <span className={`area-type-badge type-${area.type}`}>
                          {area.type}
                        </span>

                        <div className="area-card-header">
                          <div className={`area-icon ${area.type}`}>
                            {area.type === 'village' ? <Home size={18} /> : <Building2 size={18} />}
                          </div>
                          <div className="area-info">
                            <div className="area-name">
                              {area.nameEn} · <span className="mr" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>{area.nameMr}</span>
                            </div>
                            <div className="area-parent">{area.parent}</div>
                          </div>
                        </div>

                        <div className="area-stats">
                          <div className="area-stat">
                            <div className="area-stat-val" style={{ color: 'var(--er, #dc2626)' }}>{area.complaints}</div>
                            <div className="area-stat-label">Complaints</div>
                          </div>
                          <div className="area-stat">
                            <div className="area-stat-val" style={{ color: 'var(--in, #2563eb)' }}>{area.devWorks}</div>
                            <div className="area-stat-label">Dev Works</div>
                          </div>
                          <div className="area-stat">
                            <div className="area-stat-val" style={{ color: 'var(--pu, #7c3aed)' }}>{area.workers}</div>
                            <div className="area-stat-label">Workers</div>
                          </div>
                          <div className="area-stat">
                            <div className="area-stat-val" style={{ color: 'var(--ok, #16a34a)' }}>{area.booths}</div>
                            <div className="area-stat-label">Booths</div>
                          </div>
                        </div>

                        <div className="area-progress">
                          <div className="progress-header">
                            <span>Nivedan Resolution</span>
                            <span>{area.resolved} / {area.complaints} resolved</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill-ok" style={{ width: `${resPct}%` }} />
                            <div className="progress-fill-er" style={{ width: `${100 - resPct}%` }} />
                          </div>
                        </div>

                        <div className="area-footer">
                          <span className="area-booths" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Vote size={14} /> <strong>{area.booths}</strong> booths · {area.voters.toLocaleString()} voters
                          </span>
                          <span className="area-pramukh">
                            <span className={`pramukh-dot ${area.allPramukhsAssigned ? 'pramukh-yes' : 'pramukh-no'}`} />
                            {area.allPramukhsAssigned
                              ? 'All Pramukh assigned'
                              : `${area.missingPramukhCount || 1} Pramukh missing`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--c, #ffffff)', border: '1px solid var(--b, #dde3eb)', borderRadius: '4px' }}>
              <Building size={36} style={{ color: 'var(--t4)', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 6px 0', color: 'var(--t1)' }}>
                {isMr ? 'कोणतेही क्षेत्र सापडले नाही' : 'No Areas Found'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--t3)', margin: '0 0 16px 0' }}>
                {isMr
                  ? 'आपल्या शोध किंवा फिल्टर निकषांशी जुळणारे क्षेत्र उपलब्ध नाही.'
                  : 'There are no areas matching your selected filters or search terms.'}
              </p>
              <button className="btn-o" onClick={resetFilters} style={{ margin: '0 auto', fontSize: '12px' }}>
                <RotateCcw size={14} /> {isMr ? 'सर्व फिल्टर रिसेट करा' : 'Reset All Filters'}
              </button>
            </div>
          )}
        </div>

        {/* ── Sticky Detail Drawer (Right Panel) ────────────────── */}
        {selectedArea && (
          <div className="detail-panel">
            <div className="dp-header">
              <button className="dp-close" onClick={() => setSelectedArea(null)}><X size={16} /></button>
              <div className="dp-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {selectedArea.type === 'village' ? <Home size={18} /> : <Building2 size={18} />} {selectedArea.nameEn} · <span className="mr" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>{selectedArea.nameMr}</span>
              </div>
              <div className="dp-sub">{selectedArea.parent}</div>

              <div className="dp-stats">
                <div className="dp-stat">
                  <div className="dp-stat-val" style={{ color: 'var(--er, #dc2626)' }}>{selectedArea.complaints}</div>
                  <div className="dp-stat-label">{isMr ? 'निवेदने' : 'Nivedans'}</div>
                </div>
                <div className="dp-stat">
                  <div className="dp-stat-val" style={{ color: 'var(--in, #2563eb)' }}>{selectedArea.devWorks}</div>
                  <div className="dp-stat-label">{isMr ? 'विकास कामे' : 'Dev Works'}</div>
                </div>
                <div className="dp-stat">
                  <div className="dp-stat-val" style={{ color: 'var(--pu, #7c3aed)' }}>{selectedArea.workers}</div>
                  <div className="dp-stat-label">{isMr ? 'कार्यकर्ते' : 'Workers'}</div>
                </div>
                <div className="dp-stat">
                  <div className="dp-stat-val" style={{ color: 'var(--ok, #16a34a)' }}>{selectedArea.booths}</div>
                  <div className="dp-stat-label">{isMr ? 'बूथ' : 'Booths'}</div>
                </div>
              </div>
            </div>

            <div className="dp-body">
              {/* Linked Booths */}
              <div className="dp-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Vote size={16} /> Booths in {selectedArea.nameEn} ({selectedArea.booths})
              </div>
              {selectedArea.boothsList && selectedArea.boothsList.length > 0 ? (
                selectedArea.boothsList.map((b) => (
                  <div key={b.id} className="linked-item">
                    <div className="li-icon" style={{ background: 'var(--pl)', color: 'var(--p)', fontWeight: 700, fontSize: '12px' }}>
                      {b.id}
                    </div>
                    <div className="li-info">
                      <div className="li-title">{b.title}</div>
                      <div className="li-meta">Pramukh: {b.pramukh} · {b.voters} voters</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--t4)', padding: '6px 0' }}>No booth data available</div>
              )}

              {/* Recent Nivedans */}
              <div className="dp-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ClipboardList size={16} /> Recent Nivedans ({selectedArea.recentNivedans?.length || 0})
              </div>
              {selectedArea.recentNivedans && selectedArea.recentNivedans.length > 0 ? (
                selectedArea.recentNivedans.map((n, idx) => (
                  <div key={idx} className="linked-item">
                    <div className="li-icon" style={{ background: 'var(--inb)' }}><ClipboardList size={14} /></div>
                    <div className="li-info">
                      <div className="li-title">{n.title}</div>
                      <div className="li-meta">{n.id} · {n.date}</div>
                    </div>
                    <span className={`li-status status-${n.status}`}>{n.statusText}</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--t4)', padding: '6px 0' }}>No recent nivedans</div>
              )}

              {/* Active Dev Works */}
              <div className="dp-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HardHat size={16} /> Active Development Works ({selectedArea.activeDevWorks?.length || 0})
              </div>
              {selectedArea.activeDevWorks && selectedArea.activeDevWorks.length > 0 ? (
                selectedArea.activeDevWorks.map((dw, idx) => (
                  <div key={idx} className="linked-item">
                    <div className="li-icon" style={{ background: 'var(--wrb)' }}><HardHat size={14} /></div>
                    <div className="li-info">
                      <div className="li-title">{dw.title}</div>
                      <div className="li-meta">{dw.fund} · {dw.budget} · {dw.progress} complete</div>
                    </div>
                    <span className="li-status status-progress">In Progress</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--t4)', padding: '6px 0' }}>No active development works</div>
              )}

              {/* Key Workers */}
              <div className="dp-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} /> Key Workers ({selectedArea.workers} total)
              </div>
              <div className="worker-avatars">
                {selectedArea.keyWorkers && selectedArea.keyWorkers.length > 0 ? (
                  selectedArea.keyWorkers.map((kw, idx) => (
                    <div key={idx} className="w-avatar" title={kw.name}>
                      {kw.initials}
                    </div>
                  ))
                ) : (
                  <div className="w-avatar">KP</div>
                )}
                <div className="w-avatar w-more">+{Math.max(0, selectedArea.workers - (selectedArea.keyWorkers?.length || 0))}</div>
              </div>
            </div>

            <div className="dp-footer">
              <button className="btn-o" style={{ flex: 1, height: '34px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }} onClick={() => alert('Exporting area report...')}>
                <FileText size={14} /> {isMr ? 'अहवाल' : 'Area Report'}
              </button>
              <button className="btn-p" style={{ flex: 1, height: '34px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }} onClick={() => alert(`Opening details for ${selectedArea.nameEn}...`)}>
                <Eye size={14} /> {isMr ? 'सविस्तर पहा' : 'View Full Detail'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GramWardPage;
