// src/utils/iconMap.js
// ============================================================
// Lucide Icon Mapping Dictionary with 4 Cohesive Uniform Icon Families
// Ensures 100% visual design harmony & uniform line weights per family
// 1. Sleek Modern SaaS (Linear / Vercel Line Style)
// 2. Apple iOS Rounded Line (Curved & Soft iOS Style)
// 3. Tech Monochromatic (Stripe / Supabase Geometric Style)
// 4. Executive Enterprise (Authoritative Government Style)
// ============================================================

import {
  // Family 1: Sleek Modern SaaS
  LayoutGrid, FileInput, FileOutput, UserCheck, ScrollText, Building2,
  Users, MapPin, Vote, Calendar, MessageSquare, BarChart3, Settings, ShieldCheck, Landmark,

  // Family 2: Apple iOS Rounded Line
  LayoutDashboard, Mail, SendHorizontal, Contact, FileCheck, HardHat,
  UsersRound, Map, CheckSquare, CalendarDays, MessageCircle, LineChart, Sliders, Shield, Library,

  // Family 3: Tech Monochromatic
  Kanban, FileUp, FileDown, UserPlus, FileCode, Construction,
  Network, Compass, Box, Clock, MessageSquareCode, PieChart, SlidersHorizontal, ShieldAlert, Building,

  // Family 4: Executive Enterprise
  Columns3, FileCheck2, Share2, Contact as ContactBadge, FileSpreadsheet, Warehouse,
  Briefcase, Globe, Vote as VoteBallot, CalendarCheck, MailCheck, TrendingUp, Cog, KeyRound, Landmark as LandmarkGov,

// Common Actions & Controls
  Download, Plus, Pencil, Trash2, ListFilter, Search, LogOut,
  Sun, Moon, RefreshCw, Eye, CheckCheck, XCircle, Clock as ClockIcon,
  User, Phone, Printer, Paperclip, HelpCircle, DownloadCloud, PlusCircle
} from 'lucide-react';

export const COHESIVE_ICON_FAMILIES = {
  // Family 1: Sleek Modern SaaS (Default - Recommended)
  'saas-line': {
    dashboard: LayoutGrid,
    inward: FileInput,
    outward: FileOutput,
    visitor: UserCheck,
    nivedan: ScrollText,
    devworks: Building2,
    karyakarta: Users,
    'gram-ward': MapPin,
    booth: Vote,
    calendar: Calendar,
    whatsapp: MessageSquare,
    reports: BarChart3,
    settings: Settings,
    users: ShieldCheck,
    emblem: Landmark,
    strokeWidth: 1.75,
  },

  // Family 2: Apple iOS Rounded Line
  'ios-line': {
    dashboard: LayoutDashboard,
    inward: Mail,
    outward: SendHorizontal,
    visitor: Contact,
    nivedan: FileCheck,
    devworks: HardHat,
    karyakarta: UsersRound,
    'gram-ward': Map,
    booth: CheckSquare,
    calendar: CalendarDays,
    whatsapp: MessageCircle,
    reports: LineChart,
    settings: Sliders,
    users: Shield,
    emblem: Library,
    strokeWidth: 2.0,
  },

  // Family 3: Tech Monochromatic (Stripe / Supabase)
  'tech-line': {
    dashboard: Kanban,
    inward: FileUp,
    outward: FileDown,
    visitor: UserPlus,
    nivedan: FileCode,
    devworks: Construction,
    karyakarta: Network,
    'gram-ward': Compass,
    booth: Box,
    calendar: Clock,
    whatsapp: MessageSquareCode,
    reports: PieChart,
    settings: SlidersHorizontal,
    users: ShieldAlert,
    emblem: Building,
    strokeWidth: 2.25,
  },

  // Family 4: Executive Enterprise (Government)
  'executive-line': {
    dashboard: Columns3,
    inward: FileCheck2,
    outward: Share2,
    visitor: ContactBadge,
    nivedan: FileSpreadsheet,
    devworks: Warehouse,
    karyakarta: Briefcase,
    'gram-ward': Globe,
    booth: VoteBallot,
    calendar: CalendarCheck,
    whatsapp: MailCheck,
    reports: TrendingUp,
    settings: Cog,
    users: KeyRound,
    emblem: LandmarkGov,
    strokeWidth: 1.5,
  },
};

export const COMMON_ACTION_MAP = {
  export: Download,
  download: Download,
  add: Plus,
  plus: Plus,
  edit: Pencil,
  delete: Trash2,
  filter: ListFilter,
  search: Search,
  logout: LogOut,
  sun: Sun,
  moon: Moon,
  refresh: RefreshCw,
  eye: Eye,
  check: CheckCheck,
  close: XCircle,
  clock: ClockIcon,
  user: User,
  phone: Phone,
  print: Printer,
  attachment: Paperclip,
  info: HelpCircle,
};

/**
 * Returns the family-specific Lucide Icon component for a given key and family style.
 */
export const getLucideIcon = (key, family = 'tech-line') => {
  const familyMap = COHESIVE_ICON_FAMILIES[family] || COHESIVE_ICON_FAMILIES['tech-line'];
  return familyMap[key] || COMMON_ACTION_MAP[key] || COHESIVE_ICON_FAMILIES['tech-line'][key] || ScrollText;
};

/**
 * Returns the default stroke width for a given icon family style.
 */
export const getFamilyStrokeWidth = (family = 'tech-line') => {
  const familyConfig = COHESIVE_ICON_FAMILIES[family] || COHESIVE_ICON_FAMILIES['tech-line'];
  return familyConfig.strokeWidth || 2.25;
};
