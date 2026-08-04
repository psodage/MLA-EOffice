// src/pages/booth/BoothPage.jsx
// ============================================================
// Booth Structure Page — Network Module
// 1:1 Layout Match with WIREFRAMES/booth_structure.html
// Features: Constituency Hierarchy Tree (Taluka → GP/Ward → Booth),
// Search Filtering, Area Detail Panel, Booth Cards, Language Switch
// ============================================================

import { useState, useMemo } from 'react';
import useLangStore from '../../store/langStore.js';
import BoothFormModal from './BoothFormModal.jsx';
import LucideIcon from '../../components/common/LucideIcon.jsx';
import './BoothPage.css';

const INITIAL_TREE_DATA = {
  id: 'constituency-1',
  nameEn: 'Haveli Constituency',
  nameMr: 'हवेली विधानसभा मतदारसंघ',
  type: 'constituency',
  icon: '🏛️',
  totalBooths: 156,
  children: [
    {
      id: 'taluka-1',
      nameEn: 'Haveli Taluka',
      nameMr: 'हवेली तालुका',
      type: 'taluka',
      icon: '📍',
      totalBooths: 92,
      children: [
        {
          id: 'ward-5',
          nameEn: 'Pimpri (Ward 5)',
          nameMr: 'पिंपरी (वॉर्ड ५)',
          type: 'ward',
          icon: '🏘️',
          totalBooths: 12,
          totalVoters: 10245,
          pramukhsCount: 12,
          booths: [
            { id: 145, number: '145', name: 'Booth 145 — ZP School, Pimpri', pramukh: 'Ramesh Patil', workersCount: 3, voters: 845 },
            { id: 146, number: '146', name: 'Booth 146 — Gram Panchayat Office', pramukh: 'Mangesh Jadhav', workersCount: 5, voters: 912 },
            { id: 147, number: '147', name: 'Booth 147 — Community Hall', pramukh: 'Sachin Kale', workersCount: 4, voters: 738 },
            { id: 148, number: '148', name: 'Booth 148 — Primary School', pramukh: 'Priya Deshmukh', workersCount: 2, voters: 801 },
            { id: 149, number: '149', name: 'Booth 149 — High School Hall', pramukh: 'Vikas Thorat', workersCount: 4, voters: 890 },
            { id: 150, number: '150', name: 'Booth 150 — Samaj Mandir', pramukh: 'Santosh More', workersCount: 3, voters: 760 },
          ],
        },
        {
          id: 'ward-1',
          nameEn: 'Shivaji Nagar (Ward 1)',
          nameMr: 'शिवाजी नगर (वॉर्ड १)',
          type: 'ward',
          icon: '🏘️',
          totalBooths: 8,
          totalVoters: 6850,
          pramukhsCount: 8,
          booths: [
            { id: 101, number: '101', name: 'Booth 101 — Town Hall', pramukh: 'Anand Shinde', workersCount: 4, voters: 820 },
            { id: 102, number: '102', name: 'Booth 102 — Govt Library', pramukh: 'Kiran Mane', workersCount: 3, voters: 790 },
          ],
        },
        {
          id: 'village-wadgaon',
          nameEn: 'Wadgaon Village',
          nameMr: 'वडगाव गाव',
          type: 'village',
          icon: '🏡',
          totalBooths: 6,
          totalVoters: 4812,
          pramukhsCount: 6,
          booths: [
            { id: 12, number: '12', name: 'Booth 12 — ZP Primary School', pramukh: 'Vishnu Gaikwad', workersCount: 4, voters: 845 },
            { id: 13, number: '13', name: 'Booth 13 — Gram Panchayat Office', pramukh: 'Anil Shinde', workersCount: 3, voters: 912 },
            { id: 14, number: '14', name: 'Booth 14 — Community Center', pramukh: 'Suresh Pawar', workersCount: 5, voters: 738 },
          ],
        },
        {
          id: 'village-ambegaon',
          nameEn: 'Ambegaon Village',
          nameMr: 'आंबेगाव गाव',
          type: 'village',
          icon: '🏡',
          totalBooths: 4,
          totalVoters: 3400,
          pramukhsCount: 4,
          booths: [
            { id: 21, number: '21', name: 'Booth 21 — ZP School Ambegaon', pramukh: 'Ganesh Raut', workersCount: 3, voters: 850 },
            { id: 22, number: '22', name: 'Booth 22 — Anganwadi Hall', pramukh: 'Nitin Kadam', workersCount: 2, voters: 810 },
          ],
        },
      ],
    },
    {
      id: 'taluka-2',
      nameEn: 'Maval Taluka',
      nameMr: 'मावळ तालुका',
      type: 'taluka',
      icon: '📍',
      totalBooths: 38,
      children: [
        {
          id: 'village-lonavala',
          nameEn: 'Lonavala Rural',
          nameMr: 'लोणावळा ग्रामीण',
          type: 'village',
          icon: '🏡',
          totalBooths: 10,
          totalVoters: 7500,
          pramukhsCount: 10,
          booths: [
            { id: 51, number: '51', name: 'Booth 51 — High School Lonavala', pramukh: 'Ajay Jagtap', workersCount: 4, voters: 780 },
          ],
        },
      ],
    },
    {
      id: 'taluka-3',
      nameEn: 'Shirur Taluka',
      nameMr: 'शिरूर तालुका',
      type: 'taluka',
      icon: '📍',
      totalBooths: 26,
      children: [],
    },
  ],
};

const BoothPage = () => {
  const { lang, setLang } = useLangStore();
  const isMr = lang === 'MR';

  const [treeData, setTreeData] = useState(INITIAL_TREE_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState({
    'constituency-1': true,
    'taluka-1': true,
    'ward-5': true,
  });

  const [selectedNode, setSelectedNode] = useState(
    INITIAL_TREE_DATA.children[0].children[0] // Pimpri (Ward 5)
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
            {hasChildren ? (isExpanded ? '▼' : '▶') : ''}
          </span>
          <span className="tn-icon">{node.icon || '📍'}</span>
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
            {isMr ? 'बूथ रचना (Booth Structure)' : 'Booth Structure · '}
            <span className="mr">{isMr ? '' : 'बूथ रचना'}</span>
          </h1>
          <p className="page-subtitle">
            {isMr
              ? 'मतदारसंघ रचना: तालुका → ग्रामपंचायत → गाव/वॉर्ड → बूथ'
              : 'Constituency hierarchy: Taluka → Gram Panchayat → Village → Booth'}
          </p>
        </div>

        <div className="page-actions">
          <button className="btn-o" onClick={() => alert(isMr ? 'बूथ डेटा एक्सपोर्ट होत आहे...' : 'Exporting booth data...')}>
            📥 {isMr ? 'एक्सपोर्ट' : 'Export'}
          </button>
          <button className="btn-p" onClick={() => setIsFormOpen(true)}>
            + {isMr ? 'नवीन बूथ जोडा' : 'Add Booth'}
          </button>
        </div>
      </div>

      {/* ── Two Column Layout (Tree + Detail) ────────────────── */}
      <div className="booth-layout">
        {/* Left Column: Constituency Tree Panel */}
        <div className="tree-panel">
          <div className="tree-header">
            <span className="tree-header-title">🗳️ {isMr ? 'मतदारसंघ वृक्ष' : 'Constituency Tree'}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-4)' }}>
              156 {isMr ? 'एकूण बूथ' : 'booths'}
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
              {isMr ? 'हवेली तालुका' : 'Haveli Taluka'} · {selectedNode?.totalBooths || selectedNode?.booths?.length || 0} {isMr ? 'बूथ' : 'Booths'} ·{' '}
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
