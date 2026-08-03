// src/modules/dashboard/dashboard.service.js
// ============================================================
// Dashboard business logic — provides role-specific stats & activities
// Handles MLA, PA, RECEPTIONIST, AUDITOR, BOOTH_PRAMUKH, ADMIN roles.
// ============================================================

/**
 * Get role-specific dashboard summary stats and recent activities
 * @param {object} user - Decoded JWT user object from req.user
 * @returns {Promise<object>} Dashboard summary data
 */
export const getDashboardSummary = async (user) => {
  const role = user?.role || 'CITIZEN';

  // Base recent activities array (bilingual & structured)
  const activities = [
    {
      id: 1,
      type: 'nivedan',
      title: 'नवीन निवेदन नोंदवले (पिण्याच्या पाण्याची समस्या)',
      subtitle: 'New Petition: Drinking Water Issue - Village Rahata',
      referenceId: 'NIV-2026-00102',
      time: '१० मिनिटांपूर्वी',
      timeAgo: '10 mins ago',
      status: 'PENDING',
      statusText: 'प्रलंबित / Pending',
      statusColor: 'warning',
      actor: 'रमेश पाटील (नागरिक)',
    },
    {
      id: 2,
      type: 'visitor',
      title: 'नागरिक भेट नोंदणी (वैद्यकीय मदत)',
      subtitle: 'Visitor Arrival: Medical Assistance Request',
      referenceId: 'VIS-2026-0045',
      time: '३० मिनिटांपूर्वी',
      timeAgo: '30 mins ago',
      status: 'CHECKED_IN',
      statusText: 'कार्यालयात उपस्थित / Checked In',
      statusColor: 'info',
      actor: 'विजय साळुंके',
    },
    {
      id: 3,
      type: 'inward',
      title: 'शासकीय पत्र प्राप्त (सार्वजनिक बांधकाम विभाग)',
      subtitle: 'Government Letter Received: PWD Department',
      referenceId: 'INW-2026-00088',
      time: '१ तासापूर्वी',
      timeAgo: '1 hr ago',
      status: 'ASSIGNED',
      statusText: 'नियुक्त / Assigned to PA',
      statusColor: 'purple',
      actor: 'कार्यकारी अभियंता, PWD',
    },
    {
      id: 4,
      type: 'devwork',
      title: 'रस्ता रुंदीकरण काम प्रगतीपथावर (७५%)',
      subtitle: 'Road Widening Work in Progress (75%)',
      referenceId: 'DEV-2026-0012',
      time: '२ तासांपूर्वी',
      timeAgo: '2 hrs ago',
      status: 'IN_PROGRESS',
      statusText: 'प्रगतीपथावर / In Progress',
      statusColor: 'info',
      actor: 'सुनील देशमुख (ऑडिटर)',
    },
    {
      id: 5,
      type: 'nivedan',
      title: 'निवेदन मार्गी लावले (विद्युत ट्रान्सफॉर्मर दुरुस्ती)',
      subtitle: 'Petition Resolved: Transformer Repair',
      referenceId: 'NIV-2026-00084',
      time: '३ तासांपूर्वी',
      timeAgo: '3 hrs ago',
      status: 'RESOLVED',
      statusText: 'पूर्ण / Resolved',
      statusColor: 'success',
      actor: 'MSEDCL अधिकारी',
    },
  ];

  // Role-specific stats definitions according to USER_ROLES.md & requirements
  let stats = [];

  switch (role) {
    case 'MLA':
      stats = [
        {
          key: 'total_nivedans',
          title: 'एकूण निवेदने',
          titleEn: 'Total Petitions',
          count: 142,
          unit: 'निवेदने / Total',
          icon: 'FileText',
          color: 'blue',
          trend: '+12 या आठवड्यात',
          breakdown: {
            pending: 28,
            inProgress: 45,
            escalated: 6,
            resolved: 63,
          },
        },
        {
          key: 'devworks_progress',
          title: 'विकासकामे प्रगती',
          titleEn: 'DevWorks Progress',
          count: 34,
          unit: 'सक्रिय कामे / Active Works',
          icon: 'Building',
          color: 'emerald',
          trend: '८५% अर्थसंकल्प वापरला',
          breakdown: {
            sanctioned: 8,
            inProgress: 18,
            completed: 8,
          },
        },
        {
          key: 'karyakarta_count',
          title: 'कार्यकर्ता संख्या',
          titleEn: 'Karyakarta Strength',
          count: 1250,
          unit: 'नोंदणीकृत / Registered',
          icon: 'Users',
          color: 'amber',
          trend: '२३५ बूथ समाविष्ट',
          breakdown: {
            boothPramukhs: 235,
            activeWorkers: 1015,
          },
        },
        {
          key: 'today_visitors',
          title: 'आजचे भेट देणारे',
          titleEn: "Today's Visitors",
          count: 18,
          unit: 'नागरिक / Citizens',
          icon: 'UserCheck',
          color: 'purple',
          trend: '५ प्रलंबित भेटी',
        },
      ];
      break;

    case 'PA':
      stats = [
        {
          key: 'pending_nivedans',
          title: 'प्रलंबित निवेदने',
          titleEn: 'Pending Petitions',
          count: 28,
          unit: 'कार्यवाही बाकी / Pending Action',
          icon: 'Clock',
          color: 'amber',
          badge: 'तात्काळ / High Priority',
          badgeColor: 'warning',
        },
        {
          key: 'overdue_nivedans',
          title: 'कालावधी उलटलेली निवेदने',
          titleEn: 'Overdue / Escalated',
          count: 6,
          unit: 'तातडीची / Escalated',
          icon: 'AlertTriangle',
          color: 'rose',
          badge: 'मुदत संपली / Overdue',
          badgeColor: 'danger',
        },
        {
          key: 'today_visitors',
          title: 'आजचे भेट देणारे',
          titleEn: "Today's Visitors",
          count: 18,
          unit: 'नोंदणीकृत / Checked In',
          icon: 'UserCheck',
          color: 'purple',
          trend: '१३ बाहेर पडले, ५ भेटत आहेत',
        },
        {
          key: 'inward_pending',
          title: 'प्रलंबित आवक पत्रे',
          titleEn: 'Inward Pending Action',
          count: 9,
          unit: 'उत्तर प्रलंबित / Response Pending',
          icon: 'Inbox',
          color: 'blue',
          trend: '४ AI ड्राफ्ट तयार',
        },
      ];
      break;

    case 'RECEPTIONIST':
      stats = [
        {
          key: 'today_visitors_count',
          title: 'आजचे एकूण नागरिक भेट',
          titleEn: "Today's Visitor Count",
          count: 18,
          unit: 'भेट देणारे / Visitors',
          icon: 'UserCheck',
          color: 'purple',
          trend: '५ सध्या उपस्थित',
        },
        {
          key: 'pending_nivedans_register',
          title: 'नोंदणी करावयाची निवेदने',
          titleEn: 'Petitions to Register',
          count: 4,
          unit: 'प्रलंबित / Pending Entry',
          icon: 'FilePlus',
          color: 'amber',
          badge: 'नवी निवेदने',
          badgeColor: 'warning',
        },
        {
          key: 'inward_letters_today',
          title: 'आज प्राप्त आवक पत्रे',
          titleEn: "Today's Inward Letters",
          count: 7,
          unit: 'स्कॅन केलेली पत्रे / Scanned',
          icon: 'FileText',
          color: 'blue',
        },
      ];
      break;

    case 'AUDITOR':
      stats = [
        {
          key: 'devworks_status',
          title: 'विकासकामे तपासणी',
          titleEn: 'DevWorks Inspections',
          count: 14,
          unit: 'क्षेत्रीय तपासणी / Assigned Sites',
          icon: 'CheckSquare',
          color: 'emerald',
          breakdown: {
            inspected: 9,
            pending: 5,
          },
        },
        {
          key: 'booth_verification',
          title: 'बूथ पडताळणी आकडेवारी',
          titleEn: 'Booth Verification Stats',
          count: 180,
          unit: 'पडताळलेले बूथ / Verified Booths',
          icon: 'MapPin',
          color: 'blue',
          trend: 'एकूण २३५ पैकी १८० पूर्ण (७६%)',
        },
        {
          key: 'photos_uploaded',
          title: 'अपलोड केलेले फोटो',
          titleEn: 'Evidence Photos Uploaded',
          count: 86,
          unit: 'फोटो / Photos',
          icon: 'Camera',
          color: 'purple',
        },
      ];
      break;

    case 'ADMIN':
    case 'BOOTH_PRAMUKH':
    default:
      stats = [
        {
          key: 'system_overview',
          title: 'एकूण नोंदणीकृत निवेदने',
          titleEn: 'Total Registered Petitions',
          count: 142,
          unit: 'निवेदने / Petitions',
          icon: 'FileText',
          color: 'blue',
        },
        {
          key: 'active_projects',
          title: 'सक्रिय विकासकामे',
          titleEn: 'Active Dev Projects',
          count: 34,
          unit: 'प्रकल्प / Projects',
          icon: 'Building',
          color: 'emerald',
        },
        {
          key: 'booth_count',
          title: 'एकूण मतदान बूथ',
          titleEn: 'Polling Booths',
          count: 235,
          unit: 'बूथ / Booths',
          icon: 'MapPin',
          color: 'amber',
        },
      ];
      break;
  }

  // Quick actions matrix based on role
  const quickActions = getQuickActionsForRole(role);

  return {
    role,
    user: {
      userId: user.userId,
      username: user.username,
      full_name: user.full_name || user.username,
    },
    stats,
    activities,
    quickActions,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Helper to get available quick action shortcuts by role
 * @param {string} role
 * @returns {Array} List of quick action buttons
 */
const getQuickActionsForRole = (role) => {
  switch (role) {
    case 'MLA':
      return [
        { id: 'view_nivedans', label: 'निवेदने पहा', labelEn: 'View Petitions', icon: 'FileText', path: '/nivedan', primary: true },
        { id: 'view_devworks', label: 'विकासकामे पहा', labelEn: 'View DevWorks', icon: 'Building', path: '/devworks', primary: false },
        { id: 'view_reports', label: 'अहवाल पहा', labelEn: 'View Reports', icon: 'BarChart2', path: '/reports', primary: false },
      ];
    case 'PA':
      return [
        { id: 'new_nivedan', label: '+ नवीन निवेदन', labelEn: '+ New Petition', icon: 'PlusCircle', path: '/nivedan/new', primary: true },
        { id: 'new_inward', label: '+ नवीन आवक', labelEn: '+ New Inward', icon: 'FilePlus', path: '/inward/new', primary: false },
        { id: 'ai_draft', label: 'AI पत्र ड्राफ्ट', labelEn: 'AI Letter Draft', icon: 'Sparkles', path: '/outward/ai-draft', primary: false },
        { id: 'schedule_event', label: '+ कार्यक्रम जोडा', labelEn: '+ Schedule Event', icon: 'Calendar', path: '/calendar/new', primary: false },
      ];
    case 'RECEPTIONIST':
      return [
        { id: 'new_visitor', label: '+ नवीन भेट नोंद', labelEn: '+ New Visitor Entry', icon: 'UserPlus', path: '/visitors/new', primary: true },
        { id: 'new_nivedan', label: '+ नवीन निवेदन नोंदणी', labelEn: '+ Register Petition', icon: 'PlusCircle', path: '/nivedan/new', primary: true },
        { id: 'scan_inward', label: '+ आवक पत्र अपलोड', labelEn: '+ Scan Inward Letter', icon: 'Upload', path: '/inward/new', primary: false },
      ];
    case 'AUDITOR':
      return [
        { id: 'inspect_work', label: '+ काम तपासणी नोंद', labelEn: '+ Submit Inspection', icon: 'CheckSquare', path: '/devworks/inspect', primary: true },
        { id: 'upload_photo', label: 'फोटो पुरावा अपलोड', labelEn: 'Upload Site Photo', icon: 'Camera', path: '/devworks/photos', primary: false },
      ];
    default:
      return [
        { id: 'view_nivedans', label: 'निवेदने पहा', labelEn: 'View Petitions', icon: 'FileText', path: '/nivedan', primary: true },
      ];
  }
};
