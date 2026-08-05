import { useState, useMemo } from 'react';
import { Landmark, MapPin, Building2, Home, Download, Plus, Vote, ChevronDown, ChevronRight } from 'lucide-react';
import useLangStore from '../../store/langStore.js';
import BoothFormModal from './BoothFormModal.jsx';
import LucideIcon from '../../components/common/LucideIcon.jsx';
import './BoothPage.css';

const INITIAL_TREE_DATA = {
  id: 'constituency-1',
  nameEn: 'Kolhapur South Constituency',
  nameMr: 'कोल्हापूर दक्षिण विधानसभा मतदारसंघ',
  type: 'constituency',
  totalBooths: 284,
  children: [
    {
      id: 'taluka-karveer',
      nameEn: 'Karveer Taluka',
      nameMr: 'करवीर तालुका',
      type: 'taluka',
      totalBooths: 156,
      children: [
        {
          id: 'ward-rajarampuri',
          nameEn: 'Rajarampuri (Ward 5)',
          nameMr: 'राजारामपूरी (वॉर्ड ५)',
          type: 'ward',
          totalBooths: 12,
          totalVoters: 10245,
          pramukhsCount: 12,
          booths: [
            { id: 145, number: '145', name: 'Booth 145 — Rajarampuri High School', pramukh: 'Ajit Shinde · अजित शिंदे', workersCount: 5, voters: 895 },
            { id: 146, number: '146', name: 'Booth 146 — Tarabai Park Library Hall', pramukh: 'Aniket Desai · अनिकेत देसाई', workersCount: 4, voters: 912 },
            { id: 147, number: '147', name: 'Booth 147 — Commerce College Hall', pramukh: 'Amol Gurav · अमोल गुरव', workersCount: 4, voters: 738 },
            { id: 148, number: '148', name: 'Booth 148 — Kasaba Bawada Primary School', pramukh: 'Abhijit Jadhav · अभिजित जाधव', workersCount: 6, voters: 801 },
            { id: 149, number: '149', name: 'Booth 149 — Ramanand Nagar Samaj Mandir', pramukh: 'Atish Sangavkar · अतिश सांगवकर', workersCount: 4, voters: 890 },
            { id: 150, number: '150', name: 'Booth 150 — Phulewadi Community Center', pramukh: 'Atul Powar · अतुल पोवार', workersCount: 3, voters: 760 },
          ],
        },
        {
          id: 'ward-uchgaon',
          nameEn: 'Uchgaon (Gram Panchayat)',
          nameMr: 'उचगाव (ग्रामपंचायत)',
          type: 'village',
          totalBooths: 14,
          totalVoters: 12450,
          pramukhsCount: 14,
          booths: [
            { id: 101, number: '101', name: 'Booth 101 — ZP Central School, Uchgaon', pramukh: 'Ananda Patil · आनंदा पाटील', workersCount: 5, voters: 920 },
            { id: 102, number: '102', name: 'Booth 102 — High School Hall, Uchgaon', pramukh: 'Kiran Mane · किरण माने', workersCount: 4, voters: 880 },
            { id: 103, number: '103', name: 'Booth 103 — Gram Panchayat Office', pramukh: 'Sachin Kamble · सचिन कांबळे', workersCount: 6, voters: 950 },
            { id: 104, number: '104', name: 'Booth 104 — Samaj Mandir, Uchgaon', pramukh: 'Maruti Todkar · मारुती तोडकर', workersCount: 4, voters: 840 },
          ],
        },
        {
          id: 'village-gokul-shirgaon',
          nameEn: 'Gokul Shirgaon (MIDC)',
          nameMr: 'गोकुळ शिरगाव (एम.आय.डी.सी.)',
          type: 'village',
          totalBooths: 10,
          totalVoters: 8412,
          pramukhsCount: 10,
          booths: [
            { id: 115, number: '115', name: 'Booth 115 — ZP Marathi School, Gokul Shirgaon', pramukh: 'Vikram Jadhav · विक्रम जाधव', workersCount: 4, voters: 845 },
            { id: 116, number: '116', name: 'Booth 116 — Industrial Community Hall', pramukh: 'Sandeep Chavan · संदीप चव्हाण', workersCount: 3, voters: 912 },
            { id: 117, number: '117', name: 'Booth 117 — Gram Panchayat Sabha Griha', pramukh: 'Rahul More · राहुल मोरे', workersCount: 5, voters: 738 },
          ],
        },
        {
          id: 'village-pachgaon',
          nameEn: 'Pachgaon & Morewadi',
          nameMr: 'पाचगाव व मोरेवाडी',
          type: 'village',
          totalBooths: 8,
          totalVoters: 6800,
          pramukhsCount: 8,
          booths: [
            { id: 130, number: '130', name: 'Booth 130 — ZP School Pachgaon', pramukh: 'Atharva Kadam · अथर्व कदम', workersCount: 4, voters: 850 },
            { id: 131, number: '131', name: 'Booth 131 — Morewadi Primary School', pramukh: 'Amrut Bhalkar · अमृत भालकर', workersCount: 5, voters: 810 },
          ],
        },
        {
          id: 'village-kaneri',
          nameEn: 'Kaneri & Kaneriwadi',
          nameMr: 'कानेरी व कानेरीवाडी',
          type: 'village',
          totalBooths: 6,
          totalVoters: 5200,
          pramukhsCount: 6,
          booths: [
            { id: 160, number: '160', name: 'Booth 160 — Siddhagiri School, Kaneri', pramukh: 'Mahesh Khade · महेश खाडे', workersCount: 3, voters: 820 },
            { id: 161, number: '161', name: 'Booth 161 — ZP School Kaneriwadi', pramukh: 'Anil Kamat · अनिल कामत', workersCount: 4, voters: 790 },
          ],
        },
      ],
    },
    {
      id: 'taluka-kagal',
      nameEn: 'Kagal Taluka',
      nameMr: 'कागल तालुका',
      type: 'taluka',
      totalBooths: 64,
      children: [
        {
          id: 'village-kagal-town',
          nameEn: 'Kagal Municipal Area',
          nameMr: 'कागल नगरपरिषद क्षेत्र',
          type: 'ward',
          totalBooths: 16,
          totalVoters: 14200,
          pramukhsCount: 16,
          booths: [
            { id: 201, number: '201', name: 'Booth 201 — Kagal Municipal School No. 1', pramukh: 'Deepak Patil · दिपक पाटील', workersCount: 6, voters: 910 },
            { id: 202, number: '202', name: 'Booth 202 — Chhatrapati Shahu Community Hall', pramukh: 'Balaso Bhosale · बाळासो भोसले', workersCount: 5, voters: 860 },
          ],
        },
        {
          id: 'village-vathar',
          nameEn: 'Vathar Gram Panchayat',
          nameMr: 'वाठार ग्रामपंचायत',
          type: 'village',
          totalBooths: 8,
          totalVoters: 6500,
          pramukhsCount: 8,
          booths: [
            { id: 210, number: '210', name: 'Booth 210 — ZP Primary School Vathar', pramukh: 'Suryakant Ghadge · सूर्यकांत घाडगे', workersCount: 4, voters: 820 },
          ],
        },
      ],
    },
    {
      id: 'taluka-radhanagari',
      nameEn: 'Radhanagari Taluka',
      nameMr: 'राधानगरी तालुका',
      type: 'taluka',
      totalBooths: 42,
      children: [
        {
          id: 'village-radhanagari-town',
          nameEn: 'Radhanagari Central',
          nameMr: 'राधानगरी मध्यवर्ती',
          type: 'village',
          totalBooths: 10,
          totalVoters: 7800,
          pramukhsCount: 10,
          booths: [
            { id: 240, number: '240', name: 'Booth 240 — Irrigation Dept Colony School', pramukh: 'Vishwas Nalawade · विश्वास नलवडे', workersCount: 4, voters: 790 },
          ],
        },
      ],
    },
    {
      id: 'taluka-hatkanangale',
      nameEn: 'Hatkanangale Taluka',
      nameMr: 'हातकणंगले तालुका',
      type: 'taluka',
      totalBooths: 22,
      children: [
        {
          id: 'village-shiroli',
          nameEn: 'Shiroli Pulachi',
          nameMr: 'शिरोली पुलाची',
          type: 'village',
          totalBooths: 8,
          totalVoters: 6900,
          pramukhsCount: 8,
          booths: [
            { id: 260, number: '260', name: 'Booth 260 — ZP High School Shiroli', pramukh: 'Balkrishna Mane · बाळकृष्ण माने', workersCount: 5, voters: 870 },
          ],
        },
      ],
    },
  ],
};

const renderTypeIcon = (type) => {
  if (type === 'constituency') return <Landmark size={14} />;
  if (type === 'taluka') return <MapPin size={14} />;
  if (type === 'ward') return <Building2 size={14} />;
  if (type === 'village') return <Home size={14} />;
  return <MapPin size={14} />;
};

const BoothPage = () => {
  const { lang } = useLangStore();
  const isMr = lang === 'MR';

  const [treeData] = useState(INITIAL_TREE_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState({
    'constituency-1': true,
    'taluka-karveer': true,
    'ward-rajarampuri': true,
  });

  const [selectedNode, setSelectedNode] = useState(
    INITIAL_TREE_DATA.children[0].children[0] // Rajarampuri (Ward 5)
  );

  const [isFormOpen, setIsFormOpen] = useState(false);

  const toggleNode = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const handleAddBoothSuccess = (newBoothData) => {
    if (!selectedNode || !selectedNode.booths) return;

    const newBooth = {
      id: Date.now(),
      number: newBoothData.booth_number || '151',
      name: newBoothData.booth_name || 'New Polling Booth',
      pramukh: newBoothData.pramukh_name || 'Assigned Pramukh',
      workersCount: 2,
      voters: parseInt(newBoothData.total_voters, 10) || 850,
    };

    setSelectedNode((prev) => ({
      ...prev,
      booths: [...(prev.booths || []), newBooth],
      totalBooths: (prev.totalBooths || 0) + 1,
      totalVoters: (prev.totalVoters || 0) + newBooth.voters,
    }));
  };

  // Render Tree Recursive Function
  const renderTree = (node) => {
    const isExpanded = !!expandedNodes[node.id];
    const isSelected = selectedNode?.id === node.id;
    const hasChildren = node.children && node.children.length > 0;

    // Filter by search query if present
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = node.nameEn.toLowerCase().includes(q) || node.nameMr.includes(q);
      const childMatch = node.children?.some(
        (c) => c.nameEn.toLowerCase().includes(q) || c.nameMr.includes(q)
      );
      const boothMatch = node.booths?.some(
        (b) => b.name.toLowerCase().includes(q) || String(b.number).includes(q)
      );

      if (!nameMatch && !childMatch && !boothMatch) {
        return null;
      }
    }

    return (
      <div key={node.id} className="tree-node">
        <div
          className={`tn-row ${isSelected ? 'active' : ''}`}
          onClick={() => handleNodeClick(node)}
        >
          <span
            className="tn-toggle"
            onClick={(e) => {
              e.stopPropagation();
              toggleNode(node.id);
            }}
          >
            {hasChildren ? (isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />) : ''}
          </span>
          <span className="tn-icon">{renderTypeIcon(node.type)}</span>
          <span className="tn-label">{isMr ? node.nameMr : node.nameEn}</span>
          <span className="tn-count">{node.totalBooths || node.booths?.length || 0}</span>
        </div>

        {hasChildren && (isExpanded || searchQuery.trim()) && (
          <div className="tn-children">
            {node.children.map((child) => renderTree(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="booth-page-container">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {isMr ? 'बूथ रचना' : 'Booth Structure'}
          </h1>
          <p className="page-subtitle">
            {isMr
              ? 'मतदारसंघ रचना: तालुका → ग्रामपंचायत → गाव/वॉर्ड → बूथ'
              : 'Constituency hierarchy: Taluka → Gram Panchayat → Village → Booth'}
          </p>
        </div>

        <div className="page-actions">
          <button className="btn-o" onClick={() => alert(isMr ? 'बूथ डेटा एक्सपोर्ट होत आहे...' : 'Exporting booth data...')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} /> {isMr ? 'एक्सपोर्ट' : 'Export'}
          </button>
          <button className="btn-p" onClick={() => setIsFormOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} /> {isMr ? 'नवीन बूथ जोडा' : 'Add Booth'}
          </button>
        </div>
      </div>

      {/* ── Two Column Layout (Tree + Detail) ────────────────── */}
      <div className="booth-layout">
        {/* Left Column: Constituency Tree Panel */}
        <div className="tree-panel">
          <div className="tree-header">
            <span className="tree-header-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Vote size={16} /> {isMr ? 'मतदारसंघ वृक्ष' : 'Constituency Tree'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-4)' }}>
              284 {isMr ? 'एकूण बूथ' : 'booths'}
            </span>
          </div>

          <div className="tree-search">
            <input
              type="text"
              placeholder={isMr ? 'तालुका, गाव, वॉर्ड, बूथ शोधा...' : 'Search taluka, village, booth...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="tree-body">{renderTree(treeData)}</div>
        </div>

        {/* Right Column: Detail Panel */}
        <div className="detail-panel">
          <div className="dp-header">
            <div className="dp-title">
              {isMr ? selectedNode?.nameMr : selectedNode?.nameEn}
              <span className="mr" style={{ fontSize: '15px', color: 'var(--text-3)', marginLeft: '8px' }}>
                {isMr ? selectedNode?.nameEn : selectedNode?.nameMr}
              </span>
            </div>
            <div className="dp-sub">
              {isMr ? 'करवीर तालुका · कोल्हापूर विभाग' : 'Karveer Taluka · Kolhapur Division'} · {selectedNode?.totalBooths || selectedNode?.booths?.length || 0} {isMr ? 'बूथ' : 'Booths'} ·{' '}
              {(selectedNode?.totalVoters || 10245).toLocaleString(isMr ? 'mr-IN' : 'en-US')} {isMr ? 'एकूण मतदार' : 'Total Voters'}
            </div>

            {/* 3 Stat KPI Cards */}
            <div className="dp-stats">
              <div className="dp-stat">
                <div className="dp-stat-val" style={{ color: 'var(--primary)' }}>
                  {selectedNode?.totalBooths || selectedNode?.booths?.length || 12}
                </div>
                <div className="dp-stat-label">{isMr ? 'बूथ (Booths)' : 'Booths'}</div>
              </div>

              <div className="dp-stat">
                <div className="dp-stat-val" style={{ color: 'var(--purple, #7C3AED)' }}>
                  {selectedNode?.pramukhsCount || selectedNode?.booths?.length || 12}
                </div>
                <div className="dp-stat-label">{isMr ? 'बूथ प्रमुख (Pramukhs)' : 'Booth Pramukh'}</div>
              </div>

              <div className="dp-stat">
                <div className="dp-stat-val" style={{ color: 'var(--success, #16A34A)' }}>
                  {(selectedNode?.totalVoters || 10245).toLocaleString(isMr ? 'mr-IN' : 'en-US')}
                </div>
                <div className="dp-stat-label">{isMr ? 'एकूण मतदार (Voters)' : 'Total Voters'}</div>
              </div>
            </div>
          </div>

          <div className="dp-body">
            <div className="dp-section-title">
              {isMr ? `${selectedNode?.nameMr || ''} मधील बूथ यादी` : `Booths in ${selectedNode?.nameEn || ''}`}
            </div>

            {/* Booth Cards List */}
            {selectedNode?.booths && selectedNode.booths.length > 0 ? (
              selectedNode.booths.map((b) => (
                <div key={b.id} className="booth-card">
                  <div className="booth-num">{b.number}</div>
                  <div className="booth-info">
                    <div className="booth-name">{b.name}</div>
                    <div className="booth-meta">
                      {isMr ? 'प्रमुख:' : 'Pramukh:'} <strong>{b.pramukh}</strong> · {b.workersCount} {isMr ? 'कार्यकर्ते' : 'workers'}
                    </div>
                  </div>
                  <div className="booth-voters">
                    {b.voters.toLocaleString(isMr ? 'mr-IN' : 'en-US')} {isMr ? 'मतदार' : 'voters'}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-3)' }}>
                <p>{isMr ? 'या विभागामध्ये कोणतेही थेट बूथ जोडलेले नाहीत.' : 'No direct booths found under this node. Select a village/ward in the tree.'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Add Booth Modal ─────────────────────────────────── */}
      <BoothFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleAddBoothSuccess}
        initialArea={isMr ? selectedNode?.nameMr : selectedNode?.nameEn}
      />
    </div>
  );
};

export default BoothPage;
