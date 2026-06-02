const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;
const appCore = window.appCore || {};
const ICON_PATHS = {
    LayoutDashboard: [['rect',{x:3,y:3,width:7,height:9,rx:1}], ['rect',{x:14,y:3,width:7,height:5,rx:1}], ['rect',{x:14,y:12,width:7,height:9,rx:1}], ['rect',{x:3,y:16,width:7,height:5,rx:1}]],
    Layers: [['path',{d:'M12 2 2 7l10 5 10-5-10-5Z'}], ['path',{d:'m2 17 10 5 10-5'}], ['path',{d:'m2 12 10 5 10-5'}]],
    PlusCircle: [['circle',{cx:12,cy:12,r:10}], ['path',{d:'M8 12h8'}], ['path',{d:'M12 8v8'}]],
    UserCog: [['circle',{cx:9,cy:7,r:4}], ['path',{d:'M3 21v-2a6 6 0 0 1 6-6h1'}], ['circle',{cx:17,cy:17,r:3}], ['path',{d:'M17 13v1'}], ['path',{d:'M17 20v1'}], ['path',{d:'M13 17h1'}], ['path',{d:'M20 17h1'}]],
    AlertCircle: [['circle',{cx:12,cy:12,r:10}], ['path',{d:'M12 8v5'}], ['path',{d:'M12 16h.01'}]],
    CheckCircle: [['circle',{cx:12,cy:12,r:10}], ['path',{d:'m9 12 2 2 4-4'}]],
    Clock: [['circle',{cx:12,cy:12,r:10}], ['path',{d:'M12 6v6l4 2'}]],
    Calendar: [['rect',{x:3,y:4,width:18,height:18,rx:2}], ['path',{d:'M16 2v4'}], ['path',{d:'M8 2v4'}], ['path',{d:'M3 10h18'}]],
    MapPin: [['path',{d:'M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 0 1 16 0Z'}], ['circle',{cx:12,cy:10,r:3}]],
    DollarSign: [['path',{d:'M12 2v20'}], ['path',{d:'M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6'}]],
    BriefcaseBusiness: [['rect',{x:2,y:7,width:20,height:14,rx:2}], ['path',{d:'M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2'}], ['path',{d:'M2 13h20'}], ['path',{d:'M12 12v2'}]],
    ShoppingCart: [['circle',{cx:8,cy:21,r:1}], ['circle',{cx:19,cy:21,r:1}], ['path',{d:'M2.05 2.05h2l2.7 12.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.5-7.4H5.1'}]],
    Factory: [['path',{d:'M2 20h20'}], ['path',{d:'M4 20V10l6 3V10l6 3V8l4 2v10'}], ['path',{d:'M17 5h3v5'}], ['path',{d:'M8 16h.01'}], ['path',{d:'M12 16h.01'}], ['path',{d:'M16 16h.01'}]],
    Activity: [['path',{d:'M22 12h-4l-3 9L9 3l-3 9H2'}]],
    TrendingUp: [['path',{d:'M22 7 13.5 15.5 8.5 10.5 2 17'}], ['path',{d:'M16 7h6v6'}]],
    AlertTriangle: [['path',{d:'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z'}], ['path',{d:'M12 9v4'}], ['path',{d:'M12 17h.01'}]],
    BarChart3: [['path',{d:'M3 3v18h18'}], ['path',{d:'M7 16V9'}], ['path',{d:'M12 16V5'}], ['path',{d:'M17 16v-3'}]],
    Target: [['circle',{cx:12,cy:12,r:10}], ['circle',{cx:12,cy:12,r:6}], ['circle',{cx:12,cy:12,r:2}]],
    FileText: [['path',{d:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z'}], ['path',{d:'M14 2v6h6'}], ['path',{d:'M16 13H8'}], ['path',{d:'M16 17H8'}], ['path',{d:'M10 9H8'}]],
    Image: [['rect',{x:3,y:3,width:18,height:18,rx:2}], ['circle',{cx:9,cy:9,r:2}], ['path',{d:'m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21'}]],
    ExternalLink: [['path',{d:'M15 3h6v6'}], ['path',{d:'M10 14 21 3'}], ['path',{d:'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'}]],
    Download: [['path',{d:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'}], ['path',{d:'M7 10l5 5 5-5'}], ['path',{d:'M12 15V3'}]],
    Settings2: [['path',{d:'M20 7h-9'}], ['path',{d:'M14 17H5'}], ['circle',{cx:17,cy:17,r:3}], ['circle',{cx:7,cy:7,r:3}]],
    Truck: [['path',{d:'M10 17h4V5H2v12h3'}], ['path',{d:'M14 17h1'}], ['path',{d:'M14 8h4l4 4v5h-3'}], ['circle',{cx:7,y:null,cy:17,r:2}], ['circle',{cx:17,cy:17,r:2}]],
    Lock: [['rect',{x:3,y:11,width:18,height:11,rx:2}], ['path',{d:'M7 11V7a5 5 0 0 1 10 0v4'}]],
    Plus: [['path',{d:'M12 5v14'}], ['path',{d:'M5 12h14'}]],
    X: [['path',{d:'M18 6 6 18'}], ['path',{d:'m6 6 12 12'}]],
    CalendarDays: [['rect',{x:3,y:4,width:18,height:18,rx:2}], ['path',{d:'M16 2v4'}], ['path',{d:'M8 2v4'}], ['path',{d:'M3 10h18'}], ['path',{d:'M8 14h.01'}], ['path',{d:'M12 14h.01'}], ['path',{d:'M16 14h.01'}], ['path',{d:'M8 18h.01'}], ['path',{d:'M12 18h.01'}]],
    Trophy: [['path',{d:'M8 21h8'}], ['path',{d:'M12 17v4'}], ['path',{d:'M7 4h10v7a5 5 0 0 1-10 0Z'}], ['path',{d:'M5 5H3v3a4 4 0 0 0 4 4'}], ['path',{d:'M19 5h2v3a4 4 0 0 1-4 4'}]],
    ChevronRight: [['path',{d:'m9 18 6-6-6-6'}]],
    User: [['path',{d:'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'}], ['circle',{cx:12,cy:7,r:4}]],
    LogIn: [['path',{d:'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4'}], ['path',{d:'m10 17 5-5-5-5'}], ['path',{d:'M15 12H3'}]],
    LogOut: [['path',{d:'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'}], ['path',{d:'m16 17 5-5-5-5'}], ['path',{d:'M21 12H9'}]],
    Paperclip: [['path',{d:'m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48'}]]
};

const makeIcon = (name) => ({ className = '', size = 24, strokeWidth = 2, ...props }) =>
    React.createElement('svg', {
        className,
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
        ...props
    }, (ICON_PATHS[name] || ICON_PATHS.AlertCircle).map(([tag, attrs], index) =>
        React.createElement(tag, { key: index, ...Object.fromEntries(Object.entries(attrs).filter(([,v]) => v !== null)) })
    ));

const iconNames = Object.keys(ICON_PATHS);
const { LayoutDashboard, PlusCircle, UserCog, AlertCircle, CheckCircle, Clock, Calendar, MapPin, DollarSign, BriefcaseBusiness, ShoppingCart, Factory, Activity, TrendingUp, AlertTriangle, BarChart3, Target, FileText, Image: ImageIcon, ExternalLink, Download, Settings2, Truck, Lock, Plus, X, CalendarDays, Trophy, ChevronRight, Layers, User, LogIn, LogOut, Paperclip } = Object.fromEntries(iconNames.map((name) => [name, makeIcon(name)]));
// --- CONSTANTES E DADOS GERAIS ---
const SETORES = appCore.SETORES || ['Administração', 'Comercial', 'Compras', 'Financeiro', 'Produção', 'PD_I', 'Automação', 'Logística'];
const COMPLEXIDADES = appCore.COMPLEXIDADES || ['Baixa', 'Média', 'Alta'];
const STATUS = appCore.STATUS || {
    PENDENTE: 'Pendente',
    AGUARDANDO_AVALIACAO: 'Aguardando Avaliação',
    CONCLUIDA: 'Concluída'
};
const todayDateOnly = appCore.todayDateOnly || (() => new Date().toISOString().split('T')[0]);
const normalizeDateOnly = appCore.normalizeDateOnly || ((value, fallback = '') => {
    if (!value) return fallback;
    const match = String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : fallback;
});
const daysBetweenDateOnly = appCore.daysBetweenDateOnly || (() => 0);
const formatDateBR = appCore.formatDateBR || ((value, fallback = '-') => value ? new Date(`${value}T00:00:00`).toLocaleDateString('pt-BR') : fallback);
const ATTACHMENT_CONFIG = appCore.ATTACHMENT_CONFIG || {
    bucketName: 'Registros - sobre tarefas',
    maxFiles: 5,
    maxSizeBytes: 10 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
};
const validateAttachmentFile = appCore.validateAttachmentFile || ((file) => {
    const mimeType = String(file && file.type || '').toLowerCase();
    if (!ATTACHMENT_CONFIG.allowedMimeTypes.includes(mimeType)) return { valid: false, message: 'Use apenas imagens ou PDF.' };
    if (Number(file && file.size || 0) > ATTACHMENT_CONFIG.maxSizeBytes) return { valid: false, message: 'Cada arquivo deve ter no máximo 10 MB.' };
    return { valid: true, message: '' };
});
const formatFileSize = (bytes) => {
    const value = Number(bytes || 0);
    if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
    if (value >= 1024) return `${Math.round(value / 1024)} KB`;
    return `${value} B`;
};
const getTaskScheduleState = appCore.getTaskScheduleState || ((task) => {
    const currentDueDate = normalizeDateOnly(task && task.conclusaoPrevista);
    const originalDueDate = normalizeDateOnly(task && task.conclusaoPrevistaOriginal, currentDueDate);
    const completionDate = normalizeDateOnly(task && (task.conclusaoReal || task.conclusaoRealUser));
    const compareDate = completionDate || todayDateOnly();
    const storedReprogrammingDelayDays = Number(task && task.diasAtrasoUltimaReprogramacao || 0);
    const delayDays = Math.max(0, daysBetweenDateOnly(originalDueDate, compareDate), daysBetweenDateOnly(currentDueDate, compareDate), storedReprogrammingDelayDays);
    const currentDelayDays = Math.max(0, daysBetweenDateOnly(currentDueDate, compareDate));
    return {
        currentDueDate,
        originalDueDate,
        completionDate,
        delayDays,
        currentDelayDays,
        isReplanned: originalDueDate !== currentDueDate,
        isOverdue: task && task.status === STATUS.PENDENTE && delayDays > 0,
        isCurrentDueOverdue: task && task.status === STATUS.PENDENTE && currentDelayDays > 0,
        isOnTimeOriginal: Boolean(completionDate && daysBetweenDateOnly(completionDate, originalDueDate) >= 0)
    };
});
// --- DADOS DE EXEMPLO (MOCK DATA) ---
const todayStr = todayDateOnly();
const yesterdayDate = new Date();
yesterdayDate.setDate(yesterdayDate.getDate() - 2);
const yesterdayStr = normalizeDateOnly(yesterdayDate, todayStr);
const nextWeekDate = new Date();
nextWeekDate.setDate(nextWeekDate.getDate() + 5);
const nextWeekStr = normalizeDateOnly(nextWeekDate, todayStr);
// --- DADOS DE OBJETIVOS MACRO ---
const INITIAL_OBJETIVOS = appCore.INITIAL_OBJETIVOS || ['Fábrica Principal', 'Proposta 2026/05', 'Geral', 'Logística Regional'];
const INITIAL_TASKS = [
    {
        id: '1',
        setorSolicitante: 'Produção',
        setorExecutor: 'Produção',
        dataAbertura: yesterdayStr,
        conclusaoPrevista: yesterdayStr, // Atrasada (Vencida a 2 dias)
        complexidade: 'Alta',
        descricao: 'Manutenção preventiva na linha de montagem principal. Substituição de correias.',
        objetivo: 'Fábrica Principal',
        clienteFornecedor: 'Equipe Interna',
        deslocamento: false,
        local: '',
        duracaoDeslocamento: '',
        unidadeDeslocamento: 'Horas',
        geraCusto: true,
        tipoCusto: 'Peças de reposição (Correias)',
        valorCusto: '800.00',
        dependencia: '', // Sem dependência
        status: STATUS.PENDENTE
    },
    {
        id: '2',
        setorSolicitante: 'Comercial',
        setorExecutor: 'Comercial',
        dataAbertura: todayStr,
        conclusaoPrevista: nextWeekStr, // No prazo
        complexidade: 'Média',
        descricao: 'Apresentação comercial e fechamento de contrato com novo cliente VIP.',
        objetivo: 'Proposta 2026/05',
        clienteFornecedor: 'Empresa Tech SA',
        deslocamento: true,
        local: 'Sede do Cliente (São Paulo)',
        duracaoDeslocamento: '4',
        unidadeDeslocamento: 'Horas',
        geraCusto: true,
        tipoCusto: 'Transporte e Alimentação',
        valorCusto: '150.00',
        dependencia: '1', // Inteligência: ID '1' = Depende da Manutenção (Produção)
        status: STATUS.PENDENTE
    },
    {
        id: '3',
        setorSolicitante: 'Financeiro',
        setorExecutor: 'Compras',
        dataAbertura: yesterdayStr,
        conclusaoPrevista: nextWeekStr,
        complexidade: 'Baixa',
        descricao: 'Cotação e compra de novos equipamentos de proteção individual (EPIs).',
        objetivo: 'Geral',
        clienteFornecedor: 'Diversos Fornecedores',
        deslocamento: false,
        local: '',
        duracaoDeslocamento: '',
        unidadeDeslocamento: 'Horas',
        geraCusto: true,
        tipoCusto: 'Compra de Material',
        valorCusto: '2500.00',
        dependencia: '',
        status: STATUS.AGUARDANDO_AVALIACAO,
        conclusaoRealUser: todayStr
    },
    {
        id: '4',
        setorSolicitante: 'Logística',
        setorExecutor: 'Logística',
        dataAbertura: '2026-05-01',
        conclusaoPrevista: '2026-05-15',
        complexidade: 'Média',
        descricao: 'Otimização das rotas de entrega semanais na região sul.',
        objetivo: 'Logística Regional',
        clienteFornecedor: 'Transportadoras Parceiras',
        deslocamento: false,
        local: '',
        duracaoDeslocamento: '',
        unidadeDeslocamento: 'Horas',
        geraCusto: false,
        tipoCusto: '',
        valorCusto: '',
        dependencia: '',
        status: STATUS.CONCLUIDA,
        avaliacao: 'As rotas foram bem desenhadas, tivemos uma economia de 10% no tempo.',
        dataAvaliacao: '2026-05-16',
        conclusaoReal: '2026-05-14',
        necessitaAjuste: false,
        encaminhamento: 'Monitorar os resultados de entrega durante o próximo mês.'
    }
];
// --- FUNÇÃO AUXILIAR PARA DATA E SEMANA ---
const getWeekNumber = (d) => {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

const getProfileSectorName = (profile) => profile?.sector?.name || profile?.sectors?.name || '';

const sameSector = (left, right) => {
    const normalize = appCore.normalizeKey || ((value) => String(value || '').trim().toLowerCase());
    return Boolean(left && right && normalize(left) === normalize(right));
};

const getTaskCreatorId = (task) => String((task && (task.criadoPorId || task.created_by)) || (task && task.raw && (task.raw.created_by || (task.raw.metadata && task.raw.metadata.criadoPorId))) || '').trim();

const isTaskCreator = (task, user) => Boolean(task && user && getTaskCreatorId(task) && String(user.id || '').trim() === getTaskCreatorId(task));

const parseMoneyValue = (value) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    const parsed = Number(String(value || '0').replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
};

const moneyBR = (value) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const isBlankValue = (value) => value === null || value === undefined || String(value).trim() === '';
const isDefaultObjectiveValue = (value) => {
    const normalize = appCore.normalizeKey || ((item) => String(item || '').trim().toLowerCase());
    return isBlankValue(value) || normalize(value) === normalize('Geral');
};
const hasPositiveMoneyValue = (value) => parseMoneyValue(value) > 0;
const SECTOR_COLOR_CLASSES = {
    administracao: { badge: 'bg-sky-50 text-sky-800 border-sky-200', soft: 'bg-sky-50 border-sky-200 text-sky-800', dot: 'bg-sky-500' },
    administrativo: { badge: 'bg-sky-50 text-sky-800 border-sky-200', soft: 'bg-sky-50 border-sky-200 text-sky-800', dot: 'bg-sky-500' },
    comercial: { badge: 'bg-blue-50 text-blue-800 border-blue-200', soft: 'bg-blue-50 border-blue-200 text-blue-800', dot: 'bg-blue-500' },
    compras: { badge: 'bg-violet-50 text-violet-800 border-violet-200', soft: 'bg-violet-50 border-violet-200 text-violet-800', dot: 'bg-violet-500' },
    financeiro: { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', soft: 'bg-emerald-50 border-emerald-200 text-emerald-800', dot: 'bg-emerald-500' },
    producao: { badge: 'bg-amber-50 text-amber-800 border-amber-200', soft: 'bg-amber-50 border-amber-200 text-amber-800', dot: 'bg-amber-500' },
    operacional: { badge: 'bg-amber-50 text-amber-800 border-amber-200', soft: 'bg-amber-50 border-amber-200 text-amber-800', dot: 'bg-amber-500' },
    pdi: { badge: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200', soft: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800', dot: 'bg-fuchsia-500' },
    automacao: { badge: 'bg-cyan-50 text-cyan-800 border-cyan-200', soft: 'bg-cyan-50 border-cyan-200 text-cyan-800', dot: 'bg-cyan-500' },
    logistica: { badge: 'bg-orange-50 text-orange-800 border-orange-200', soft: 'bg-orange-50 border-orange-200 text-orange-800', dot: 'bg-orange-500' },
    sal: { badge: 'bg-teal-50 text-teal-800 border-teal-200', soft: 'bg-teal-50 border-teal-200 text-teal-800', dot: 'bg-teal-500' },
    salatecnica: { badge: 'bg-teal-50 text-teal-800 border-teal-200', soft: 'bg-teal-50 border-teal-200 text-teal-800', dot: 'bg-teal-500' }
};
const SECTOR_COLOR_FALLBACKS = [
    { badge: 'bg-indigo-50 text-indigo-800 border-indigo-200', soft: 'bg-indigo-50 border-indigo-200 text-indigo-800', dot: 'bg-indigo-500' },
    { badge: 'bg-lime-50 text-lime-800 border-lime-200', soft: 'bg-lime-50 border-lime-200 text-lime-800', dot: 'bg-lime-500' },
    { badge: 'bg-pink-50 text-pink-800 border-pink-200', soft: 'bg-pink-50 border-pink-200 text-pink-800', dot: 'bg-pink-500' },
    { badge: 'bg-purple-50 text-purple-800 border-purple-200', soft: 'bg-purple-50 border-purple-200 text-purple-800', dot: 'bg-purple-500' }
];
const getSectorColorClasses = (sectorName) => {
    const normalize = appCore.normalizeKey || ((value) => String(value || '').trim().toLowerCase());
    const key = normalize(sectorName);
    if (SECTOR_COLOR_CLASSES[key]) return SECTOR_COLOR_CLASSES[key];
    const hash = String(sectorName || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return SECTOR_COLOR_FALLBACKS[hash % SECTOR_COLOR_FALLBACKS.length];
};
const SECTOR_ICON_COMPONENTS = {
    administracao: BriefcaseBusiness,
    administrativo: BriefcaseBusiness,
    comercial: UserCog,
    compras: ShoppingCart,
    financeiro: DollarSign,
    producao: Factory,
    operacional: Factory,
    pdi: Target,
    automacao: Settings2,
    logistica: Truck,
    sal: Settings2,
    salatecnica: Settings2
};
const SECTOR_ICON_FALLBACKS = [Layers, FileText, Activity, Target];
const getSectorIconComponent = (sectorName) => {
    const normalize = appCore.normalizeKey || ((value) => String(value || '').trim().toLowerCase());
    const key = normalize(sectorName);
    if (SECTOR_ICON_COMPONENTS[key]) return SECTOR_ICON_COMPONENTS[key];
    const hash = String(sectorName || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return SECTOR_ICON_FALLBACKS[hash % SECTOR_ICON_FALLBACKS.length];
};
const getTaskComplementOptions = (task) => {
    const canFillObjective = isDefaultObjectiveValue(task && task.objetivo);
    const canFillClienteFornecedor = isBlankValue(task && task.clienteFornecedor);
    const canFillDisplacement = !(task && task.deslocamento) || isBlankValue(task && task.local) || isBlankValue(task && task.duracaoDeslocamento);
    const canFillCost = !(task && task.geraCusto) || isBlankValue(task && task.tipoCusto) || !hasPositiveMoneyValue(task && task.valorCusto);

    return {
        canFillObjective,
        canFillClienteFornecedor,
        canFillDisplacement,
        canFillCost,
        hasComplementableFields: canFillObjective || canFillClienteFornecedor || canFillDisplacement || canFillCost
    };
};

const normalizeSectorNames = (rows) => {
    const names = (rows || [])
        .map((row) => typeof row === 'string' ? row : row && row.name)
        .map((name) => String(name || '').trim())
        .filter(Boolean);

    return names.length
        ? (appCore.uniqueNormalized ? appCore.uniqueNormalized(names) : [...new Set(names)])
        : SETORES;
};
// --- COMPONENTE PRINCIPAL ---
function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [tasks, setTasks] = useState([]);
    const [objetivos, setObjetivos] = useState(INITIAL_OBJETIVOS);
    const [setores, setSetores] = useState(SETORES);
    const [syncStatus, setSyncStatus] = useState('Conectando sistema...');
    const [authUser, setAuthUser] = useState(null);
    const [authProfile, setAuthProfile] = useState(null);
    const [isManagerUser, setIsManagerUser] = useState(false);
    const [authGate, setAuthGate] = useState(null);
    const [authError, setAuthError] = useState('');
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const [feedback, setFeedback] = useState(null);
    const [expandedSector, setExpandedSector] = useState(null);
    const [sectorPasswordTask, setSectorPasswordTask] = useState(null);
    const [sectorPasswordError, setSectorPasswordError] = useState('');
    const [isVerifyingSectorPassword, setIsVerifyingSectorPassword] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isCompletingTask, setIsCompletingTask] = useState(false);
    const [isEditingTask, setIsEditingTask] = useState(false);
    // Inteligência do Cabeçalho (Data e Semana Dinâmicas)
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    const weekNumber = getWeekNumber(currentDate);
    // Estados e Refs para o Menu Flutuante (FAB)
    const [isFabOpen, setIsFabOpen] = useState(false);
    const fabRef = useRef(null);
    const profileMenuRef = useRef(null);
    const clickTimer = useRef(null);
    const dataRefreshTimer = useRef(null);
    // Lógica de fechamento do menu ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (fabRef.current && !fabRef.current.contains(event.target)) {
                setIsFabOpen(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const showFeedback = (type, message) => {
        setFeedback({ type, message });
    };

    const openUserLogin = () => {
        setAuthError('');
        setAuthGate({ type: 'insert' });
    };

    const openUserSection = (tab) => {
        setIsProfileMenuOpen(false);
        setIsFabOpen(false);

        if (!authUser) {
            openUserLogin();
            return;
        }

        setActiveTab(tab);
    };

    const isManagerAccount = (user, profile, authResult = {}) => {
        const role = String(profile?.role || '').toLowerCase();
        const email = String(user?.email || '').toLowerCase();
        const officialLink = typeof appCore.getUserSectorLink === 'function' ? appCore.getUserSectorLink(email) : null;
        const officialRole = String(officialLink?.role || '').toLowerCase();
        return Boolean(authResult.isManager || email === String(appCore.AUTH_USER_EMAIL || '').toLowerCase() || ['admin', 'gestor', 'lider'].includes(role) || ['admin', 'gestor', 'lider'].includes(officialRole));
    };

    const canAuthenticatedUserFinalizeTask = (task) => {
        if (!authUser || !task) return false;
        if (isTaskCreator(task, authUser)) return true;

        const rawProfileSectorName = getProfileSectorName(authProfile);
        if (!rawProfileSectorName) return false;

        const profileSectorName = appCore.resolveSectorName ? appCore.resolveSectorName(rawProfileSectorName) : rawProfileSectorName;
        const taskSectorName = appCore.resolveSectorName ? appCore.resolveSectorName(task.setorExecutor) : task.setorExecutor;
        const normalize = appCore.normalizeKey || ((value) => String(value || '').trim().toLowerCase());

        return Boolean(profileSectorName && taskSectorName && normalize(profileSectorName) === normalize(taskSectorName));
    };

    const carregarDadosSupabase = async () => {
        if (!window.motorBackend || !window.motorBackend.online) {
            setSyncStatus('Sistema indisponível');
            throw new Error('Conexão de dados indisponível.');
        }

        await window.motorBackend.init();
        const [tarefasSupabase, objetivosSupabase, setoresSupabase] = await Promise.all([
            window.motorBackend.listarTarefas(),
            window.motorBackend.listarObjetivos(),
            window.motorBackend.listarSetores ? window.motorBackend.listarSetores() : []
        ]);

        setTasks(tarefasSupabase || []);
        setObjetivos((objetivosSupabase && objetivosSupabase.length) ? objetivosSupabase : INITIAL_OBJETIVOS);
        setSetores(normalizeSectorNames(setoresSupabase));
        setSyncStatus((tarefasSupabase && tarefasSupabase.length) ? 'Sistema conectado' : 'Sistema conectado sem tarefas');
    };

    useEffect(() => {
        let mounted = true;

        const carregarSessao = async () => {
            try {
                if (!window.motorBackend || !window.motorBackend.online) {
                    if (!mounted) return;
                    setSyncStatus('Sistema indisponível');
                    setAuthError('Não foi possível carregar a conexão de dados.');
                    setIsAuthChecking(false);
                    return;
                }

                const session = await window.motorBackend.getSession();
                if (!mounted) return;

                if (session) {
                    setAuthUser(session.user);
                    setAuthProfile(session.profile || null);
                    setIsManagerUser(isManagerAccount(session.user, session.profile, session));
                }
                await carregarDadosSupabase();
            }
            catch (error) {
                console.error('[App] Falha ao carregar Supabase:', error);
                if (!mounted) return;
                setSyncStatus('Falha na conexão');
                setAuthError(error.message || 'Falha ao carregar sessão.');
            }
            finally {
                if (mounted) setIsAuthChecking(false);
            }
        };

        carregarSessao();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (!window.motorBackend || !window.motorBackend.online || typeof window.motorBackend.subscribeAppChanges !== 'function') {
            return undefined;
        }

        const refreshFromDatabase = () => {
            if (dataRefreshTimer.current) {
                clearTimeout(dataRefreshTimer.current);
            }

            dataRefreshTimer.current = setTimeout(() => {
                Promise.resolve()
                    .then(async () => {
                        const session = await window.motorBackend.getSession().catch(() => null);
                        if (session) {
                            setAuthUser(session.user);
                            setAuthProfile(session.profile || null);
                            setIsManagerUser(isManagerAccount(session.user, session.profile, session));
                        }
                        else {
                            setAuthUser(null);
                            setAuthProfile(null);
                            setIsManagerUser(false);
                        }
                        await carregarDadosSupabase();
                    })
                    .catch((error) => {
                        console.error('[App] Falha ao sincronizar dados do banco:', error);
                        setSyncStatus('Falha ao sincronizar banco');
                    });
            }, 500);
        };

        const unsubscribe = window.motorBackend.subscribeAppChanges(refreshFromDatabase);
        const handleFocus = () => refreshFromDatabase();
        const intervalId = setInterval(refreshFromDatabase, 60000);

        window.addEventListener('focus', handleFocus);

        return () => {
            if (dataRefreshTimer.current) {
                clearTimeout(dataRefreshTimer.current);
            }
            clearInterval(intervalId);
            window.removeEventListener('focus', handleFocus);
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, []);

    const handleLogin = async (email, password, gateType = authGate?.type) => {
        setAuthError('');
        setSyncStatus('Autenticando...');

        try {
            if (!window.motorBackend || !window.motorBackend.online) {
                throw new Error('Conexão de dados indisponível.');
            }
            const authResult = await window.motorBackend.login(email, password);
            const managerAccount = isManagerAccount(authResult.user, authResult.profile, authResult);

            if (gateType === 'manager' && !managerAccount) {
                await window.motorBackend.logout();
                setAuthUser(null);
                setAuthProfile(null);
                setIsManagerUser(false);
                throw new Error('Este usuário não possui permissão de gestor.');
            }

            setAuthUser(authResult.user);
            setAuthProfile(authResult.profile || null);
            setIsManagerUser(managerAccount);
            await carregarDadosSupabase();
            setActiveTab(gateType === 'manager' ? 'manager' : gateType === 'insert' ? 'insert' : activeTab);
            setAuthGate(null);
            setSyncStatus('Login realizado com sucesso');
            showFeedback('success', gateType === 'manager' ? 'Acesso do gestor autorizado.' : gateType === 'complement' ? 'Acesso autorizado para complementar a ficha.' : 'Acesso do setor autorizado para cadastrar atividade.');
        }
        catch (error) {
            console.error('[App] Falha no login:', error);
            const message = error.message || 'Não foi possível autenticar este usuário.';
            setAuthError(message);
            setSyncStatus('Falha no login');
            showFeedback('error', message);
        }
    };

    const handleLogout = async () => {
        if (window.motorBackend && window.motorBackend.online) {
            await window.motorBackend.logout();
        }
        setAuthUser(null);
        setAuthProfile(null);
        setIsManagerUser(false);
        setIsProfileMenuOpen(false);
        if (activeTab !== 'dashboard') setActiveTab('dashboard');
        setSyncStatus('Sessão encerrada');
        showFeedback('success', 'Sessão encerrada com segurança.');
    };

    const openProtectedTab = (tab) => {
        setIsFabOpen(false);
        setAuthError('');

        if (tab === 'dashboard') {
            setActiveTab('dashboard');
            return;
        }

        if (tab === 'insert') {
            if (authUser) {
                setActiveTab('insert');
                return;
            }
            setAuthGate({ type: 'insert' });
            return;
        }

        if (tab === 'manager') {
            if (authUser && isManagerUser) {
                setActiveTab('manager');
                return;
            }
            setAuthGate({ type: 'manager' });
        }
    };

    // Lógica Inteligente do Botão: 1 Clique vs 2 Cliques
    const handleFabClick = (e) => {
        e.preventDefault();
        if (clickTimer.current === null) {
            clickTimer.current = setTimeout(() => {
                setIsFabOpen(!isFabOpen);
                clickTimer.current = null;
            }, 250);
        }
        else {
            // Duplo clique - Redireciona para o início (Dashboard)
            clearTimeout(clickTimer.current);
            clickTimer.current = null;
            setActiveTab('dashboard');
            setIsFabOpen(false);
        }
    };
    const addTask = async (newTask) => {
        if (!window.motorBackend || !window.motorBackend.online || !authUser) {
            const message = 'Registro não realizado: faça login e confirme a conexão de dados.';
            setSyncStatus('Registro não enviado');
            setAuthGate({ type: 'insert' });
            showFeedback('error', message);
            return;
        }

        const cleanTask = appCore.normalizeTaskInput ? appCore.normalizeTaskInput(newTask) : newTask;
        const { anexos = [], ...taskPayload } = cleanTask;

        if (cleanTask.objetivo && !objetivos.some(obj => (appCore.normalizeKey ? appCore.normalizeKey(obj) === appCore.normalizeKey(cleanTask.objetivo) : obj === cleanTask.objetivo))) {
            setObjetivos([...objetivos, cleanTask.objetivo]);
        }

        const taskWithMeta = {
            ...taskPayload,
            id: Date.now().toString(),
            status: STATUS.PENDENTE,
        };

        try {
            setSyncStatus('Salvando atividade...');
            const savedTask = await window.motorBackend.criarTarefa(taskWithMeta);

            if (anexos.length && typeof window.motorBackend.anexarArquivosTarefa === 'function') {
                try {
                    setSyncStatus('Enviando anexos da atividade...');
                    const anexosSalvos = await window.motorBackend.anexarArquivosTarefa(savedTask.id, anexos);
                    const anexosResumo = (anexosSalvos || []).map((item) => ({
                        id: item.id || null,
                        nome: item.original_file_name || item.nome || 'Anexo',
                        tipo: item.file_type || item.tipo || 'outro',
                        mime: item.mime_type || item.mime || null,
                        tamanho: item.file_size_bytes || item.tamanho || null,
                        url: item.public_url || item.url || null,
                        caminho: item.storage_path || item.caminho || null
                    }));
                    savedTask.anexosResumo = anexosResumo;
                    savedTask.anexosCount = anexosResumo.length;
                } catch (attachmentError) {
                    console.error('[App] Falha ao enviar anexos:', attachmentError);
                    setTasks(currentTasks => [savedTask, ...currentTasks]);
                    setSyncStatus('Atividade salva; anexo não enviado');
                    showFeedback('error', `Atividade registrada, mas anexo não enviado: ${attachmentError.message || 'falha no upload.'}`);
                    setActiveTab('dashboard');
                    return;
                }
            }

            setTasks(currentTasks => [savedTask, ...currentTasks]);
            setSyncStatus(anexos.length ? 'Tarefa e anexos salvos' : 'Tarefa salva');
            showFeedback('success', anexos.length ? 'Atividade registrada com anexos.' : 'Atividade registrada com sucesso.');
            setActiveTab('dashboard');
        }
        catch (error) {
            console.error('[App] Falha ao salvar tarefa:', error);
            const message = error.message || 'Falha ao registrar atividade.';
            setSyncStatus('Registro não enviado');
            showFeedback('error', `Registro não realizado: ${message}`);
        }
    };
    const completeTaskDetails = async (taskId, complementData) => {
        if (!window.motorBackend || !window.motorBackend.online || !authUser) {
            const message = 'Complemento não realizado: faça login com um usuário autorizado.';
            setSyncStatus('Complemento não enviado');
            setAuthGate({ type: 'complement' });
            showFeedback('error', message);
            throw new Error(message);
        }

        try {
            setIsCompletingTask(true);
            setSyncStatus('Complementando ficha...');
            const updatedTask = await window.motorBackend.completarFichaTarefa(taskId, complementData);
            setTasks(currentTasks => currentTasks.map(task => task.id === taskId ? { ...task, ...updatedTask } : task));
            setSyncStatus('Ficha complementada');
            showFeedback('success', 'Ficha da atividade complementada com sucesso.');
            return updatedTask;
        }
        catch (error) {
            console.error('[App] Falha ao complementar ficha:', error);
            const message = error.message || 'Falha ao complementar ficha da atividade.';
            setSyncStatus('Complemento não enviado');
            showFeedback('error', `Complemento não realizado: ${message}`);
            throw error;
        }
        finally {
            setIsCompletingTask(false);
        }
    };
    const editTaskDetails = async (taskId, editData) => {
        if (!window.motorBackend || !window.motorBackend.online || !authUser) {
            const message = 'Edicao nao realizada: faca login com um usuario autorizado.';
            setSyncStatus('Edicao nao enviada');
            setAuthGate({ type: 'complement' });
            showFeedback('error', message);
            throw new Error(message);
        }

        if (typeof window.motorBackend.editarFichaTarefa !== 'function') {
            const message = 'Edicao de ficha indisponivel na camada de dados.';
            showFeedback('error', message);
            throw new Error(message);
        }

        try {
            setIsEditingTask(true);
            setSyncStatus('Editando ficha...');
            const updatedTask = await window.motorBackend.editarFichaTarefa(taskId, editData);
            setTasks(currentTasks => currentTasks.map(task => task.id === taskId ? { ...task, ...updatedTask } : task));
            setSyncStatus('Ficha editada');
            showFeedback('success', 'Ficha da atividade editada com sucesso.');
            return updatedTask;
        }
        catch (error) {
            console.error('[App] Falha ao editar ficha:', error);
            const message = error.message || 'Falha ao editar ficha da atividade.';
            setSyncStatus('Edicao nao enviada');
            showFeedback('error', `Edicao nao realizada: ${message}`);
            throw error;
        }
        finally {
            setIsEditingTask(false);
        }
    };
    const requestEvaluation = async (taskId, sectorPassword) => {
        const taskToFinish = tasks.find(task => task.id === taskId);
        const sectorName = taskToFinish?.setorExecutor || taskToFinish?.setorSolicitante || '';
        const requiresSectorPassword = !authUser || !canAuthenticatedUserFinalizeTask(taskToFinish);

        if (!sectorName) {
            setSectorPasswordError('Não foi possível identificar o setor responsável pela atividade.');
            return;
        }

        if (requiresSectorPassword && !sectorPassword) {
            setSectorPasswordError('Informe a senha de login do setor executor ou do usuario que inseriu a atividade.');
            return;
        }

        if (!window.motorBackend || !window.motorBackend.online) {
            setSectorPasswordError('Finalização bloqueada: conexão de dados indisponível.');
            setSyncStatus('Finalização exige validação');
            showFeedback('error', 'Finalização não realizada: conexão de dados indisponível.');
            return;
        }

        setIsVerifyingSectorPassword(true);
        setSectorPasswordError('');

        try {
            const conclusaoRealUser = todayDateOnly();
            const updatedTask = await window.motorBackend.solicitarAvaliacao(
                taskId,
                conclusaoRealUser,
                requiresSectorPassword ? { sectorName, password: sectorPassword } : {}
            );

            if (requiresSectorPassword) {
                const session = await window.motorBackend.getSession().catch(() => null);
                if (session) {
                    setAuthUser(session.user);
                    setAuthProfile(session.profile || null);
                    setIsManagerUser(isManagerAccount(session.user, session.profile, session));
                }
            }

            setTasks(currentTasks => currentTasks.map(task => task.id === taskId ? { ...task, ...updatedTask } : task));
            setSyncStatus(requiresSectorPassword ? 'Finalizacao autorizada por senha' : 'Finalizacao enviada por usuario autorizado');
            showFeedback('success', requiresSectorPassword ? 'Senha validada e finalizacao enviada para avaliacao do gestor.' : 'Finalizacao enviada com sucesso para avaliacao do gestor.');
            setSectorPasswordTask(null);
        }
        catch (error) {
            console.error('[App] Falha ao solicitar avaliação:', error);
            if (requiresSectorPassword) {
                const session = await window.motorBackend.getSession().catch(() => null);
                if (session) {
                    setAuthUser(session.user);
                    setAuthProfile(session.profile || null);
                    setIsManagerUser(isManagerAccount(session.user, session.profile, session));
                }
            }
            setSectorPasswordError(error.message || 'Senha de login inválida ou setor não autorizado.');
            setSyncStatus('Finalização recusada');
            showFeedback('error', `Finalização não realizada: ${error.message || 'senha de login inválida ou setor não autorizado.'}`);
        }
        finally {
            setIsVerifyingSectorPassword(false);
        }
    };
    const closeTask = async (taskId, evaluationData) => {
        if (!window.motorBackend || !window.motorBackend.online || !authUser || !isManagerUser) {
            const message = 'Avaliação não realizada: acesse com usuário gestor.';
            setSyncStatus('Avaliação não enviada');
            setAuthGate({ type: 'manager' });
            showFeedback('error', message);
            return;
        }

        try {
            setSyncStatus('Salvando avaliação...');
            const updatedTask = await window.motorBackend.concluirTarefa(taskId, evaluationData);
            setTasks(currentTasks => currentTasks.map(task => task.id === taskId ? { ...task, ...updatedTask } : task));
            setSyncStatus('Avaliação salva');
            showFeedback('success', 'Avaliação registrada com sucesso.');
        }
        catch (error) {
            console.error('[App] Falha ao concluir tarefa:', error);
            const message = error.message || 'Falha ao salvar avaliação.';
            setSyncStatus('Avaliação não enviada');
            showFeedback('error', `Avaliação não realizada: ${message}`);
        }
    };
    const updateDeadline = async (taskId, newDate) => {
        if (!window.motorBackend || !window.motorBackend.online || !authUser || !isManagerUser) {
            const message = 'Prazo não atualizado: acesse com usuário gestor.';
            setSyncStatus('Prazo não enviado');
            setAuthGate({ type: 'manager' });
            showFeedback('error', message);
            return;
        }

        try {
            setSyncStatus('Atualizando prazo...');
            const updatedTask = await window.motorBackend.atualizarPrazo(taskId, newDate);
            setTasks(currentTasks => currentTasks.map(task => task.id === taskId ? { ...task, ...updatedTask } : task));
            setSyncStatus('Prazo atualizado');
            showFeedback('success', 'Prazo atualizado com sucesso.');
        }
        catch (error) {
            console.error('[App] Falha ao atualizar prazo:', error);
            const message = error.message || 'Falha ao atualizar prazo.';
            setSyncStatus('Prazo não enviado');
            showFeedback('error', `Prazo não atualizado: ${message}`);
        }
    };

    if (isAuthChecking) {
        return React.createElement("div", { className: "min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-700 font-sans" },
            React.createElement("div", { className: "bg-white border border-slate-200 rounded-2xl shadow-sm p-6 w-full max-w-md text-center" },
                React.createElement(Activity, { className: "w-8 h-8 mx-auto mb-3 text-[#003865]" }),
                React.createElement("h2", { className: "text-lg font-black text-slate-900" }, "Carregando sistema"),
                React.createElement("p", { className: "text-sm text-slate-500 mt-2 font-medium" }, syncStatus)));
    }

    return (React.createElement("div", { className: "min-h-screen bg-slate-50/50 text-slate-800 font-sans pb-24 selection:bg-blue-200" },
        React.createElement("header", { className: "bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm transition-all" },
            React.createElement("div", { className: "w-full px-3 py-3 md:py-4 sm:px-5 lg:px-8 xl:px-10 flex flex-row items-center justify-between" },
                React.createElement("div", { className: "flex items-center" },
                    React.createElement("img", { src: "https://res.cloudinary.com/dbnyxxhe3/image/upload/v1772102800/02_Prancheta_1_ksm9oj.png", alt: "Logo Mais Hidro Solu\u00E7\u00F5es", className: "h-10 md:h-12 mr-4 md:mr-6 object-contain" }),
                    React.createElement("div", { className: "flex flex-col justify-center" },
                        React.createElement("h1", { className: "text-lg md:text-xl font-extrabold text-[#003865] leading-none tracking-tight mb-1" }, "Controle de Tarefas"),
                        React.createElement("div", { className: "flex items-center text-[10px] md:text-xs font-bold text-slate-500 gap-3 md:gap-4" },
                            React.createElement("span", { className: "flex items-center gap-1 md:gap-1.5" },
                                React.createElement(CalendarDays, { className: "w-3 h-3 md:w-4 md:h-4 text-slate-400" }),
                                " Sem ",
                                weekNumber),
                            React.createElement("span", { className: "flex items-center gap-1 md:gap-1.5" },
                                React.createElement(Calendar, { className: "w-3 h-3 md:w-4 md:h-4 text-slate-400" }),
                                " ",
                                formattedDate)))),
                React.createElement("div", { className: "relative flex items-center gap-2", ref: profileMenuRef },
                    authUser
                        ? React.createElement(React.Fragment, null,
                            React.createElement("button", { type: "button", onClick: () => setIsProfileMenuOpen(current => !current), title: "Menu do usuário", className: "inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-[#003865] shadow-sm hover:bg-blue-50" },
                                React.createElement(User, { className: "w-5 h-5" })),
                            isProfileMenuOpen && React.createElement(UserProfileMenu, {
                                authProfile,
                                isManagerUser,
                                onOpenAnalytics: () => openUserSection('userAnalytics'),
                                onLogout: handleLogout
                            }))
                        : React.createElement("button", { type: "button", onClick: openUserLogin, className: "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#003865] shadow-sm hover:bg-slate-50" },
                            React.createElement(LogIn, { className: "w-4 h-4" }),
                            "Entrar")))),
        React.createElement("main", { className: "w-full px-3 py-4 md:py-7 sm:px-5 lg:px-8 xl:px-10 relative animate-in fade-in duration-500" },
            feedback && React.createElement(FeedbackBanner, { feedback: feedback, onClose: () => setFeedback(null) }),
            activeTab === 'dashboard' && React.createElement(DashboardView, { tasks: tasks, objetivos: objetivos, setores: setores, onCompleteTask: completeTaskDetails, isCompletingTask: isCompletingTask, onEditTask: editTaskDetails, isEditingTask: isEditingTask, onRequestEvaluation: (taskId) => {
                const taskToAuthorize = tasks.find(task => task.id === taskId);
                setSectorPasswordError('');
                if (!taskToAuthorize) return;
                if (authUser && canAuthenticatedUserFinalizeTask(taskToAuthorize)) {
                    requestEvaluation(taskId);
                    return;
                }
                if (authUser) {
                    setSectorPasswordError('Sua sessao atual nao pertence ao setor executor nem ao usuario criador. Informe uma das senhas autorizadas.');
                }
                setSectorPasswordTask(taskToAuthorize);
            } }),
            activeTab === 'insert' && authUser && React.createElement(InsertTaskForm, { onAdd: addTask, objetivos: objetivos, tasks: tasks, setores: setores, authProfile: authProfile }),
            activeTab === 'manager' && authUser && isManagerUser && React.createElement(ManagerPanelView, { tasks: tasks, setores: setores, onCloseTask: closeTask, onUpdateDeadline: updateDeadline, onCompleteTask: completeTaskDetails, isCompletingTask: isCompletingTask }),
            activeTab === 'userAnalytics' && authUser && React.createElement(UserWorkspaceView, { viewType: "analytics", tasks, objetivos, setores, authUser, authProfile, isManagerUser, onCompleteTask: completeTaskDetails, isCompletingTask, onEditTask: editTaskDetails, isEditingTask })),
        authGate && React.createElement(AuthLoginView, {
            key: authGate.type,
            gateType: authGate.type,
            error: authError,
            feedback: null,
            syncStatus,
            onLogin: (email, password) => handleLogin(email, password, authGate.type),
            onClose: () => {
                setAuthGate(null);
                setAuthError('');
            },
            onClearFeedback: () => setFeedback(null)
        }),
        sectorPasswordTask && React.createElement(SectorPasswordModal, {
            task: sectorPasswordTask,
            error: sectorPasswordError,
            isLoading: isVerifyingSectorPassword,
            onClose: () => {
                if (!isVerifyingSectorPassword) {
                    setSectorPasswordTask(null);
                    setSectorPasswordError('');
                }
            },
            onConfirm: (password) => requestEvaluation(sectorPasswordTask.id, password)
        }),
        React.createElement("div", { className: "fixed bottom-6 right-4 md:right-8 lg:right-12 xl:right-16 z-[100] flex flex-col items-end font-sans", ref: fabRef },
            React.createElement("div", { className: `flex flex-col gap-3 mb-4 items-end transition-all duration-300 transform ${isFabOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-10 opacity-0 pointer-events-none'}` },
                React.createElement("button", { onClick: () => openProtectedTab('dashboard'), className: "flex items-center gap-3 hover:scale-105 transition-transform group" },
                    React.createElement("span", { className: `${activeTab === 'dashboard' ? 'bg-[#003865] text-white border-[#003865]' : 'bg-white text-slate-700 border-slate-100'} border text-xs md:text-sm font-semibold px-4 py-2 rounded-xl shadow-lg whitespace-nowrap` }, "Controle de Tarefas (In\u00EDcio)"),
                    React.createElement("div", { className: `w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex items-center justify-center border border-slate-100 transition-colors ${activeTab === 'dashboard' ? 'bg-[#003865] text-white' : 'bg-white text-[#003865]'}` },
                        React.createElement(LayoutDashboard, { className: "w-5 h-5 md:w-6 md:h-6" }))),
                React.createElement("button", { onClick: () => openProtectedTab('insert'), className: "flex items-center gap-3 hover:scale-105 transition-transform group" },
                    React.createElement("span", { className: `${activeTab === 'insert' ? 'bg-[#003865] text-white border-[#003865]' : 'bg-white text-slate-700 border-slate-100'} border text-xs md:text-sm font-semibold px-4 py-2 rounded-xl shadow-lg whitespace-nowrap` }, "Nova Atividade"),
                    React.createElement("div", { className: `w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex items-center justify-center border border-slate-100 transition-colors ${activeTab === 'insert' ? 'bg-[#003865] text-white' : 'bg-white text-[#003865]'}` },
                        React.createElement(PlusCircle, { className: "w-5 h-5 md:w-6 md:h-6" }))),
                React.createElement("button", { onClick: () => openProtectedTab('manager'), className: "flex items-center gap-3 hover:scale-105 transition-transform group" },
                    React.createElement("span", { className: `${activeTab === 'manager' ? 'bg-[#003865] text-white border-[#003865]' : 'bg-white text-slate-700 border-slate-100'} border text-xs md:text-sm font-semibold px-4 py-2 rounded-xl shadow-lg whitespace-nowrap` }, "Painel do Gestor"),
                    React.createElement("div", { className: `w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex items-center justify-center border border-slate-100 transition-colors ${activeTab === 'manager' ? 'bg-[#003865] text-white' : 'bg-white text-[#003865]'}` },
                        React.createElement(UserCog, { className: "w-5 h-5 md:w-6 md:h-6" })))),
            React.createElement("button", { onClick: handleFabClick, className: `w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border outline-none hover:scale-105 active:scale-95 ${isFabOpen
                    ? 'bg-rose-500 text-white border-rose-500 opacity-100 rotate-90'
                    : 'bg-white text-[#003865] border-slate-200 opacity-90 hover:opacity-100 focus:opacity-100'}`, title: "1 clique para Menu | 2 cliques para In\u00EDcio" }, isFabOpen ? React.createElement(X, { className: "w-7 h-7 md:w-8 md:h-8 transition-transform duration-300" }) : React.createElement(Plus, { className: "w-7 h-7 md:w-8 md:h-8 transition-transform duration-300" })))));
}
// --- SUB-COMPONENTES ---

function UserProfileMenu({ authProfile, isManagerUser, onOpenAnalytics, onLogout }) {
    const sectorName = getProfileSectorName(authProfile);
    const profileName = authProfile?.full_name || authProfile?.email || 'Usuário';

    const menuItemClass = "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-slate-50";

    return React.createElement("div", { className: "absolute right-0 top-12 z-[220] w-[min(88vw,320px)] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl" },
        React.createElement("div", { className: "border-b border-slate-100 px-3 py-3" },
            React.createElement("p", { className: "text-sm font-black text-slate-900 truncate" }, profileName),
            React.createElement("p", { className: "mt-1 text-[11px] font-bold uppercase tracking-widest text-slate-400 truncate" },
                isManagerUser ? "Gestor" : (sectorName || "Usuário comum"))),
        React.createElement("div", { className: "py-2 space-y-1" },
            React.createElement("button", { type: "button", onClick: onOpenAnalytics, className: menuItemClass },
                React.createElement(BarChart3, { className: "w-4 h-4 text-[#003865]" }),
                "Análise do usuário")),
        React.createElement("div", { className: "border-t border-slate-100 pt-2" },
            React.createElement("button", { type: "button", onClick: onLogout, className: "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-black text-rose-600 hover:bg-rose-50" },
                React.createElement(LogOut, { className: "w-4 h-4" }),
                "Sair")));
}

function FeedbackBanner({ feedback, onClose }) {
    if (!feedback) return null;
    const isSuccess = feedback.type === 'success';
    return React.createElement("div", { className: `${isSuccess ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'} mb-5 rounded-2xl border px-4 py-3 flex items-start justify-between gap-3 shadow-sm` },
        React.createElement("div", { className: "flex items-start gap-2 font-bold text-sm" },
            isSuccess ? React.createElement(CheckCircle, { className: "w-5 h-5 mt-0.5 shrink-0" }) : React.createElement(AlertTriangle, { className: "w-5 h-5 mt-0.5 shrink-0" }),
            React.createElement("span", null, feedback.message)),
        React.createElement("button", { type: "button", onClick: onClose, className: "shrink-0 rounded-full p-1 hover:bg-white/60", title: "Fechar mensagem" },
            React.createElement(X, { className: "w-4 h-4" })));
}

function AuthLoginView({ gateType, error, feedback, syncStatus, onLogin, onClose, onClearFeedback }) {
    const isManagerGate = gateType === 'manager';
    const isComplementGate = gateType === 'complement';
    const [email, setEmail] = useState(isManagerGate ? (appCore.AUTH_USER_EMAIL || '') : '');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const submit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await onLogin(email, password);
        }
        finally {
            setIsLoading(false);
        }
    };

    return React.createElement("div", { className: "fixed inset-0 z-[210] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4" },
        React.createElement("div", { className: "w-full max-w-md" },
            React.createElement("div", { className: "mb-5 flex flex-col items-center text-center" },
                React.createElement("img", { src: "https://res.cloudinary.com/dbnyxxhe3/image/upload/v1772102800/02_Prancheta_1_ksm9oj.png", alt: "Logo Mais Hidro Soluções", className: "h-14 object-contain mb-4" }),
                React.createElement("h1", { className: "text-2xl font-black text-[#003865]" }, "Controle de Tarefas"),
                React.createElement("p", { className: "text-xs font-bold uppercase tracking-widest text-slate-400 mt-2" }, syncStatus)),
            feedback && React.createElement(FeedbackBanner, { feedback: feedback, onClose: onClearFeedback }),
            React.createElement("form", { onSubmit: submit, className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 space-y-4" },
                React.createElement("div", { className: "flex items-center gap-3 pb-3 border-b border-slate-100" },
                    React.createElement("div", { className: "w-11 h-11 rounded-2xl bg-[#003865] text-white flex items-center justify-center" },
                        React.createElement(Lock, { className: "w-5 h-5" })),
                    React.createElement("div", null,
                        React.createElement("h2", { className: "text-lg font-black text-slate-900" }, isManagerGate ? "Acesso do Gestor" : isComplementGate ? "Acesso para Complementar" : "Acesso do Setor"),
                        React.createElement("p", { className: "text-sm font-medium text-slate-500" }, isManagerGate ? "Entre com o usuário gestor autorizado." : isComplementGate ? "Entre com gestor ou usuario de setor participante." : "Entre com o usuário vinculado ao setor."))),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-xs font-black uppercase tracking-widest text-slate-500 mb-2" }, "E-mail"),
                    React.createElement("input", { type: "email", value: email, onChange: e => setEmail(e.target.value), disabled: isLoading, required: true, className: "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#003865]", autoComplete: "username" })),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-xs font-black uppercase tracking-widest text-slate-500 mb-2" }, "Senha"),
                    React.createElement("input", { type: "password", value: password, onChange: e => setPassword(e.target.value), disabled: isLoading, required: true, className: "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#003865]", autoComplete: "current-password" })),
                error && React.createElement("div", { className: "rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 flex items-start gap-2" },
                    React.createElement(AlertTriangle, { className: "w-4 h-4 mt-0.5 shrink-0" }),
                    React.createElement("span", null, error)),
                React.createElement("div", { className: "flex flex-col-reverse sm:flex-row gap-3 pt-2" },
                    React.createElement("button", { type: "button", onClick: onClose, disabled: isLoading, className: "w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 text-slate-600 font-black text-sm hover:bg-slate-200 disabled:opacity-60" }, "Cancelar"),
                    React.createElement("button", { type: "submit", disabled: isLoading || !email.trim() || !password.trim(), className: "flex-1 px-5 py-3 rounded-xl bg-[#003865] text-white font-black text-sm hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg" }, isLoading ? "Autenticando..." : "Entrar")))));
}

function SectorPasswordModal({ task, error, isLoading, onClose, onConfirm }) {
    const [password, setPassword] = useState('');
    const setor = task?.setorExecutor || task?.setorSolicitante || 'Setor responsável';

    const submit = (e) => {
        e.preventDefault();
        onConfirm(password);
    };

    return React.createElement("div", { className: "fixed inset-0 z-[200] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4" },
        React.createElement("div", { className: "bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden" },
            React.createElement("div", { className: "p-5 md:p-6 border-b border-slate-100 bg-slate-50" },
                React.createElement("div", { className: "flex items-start gap-3" },
                    React.createElement("div", { className: "w-11 h-11 rounded-2xl bg-[#003865] text-white flex items-center justify-center shrink-0" },
                        React.createElement(Lock, { className: "w-5 h-5" })),
                    React.createElement("div", null,
                        React.createElement("h3", { className: "text-lg font-black text-slate-900" }, "Autorizacao de Baixa"),
                        React.createElement("p", { className: "text-sm text-slate-500 font-medium mt-1" },
                            "Use a senha de login do setor executor ",
                            React.createElement("strong", { className: "text-[#003865]" }, setor),
                            " ou do usuario que inseriu esta atividade.")))),
            React.createElement("form", { onSubmit: submit, className: "p-5 md:p-6 space-y-4" },
                React.createElement("div", { className: "rounded-2xl border border-slate-200 bg-slate-50 p-3" },
                    React.createElement("span", { className: "block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1" }, "Atividade"),
                    React.createElement("p", { className: "text-sm font-bold text-slate-700 leading-snug line-clamp-3" }, task?.descricao || "Sem descrição.")),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-xs font-black uppercase tracking-widest text-slate-500 mb-2" }, "Senha autorizada"),
                    React.createElement("input", {
                        type: "password",
                        value: password,
                        autoFocus: true,
                        disabled: isLoading,
                        onChange: e => setPassword(e.target.value),
                        className: "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#003865]",
                        autoComplete: "current-password",
                        placeholder: "Digite a senha de login"
                    })),
                error && React.createElement("div", { className: "rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 flex items-start gap-2" },
                    React.createElement(AlertTriangle, { className: "w-4 h-4 mt-0.5 shrink-0" }),
                    React.createElement("span", null, error)),
                React.createElement("div", { className: "flex flex-col-reverse sm:flex-row gap-3 pt-2" },
                    React.createElement("button", { type: "button", onClick: onClose, disabled: isLoading, className: "w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 text-slate-600 font-black text-sm hover:bg-slate-200 disabled:opacity-60" }, "Cancelar"),
                    React.createElement("button", { type: "submit", disabled: isLoading || !password.trim(), className: "flex-1 px-5 py-3 rounded-xl bg-[#003865] text-white font-black text-sm hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg" },
                        isLoading ? "Autenticando..." : "Autorizar Baixa")))));
}

function ToggleSwitch({ label, checked, onChange, icon }) {
    return (React.createElement("div", { className: "flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:bg-slate-50 transition-colors cursor-pointer", onClick: () => onChange(!checked) },
        React.createElement("div", { className: "flex items-center space-x-3 pr-4" },
            icon && React.createElement("div", { className: "text-slate-400 bg-slate-100 p-2 rounded-lg" }, icon),
            React.createElement("span", { className: "text-xs md:text-sm font-semibold text-slate-700 leading-tight" }, label)),
        React.createElement("button", { type: "button", className: `relative inline-flex h-6 md:h-7 w-11 md:w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#003865]' : 'bg-slate-200'}` },
            React.createElement("span", { className: `pointer-events-none inline-block h-5 md:h-6 w-5 md:w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5 md:translate-x-5' : 'translate-x-0'}` }))));
}
// ABA 1: Formulário de Nova Atividade (Layout Otimizado)
function InsertTaskForm({ onAdd, objetivos, tasks, setores = SETORES, authProfile = null }) {
    const linkedSector = (() => {
        const sectorName = getProfileSectorName(authProfile);
        return sectorName ? (appCore.resolveSectorName ? appCore.resolveSectorName(sectorName) : sectorName) : '';
    })();
    const baseSetores = (Array.isArray(setores) && setores.length) ? setores : SETORES;
    const availableSetores = appCore.uniqueNormalized
        ? appCore.uniqueNormalized([...baseSetores, linkedSector].filter(Boolean), (item) => appCore.resolveSectorName ? appCore.resolveSectorName(item) : item)
        : [...new Set([...baseSetores, linkedSector].filter(Boolean))];
    const firstSector = linkedSector || availableSetores[0] || SETORES[0];
    const isSolicitanteLocked = Boolean(linkedSector);
    const [isNewObjetivo, setIsNewObjetivo] = useState(false);
    const [hasObjetivo, setHasObjetivo] = useState(false);
    const [hasDependencia, setHasDependencia] = useState(false);
    const [anexos, setAnexos] = useState([]);
    const [attachmentError, setAttachmentError] = useState('');
    const [formData, setFormData] = useState({
        setorSolicitante: firstSector,
        setorExecutor: firstSector,
        dataAbertura: todayDateOnly(),
        conclusaoPrevista: '',
        complexidade: COMPLEXIDADES[0],
        descricao: '',
        objetivo: objetivos[0] || '',
        clienteFornecedor: '',
        deslocamento: false,
        local: '',
        duracaoDeslocamento: '',
        unidadeDeslocamento: 'Horas',
        geraCusto: false,
        tipoCusto: '',
        valorCusto: '',
        dependencia: ''
    });
    useEffect(() => {
        setFormData((current) => {
            const nextSolicitante = isSolicitanteLocked ? linkedSector : (availableSetores.includes(current.setorSolicitante) ? current.setorSolicitante : firstSector);
            const nextExecutor = availableSetores.includes(current.setorExecutor) ? current.setorExecutor : firstSector;

            if (nextSolicitante === current.setorSolicitante && nextExecutor === current.setorExecutor) {
                return current;
            }

            return {
                ...current,
                setorSolicitante: nextSolicitante,
                setorExecutor: nextExecutor
            };
        });
    }, [setores, linkedSector, isSolicitanteLocked]);
    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };
    const handleToggle = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };
    const handleAttachmentChange = (event) => {
        const files = Array.from(event.target.files || []);
        setAttachmentError('');

        if (files.length > ATTACHMENT_CONFIG.maxFiles) {
            setAttachmentError(`Selecione no máximo ${ATTACHMENT_CONFIG.maxFiles} anexos.`);
            event.target.value = '';
            return;
        }

        const invalid = files.map(validateAttachmentFile).find((result) => !result.valid);
        if (invalid) {
            setAttachmentError(invalid.message);
            event.target.value = '';
            return;
        }

        setAnexos(files);
    };
    const removeAttachment = (indexToRemove) => {
        setAnexos(current => current.filter((_, index) => index !== indexToRemove));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...formData,
            objetivo: hasObjetivo ? formData.objetivo : '',
            anexos
        });
    };
    const inputClass = "mt-1 block w-full rounded-lg border-slate-300 bg-white py-3 px-4 text-sm text-slate-900 shadow-sm focus:border-[#003865] focus:outline-none focus:ring-1 focus:ring-[#003865] transition-colors border";
    const labelClass = "block text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";
    return (React.createElement("div", { className: "w-full" },
        React.createElement("div", { className: "mb-6 md:mb-8 text-center md:text-left" },
            React.createElement("h2", { className: "text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight" }, "Cadastrar Nova Atividade"),
            React.createElement("p", { className: "text-slate-500 text-sm mt-2" }, "Preencha os detalhes abaixo para registrar uma nova demanda no quadro geral.")),
        React.createElement("form", { onSubmit: handleSubmit, className: "space-y-6 md:space-y-8" },
            React.createElement("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow" },
                React.createElement("div", { className: "bg-slate-50/80 border-b border-slate-200 px-5 md:px-8 py-4 flex items-center" },
                    React.createElement(Settings2, { className: "w-5 h-5 text-[#003865] mr-3" }),
                    React.createElement("h3", { className: "text-sm md:text-base font-bold text-slate-800" }, "Atribui\u00E7\u00E3o e Prazos")),
                React.createElement("div", { className: "p-5 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6" },
                    React.createElement("div", null,
                        React.createElement("label", { className: labelClass }, "Setor Solicitante"),
                        React.createElement("select", { name: "setorSolicitante", value: formData.setorSolicitante, onChange: handleChange, disabled: isSolicitanteLocked, title: isSolicitanteLocked ? "Setor vinculado ao usu\u00E1rio logado" : undefined, className: isSolicitanteLocked ? `${inputClass} bg-slate-100 text-slate-500 cursor-not-allowed` : inputClass }, availableSetores.map(s => React.createElement("option", { key: s, value: s }, s))),
                        isSolicitanteLocked && React.createElement("p", { className: "mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400" }, "Vinculado ao usu\u00E1rio logado")),
                    React.createElement("div", null,
                        React.createElement("label", { className: labelClass }, "Setor Executor"),
                        React.createElement("select", { name: "setorExecutor", value: formData.setorExecutor, onChange: handleChange, className: inputClass }, availableSetores.map(s => React.createElement("option", { key: s, value: s }, s)))),
                    React.createElement("div", null,
                        React.createElement("label", { className: labelClass }, "Complexidade"),
                        React.createElement("select", { name: "complexidade", value: formData.complexidade, onChange: handleChange, className: inputClass }, COMPLEXIDADES.map(c => React.createElement("option", { key: c, value: c }, c)))),
                    React.createElement("div", { className: "lg:col-span-1 md:col-span-2 grid grid-cols-2 gap-4 lg:col-start-1 lg:col-end-4" },
                        React.createElement("div", null,
                            React.createElement("label", { className: labelClass }, "Data de Abertura"),
                            React.createElement("input", { type: "date", name: "dataAbertura", value: formData.dataAbertura, onChange: handleChange, required: true, className: inputClass })),
                        React.createElement("div", null,
                            React.createElement("label", { className: labelClass }, "Conclus\u00E3o Prevista"),
                            React.createElement("input", { type: "date", name: "conclusaoPrevista", value: formData.conclusaoPrevista, onChange: handleChange, required: true, className: `${inputClass} border-blue-200 bg-blue-50/50` }))))),
            React.createElement("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow" },
                React.createElement("div", { className: "bg-slate-50/80 border-b border-slate-200 px-5 md:px-8 py-4 flex items-center" },
                    React.createElement(FileText, { className: "w-5 h-5 text-[#003865] mr-3" }),
                    React.createElement("h3", { className: "text-sm md:text-base font-bold text-slate-800" }, "Escopo da Atividade")),
                React.createElement("div", { className: "p-5 md:p-8 space-y-6" },
                    React.createElement("div", null,
                        React.createElement("label", { className: labelClass }, "Descri\u00E7\u00E3o Detalhada"),
                        React.createElement("textarea", { name: "descricao", value: formData.descricao, onChange: handleChange, required: true, rows: 4, className: inputClass, placeholder: "Descreva claramente o que precisa ser entregue..." })),
                    React.createElement("div", { className: "pt-4 border-t border-slate-100" },
                        React.createElement(ToggleSwitch, { label: "Esta atividade possui uma Depend\u00EAncia (Pr\u00E9-requisito)?", checked: hasDependencia, onChange: (val) => {
                                setHasDependencia(val);
                                if (!val)
                                    setFormData({ ...formData, dependencia: '' }); // Limpa se desmarcar
                            }, icon: React.createElement(Lock, { className: "w-5 h-5" }) }),
                        hasDependencia && (React.createElement("div", { className: "mt-4 bg-amber-50/80 border border-amber-200 rounded-xl p-5 md:p-6 animate-in fade-in slide-in-from-top-2" },
                            React.createElement("label", { className: "block text-[11px] md:text-xs font-bold text-amber-800 uppercase tracking-wider mb-3" }, "Qual atividade de qual setor deve ser conclu\u00EDda primeiro?"),
                            React.createElement("select", { name: "dependencia", value: formData.dependencia, onChange: handleChange, required: hasDependencia, className: "block w-full rounded-lg border-amber-300 bg-white py-3 px-4 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500" },
                                React.createElement("option", { value: "", disabled: true }, "Selecione a atividade bloqueadora..."),
                                tasks.filter(t => t.status !== STATUS.CONCLUIDA).length === 0 && (React.createElement("option", { value: "", disabled: true }, "N\u00E3o h\u00E1 atividades pendentes em andamento.")),
                                tasks.filter(t => t.status !== STATUS.CONCLUIDA).map(t => (React.createElement("option", { key: t.id, value: t.id },
                                    "[",
                                    t.setorExecutor,
                                    "] - ",
                                    t.descricao.length > 80 ? t.descricao.substring(0, 80) + '...' : t.descricao)))),
                            React.createElement("div", { className: "flex items-start mt-3 text-amber-700 bg-white/50 p-3 rounded-lg border border-amber-100/50" },
                                React.createElement(Lock, { className: "w-4 h-4 mr-2 mt-0.5 flex-shrink-0" }),
                                React.createElement("p", { className: "text-[11px] md:text-xs font-medium leading-relaxed" },
                                    "A sua atividade ficar\u00E1 ",
                                    React.createElement("strong", null, "bloqueada"),
                                    " no quadro at\u00E9 que o gestor d\u00EA a baixa final na atividade selecionada acima."))))))),
            React.createElement("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow" },
                React.createElement("div", { className: "bg-slate-50/80 border-b border-slate-200 px-5 md:px-8 py-4 flex items-center" },
                    React.createElement(Target, { className: "w-5 h-5 text-[#003865] mr-3" }),
                    React.createElement("h3", { className: "text-sm md:text-base font-bold text-slate-800" }, "Contexto e Recursos")),
                React.createElement("div", { className: "p-5 md:p-8 space-y-6 md:space-y-8" },
                    React.createElement("div", { className: "bg-[#003865]/5 border border-[#003865]/10 rounded-xl p-5 md:p-6 transition-all hover:bg-[#003865]/10" },
                        React.createElement("div", { className: "flex items-center justify-between cursor-pointer", onClick: () => setHasObjetivo(!hasObjetivo) },
                            React.createElement("div", { className: "pr-4" },
                                React.createElement("h4", { className: "text-sm md:text-base font-bold text-[#003865]" }, "V\u00EDnculo com Objetivo Macro"),
                                React.createElement("p", { className: "text-xs md:text-sm text-slate-600 mt-1" }, "Esta atividade faz parte de um grande objetivo ou entrega final?")),
                            React.createElement("button", { type: "button", className: `relative inline-flex h-6 md:h-7 w-11 md:w-12 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${hasObjetivo ? 'bg-[#003865]' : 'bg-slate-300'}` },
                                React.createElement("span", { className: `pointer-events-none inline-block h-5 md:h-6 w-5 md:w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${hasObjetivo ? 'translate-x-5 md:translate-x-5' : 'translate-x-0'}` }))),
                        hasObjetivo && (React.createElement("div", { className: "mt-5 pt-5 border-t border-[#003865]/10 animate-in fade-in slide-in-from-top-2 duration-300" },
                            React.createElement("label", { className: labelClass }, "Selecione ou Crie o Objetivo"),
                            React.createElement("select", { className: inputClass, value: isNewObjetivo ? 'NEW' : formData.objetivo, onChange: (e) => {
                                    if (e.target.value === 'NEW') {
                                        setIsNewObjetivo(true);
                                        setFormData({ ...formData, objetivo: '' });
                                    }
                                    else {
                                        setIsNewObjetivo(false);
                                        setFormData({ ...formData, objetivo: e.target.value });
                                    }
                                } },
                                objetivos.map(obj => React.createElement("option", { key: obj, value: obj }, obj)),
                                React.createElement("option", { value: "NEW", className: "font-bold text-[#003865]" }, "+ Criar Novo Objetivo Macro...")),
                            isNewObjetivo && (React.createElement("div", { className: "mt-4" },
                                React.createElement("label", { className: labelClass }, "Nome do Novo Objetivo"),
                                React.createElement("input", { type: "text", name: "objetivo", value: formData.objetivo, onChange: handleChange, placeholder: "Ex: Implanta\u00E7\u00E3o do Sistema ERP", required: true, className: inputClass })))))),
                    React.createElement("div", null,
                        React.createElement("label", { className: labelClass }, "Cliente ou Fornecedor Envolvido"),
                        React.createElement("input", { type: "text", name: "clienteFornecedor", value: formData.clienteFornecedor, onChange: handleChange, className: inputClass, placeholder: "Nome do cliente ou fornecedor (Opcional)" })),
                    React.createElement("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5" },
                        React.createElement("div", { className: "flex items-start gap-3" },
                            React.createElement("div", { className: "rounded-lg bg-white border border-slate-200 p-2 text-[#003865]" },
                                React.createElement(Paperclip, { className: "w-5 h-5" })),
                            React.createElement("div", { className: "flex-1 min-w-0" },
                                React.createElement("label", { className: labelClass }, "Anexos da Atividade"),
                                React.createElement("input", {
                                    type: "file",
                                    multiple: true,
                                    accept: "image/jpeg,image/png,image/webp,image/gif,application/pdf",
                                    onChange: handleAttachmentChange,
                                    className: "block w-full text-xs md:text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#003865] file:px-4 file:py-2 file:text-xs file:font-black file:text-white hover:file:bg-blue-800"
                                }),
                                React.createElement("p", { className: "mt-2 text-[11px] md:text-xs font-medium text-slate-500" },
                                    "Imagens ou PDF, até ",
                                    ATTACHMENT_CONFIG.maxFiles,
                                    " arquivos de 10 MB cada."))),
                        attachmentError && React.createElement("div", { className: "mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700" }, attachmentError),
                        anexos.length > 0 && React.createElement("div", { className: "mt-4 space-y-2" }, anexos.map((file, index) => React.createElement("div", { key: `${file.name}-${index}`, className: "flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600" },
                            React.createElement("span", { className: "min-w-0 truncate" }, file.name),
                            React.createElement("div", { className: "flex items-center gap-2 shrink-0" },
                                React.createElement("span", { className: "text-slate-400" }, formatFileSize(file.size)),
                                React.createElement("button", { type: "button", onClick: () => removeAttachment(index), className: "rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-600", title: "Remover anexo" },
                                    React.createElement(X, { className: "w-4 h-4" }))))))),
                    React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pt-2" },
                        React.createElement("div", { className: "space-y-4" },
                            React.createElement(ToggleSwitch, { label: "Haver\u00E1 Deslocamento?", checked: formData.deslocamento, onChange: (val) => handleToggle('deslocamento', val), icon: React.createElement(Truck, { className: "w-5 h-5 md:w-6 md:h-6" }) }),
                            formData.deslocamento && (React.createElement("div", { className: "pl-4 md:pl-5 border-l-4 border-indigo-500 animate-in fade-in slide-in-from-top-2 space-y-4 py-2" },
                                React.createElement("div", null,
                                    React.createElement("label", { className: labelClass }, "Local onde devo comparecer"),
                                    React.createElement("input", { type: "text", name: "local", value: formData.local, onChange: handleChange, className: inputClass, placeholder: "Endere\u00E7o, Cidade ou Empresa" })),
                                React.createElement("div", null,
                                    React.createElement("label", { className: labelClass }, "Tempo Estimado de Deslocamento"),
                                    React.createElement("div", { className: "flex gap-2" },
                                        React.createElement("input", { type: "number", min: "0", name: "duracaoDeslocamento", value: formData.duracaoDeslocamento, onChange: handleChange, className: inputClass, placeholder: "Ex: 2" }),
                                        React.createElement("select", { name: "unidadeDeslocamento", value: formData.unidadeDeslocamento, onChange: handleChange, className: `${inputClass} w-1/3 md:w-1/4` },
                                            React.createElement("option", { value: "Horas" }, "Horas"),
                                            React.createElement("option", { value: "Dias" }, "Dias"))))))),
                        React.createElement("div", { className: "space-y-4" },
                            React.createElement(ToggleSwitch, { label: "Esta atividade gera custo?", checked: formData.geraCusto, onChange: (val) => handleToggle('geraCusto', val), icon: React.createElement(DollarSign, { className: "w-5 h-5 md:w-6 md:h-6" }) }),
                            formData.geraCusto && (React.createElement("div", { className: "pl-4 md:pl-5 border-l-4 border-orange-500 animate-in fade-in slide-in-from-top-2 space-y-4 py-2" },
                                React.createElement("div", null,
                                    React.createElement("label", { className: labelClass }, "Descri\u00E7\u00E3o do Custo"),
                                    React.createElement("input", { type: "text", name: "tipoCusto", value: formData.tipoCusto, onChange: handleChange, className: inputClass, placeholder: "Ex: Compra de material, Passagem, etc." })),
                                React.createElement("div", null,
                                    React.createElement("label", { className: labelClass }, "Valor Estimado (R$)"),
                                    React.createElement("input", { type: "number", step: "0.01", name: "valorCusto", value: formData.valorCusto, onChange: handleChange, className: inputClass, placeholder: "0.00" })))))))),
            React.createElement("div", { className: "mt-8 mb-4 flex items-center justify-between bg-slate-900 rounded-2xl p-4 md:p-6 shadow-xl border border-slate-800 sticky bottom-6 z-30 transition-transform" },
                React.createElement("p", { className: "text-slate-300 text-sm hidden md:block ml-2" }, "Revise todas as informa\u00E7\u00F5es com aten\u00E7\u00E3o antes de confirmar."),
                React.createElement("button", { type: "submit", className: "w-full md:w-auto bg-[#003865] hover:bg-blue-800 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 text-sm md:text-base" },
                    React.createElement(PlusCircle, { className: "w-5 h-5 mr-2 md:mr-3" }),
                    " Registrar Atividade no Quadro")))));
}
// Sub-componente para os Cards de Resumo (Otimizado)
function SummaryCard({ title, value, icon, colorClass }) {
    return (React.createElement("div", { className: "bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4 hover:shadow-md transition-shadow" },
        React.createElement("div", { className: `p-3.5 rounded-xl ${colorClass}` }, icon),
        React.createElement("div", { className: "flex-1" },
            React.createElement("p", { className: "text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, title),
            React.createElement("p", { className: "text-2xl md:text-3xl font-extrabold text-slate-800" }, value))));
}

function UserWorkspaceView({ viewType, tasks, objetivos = INITIAL_OBJETIVOS, setores = SETORES, authUser, authProfile, isManagerUser, onCompleteTask, isCompletingTask, onEditTask, isEditingTask }) {
    const [selectedTask, setSelectedTask] = useState(null);
    const today = todayDateOnly();
    const profileName = authProfile?.full_name || authProfile?.email || authUser?.email || 'Usuário';
    const currentUserId = String(authUser?.id || authProfile?.id || '').trim();
    const userEmail = String(authUser?.email || authProfile?.email || '').trim().toLowerCase();
    const getTaskCreatorEmail = (task) => String(
        task?.criadoPorEmail
        || task?.raw?.metadata?.criadoPorEmail
        || ''
    ).trim().toLowerCase();
    const isTaskInsertedByCurrentUser = (task) => {
        const taskCreatorId = getTaskCreatorId(task);
        if (currentUserId && taskCreatorId && currentUserId === taskCreatorId) return true;

        const creatorEmail = getTaskCreatorEmail(task);
        return Boolean(userEmail && creatorEmail && userEmail === creatorEmail);
    };
    const visibleTasks = (currentUserId || userEmail)
        ? tasks.filter(isTaskInsertedByCurrentUser)
        : [];

    const pendingTasks = visibleTasks.filter(task => task.status === STATUS.PENDENTE);
    const reviewTasks = visibleTasks.filter(task => task.status === STATUS.AGUARDANDO_AVALIACAO);
    const doneTasks = visibleTasks.filter(task => task.status === STATUS.CONCLUIDA);
    const overdueTasks = pendingTasks.filter(task => getTaskScheduleState(task, today).isOverdue);
    const futureTasks = pendingTasks.filter(task => !getTaskScheduleState(task, today).isOverdue);
    const onTimeDone = doneTasks.filter(task => getTaskScheduleState(task, today).isOnTimeOriginal).length;
    const totalCost = visibleTasks.reduce((sum, task) => sum + (task.geraCusto ? parseMoneyValue(task.valorCusto) : 0), 0);
    const attachmentCount = visibleTasks.reduce((sum, task) => sum + Number(task.anexosCount || (Array.isArray(task.anexosResumo) ? task.anexosResumo.length : 0)), 0);
    const onTimeRate = doneTasks.length ? Math.round((onTimeDone / doneTasks.length) * 100) : 0;

    const copy = {
        title: 'Análise do Usuário',
        subtitle: 'Somente atividades inseridas por este usuário.'
    };

    const sortBySchedule = (a, b) => {
        const scheduleA = getTaskScheduleState(a, today);
        const scheduleB = getTaskScheduleState(b, today);
        if (scheduleA.isOverdue !== scheduleB.isOverdue) return scheduleA.isOverdue ? -1 : 1;
        return daysBetweenDateOnly(today, scheduleA.currentDueDate) - daysBetweenDateOnly(today, scheduleB.currentDueDate);
    };

    const renderTaskList = (title, list, emptyText) => React.createElement("section", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5" },
        React.createElement("div", { className: "mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3" },
            React.createElement("h3", { className: "text-sm md:text-base font-black text-slate-800" }, title),
            React.createElement("span", { className: "rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600" }, list.length)),
        list.length
            ? React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3 md:gap-4" }, list.map(task => React.createElement(TaskCard, {
                key: task.id,
                task,
                onOpen: () => setSelectedTask(task),
                compact: true,
                isReview: task.status === STATUS.AGUARDANDO_AVALIACAO,
                isDone: task.status === STATUS.CONCLUIDA
            })))
            : React.createElement("p", { className: "py-6 text-center text-sm font-bold text-slate-400" }, emptyText));

    const renderAnalytics = () => React.createElement("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-5" },
        React.createElement("section", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-5 xl:col-span-2" },
            React.createElement("h3", { className: "text-base font-black text-slate-900 mb-4 flex items-center" },
                React.createElement(BarChart3, { className: "w-5 h-5 mr-2 text-[#003865]" }),
                "Resumo operacional"),
            React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 text-center" },
                React.createElement("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-3" },
                    React.createElement("strong", { className: "block text-xl font-black text-slate-900" }, pendingTasks.length),
                    React.createElement("span", { className: "text-[10px] uppercase font-black text-slate-400" }, "Em aberto")),
                React.createElement("div", { className: "rounded-xl border border-amber-200 bg-amber-50 p-3" },
                    React.createElement("strong", { className: "block text-xl font-black text-amber-700" }, reviewTasks.length),
                    React.createElement("span", { className: "text-[10px] uppercase font-black text-amber-600" }, "Aguardando")),
                React.createElement("div", { className: "rounded-xl border border-rose-200 bg-rose-50 p-3" },
                    React.createElement("strong", { className: "block text-xl font-black text-rose-700" }, overdueTasks.length),
                    React.createElement("span", { className: "text-[10px] uppercase font-black text-rose-600" }, "Atrasadas")),
                React.createElement("div", { className: "rounded-xl border border-emerald-200 bg-emerald-50 p-3" },
                    React.createElement("strong", { className: "block text-xl font-black text-emerald-700" }, `${onTimeRate}%`),
                    React.createElement("span", { className: "text-[10px] uppercase font-black text-emerald-600" }, "No prazo")))),
        React.createElement("section", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-5" },
            React.createElement("h3", { className: "text-base font-black text-slate-900 mb-4 flex items-center" },
                React.createElement(DollarSign, { className: "w-5 h-5 mr-2 text-orange-600" }),
                "Custo e evidências"),
            React.createElement("div", { className: "space-y-3" },
                React.createElement("div", { className: "rounded-xl bg-orange-50 border border-orange-100 p-4" },
                    React.createElement("span", { className: "block text-[10px] uppercase font-black text-orange-600" }, "Custo previsto"),
                    React.createElement("strong", { className: "text-xl font-black text-orange-700" }, moneyBR(totalCost))),
                React.createElement("div", { className: "rounded-xl bg-slate-50 border border-slate-200 p-4" },
                    React.createElement("span", { className: "block text-[10px] uppercase font-black text-slate-400" }, "Anexos"),
                    React.createElement("strong", { className: "text-xl font-black text-slate-800" }, attachmentCount)))));

    return React.createElement("div", { className: "w-full flex flex-col space-y-5 md:space-y-6" },
        React.createElement("div", { className: "flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3" },
            React.createElement("div", null,
                React.createElement("h2", { className: "text-2xl md:text-3xl font-black text-slate-900 tracking-tight" }, copy.title),
                React.createElement("p", { className: "mt-2 text-sm md:text-base font-medium text-slate-500" }, copy.subtitle)),
            React.createElement("span", { className: "w-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#003865]" }, profileName)),
        React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4" },
            React.createElement(SummaryCard, { title: "Total", value: visibleTasks.length, icon: React.createElement(Activity, { className: "w-6 h-6 text-blue-600" }), colorClass: "bg-blue-50 border border-blue-100" }),
            React.createElement(SummaryCard, { title: "Realizadas", value: doneTasks.length, icon: React.createElement(CheckCircle, { className: "w-6 h-6 text-emerald-600" }), colorClass: "bg-emerald-50 border border-emerald-100" }),
            React.createElement(SummaryCard, { title: "Atrasadas", value: overdueTasks.length, icon: React.createElement(AlertTriangle, { className: "w-6 h-6 text-rose-600" }), colorClass: "bg-rose-50 border border-rose-100" }),
            React.createElement(SummaryCard, { title: "Custo", value: moneyBR(totalCost), icon: React.createElement(DollarSign, { className: "w-6 h-6 text-orange-600" }), colorClass: "bg-orange-50 border border-orange-100" })),
        renderAnalytics(),
        renderTaskList("Está sendo realizado", [...overdueTasks, ...reviewTasks].sort(sortBySchedule), "Nada em execução ou avaliação neste recorte."),
        renderTaskList("Será realizado", futureTasks.sort(sortBySchedule), "Nenhuma atividade futura neste recorte."),
        renderTaskList("Foi realizado", doneTasks.sort((a, b) => String(b.conclusaoReal || '').localeCompare(String(a.conclusaoReal || ''))), "Nenhuma atividade concluída neste recorte."),
        selectedTask && React.createElement(TaskDetailModal, {
            task: selectedTask,
            parentTask: selectedTask.dependencia ? tasks.find(task => task.id === selectedTask.dependencia) : null,
            onClose: () => setSelectedTask(null),
            onComplete: onCompleteTask ? (taskId, complementData) => onCompleteTask(taskId, complementData).then((updatedTask) => {
                setSelectedTask(updatedTask);
                return updatedTask;
            }) : null,
            isCompleting: isCompletingTask,
            onEdit: onEditTask ? (taskId, editData) => onEditTask(taskId, editData).then((updatedTask) => {
                setSelectedTask(updatedTask);
                return updatedTask;
            }) : null,
            isEditing: isEditingTask,
            setores,
            objetivos,
            tasks
        }));
}
// ABA 2: Gestão à Vista (Quadro por Complexidade + Vencimento)
function DashboardView({ tasks, objetivos = INITIAL_OBJETIVOS, setores = SETORES, onRequestEvaluation, onCompleteTask, isCompletingTask, onEditTask, isEditingTask }) {
    const [selectedTask, setSelectedTask] = useState(null);
    const pendingTasks = tasks.filter(t => t.status === STATUS.PENDENTE);
    const reviewTasks = tasks.filter(t => t.status === STATUS.AGUARDANDO_AVALIACAO);
    const doneTasks = tasks.filter(t => t.status === STATUS.CONCLUIDA);
    const today = todayDateOnly();
    const totalAtividades = tasks.length;
    const atrasadas = pendingTasks.filter(t => getTaskScheduleState(t, today).isOverdue).length;
    const geramCusto = tasks.filter(t => t.geraCusto).length;
    const totalDone = doneTasks.length;
    const totalOnTime = doneTasks.filter(t => getTaskScheduleState(t, today).isOnTimeOriginal).length;
    const globalRate = totalDone > 0 ? Math.round((totalOnTime / totalDone) * 100) : 0;

    const normalizeComplexity = (value) => {
        const normalized = String(value || '').trim().toLowerCase();
        if (normalized === 'alta') return 'Alta';
        if (normalized === 'media' || normalized === 'média') return 'Média';
        if (normalized === 'baixa') return 'Baixa';
        return 'Baixa';
    };

    const getDateTime = (value) => {
        if (!value) return Number.POSITIVE_INFINITY;
        const time = new Date(`${value}T00:00:00`).getTime();
        return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
    };

    const sortByDueDate = (a, b) => {
        const aHasDate = Boolean(a.conclusaoPrevista);
        const bHasDate = Boolean(b.conclusaoPrevista);
        if (!aHasDate && !bHasDate) return 0;
        if (!aHasDate) return 1;
        if (!bHasDate) return -1;

        const overdueA = getTaskScheduleState(a, today).isOverdue;
        const overdueB = getTaskScheduleState(b, today).isOverdue;
        if (overdueA !== overdueB) return overdueA ? -1 : 1;

        return getDateTime(a.conclusaoPrevista) - getDateTime(b.conclusaoPrevista);
    };

    const complexityConfig = [
        {
            label: 'Alta',
            title: 'Alta Complexidade',
            subtitle: 'Prioridade máxima por vencimento',
            icon: React.createElement(AlertTriangle, { className: "w-5 h-5 md:w-6 md:h-6 mr-2 text-rose-600" }),
            containerClass: 'bg-rose-50/60 border-rose-200',
            headerClass: 'border-rose-200',
            titleClass: 'text-rose-800',
            badgeClass: 'bg-rose-100 text-rose-800',
            emptyClass: 'text-rose-500/60'
        },
        {
            label: 'Média',
            title: 'Média Complexidade',
            subtitle: 'Atenção operacional por prazo',
            icon: React.createElement(Clock, { className: "w-5 h-5 md:w-6 md:h-6 mr-2 text-orange-600" }),
            containerClass: 'bg-orange-50/60 border-orange-200',
            headerClass: 'border-orange-200',
            titleClass: 'text-orange-800',
            badgeClass: 'bg-orange-100 text-orange-800',
            emptyClass: 'text-orange-500/60'
        },
        {
            label: 'Baixa',
            title: 'Baixa Complexidade',
            subtitle: 'Execução simples organizada por vencimento',
            icon: React.createElement(CheckCircle, { className: "w-5 h-5 md:w-6 md:h-6 mr-2 text-emerald-600" }),
            containerClass: 'bg-emerald-50/60 border-emerald-200',
            headerClass: 'border-emerald-200',
            titleClass: 'text-emerald-800',
            badgeClass: 'bg-emerald-100 text-emerald-800',
            emptyClass: 'text-emerald-500/60'
        }
    ];

    const availableSetores = (Array.isArray(setores) && setores.length) ? setores : SETORES;
    const sectorStats = availableSetores.map(setor => {
        const completedBySector = doneTasks.filter(t => t.setorExecutor === setor);
        const onTime = completedBySector.filter(t => getTaskScheduleState(t, today).isOnTimeOriginal).length;
        const total = completedBySector.length;
        const rate = total > 0 ? Math.round((onTime / total) * 100) : 0;
        return { setor, total, onTime, rate };
    }).filter(s => s.total > 0).sort((a, b) => b.rate - a.rate || b.total - a.total);
    const reviewSectorNames = appCore.uniqueNormalized
        ? appCore.uniqueNormalized([...availableSetores, ...reviewTasks.map(task => task.setorExecutor)])
        : [...new Set([...availableSetores, ...reviewTasks.map(task => task.setorExecutor)].filter(Boolean))];
    const isReviewBlockingDependency = (reviewTask) => pendingTasks.some(task => String(task.dependencia || '') === String(reviewTask.id || ''));
    const reviewTasksBySector = reviewSectorNames.map(setor => {
        const approvals = reviewTasks.filter(task => sameSector(task.setorExecutor, setor));
        return {
            setor,
            count: approvals.length,
            conditionalCount: approvals.filter(isReviewBlockingDependency).length
        };
    }).filter(item => item.count > 0).sort((a, b) => b.conditionalCount - a.conditionalCount || b.count - a.count || a.setor.localeCompare(b.setor));
    const conditionalReviewTasks = reviewTasks
        .filter(isReviewBlockingDependency)
        .sort((a, b) => getDateTime(a.conclusaoPrevista) - getDateTime(b.conclusaoPrevista));
    const quickSummarySectorNames = appCore.uniqueNormalized
        ? appCore.uniqueNormalized([...availableSetores, ...tasks.map(task => task.setorExecutor)])
        : [...new Set([...availableSetores, ...tasks.map(task => task.setorExecutor)].filter(Boolean))];
    const sectorQuickSummary = quickSummarySectorNames.map(setor => {
        const tasksAsExecutor = tasks.filter(task => sameSector(task.setorExecutor, setor));
        const activeTasksAsExecutor = tasksAsExecutor.filter(task => task.status !== STATUS.CONCLUIDA);
        const doneBySector = tasksAsExecutor.filter(task => task.status === STATUS.CONCLUIDA).length;
        const overdueBySector = activeTasksAsExecutor.filter(task => getTaskScheduleState(task, today).isOverdue).length;
        const crossedBySector = activeTasksAsExecutor.filter(task => !sameSector(task.setorSolicitante, setor)).length;
        const dependencyBySector = activeTasksAsExecutor.filter(task => task.dependencia).length;

        return {
            setor,
            total: activeTasksAsExecutor.length,
            done: doneBySector,
            overdue: overdueBySector,
            crossed: crossedBySector,
            dependencies: dependencyBySector
        };
    }).filter(item => item.total > 0).sort((a, b) => b.total - a.total || b.overdue - a.overdue || a.setor.localeCompare(b.setor));

    const renderTaskForComplexity = (task) => {
        const parentTask = task.dependencia ? tasks.find(t => t.id === task.dependencia) : null;
        const isBlocked = parentTask && parentTask.status !== STATUS.CONCLUIDA;
        return React.createElement(TaskCard, {
            key: task.id,
            task,
            onAction: () => onRequestEvaluation(task.id),
            onOpen: () => setSelectedTask(task),
            actionLabel: "Finalizar Tarefa",
            compact: true,
            isBlocked,
            parentTask
        });
    };

    const renderComplexitySection = (section) => {
        const sectionTasks = pendingTasks
            .filter(task => normalizeComplexity(task.complexidade) === section.label)
            .sort(sortByDueDate);
        const taskListClass = `space-y-3 ${sectionTasks.length > 3 ? 'max-h-[720px] overflow-y-auto pr-1 custom-scrollbar' : ''}`;

        return React.createElement("div", { key: section.label, className: `${section.containerClass} rounded-2xl p-3 md:p-4 border shadow-sm min-w-0` },
            React.createElement("div", { className: `flex items-center justify-between gap-3 mb-3 md:mb-4 pb-3 border-b ${section.headerClass}` },
                React.createElement("div", { className: "min-w-0" },
                    React.createElement("h4", { className: `text-sm md:text-lg font-black flex items-center ${section.titleClass}` },
                        section.icon,
                        section.title),
                    React.createElement("p", { className: "text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 truncate" }, section.subtitle)),
                React.createElement("span", { className: `${section.badgeClass} py-1 px-3 rounded-full text-xs font-black shadow-sm flex-shrink-0` }, sectionTasks.length)),
            React.createElement("div", { className: taskListClass },
                sectionTasks.length === 0
                    ? React.createElement("p", { className: `text-sm md:text-base ${section.emptyClass} text-center py-5 font-medium` }, "Nenhuma tarefa nesta complexidade.")
                    : sectionTasks.map(renderTaskForComplexity)));
    };

    const renderSectorStat = (stat, index) => React.createElement("div", { key: stat.setor, className: "bg-white p-4 md:p-5 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md" },
        index === 0 && React.createElement("div", { className: "absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl shadow-sm uppercase tracking-wider" }, "1\u00BA LUGAR"),
        React.createElement("div", { className: "flex justify-between items-end mb-3" },
            React.createElement("span", { className: "text-sm md:text-base font-bold text-slate-800" }, stat.setor),
            React.createElement("span", { className: "text-[10px] text-slate-400 uppercase font-bold" },
                React.createElement("strong", { className: "text-slate-700 text-xs md:text-sm" }, stat.total),
                " entregas")),
        React.createElement("div", { className: "w-full bg-slate-100 rounded-full h-2.5 md:h-3 mb-2 overflow-hidden shadow-inner" },
            React.createElement("div", { className: `h-full rounded-full transition-all duration-1000 ${stat.rate >= 80 ? 'bg-emerald-500' : stat.rate >= 50 ? 'bg-amber-400' : 'bg-rose-500'}`, style: { width: `${stat.rate}%` } })),
        React.createElement("div", { className: "flex justify-between items-center text-[10px] md:text-[11px] font-bold uppercase tracking-wider" },
            React.createElement("span", { className: "text-slate-400" }, "Efici\u00EAncia"),
            React.createElement("span", { className: stat.rate >= 80 ? 'text-emerald-600' : stat.rate >= 50 ? 'text-amber-600' : 'text-rose-600' },
                stat.rate,
                "% no prazo")));
    const renderReviewSectorSummary = (item) => {
        const colors = getSectorColorClasses(item.setor);
        const SectorIcon = getSectorIconComponent(item.setor);
        return React.createElement("div", { key: item.setor, className: `rounded-2xl border p-3 shadow-sm ${colors.soft}` },
            React.createElement("div", { className: "flex items-center justify-between gap-3" },
                React.createElement("div", { className: "flex items-center gap-2 min-w-0" },
                    React.createElement("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/70 bg-white/90 shadow-sm" },
                        React.createElement(SectorIcon, { className: "w-4 h-4" })),
                    React.createElement("div", { className: "min-w-0" },
                        React.createElement("span", { className: "block text-[9px] font-black uppercase tracking-widest opacity-60" }, "Setor"),
                        React.createElement("span", { className: "block truncate text-xs font-black uppercase tracking-widest" }, item.setor))),
                React.createElement("strong", { className: "rounded-full bg-white/80 px-3 py-1 text-lg font-black shadow-sm" }, item.count)),
            item.conditionalCount > 0 && React.createElement("p", { className: "mt-2 text-[10px] font-black uppercase tracking-widest" }, "Prioridade condicional"));
    };
    const renderReviewPriorityItem = (task) => {
        const colors = getSectorColorClasses(task.setorExecutor);
        const SectorIcon = getSectorIconComponent(task.setorExecutor);
        return React.createElement("div", { key: task.id, className: `rounded-xl border bg-white p-3 shadow-sm ${colors.soft}` },
            React.createElement("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between" },
                React.createElement("div", { className: "min-w-0" },
                    React.createElement("span", { className: "inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-amber-800" },
                        React.createElement(SectorIcon, { className: "w-3.5 h-3.5" }),
                        task.status),
                    React.createElement("h4", { className: "mt-2 text-sm md:text-base font-black text-slate-900 leading-snug" }, task.descricao || 'Atividade sem titulo'),
                    React.createElement("p", { className: "mt-1 text-xs font-black uppercase tracking-widest text-[#003865]" }, task.objetivo || 'Sem objetivo'))));
    };
    const renderSectorQuickSummary = (item) => {
        const colors = getSectorColorClasses(item.setor);
        const SectorIcon = getSectorIconComponent(item.setor);
        const metricClass = "mx-auto flex h-12 min-w-0 items-center justify-center rounded-xl border border-slate-200 bg-white/90 px-3 shadow-sm";
        const labelClass = "mt-1 block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500";

        return React.createElement("article", { key: item.setor, className: `rounded-2xl border p-4 md:p-5 shadow-sm ${colors.soft}` },
            React.createElement("div", { className: "mb-4 flex items-center justify-between gap-3" },
                React.createElement("div", { className: "flex min-w-0 items-center gap-2" },
                    React.createElement("span", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white/90 shadow-sm" },
                        React.createElement(SectorIcon, { className: "w-5 h-5" })),
                    React.createElement("div", { className: "min-w-0" },
                        React.createElement("span", { className: "block text-[9px] font-black uppercase tracking-widest opacity-60" }, "Setor"),
                        React.createElement("h4", { className: "truncate text-sm md:text-base font-black uppercase tracking-widest" }, item.setor))),
                React.createElement("strong", { className: "rounded-full bg-white/90 px-3 py-1 text-lg md:text-xl font-black text-slate-900 shadow-sm" }, item.total)),
            React.createElement("div", { className: "grid grid-cols-4 gap-2" },
                React.createElement("div", { className: "min-w-0 text-center" },
                    React.createElement("div", { className: metricClass },
                        React.createElement("strong", { className: "block text-base md:text-lg font-black text-emerald-700" }, item.done)),
                    React.createElement("span", { className: labelClass }, "Concluidas")),
                React.createElement("div", { className: "min-w-0 text-center" },
                    React.createElement("div", { className: metricClass },
                        React.createElement("strong", { className: "block text-base md:text-lg font-black text-rose-600" }, item.overdue)),
                    React.createElement("span", { className: labelClass }, "Atrasos")),
                React.createElement("div", { className: "min-w-0 text-center" },
                    React.createElement("div", { className: metricClass },
                        React.createElement("strong", { className: "block text-base md:text-lg font-black text-violet-700" }, item.crossed)),
                    React.createElement("span", { className: labelClass }, "Cruzadas")),
                React.createElement("div", { className: "min-w-0 text-center" },
                    React.createElement("div", { className: metricClass },
                        React.createElement("strong", { className: "block text-base md:text-lg font-black text-amber-700" }, item.dependencies)),
                    React.createElement("span", { className: labelClass }, "Depend."))));
    };

    return React.createElement("div", { className: "w-full flex flex-col space-y-6 md:space-y-8" },
        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" },
            React.createElement(SummaryCard, { title: "Total Ativas", value: totalAtividades, icon: React.createElement(Activity, { className: "w-6 h-6 md:w-8 md:h-8 text-blue-600" }), colorClass: "bg-blue-50 border border-blue-100" }),
            React.createElement(SummaryCard, { title: "Conclu\u00EDdas", value: doneTasks.length, icon: React.createElement(CheckCircle, { className: "w-6 h-6 md:w-8 md:h-8 text-emerald-600" }), colorClass: "bg-emerald-50 border border-emerald-100" }),
            React.createElement(SummaryCard, { title: "Atrasadas", value: atrasadas, icon: React.createElement(AlertCircle, { className: "w-6 h-6 md:w-8 md:h-8 text-rose-600" }), colorClass: "bg-rose-50 border border-rose-100" }),
            React.createElement(SummaryCard, { title: "Geram Custo", value: geramCusto, icon: React.createElement(DollarSign, { className: "w-6 h-6 md:w-8 md:h-8 text-orange-600" }), colorClass: "bg-orange-50 border border-orange-100" })),
        React.createElement("div", { className: "flex flex-col gap-6 md:gap-8 items-stretch" },
            React.createElement("section", { className: "bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-sm flex flex-col w-full overflow-visible" },
                React.createElement("div", { className: "flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-4 md:mb-5 pb-3 border-b-2 border-slate-200" },
                    React.createElement("div", null,
                        React.createElement("h3", { className: "text-base md:text-xl font-extrabold text-slate-800 flex items-center" },
                            React.createElement(Layers, { className: "w-5 h-5 md:w-6 md:h-6 mr-2 text-[#003865]" }),
                            " Atividades em Andamento por Complexidade"),
                        React.createElement("p", { className: "text-[11px] md:text-xs text-slate-500 font-bold uppercase tracking-wider mt-1" }, "Atrasadas primeiro, depois vencimentos mais pr\u00F3ximos")),
                    React.createElement("span", { className: "bg-slate-100 text-slate-700 py-1.5 px-3 rounded-full text-xs font-black shadow-sm w-fit" },
                        pendingTasks.length,
                        " em andamento")),
                React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5" },
                    pendingTasks.length === 0 && React.createElement("p", { className: "text-sm md:text-base text-slate-400 text-center py-8 font-medium col-span-full" }, "Nenhuma tarefa pendente."),
                    pendingTasks.length > 0 && complexityConfig.map(renderComplexitySection))),
            React.createElement("section", { className: "bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-sm flex flex-col w-full overflow-visible" },
                React.createElement("div", { className: "mb-4 md:mb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-2 border-b-2 border-slate-200 pb-3" },
                    React.createElement("div", null,
                        React.createElement("h3", { className: "text-base md:text-lg font-extrabold text-slate-800 flex items-center" },
                            React.createElement(BarChart3, { className: "w-5 h-5 md:w-6 md:h-6 mr-2 text-[#003865]" }),
                            " Resumo rapido por setor"),
                        React.createElement("p", { className: "text-[11px] md:text-xs text-slate-500 font-bold uppercase tracking-wider mt-1" }, "Leitura basica de carga, atrasos, tarefas cruzadas e dependencias")),
                    React.createElement("span", { className: "bg-slate-100 text-slate-700 py-1.5 px-3 rounded-full text-xs font-black shadow-sm w-fit" },
                        sectorQuickSummary.length,
                        " setores")),
                sectorQuickSummary.length
                    ? React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4" },
                        sectorQuickSummary.map(renderSectorQuickSummary))
                    : React.createElement("p", { className: "py-6 text-center text-sm font-bold text-slate-400" }, "Nenhum setor com atividade ativa no momento.")),
            React.createElement("div", { className: "bg-amber-50/60 rounded-2xl p-4 md:p-5 border border-amber-100 shadow-sm flex flex-col w-full overflow-visible" },
                React.createElement("div", { className: "flex items-center justify-between mb-4 md:mb-5 pb-3 border-b-2 border-amber-200" },
                    React.createElement("h3", { className: "text-base md:text-lg font-extrabold text-amber-800 flex items-center" },
                        React.createElement(AlertCircle, { className: "w-5 h-5 md:w-6 md:h-6 mr-2 text-amber-500" }),
                        " Aguardando Gestor"),
                    React.createElement("span", { className: "bg-amber-200 text-amber-900 py-1 px-3 rounded-full text-xs font-black shadow-sm" }, reviewTasks.length)),
                reviewTasks.length === 0
                    ? React.createElement("p", { className: "text-sm md:text-base text-amber-600/60 text-center py-8 font-medium" }, "Nenhuma avalia\u00E7\u00E3o pendente.")
                    : React.createElement("div", { className: "space-y-4" },
                        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3" }, reviewTasksBySector.map(renderReviewSectorSummary)),
                        conditionalReviewTasks.length > 0 && React.createElement("div", { className: "rounded-2xl border border-amber-200 bg-white/80 p-3 md:p-4 shadow-sm" },
                            React.createElement("div", { className: "mb-3 flex items-center justify-between gap-3" },
                                React.createElement("h4", { className: "text-xs md:text-sm font-black uppercase tracking-widest text-amber-800" }, "Prioridade: libera atividades condicionais"),
                                React.createElement("span", { className: "rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800" }, conditionalReviewTasks.length)),
                            React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-3" }, conditionalReviewTasks.map(renderReviewPriorityItem))))),
            React.createElement("div", { className: "bg-emerald-50/60 rounded-2xl p-4 md:p-5 border border-emerald-100 shadow-sm flex flex-col w-full overflow-visible" },
                React.createElement("div", { className: "flex items-center justify-between mb-4 md:mb-5 pb-3 border-b-2 border-emerald-200" },
                    React.createElement("h3", { className: "text-base md:text-lg font-extrabold text-emerald-800 flex items-center" },
                        React.createElement(Trophy, { className: "w-5 h-5 md:w-6 md:h-6 mr-2 text-emerald-600" }),
                        " Desempenho (KPI)")),
                React.createElement("div", { className: "bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-emerald-100 mb-5 text-center flex flex-col items-center justify-center" },
                    React.createElement("div", { className: "text-4xl md:text-5xl font-black text-emerald-600 tracking-tighter" },
                        globalRate,
                        "%"),
                    React.createElement("div", { className: "text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 text-center leading-tight" }, "Taxa Global de Entregas no Prazo")),
                React.createElement("div", { className: "space-y-3 md:space-y-4 pr-1 pb-4 custom-scrollbar" },
                    sectorStats.length === 0 && React.createElement("p", { className: "text-sm md:text-base text-emerald-600/60 text-center py-8 font-medium" }, "Sem dados finalizados."),
                    sectorStats.map(renderSectorStat)))),
        selectedTask && React.createElement(TaskDetailModal, {
            task: selectedTask,
            parentTask: selectedTask.dependencia ? tasks.find(t => t.id === selectedTask.dependencia) : null,
            onClose: () => setSelectedTask(null),
            onComplete: onCompleteTask ? (taskId, complementData) => onCompleteTask(taskId, complementData).then((updatedTask) => {
                setSelectedTask(updatedTask);
                return updatedTask;
            }) : null,
            isCompleting: isCompletingTask,
            onEdit: onEditTask ? (taskId, editData) => onEditTask(taskId, editData).then((updatedTask) => {
                setSelectedTask(updatedTask);
                return updatedTask;
            }) : null,
            isEditing: isEditingTask,
            setores,
            objetivos,
            tasks
        }),
        React.createElement("style", { dangerouslySetInnerHTML: { __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
    ` } }));
}
// Cartão Individual da Tarefa (Card Otimizado)
function TaskCard({ task, onAction, onOpen, actionLabel, isReview, isDone, isBlocked, parentTask, compact }) {
    const schedule = getTaskScheduleState(task);
    const isOverdue = schedule.isOverdue;
    const executorColor = getSectorColorClasses(task.setorExecutor);
    const ExecutorIcon = getSectorIconComponent(task.setorExecutor);
    const delayLabel = schedule.delayDays === 1 ? '1 dia de atraso' : `${schedule.delayDays} dias de atraso`;
    const attachmentCount = Number(task.anexosCount || (Array.isArray(task.anexosResumo) ? task.anexosResumo.length : 0));
    return (React.createElement("div", { onClick: onOpen, role: onOpen ? "button" : undefined, tabIndex: onOpen ? 0 : undefined, onKeyDown: (event) => {
            if (onOpen && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                onOpen();
            }
        }, className: `bg-white ${compact ? 'p-3 md:p-3.5' : 'p-4 md:p-5'} rounded-2xl shadow-sm border-l-4 transition-all hover:shadow-md relative overflow-hidden ${onOpen ? 'cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-100' : ''} ${isBlocked ? 'border-l-amber-500 opacity-95' :
            isOverdue ? 'border-l-rose-500' :
                isDone ? 'border-l-emerald-500' :
                    isReview ? 'border-l-amber-400' : 'border-l-blue-600'}` },
        React.createElement("div", { className: `flex justify-between items-start ${compact ? 'mb-2' : 'mb-3'} gap-2` },
            React.createElement("span", { className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] md:text-xs font-black uppercase tracking-wider truncate ${executorColor.badge}`, title: `Solicitante: ${task.setorSolicitante} | Executor: ${task.setorExecutor}` },
                React.createElement(ExecutorIcon, { className: "w-3.5 h-3.5 shrink-0" }),
                task.setorSolicitante !== task.setorExecutor
                    ? `${task.setorSolicitante.substring(0, 3)} -> ${task.setorExecutor}`
                    : task.setorExecutor),
            React.createElement("span", { className: `text-[10px] md:text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider flex-shrink-0 ${task.complexidade === 'Alta' ? 'bg-rose-100 text-rose-800' :
                    task.complexidade === 'Média' ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'}` }, task.complexidade)),
        React.createElement("p", { className: `${compact ? 'text-xs md:text-sm mb-2 line-clamp-2' : 'text-sm md:text-base mb-3 line-clamp-3'} font-bold text-slate-800 leading-snug` }, task.descricao),
        React.createElement("div", { className: `${compact ? 'text-[10px] mb-3 space-y-1' : 'text-[11px] md:text-xs mb-4 space-y-1.5 md:space-y-2'} text-slate-500` },
            task.objetivo && (React.createElement("div", { className: "flex items-center font-bold text-[#003865] bg-[#003865]/5 w-fit px-2.5 py-1 rounded-md" },
                React.createElement(Target, { className: "w-3.5 h-3.5 mr-1.5" }),
                " Obj: ",
                task.objetivo)),
            attachmentCount > 0 && React.createElement("div", { className: "flex items-center font-bold text-slate-600 bg-slate-100 w-fit px-2.5 py-1 rounded-md" },
                React.createElement(Paperclip, { className: "w-3.5 h-3.5 mr-1.5" }),
                attachmentCount,
                attachmentCount === 1 ? " anexo" : " anexos"),
            React.createElement("div", { className: "flex items-center font-medium" },
                React.createElement(Calendar, { className: "w-3.5 h-3.5 mr-1.5 text-slate-400" }),
                " Previsto: ",
                React.createElement("strong", { className: "ml-1 text-slate-700" }, formatDateBR(schedule.currentDueDate))),
            schedule.isReplanned && React.createElement("div", { className: "flex items-center font-bold text-amber-700" },
                React.createElement(CalendarDays, { className: "w-3.5 h-3.5 mr-1.5 text-amber-500" }),
                " Original: ",
                React.createElement("strong", { className: "ml-1" }, formatDateBR(schedule.originalDueDate))),
            !compact && task.clienteFornecedor && React.createElement("div", { className: "flex items-center font-medium" },
                React.createElement(UserCog, { className: "w-3.5 h-3.5 mr-1.5 text-slate-400" }),
                " ",
                React.createElement("span", { className: "truncate" }, task.clienteFornecedor)),
            !compact && task.deslocamento && (React.createElement("div", { className: "flex items-center text-indigo-700 font-medium" },
                React.createElement(Truck, { className: "w-3.5 h-3.5 mr-1.5 flex-shrink-0" }),
                React.createElement("span", { className: "truncate" },
                    task.local,
                    " ",
                    task.duracaoDeslocamento && `(${task.duracaoDeslocamento} ${task.unidadeDeslocamento})`))),
            !compact && task.geraCusto && (React.createElement("div", { className: "flex items-center text-orange-700 font-medium" },
                React.createElement(DollarSign, { className: "w-3.5 h-3.5 mr-1.5 flex-shrink-0" }),
                React.createElement("span", { className: "truncate" },
                    task.valorCusto ? `R$ ${task.valorCusto}` : 'Com custo',
                    " - ",
                    task.tipoCusto)))),
        isOverdue && !isBlocked && (React.createElement("div", { className: `${compact ? 'mb-3 text-[10px]' : 'mb-4 text-[11px] md:text-xs'} font-black text-rose-600 flex items-center bg-rose-50 p-2 rounded-lg border border-rose-100 uppercase tracking-wider` },
            React.createElement(AlertTriangle, { className: "w-4 h-4 mr-1.5" }),
            schedule.isReplanned ? ` Atrasada: ${delayLabel} no prazo original` : ` Atrasada: ${delayLabel}`)),
        isOverdue && schedule.isReplanned && !isBlocked && React.createElement("div", { className: `${compact ? 'mb-3 text-[10px]' : 'mb-4 text-[11px] md:text-xs'} font-bold text-amber-700 flex items-center bg-amber-50 p-2 rounded-lg border border-amber-100` },
            React.createElement(CalendarDays, { className: "w-4 h-4 mr-1.5" }),
            "Reprogramada para ",
            formatDateBR(schedule.currentDueDate)),
        isBlocked && parentTask && (React.createElement("div", { className: `${compact ? 'mb-3 text-[10px]' : 'mb-4 text-[11px] md:text-xs'} font-bold text-amber-800 flex flex-col bg-amber-50 p-2.5 rounded-lg border border-amber-200 shadow-sm` },
            React.createElement("span", { className: "flex items-center mb-1.5 text-amber-600 uppercase tracking-wider text-[10px]" },
                React.createElement(Lock, { className: "w-3.5 h-3.5 mr-1.5" }),
                " Bloqueada por:"),
            React.createElement("span", { className: "font-medium text-amber-900 line-clamp-2 leading-tight" },
                "[",
                parentTask.setorExecutor,
                "] ",
                parentTask.descricao))),
        onOpen && compact && React.createElement("p", { className: "mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400" }, "Clique para abrir a ficha"),
        onAction && (React.createElement("button", { onClick: (event) => {
                event.stopPropagation();
                onAction();
            }, disabled: isBlocked, className: `w-full font-bold ${compact ? 'py-2 px-3 text-xs' : 'py-2.5 px-4 text-xs md:text-sm'} rounded-xl transition-all transform active:scale-95 ${isBlocked
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-[#003865] text-white hover:bg-blue-800 shadow-md hover:shadow-lg'}` }, isBlocked ? 'Aguardando Liberação' : actionLabel)),
        isReview && React.createElement("div", { className: "text-xs font-bold text-center bg-amber-100 text-amber-800 py-2 rounded-xl border border-amber-200 uppercase tracking-widest" }, "Aguardando Avalia\u00E7\u00E3o"),
        isDone && React.createElement("div", { className: "text-xs font-bold text-center bg-emerald-100 text-emerald-800 py-2 rounded-xl border border-emerald-200 uppercase tracking-widest flex items-center justify-center" },
            React.createElement(CheckCircle, { className: "w-3.5 h-3.5 mr-1.5" }),
            "Aprovada")));
}
function TaskDetailModal({ task, parentTask, onClose, onComplete, isCompleting, onEdit, isEditing, setores = SETORES, objetivos = INITIAL_OBJETIVOS, tasks = [] }) {
    const complementOptions = getTaskComplementOptions(task);
    const availableSetores = appCore.uniqueNormalized
        ? appCore.uniqueNormalized([...(setores || []), task && task.setorSolicitante, task && task.setorExecutor])
        : [...new Set([...(setores || []), task && task.setorSolicitante, task && task.setorExecutor].filter(Boolean))];
    const dependencyOptions = (tasks || []).filter((item) => String(item.id) !== String(task && task.id));
    const buildEditForm = (source) => ({
        setorSolicitante: source && source.setorSolicitante ? source.setorSolicitante : (availableSetores[0] || SETORES[0]),
        setorExecutor: source && source.setorExecutor ? source.setorExecutor : (availableSetores[0] || SETORES[0]),
        complexidade: source && source.complexidade ? source.complexidade : COMPLEXIDADES[0],
        descricao: source && source.descricao ? source.descricao : '',
        objetivo: source && source.objetivo ? source.objetivo : '',
        clienteFornecedor: source && source.clienteFornecedor ? source.clienteFornecedor : '',
        dependencia: source && source.dependencia ? source.dependencia : '',
        deslocamento: Boolean(source && source.deslocamento),
        local: source && source.local ? source.local : '',
        duracaoDeslocamento: source && source.duracaoDeslocamento ? source.duracaoDeslocamento : '',
        unidadeDeslocamento: source && source.unidadeDeslocamento ? source.unidadeDeslocamento : 'Horas',
        geraCusto: Boolean(source && source.geraCusto),
        tipoCusto: source && source.tipoCusto ? source.tipoCusto : '',
        valorCusto: source && source.valorCusto ? source.valorCusto : ''
    });
    const [isComplementOpen, setIsComplementOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [completionError, setCompletionError] = useState('');
    const [editError, setEditError] = useState('');
    const [editForm, setEditForm] = useState(buildEditForm(task));
    const [completionForm, setCompletionForm] = useState({
        objetivo: '',
        clienteFornecedor: '',
        deslocamento: Boolean(task && task.deslocamento),
        local: '',
        duracaoDeslocamento: '',
        unidadeDeslocamento: task && task.unidadeDeslocamento ? task.unidadeDeslocamento : 'Horas',
        geraCusto: Boolean(task && task.geraCusto),
        tipoCusto: '',
        valorCusto: ''
    });
    const [remoteAttachments, setRemoteAttachments] = useState(Array.isArray(task && task.anexosResumo) ? task.anexosResumo : []);
    const [attachmentsLoading, setAttachmentsLoading] = useState(false);
    const [attachmentLoadError, setAttachmentLoadError] = useState('');

    useEffect(() => {
        setIsComplementOpen(false);
        setIsEditOpen(false);
        setCompletionError('');
        setEditError('');
        setEditForm(buildEditForm(task));
        setCompletionForm({
            objetivo: '',
            clienteFornecedor: '',
            deslocamento: Boolean(task && task.deslocamento),
            local: '',
            duracaoDeslocamento: '',
            unidadeDeslocamento: task && task.unidadeDeslocamento ? task.unidadeDeslocamento : 'Horas',
            geraCusto: Boolean(task && task.geraCusto),
            tipoCusto: '',
            valorCusto: ''
        });
    }, [task && task.id]);

    useEffect(() => {
        let cancelled = false;
        const summary = Array.isArray(task && task.anexosResumo) ? task.anexosResumo : [];
        setRemoteAttachments(summary);
        setAttachmentLoadError('');

        if (!task || !task.id || !window.motorBackend || !window.motorBackend.online || typeof window.motorBackend.listarAnexos !== 'function') {
            setAttachmentsLoading(false);
            return () => { cancelled = true; };
        }

        setAttachmentsLoading(true);
        window.motorBackend.listarAnexos(task.id)
            .then((rows) => {
                if (!cancelled) setRemoteAttachments(Array.isArray(rows) ? rows : []);
            })
            .catch((error) => {
                if (!cancelled) setAttachmentLoadError(error.message || 'Nao foi possivel carregar os anexos salvos.');
            })
            .finally(() => {
                if (!cancelled) setAttachmentsLoading(false);
            });

        return () => { cancelled = true; };
    }, [task && task.id]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const dateBR = (value) => formatDateBR(value);
    const schedule = getTaskScheduleState(task);
    const inputClass = "mt-1 block w-full rounded-lg border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-900 shadow-sm focus:border-[#003865] focus:outline-none focus:ring-1 focus:ring-[#003865] transition-colors border";
    const labelClass = "block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5";
    const normalizeText = (value) => {
        if (value === null || value === undefined || value === '') return '-';
        return String(value);
    };
    const deslocamentoValue = task.deslocamento
        ? `${task.local || 'Local não informado'}${task.duracaoDeslocamento ? ` - ${task.duracaoDeslocamento} ${task.unidadeDeslocamento}` : ''}`
        : '-';
    const custoValue = task.geraCusto
        ? `${task.valorCusto ? `R$ ${task.valorCusto}` : 'Com custo'}${task.tipoCusto ? ` - ${task.tipoCusto}` : ''}`
        : '-';
    const dependenciaValue = parentTask ? `[${parentTask.setorExecutor}] ${parentTask.descricao}` : '-';
    const attachmentSummary = Array.isArray(task.anexosResumo) ? task.anexosResumo : [];
    const resolveAttachmentUrl = (attachment) => {
        const directUrl = attachment && (attachment.url || attachment.public_url || attachment.signed_url || attachment.download_url || attachment.file_url);
        if (directUrl) return directUrl;

        const storagePath = attachment && (attachment.caminho || attachment.storage_path || attachment.path);
        const bucketName = (attachment && (attachment.bucket_name || attachment.bucketName)) || ATTACHMENT_CONFIG.bucketName;
        try {
            const bucket = window.supabaseClient && window.supabaseClient.storage && window.supabaseClient.storage.from(bucketName);
            const publicUrl = storagePath && bucket && bucket.getPublicUrl(storagePath);
            return publicUrl && publicUrl.data && publicUrl.data.publicUrl ? publicUrl.data.publicUrl : '';
        } catch (_error) {
            return '';
        }
    };
    const normalizeAttachment = (attachment, index) => {
        const label = attachment && (attachment.nome || attachment.original_file_name || attachment.name || attachment.file_name || attachment.filename) || `Anexo ${index + 1}`;
        return {
            id: String(attachment && (attachment.id || attachment.attachment_id) || ''),
            nome: label,
            tipo: attachment && (attachment.tipo || attachment.file_type || attachment.type) || '',
            mime: String(attachment && (attachment.mime || attachment.mime_type || attachment.content_type) || '').toLowerCase(),
            tamanho: attachment && (attachment.tamanho || attachment.file_size_bytes || attachment.size) || null,
            url: resolveAttachmentUrl(attachment || {}),
            caminho: attachment && (attachment.caminho || attachment.storage_path || attachment.path) || ''
        };
    };
    const mergeAttachmentLists = (...lists) => {
        const merged = new Map();
        lists.flat().filter(Boolean).forEach((attachment, index) => {
            const normalized = normalizeAttachment(attachment, index);
            const key = normalized.id || normalized.url || normalized.caminho || `${normalized.nome}-${index}`;
            const current = merged.get(key) || {};
            merged.set(key, { ...current, ...normalized, url: normalized.url || current.url || '', nome: normalized.nome || current.nome || `Anexo ${index + 1}` });
        });
        return Array.from(merged.values());
    };
    const attachments = mergeAttachmentLists(attachmentSummary, remoteAttachments);
    const statusTone = task.status === STATUS.CONCLUIDA
        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
        : task.status === STATUS.AGUARDANDO_AVALIACAO
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : 'border-blue-200 bg-blue-50 text-blue-800';
    const complexityTone = task.complexidade === 'Alta'
        ? 'border-rose-200 bg-rose-50 text-rose-800'
        : task.complexidade === 'Média'
        ? 'border-orange-200 bg-orange-50 text-orange-800'
        : 'border-emerald-200 bg-emerald-50 text-emerald-800';
    const delayTone = schedule.delayDays > 0
        ? 'border-rose-200 bg-rose-50 text-rose-800'
        : 'border-emerald-200 bg-emerald-50 text-emerald-800';
    const executorColors = getSectorColorClasses(task.setorExecutor);
    const solicitanteColors = getSectorColorClasses(task.setorSolicitante);
    const ExecutorIcon = getSectorIconComponent(task.setorExecutor);
    const SolicitanteIcon = getSectorIconComponent(task.setorSolicitante);
    const fichaGroups = [
        {
            title: 'Dados gerais',
            subtitle: 'Identificacao principal da atividade',
            icon: FileText,
            wide: true,
            rows: [
                { label: 'Atividade', value: task.descricao, icon: FileText, featured: true },
                { label: 'Objetivo macro', value: task.objetivo, icon: Target },
                { label: 'Cliente/Fornecedor', value: task.clienteFornecedor, icon: UserCog },
                { label: 'Setor solicitante', value: task.setorSolicitante, icon: SolicitanteIcon, badgeTone: solicitanteColors.badge },
                { label: 'Setor executor', value: task.setorExecutor, icon: ExecutorIcon, badgeTone: executorColors.badge }
            ]
        },
        {
            title: 'Prazos e situacao',
            subtitle: 'Datas preservadas e leitura de andamento',
            icon: CalendarDays,
            rows: [
                { label: 'Abertura', value: dateBR(task.dataAbertura), icon: Calendar },
                { label: 'Conclusao prevista', value: dateBR(task.conclusaoPrevista), icon: Calendar },
                { label: 'Conclusao original', value: dateBR(schedule.originalDueDate), icon: CalendarDays },
                { label: 'Atraso apurado', value: schedule.delayDays > 0 ? `${schedule.delayDays} dia(s)` : '-', icon: AlertTriangle, badgeTone: delayTone },
                { label: 'Status', value: task.status, icon: CheckCircle, badgeTone: statusTone },
                { label: 'Complexidade', value: task.complexidade, icon: Settings2, badgeTone: complexityTone }
            ]
        },
        {
            title: 'Operacional',
            subtitle: 'Condicoes de execucao e dependencias',
            icon: Settings2,
            rows: [
                { label: 'Deslocamento', value: deslocamentoValue, icon: Truck },
                { label: 'Custo', value: custoValue, icon: DollarSign },
                { label: 'Dependencia', value: dependenciaValue, icon: Lock, featured: true },
                { label: 'Anexos', value: attachments.length ? `${attachments.length} arquivo(s)` : '-', icon: Paperclip }
            ]
        },
        {
            title: 'Fechamento e avaliacao',
            subtitle: 'Registros finais e encaminhamentos',
            icon: CheckCircle,
            wide: true,
            rows: [
                { label: 'Conclusao real informada', value: dateBR(task.conclusaoRealUser || task.conclusaoReal), icon: CalendarDays },
                task.avaliacao ? { label: 'Avaliacao', value: task.avaliacao, icon: CheckCircle, featured: true } : null,
                { label: 'Encaminhamento', value: task.encaminhamento, icon: FileText, featured: true }
            ].filter(Boolean)
        }
    ];
    const dateDetails = [
        { label: 'Abertura', value: dateBR(task.dataAbertura), icon: Calendar },
        { label: 'Conclusão prevista', value: dateBR(task.conclusaoPrevista), icon: Calendar },
        { label: 'Conclusão original', value: dateBR(schedule.originalDueDate), icon: CalendarDays }
    ];
    const summaryCards = [
        { label: 'Status', value: task.status, icon: CheckCircle, emoji: '✅', tone: statusTone },
        { label: 'Complexidade', value: task.complexidade, icon: Settings2, emoji: '⚡', tone: complexityTone },
        { label: 'Prazo previsto', value: dateBR(task.conclusaoPrevista), icon: Calendar, emoji: '📅', tone: 'border-slate-200 bg-white text-slate-800' },
        { label: 'Anexos', value: attachments.length ? `${attachments.length} arquivo(s)` : 'Sem anexos', icon: Paperclip, emoji: '📎', tone: 'border-sky-200 bg-sky-50 text-sky-800' }
    ];

    const handleCompletionChange = (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setCompletionForm(current => ({ ...current, [event.target.name]: value }));
    };

    const handleEditChange = (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setEditForm(current => ({ ...current, [event.target.name]: value }));
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        setEditError('');

        if (!onEdit) return;
        if (!editForm.descricao.trim()) {
            setEditError('Informe a descricao da atividade.');
            return;
        }

        const payload = {
            setorSolicitante: editForm.setorSolicitante,
            setorExecutor: editForm.setorExecutor,
            complexidade: editForm.complexidade,
            descricao: editForm.descricao.trim(),
            objetivo: editForm.objetivo.trim(),
            clienteFornecedor: editForm.clienteFornecedor.trim(),
            dependencia: editForm.dependencia,
            deslocamento: Boolean(editForm.deslocamento),
            local: editForm.deslocamento ? editForm.local.trim() : '',
            duracaoDeslocamento: editForm.deslocamento ? editForm.duracaoDeslocamento : '',
            unidadeDeslocamento: editForm.deslocamento ? editForm.unidadeDeslocamento : 'Horas',
            geraCusto: Boolean(editForm.geraCusto),
            tipoCusto: editForm.geraCusto ? editForm.tipoCusto.trim() : '',
            valorCusto: editForm.geraCusto ? editForm.valorCusto : ''
        };

        try {
            const updatedTask = await onEdit(task.id, payload);
            setEditForm(buildEditForm(updatedTask));
            setIsEditOpen(false);
        }
        catch (error) {
            setEditError(error.message || 'Nao foi possivel editar a ficha.');
        }
    };

    const handleComplementSubmit = async (event) => {
        event.preventDefault();
        setCompletionError('');

        const payload = {};

        if (complementOptions.canFillObjective && completionForm.objetivo.trim()) {
            payload.objetivo = completionForm.objetivo.trim();
        }

        if (complementOptions.canFillClienteFornecedor && completionForm.clienteFornecedor.trim()) {
            payload.clienteFornecedor = completionForm.clienteFornecedor.trim();
        }

        if (complementOptions.canFillDisplacement && (completionForm.deslocamento || task.deslocamento)) {
            payload.deslocamento = true;
            if (completionForm.local.trim()) payload.local = completionForm.local.trim();
            if (completionForm.duracaoDeslocamento !== '') payload.duracaoDeslocamento = completionForm.duracaoDeslocamento;
            if (completionForm.unidadeDeslocamento) payload.unidadeDeslocamento = completionForm.unidadeDeslocamento;
        }

        if (complementOptions.canFillCost && (completionForm.geraCusto || task.geraCusto)) {
            payload.geraCusto = true;
            if (completionForm.tipoCusto.trim()) payload.tipoCusto = completionForm.tipoCusto.trim();
            if (completionForm.valorCusto !== '') payload.valorCusto = completionForm.valorCusto;
        }

        if (Object.keys(payload).length === 0) {
            setCompletionError('Preencha ao menos um campo vazio da ficha.');
            return;
        }

        try {
            await onComplete(task.id, payload);
            setIsComplementOpen(false);
        }
        catch (error) {
            setCompletionError(error.message || 'NÃ£o foi possÃ­vel complementar a ficha.');
        }
    };

    const renderMetricCard = ({ label, value, icon: Icon, tone }) => React.createElement("div", { key: label, className: `rounded-2xl border px-4 py-3 shadow-sm ${tone}` },
        React.createElement("div", { className: "flex items-center gap-3" },
            React.createElement("span", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-sm" },
                React.createElement(Icon, { className: "h-5 w-5" })),
            React.createElement("div", { className: "min-w-0" },
                React.createElement("span", { className: "block text-[10px] font-black uppercase tracking-[0.18em]" }, label),
                React.createElement("strong", { className: "mt-1 block truncate text-base md:text-lg font-black leading-tight" }, normalizeText(value)))));

    const renderFichaRow = ({ label, value, icon: Icon, featured, badgeTone }) => {
        const valueNode = badgeTone
            ? React.createElement("span", { className: `inline-flex w-fit max-w-full items-center rounded-xl border px-3 py-1.5 text-sm md:text-base font-black ${badgeTone}` }, normalizeText(value))
            : React.createElement("strong", { className: `${featured ? 'text-base md:text-lg' : 'text-sm md:text-base'} block whitespace-pre-wrap break-words font-black leading-snug text-slate-950` }, normalizeText(value));

        return React.createElement("div", { key: label, className: "grid grid-cols-1 border-b border-slate-200 last:border-b-0 lg:grid-cols-[230px_minmax(0,1fr)]" },
            React.createElement("div", { className: "flex items-center gap-2.5 bg-slate-50 px-4 py-3 text-[#003865] lg:border-r lg:border-slate-200 xl:px-5" },
                React.createElement("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm" },
                    React.createElement(Icon, { className: "h-4 w-4" })),
                React.createElement("span", { className: "text-[10px] md:text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 leading-tight" }, label)),
            React.createElement("div", { className: "flex min-w-0 items-center px-4 pb-4 pt-0 lg:px-5 lg:py-3.5" }, valueNode));
    };

    const renderFichaGroup = (group) => React.createElement("section", { key: group.title, className: `${group.wide ? '2xl:col-span-2' : ''} overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm` },
        React.createElement("div", { className: "flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 xl:px-5" },
            React.createElement("div", { className: "flex min-w-0 items-center gap-3" },
                React.createElement("span", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#003865]/10 text-[#003865]" },
                    React.createElement(group.icon, { className: "h-5 w-5" })),
                React.createElement("div", { className: "min-w-0" },
                    React.createElement("h4", { className: "truncate text-sm md:text-base font-black text-slate-950" }, group.title),
                    React.createElement("p", { className: "mt-1 text-[10px] md:text-xs font-black uppercase tracking-[0.18em] text-slate-500" }, group.subtitle)))),
        React.createElement("div", { className: "divide-y-0" }, group.rows.map(renderFichaRow)));

    const isImageAttachment = (attachment) => {
        const text = `${attachment.mime || ''} ${attachment.nome || ''}`.toLowerCase();
        return text.includes('image/') || /\.(png|jpe?g|webp|gif)$/i.test(text);
    };
    const isPdfAttachment = (attachment) => {
        const text = `${attachment.mime || ''} ${attachment.nome || ''}`.toLowerCase();
        return text.includes('pdf') || /\.pdf$/i.test(text);
    };
    const renderAttachmentPreview = (attachment, label, url) => {
        if (url && isImageAttachment(attachment)) {
            return React.createElement("img", { src: url, alt: label, loading: "lazy", className: "h-44 w-full rounded-2xl border border-slate-200 bg-slate-100 object-cover" });
        }

        if (url && isPdfAttachment(attachment)) {
            return React.createElement("iframe", { src: url, title: label, className: "h-44 w-full rounded-2xl border border-slate-200 bg-white" });
        }

        const PreviewIcon = isImageAttachment(attachment) ? ImageIcon : FileText;
        return React.createElement("div", { className: "flex h-44 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-400" },
            React.createElement(PreviewIcon, { className: "h-10 w-10" }),
            React.createElement("span", { className: "mt-3 text-[10px] font-black uppercase tracking-[0.18em]" }, isPdfAttachment(attachment) ? 'PDF registrado' : 'Arquivo registrado'));
    };
    const renderAttachment = (attachment, index) => {
        const label = attachment.nome || `Anexo ${index + 1}`;
        const url = attachment.url || '';
        const typeLabel = isImageAttachment(attachment) ? 'Imagem' : isPdfAttachment(attachment) ? 'PDF' : (attachment.tipo || 'Arquivo');

        return React.createElement("article", { key: attachment.id || attachment.url || attachment.caminho || `${label}-${index}`, className: "rounded-3xl border border-slate-200 bg-white p-3 shadow-sm" },
            renderAttachmentPreview(attachment, label, url),
            React.createElement("div", { className: "mt-3 space-y-3 px-1" },
                React.createElement("div", { className: "min-w-0" },
                    React.createElement("p", { className: "truncate text-sm font-black text-slate-950", title: label }, label),
                    React.createElement("div", { className: "mt-2 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em]" },
                        React.createElement("span", { className: "rounded-full bg-sky-50 px-2.5 py-1 text-sky-700" }, typeLabel),
                        attachment.tamanho && React.createElement("span", { className: "rounded-full bg-slate-100 px-2.5 py-1 text-slate-500" }, formatFileSize(attachment.tamanho)))),
                url
                    ? React.createElement("div", { className: "grid grid-cols-2 gap-2" },
                        React.createElement("a", { href: url, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center justify-center gap-2 rounded-xl bg-[#003865] px-3 py-2 text-xs font-black text-white shadow-sm hover:bg-blue-800" },
                            "Abrir",
                            React.createElement(ExternalLink, { className: "h-3.5 w-3.5" })),
                        React.createElement("a", { href: url, download: label, className: "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-700 hover:bg-white" },
                            "Baixar",
                            React.createElement(Download, { className: "h-3.5 w-3.5" })))
                    : React.createElement("div", { className: "rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800" }, "Anexo registrado sem link publico disponivel.")));
    };

    const renderAttachmentsPanel = () => React.createElement("section", { className: "rounded-3xl border border-sky-100 bg-white p-4 md:p-5 shadow-sm" },
        React.createElement("div", { className: "mb-4 flex items-start justify-between gap-3 border-b border-sky-100 pb-3" },
            React.createElement("div", null,
                React.createElement("h4", { className: "flex items-center gap-2 text-sm md:text-base font-black text-slate-900" },
                    React.createElement(Paperclip, { className: "h-4 w-4 text-[#003865]" }),
                    "Anexos da atividade"),
                React.createElement("p", { className: "mt-1 text-[10px] md:text-xs font-black uppercase tracking-[0.18em] text-slate-500" }, "Imagens e PDFs vinculados a ficha")),
            React.createElement("span", { className: "rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-800" },
                attachmentsLoading ? "Atualizando..." : `${attachments.length} arquivo(s)`)),
        attachmentLoadError && React.createElement("div", { className: "mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800" }, attachmentLoadError),
        attachments.length > 0
            ? React.createElement("div", { className: "grid grid-cols-1 gap-3" }, attachments.map(renderAttachment))
            : React.createElement("div", { className: "rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center" },
                React.createElement(Paperclip, { className: "mx-auto h-8 w-8 text-slate-300" }),
                React.createElement("p", { className: "mt-3 text-sm font-black text-slate-500" }, attachmentsLoading ? "Carregando anexos..." : "Nenhum anexo registrado nesta atividade.")));

    const renderDatesPanel = () => React.createElement("section", { className: "rounded-3xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm" },
        React.createElement("div", { className: "mb-4 border-b border-slate-100 pb-3" },
            React.createElement("h4", { className: "flex items-center gap-2 text-sm md:text-base font-black text-slate-900" },
                React.createElement(CalendarDays, { className: "h-4 w-4 text-[#003865]" }),
                "Linha do tempo"),
            React.createElement("p", { className: "mt-1 text-[10px] md:text-xs font-black uppercase tracking-[0.18em] text-slate-500" }, "Datas protegidas contra edicao")),
        React.createElement("div", { className: "space-y-3" }, dateDetails.map((item) => React.createElement("div", { key: item.label, className: "flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3" },
            React.createElement("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#003865] shadow-sm" },
                React.createElement(item.icon, { className: "h-4 w-4" })),
            React.createElement("div", { className: "min-w-0" },
                React.createElement("span", { className: "block text-[10px] font-black uppercase tracking-[0.16em] text-slate-500" }, item.label),
                React.createElement("strong", { className: "block text-sm font-black text-slate-950" }, normalizeText(item.value)))))));

    const renderEditForm = () => {
        if (!onEdit) return null;

        return React.createElement("section", { className: "rounded-3xl border border-blue-100 bg-white p-4 md:p-5 shadow-sm 2xl:col-span-2" },
            React.createElement("div", { className: "rounded-2xl border border-blue-100 bg-blue-50/50 p-4" },
                React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" },
                    React.createElement("div", null,
                        React.createElement("h4", { className: "flex items-center gap-2 text-sm font-black text-slate-900" },
                            React.createElement(FileText, { className: "h-4 w-4 text-[#003865]" }),
                            "Editar ficha"),
                        React.createElement("p", { className: "mt-1 text-xs font-medium text-slate-500" }, "Todos os campos operacionais podem ser editados aqui. Datas ficam bloqueadas.")),
                    React.createElement("button", { type: "button", onClick: () => setIsEditOpen(current => !current), className: "rounded-xl border border-[#003865]/20 bg-[#003865] px-4 py-2 text-xs font-black text-white shadow-sm hover:bg-blue-800" },
                        isEditOpen ? "Fechar edicao" : "Editar ficha")),
                isEditOpen && React.createElement("form", { onSubmit: handleEditSubmit, className: "mt-4 space-y-4 border-t border-slate-100 pt-4" },
                    React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3" },
                        React.createElement("div", null,
                            React.createElement("label", { className: labelClass }, "Setor solicitante"),
                            React.createElement("select", { name: "setorSolicitante", value: editForm.setorSolicitante, onChange: handleEditChange, className: inputClass }, availableSetores.map((setor) => React.createElement("option", { key: setor, value: setor }, setor)))),
                        React.createElement("div", null,
                            React.createElement("label", { className: labelClass }, "Setor executor"),
                            React.createElement("select", { name: "setorExecutor", value: editForm.setorExecutor, onChange: handleEditChange, className: inputClass }, availableSetores.map((setor) => React.createElement("option", { key: setor, value: setor }, setor)))),
                        React.createElement("div", null,
                            React.createElement("label", { className: labelClass }, "Complexidade"),
                            React.createElement("select", { name: "complexidade", value: editForm.complexidade, onChange: handleEditChange, className: inputClass }, COMPLEXIDADES.map((item) => React.createElement("option", { key: item, value: item }, item))))),
                    React.createElement("div", null,
                        React.createElement("label", { className: labelClass }, "Descricao da atividade"),
                        React.createElement("textarea", { name: "descricao", value: editForm.descricao, onChange: handleEditChange, required: true, rows: 3, className: inputClass })),
                    React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" },
                        React.createElement("div", null,
                            React.createElement("label", { className: labelClass }, "Objetivo macro"),
                            React.createElement("input", { type: "text", name: "objetivo", value: editForm.objetivo, onChange: handleEditChange, className: inputClass, list: "task-objectives-list" }),
                            React.createElement("datalist", { id: "task-objectives-list" }, (objetivos || []).map((objetivo) => React.createElement("option", { key: objetivo, value: objetivo })))),
                        React.createElement("div", null,
                            React.createElement("label", { className: labelClass }, "Cliente ou fornecedor"),
                            React.createElement("input", { type: "text", name: "clienteFornecedor", value: editForm.clienteFornecedor, onChange: handleEditChange, className: inputClass }))),
                    React.createElement("div", null,
                        React.createElement("label", { className: labelClass }, "Dependencia"),
                        React.createElement("select", { name: "dependencia", value: editForm.dependencia, onChange: handleEditChange, className: inputClass },
                            React.createElement("option", { value: "" }, "Sem dependencia"),
                            dependencyOptions.map((item) => React.createElement("option", { key: item.id, value: item.id },
                                "[",
                                item.setorExecutor,
                                "] ",
                                item.descricao && item.descricao.length > 90 ? item.descricao.substring(0, 90) + '...' : item.descricao)))),
                    React.createElement("div", { className: "rounded-xl border border-indigo-100 bg-indigo-50/60 p-3" },
                        React.createElement("label", { className: "flex items-center gap-2 text-xs font-black text-indigo-800" },
                            React.createElement("input", { type: "checkbox", name: "deslocamento", checked: editForm.deslocamento, onChange: handleEditChange, className: "rounded border-indigo-300 text-[#003865] focus:ring-[#003865]" }),
                            "Possui deslocamento"),
                        editForm.deslocamento && React.createElement("div", { className: "mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3" },
                            React.createElement("div", { className: "sm:col-span-3" },
                                React.createElement("label", { className: labelClass }, "Local"),
                                React.createElement("input", { type: "text", name: "local", value: editForm.local, onChange: handleEditChange, className: inputClass })),
                            React.createElement("div", null,
                                React.createElement("label", { className: labelClass }, "Tempo"),
                                React.createElement("input", { type: "number", min: "0", name: "duracaoDeslocamento", value: editForm.duracaoDeslocamento, onChange: handleEditChange, className: inputClass })),
                            React.createElement("div", null,
                                React.createElement("label", { className: labelClass }, "Unidade"),
                                React.createElement("select", { name: "unidadeDeslocamento", value: editForm.unidadeDeslocamento, onChange: handleEditChange, className: inputClass },
                                    React.createElement("option", { value: "Horas" }, "Horas"),
                                    React.createElement("option", { value: "Dias" }, "Dias"))))),
                    React.createElement("div", { className: "rounded-xl border border-orange-100 bg-orange-50/60 p-3" },
                        React.createElement("label", { className: "flex items-center gap-2 text-xs font-black text-orange-800" },
                            React.createElement("input", { type: "checkbox", name: "geraCusto", checked: editForm.geraCusto, onChange: handleEditChange, className: "rounded border-orange-300 text-[#003865] focus:ring-[#003865]" }),
                            "Gera custo"),
                        editForm.geraCusto && React.createElement("div", { className: "mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3" },
                            React.createElement("div", null,
                                React.createElement("label", { className: labelClass }, "Descricao do custo"),
                                React.createElement("input", { type: "text", name: "tipoCusto", value: editForm.tipoCusto, onChange: handleEditChange, className: inputClass })),
                            React.createElement("div", null,
                                React.createElement("label", { className: labelClass }, "Valor estimado"),
                                React.createElement("input", { type: "number", step: "0.01", min: "0", name: "valorCusto", value: editForm.valorCusto, onChange: handleEditChange, className: inputClass })))),
                    editError && React.createElement("div", { className: "rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700" }, editError),
                    React.createElement("div", { className: "flex justify-end" },
                        React.createElement("button", { type: "submit", disabled: isEditing, className: "rounded-xl bg-[#003865] px-5 py-2.5 text-xs font-black text-white shadow-sm hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60" },
                            isEditing ? "Salvando..." : "Salvar edicao")))));
    };

    const renderComplementForm = () => {
        if (onEdit) return null;
        if (!onComplete || !complementOptions.hasComplementableFields) return null;

        return React.createElement("section", { className: "rounded-3xl border border-blue-100 bg-white p-4 md:p-5 shadow-sm 2xl:col-span-2" },
            React.createElement("div", { className: "rounded-2xl border border-blue-100 bg-blue-50/50 p-4" },
                React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" },
                    React.createElement("div", null,
                        React.createElement("h4", { className: "flex items-center gap-2 text-sm font-black text-slate-900" },
                            React.createElement(PlusCircle, { className: "h-4 w-4 text-[#003865]" }),
                            "Completar campos vazios"),
                        React.createElement("p", { className: "mt-1 text-xs font-medium text-slate-500" }, "Somente informacoes ainda vazias podem ser preenchidas. Campos ja registrados ficam bloqueados.")),
                    React.createElement("button", { type: "button", onClick: () => setIsComplementOpen(current => !current), className: "rounded-xl border border-[#003865]/20 bg-[#003865] px-4 py-2 text-xs font-black text-white shadow-sm hover:bg-blue-800" },
                        isComplementOpen ? "Fechar complemento" : "Completar ficha")),
                isComplementOpen && React.createElement("form", { onSubmit: handleComplementSubmit, className: "mt-4 space-y-4 border-t border-slate-100 pt-4" },
                    complementOptions.canFillObjective && React.createElement("div", null,
                        React.createElement("label", { className: labelClass }, "Objetivo macro"),
                        React.createElement("input", { type: "text", name: "objetivo", value: completionForm.objetivo, onChange: handleCompletionChange, className: inputClass, placeholder: "Informe o objetivo correto" })),
                    complementOptions.canFillClienteFornecedor && React.createElement("div", null,
                        React.createElement("label", { className: labelClass }, "Cliente ou fornecedor"),
                        React.createElement("input", { type: "text", name: "clienteFornecedor", value: completionForm.clienteFornecedor, onChange: handleCompletionChange, className: inputClass, placeholder: "Nome do cliente ou fornecedor envolvido" })),
                    complementOptions.canFillDisplacement && React.createElement("div", { className: "rounded-xl border border-indigo-100 bg-indigo-50/60 p-3" },
                        React.createElement("label", { className: "flex items-center gap-2 text-xs font-black text-indigo-800" },
                            React.createElement("input", { type: "checkbox", name: "deslocamento", checked: completionForm.deslocamento, onChange: handleCompletionChange, disabled: Boolean(task.deslocamento), className: "rounded border-indigo-300 text-[#003865] focus:ring-[#003865]" }),
                            "Complementar deslocamento"),
                        (completionForm.deslocamento || task.deslocamento) && React.createElement("div", { className: "mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3" },
                            isBlankValue(task.local) && React.createElement("div", { className: "sm:col-span-3" },
                                React.createElement("label", { className: labelClass }, "Local"),
                                React.createElement("input", { type: "text", name: "local", value: completionForm.local, onChange: handleCompletionChange, className: inputClass, placeholder: "Endereco, cidade ou empresa" })),
                            isBlankValue(task.duracaoDeslocamento) && React.createElement("div", null,
                                React.createElement("label", { className: labelClass }, "Tempo"),
                                React.createElement("input", { type: "number", min: "0", name: "duracaoDeslocamento", value: completionForm.duracaoDeslocamento, onChange: handleCompletionChange, className: inputClass, placeholder: "Ex: 2" })),
                            isBlankValue(task.duracaoDeslocamento) && React.createElement("div", null,
                                React.createElement("label", { className: labelClass }, "Unidade"),
                                React.createElement("select", { name: "unidadeDeslocamento", value: completionForm.unidadeDeslocamento, onChange: handleCompletionChange, className: inputClass },
                                    React.createElement("option", { value: "Horas" }, "Horas"),
                                    React.createElement("option", { value: "Dias" }, "Dias"))))),
                    complementOptions.canFillCost && React.createElement("div", { className: "rounded-xl border border-orange-100 bg-orange-50/60 p-3" },
                        React.createElement("label", { className: "flex items-center gap-2 text-xs font-black text-orange-800" },
                            React.createElement("input", { type: "checkbox", name: "geraCusto", checked: completionForm.geraCusto, onChange: handleCompletionChange, disabled: Boolean(task.geraCusto), className: "rounded border-orange-300 text-[#003865] focus:ring-[#003865]" }),
                            "Complementar custo"),
                        (completionForm.geraCusto || task.geraCusto) && React.createElement("div", { className: "mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3" },
                            isBlankValue(task.tipoCusto) && React.createElement("div", null,
                                React.createElement("label", { className: labelClass }, "Descricao do custo"),
                                React.createElement("input", { type: "text", name: "tipoCusto", value: completionForm.tipoCusto, onChange: handleCompletionChange, className: inputClass, placeholder: "Ex: compra de material" })),
                            !hasPositiveMoneyValue(task.valorCusto) && React.createElement("div", null,
                                React.createElement("label", { className: labelClass }, "Valor estimado"),
                                React.createElement("input", { type: "number", step: "0.01", min: "0", name: "valorCusto", value: completionForm.valorCusto, onChange: handleCompletionChange, className: inputClass, placeholder: "0.00" })))),
                    completionError && React.createElement("div", { className: "rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700" }, completionError),
                    React.createElement("div", { className: "flex justify-end" },
                        React.createElement("button", { type: "submit", disabled: isCompleting, className: "rounded-xl bg-[#003865] px-5 py-2.5 text-xs font-black text-white shadow-sm hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60" },
                            isCompleting ? "Salvando..." : "Salvar complemento")))));
    };

    const modal = React.createElement("div", { className: "fixed inset-0 z-[205] bg-slate-100", onClick: (event) => {
            if (event.target === event.currentTarget) onClose();
        } },
        React.createElement("div", { className: "flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-50" },
            React.createElement("header", { className: "shrink-0 border-b border-slate-200 bg-white shadow-sm" },
                React.createElement("div", { className: "w-full px-4 py-3 sm:px-6 lg:px-8 2xl:px-10" },
                    React.createElement("div", { className: "grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_56px]" },
                        React.createElement("div", { className: "min-w-0" },
                            React.createElement("p", { className: "mb-1 flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.24em] text-slate-500" },
                                React.createElement(FileText, { className: "h-4 w-4 text-[#003865]" }),
                                "Ficha completa da atividade"),
                            React.createElement("div", { className: "flex flex-col gap-2 2xl:flex-row 2xl:items-end 2xl:justify-between" },
                                React.createElement("div", { className: "min-w-0" },
                                    React.createElement("h3", { className: "text-2xl md:text-3xl font-black tracking-tight text-slate-950" }, "Ficha principal"),
                                    React.createElement("p", { className: "mt-1 text-sm md:text-base font-bold leading-snug text-slate-600" }, normalizeText(task.descricao))))),
                        React.createElement("button", { type: "button", onClick: onClose, className: "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100 xl:justify-self-end", "aria-label": "Fechar ficha da atividade" },
                            React.createElement(X, { className: "w-5 h-5" }))),
                    React.createElement("div", { className: "mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" }, summaryCards.map(renderMetricCard)))),
            React.createElement("main", { className: "flex-1 overflow-y-auto overscroll-contain" },
                React.createElement("div", { className: "w-full px-4 py-4 sm:px-6 lg:px-8 2xl:px-10" },
                    React.createElement("div", { className: "grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_410px] 2xl:grid-cols-[minmax(0,1fr)_460px]" },
                        React.createElement("div", { className: "grid grid-cols-1 gap-5 2xl:grid-cols-2" },
                            fichaGroups.map(renderFichaGroup),
                            renderEditForm(),
                            renderComplementForm()),
                        React.createElement("aside", { className: "space-y-5 self-start xl:sticky xl:top-5" },
                            renderAttachmentsPanel(),
                            renderDatesPanel()))))));

    return ReactDOM.createPortal ? ReactDOM.createPortal(modal, document.body) : modal;
}
// ABA 3: Painel do Gestor (DUAS EXPERIÊNCIAS: DESKTOP E MOBILE COMO BLOCOS EMPILHADOS DE ALTA VELOCIDADE)
function ManagerPanelView({ tasks, setores = SETORES, onCloseTask, onUpdateDeadline }) {
    const [evaluatingTask, setEvaluatingTask] = useState(null);
    const [expandedSector, setExpandedSector] = useState(null);
    const [sectorPasswordTask, setSectorPasswordTask] = useState(null);
    const [sectorPasswordError, setSectorPasswordError] = useState('');
    const [isVerifyingSectorPassword, setIsVerifyingSectorPassword] = useState(false);
    const today = todayDateOnly();
    const pendingTasks = tasks.filter(t => t.status === STATUS.PENDENTE);
    const reviewTasks = tasks.filter(t => t.status === STATUS.AGUARDANDO_AVALIACAO);
    const doneTasks = tasks.filter(t => t.status === STATUS.CONCLUIDA);
    const overdueTasks = pendingTasks.filter(t => getTaskScheduleState(t, today).isOverdue);
    const onTimeDeliveries = doneTasks.filter(t => getTaskScheduleState(t, today).isOnTimeOriginal);
    const onTimeRate = doneTasks.length > 0 ? Math.round((onTimeDeliveries.length / doneTasks.length) * 100) : 0;
    const complexityWeight = { 'Baixa': 1, 'Média': 2, 'Alta': 3 };
    const moneyBR = (value) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const shortDateBR = (value) => formatDateBR(value, 'Sem prazo');
    const availableSetores = (Array.isArray(setores) && setores.length) ? setores : SETORES;
    const workloadGrid = availableSetores.map(setor => {
        const tasksAsExecutor = tasks.filter(t => t.setorExecutor === setor);
        const tasksAsSolicitante = tasks.filter(t => t.setorSolicitante === setor && t.setorExecutor !== setor);
        const concluidas = tasksAsExecutor.filter(t => t.status === STATUS.CONCLUIDA).length;
        const atrasadasList = tasksAsExecutor.filter(t => getTaskScheduleState(t, today).isOverdue);
        const custoPrevisto = tasksAsExecutor.reduce((sum, t) => sum + Number(t.valorCusto || 0), 0);
        const pendentes = tasksAsExecutor.filter(t => t.status !== STATUS.CONCLUIDA).length;
        const cruzadas = tasksAsExecutor.filter(t => t.setorSolicitante !== setor).length;
        const comDependencia = tasksAsExecutor.filter(t => t.dependencia).length;
        const sla = tasksAsExecutor.length > 0 ? Math.round((concluidas / tasksAsExecutor.length) * 100) : 0;
        const pesoPontuacao = tasksAsExecutor.reduce((sum, t) => sum + (complexityWeight[t.complexidade] || 1), 0);
        const pesoOperacional = pesoPontuacao >= 8 || atrasadasList.length >= 2 ? 'ALTO' : pesoPontuacao >= 4 || atrasadasList.length === 1 ? 'MÉDIO' : 'BAIXO';
        const criticalTask = tasksAsExecutor
            .filter(t => t.status !== STATUS.CONCLUIDA)
            .map(t => ({
                ...t,
                criticalScore:
                    (complexityWeight[t.complexidade] || 1) * 10 +
                    (getTaskScheduleState(t, today).isOverdue ? 40 : 0) +
                    (Number(t.valorCusto || 0) > 0 ? Math.min(20, Number(t.valorCusto || 0) / 200) : 0) +
                    (t.dependencia ? 10 : 0) +
                    (t.status === STATUS.AGUARDANDO_AVALIACAO ? 5 : 0)
            }))
            .sort((a, b) => b.criticalScore - a.criticalScore)[0] || null;
        const riskLevel = atrasadasList.length > 0 ? 'RISCO' : comDependencia > 0 || cruzadas > 0 ? 'ATENÇÃO' : 'SAUDÁVEL';
        const riskClass = riskLevel === 'RISCO' ? 'bg-rose-50 text-rose-700 border-rose-200' : riskLevel === 'ATENÇÃO' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
        return {
            setor,
            totalRegistradas: tasksAsExecutor.length,
            concluidas,
            pendentes,
            atrasadas: atrasadasList.length,
            apoioAOutros: cruzadas,
            demandouParaOutros: tasksAsSolicitante.length,
            comDependencia,
            custoPrevisto,
            sla,
            pesoOperacional,
            criticalTask,
            riskLevel,
            riskClass,
            eficienciaBar: Math.max(6, sla)
        };
    }).filter(w => w.totalRegistradas > 0 || w.demandouParaOutros > 0).sort((a, b) => {
        if (b.atrasadas !== a.atrasadas) return b.atrasadas - a.atrasadas;
        return b.totalRegistradas - a.totalRegistradas;
    });
    // Define as cores das bordas e pílulas (badges)
    const statusColors = {
        [STATUS.CONCLUIDA]: { border: 'border-l-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        [STATUS.AGUARDANDO_AVALIACAO]: { border: 'border-l-amber-400', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
        [STATUS.PENDENTE]: { border: 'border-l-slate-300', badge: 'bg-slate-50 text-slate-600 border-slate-200' }
    };
    const EvaluationModal = ({ task, onClose }) => {
        const [evalData, setEvalData] = useState({
            avaliacao: '',
            dataAvaliacao: todayDateOnly(),
            conclusaoReal: task.conclusaoRealUser || todayDateOnly(),
            necessitaAjuste: false,
            encaminhamento: ''
        });
        const handleSubmit = (e) => {
            e.preventDefault();
            onCloseTask(task.id, evalData);
            onClose();
        };
        const inputClass = "mt-1 block w-full rounded-lg border-slate-300 bg-white py-2.5 px-3 text-sm md:text-base text-slate-900 shadow-sm focus:border-[#003865] focus:outline-none focus:ring-1 focus:ring-[#003865] transition-colors border";
        const labelClass = "block text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";
        return (React.createElement("div", { className: "fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-[110] animate-in fade-in duration-200" },
            React.createElement("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col mt-10 md:mt-0" },
                React.createElement("div", { className: "bg-slate-50 border-b border-slate-200 px-5 py-4 md:p-6 flex justify-between items-center" },
                    React.createElement("h3", { className: "text-base md:text-xl font-extrabold text-[#003865] flex items-center gap-2" },
                        React.createElement(CheckCircle, { className: "w-5 h-5 md:w-6 md:h-6" }),
                        "Avalia\u00E7\u00E3o Final"),
                    React.createElement("button", { onClick: onClose, className: "text-slate-400 hover:text-slate-700 transition-colors p-2 -mr-2 rounded-full hover:bg-slate-200" },
                        React.createElement(X, { className: "w-5 h-5 md:w-6 md:h-6" }))),
                React.createElement("div", { className: "p-5 md:p-6 overflow-y-auto max-h-[75vh]" },
                    React.createElement("div", { className: "bg-blue-50/80 border border-blue-100 rounded-xl p-4 md:p-5 mb-6" },
                        React.createElement("span", { className: "text-[10px] font-bold text-blue-600 uppercase tracking-wider" }, "Atividade em An\u00E1lise"),
                        React.createElement("p", { className: "text-sm md:text-base text-slate-800 font-bold mt-1.5 leading-snug" }, task.descricao)),
                    React.createElement("form", { onSubmit: handleSubmit, className: "space-y-5 md:space-y-6" },
                        React.createElement("div", null,
                            React.createElement("label", { className: labelClass }, "Avalia\u00E7\u00E3o do Gestor (Feedback)"),
                            React.createElement("textarea", { required: true, value: evalData.avaliacao, onChange: e => setEvalData({ ...evalData, avaliacao: e.target.value }), className: inputClass, rows: "3", placeholder: "O que achou da entrega?" })),
                        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5" },
                            React.createElement("div", null,
                                React.createElement("label", { className: labelClass }, "Data da Avalia\u00E7\u00E3o"),
                                React.createElement("input", { type: "date", required: true, value: evalData.dataAvaliacao, onChange: e => setEvalData({ ...evalData, dataAvaliacao: e.target.value }), className: inputClass })),
                            React.createElement("div", null,
                                React.createElement("label", { className: labelClass }, "Data Real da Conclus\u00E3o"),
                                React.createElement("input", { type: "date", required: true, value: evalData.conclusaoReal, onChange: e => setEvalData({ ...evalData, conclusaoReal: e.target.value }), className: `${inputClass} border-emerald-300 bg-emerald-50/50 text-emerald-900 font-bold` }))),
                        React.createElement("div", { className: "flex items-center justify-between p-4 md:p-5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer", onClick: () => setEvalData({ ...evalData, necessitaAjuste: !evalData.necessitaAjuste }) },
                            React.createElement("span", { className: "text-sm font-bold text-slate-700" }, "Necessita de Ajuste Posterior?"),
                            React.createElement("button", { type: "button", className: `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${evalData.necessitaAjuste ? 'bg-amber-500' : 'bg-slate-300'}` },
                                React.createElement("span", { className: `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${evalData.necessitaAjuste ? 'translate-x-5' : 'translate-x-0'}` }))),
                        React.createElement("div", null,
                            React.createElement("label", { className: labelClass }, "Encaminhamento / Decis\u00E3o Final"),
                            React.createElement("textarea", { required: true, value: evalData.encaminhamento, onChange: e => setEvalData({ ...evalData, encaminhamento: e.target.value }), className: inputClass, rows: "2", placeholder: "Quais os pr\u00F3ximos passos operacionais?" })),
                        React.createElement("div", { className: "flex flex-col-reverse sm:flex-row justify-end gap-3 pt-5 md:pt-6 border-t border-slate-100" },
                            React.createElement("button", { type: "button", onClick: onClose, className: "w-full sm:w-auto px-6 py-3 text-sm text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors" }, "Cancelar"),
                            React.createElement("button", { type: "submit", className: "w-full sm:w-auto px-6 py-3 text-sm text-white font-bold bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center transition-colors" },
                                React.createElement(CheckCircle, { className: "w-5 h-5 mr-2" }),
                                " Confirmar Baixa Final")))))));
    };
    return (React.createElement("div", { className: "w-full flex flex-col space-y-6 md:space-y-8" },
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" },
            React.createElement("div", { className: "bg-white rounded-2xl shadow-sm border border-blue-200 p-5 md:p-6 flex items-start space-x-4 md:space-x-5" },
                React.createElement("div", { className: "p-3 md:p-4 bg-blue-100 rounded-xl text-blue-700" },
                    React.createElement(UserCog, { className: "w-6 h-6 md:w-8 md:h-8" })),
                React.createElement("div", null,
                    React.createElement("h3", { className: "text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-1" }, "Aguardando Avalia\u00E7\u00E3o"),
                    React.createElement("div", { className: "flex items-baseline space-x-2" },
                        React.createElement("span", { className: "text-3xl md:text-4xl font-black text-slate-800" }, reviewTasks.length),
                        React.createElement("span", { className: "text-xs md:text-sm text-slate-500 font-medium" }, "atividades")),
                    reviewTasks.length > 0 && React.createElement("p", { className: "text-[10px] md:text-xs text-blue-600 mt-1 font-bold" }, "Requer aten\u00E7\u00E3o imediata!"))),
            React.createElement("div", { className: "bg-white rounded-2xl shadow-sm border border-emerald-200 p-5 md:p-6 flex items-start space-x-4 md:space-x-5" },
                React.createElement("div", { className: "p-3 md:p-4 bg-emerald-100 rounded-xl text-emerald-700" },
                    React.createElement(TrendingUp, { className: "w-6 h-6 md:w-8 md:h-8" })),
                React.createElement("div", null,
                    React.createElement("h3", { className: "text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-1" }, "Entregas no Prazo"),
                    React.createElement("div", { className: "flex items-baseline space-x-2" },
                        React.createElement("span", { className: "text-3xl md:text-4xl font-black text-slate-800" }, doneTasks.length > 0 ? `${onTimeRate}%` : '--')),
                    React.createElement("p", { className: "text-[10px] md:text-xs text-slate-500 mt-1 font-medium" },
                        "Das ",
                        doneTasks.length,
                        " tarefas conclu\u00EDdas"))),
            React.createElement("div", { className: "bg-white rounded-2xl shadow-sm border border-rose-200 p-5 md:p-6 flex items-start space-x-4 md:space-x-5" },
                React.createElement("div", { className: "p-3 md:p-4 bg-rose-100 rounded-xl text-rose-700" },
                    React.createElement(AlertTriangle, { className: "w-6 h-6 md:w-8 md:h-8" })),
                React.createElement("div", null,
                    React.createElement("h3", { className: "text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-1" }, "Risco (Atrasos)"),
                    React.createElement("div", { className: "flex items-baseline space-x-2" },
                        React.createElement("span", { className: "text-3xl md:text-4xl font-black text-rose-600" }, overdueTasks.length),
                        React.createElement("span", { className: "text-xs md:text-sm text-slate-500 font-medium" }, "atrasadas")),
                    React.createElement("p", { className: "text-[10px] md:text-xs text-rose-600 mt-1 font-bold" },
                        "De ",
                        pendingTasks.length,
                        " em andamento")))),
        React.createElement("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-8" },
            React.createElement("div", { className: "mb-5 md:mb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-3" },
                React.createElement("div", null,
                    React.createElement("h3", { className: "text-lg md:text-xl font-extrabold text-slate-800 flex items-center" },
                        React.createElement(BarChart3, { className: "w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-[#003865]" }),
                        " Desempenho e Carga por Setor"),
                    React.createElement("p", { className: "text-xs md:text-sm text-slate-500 mt-1 font-medium" },
                        "Ficha operacional por setor com SLA, risco, carga, custo e uma atividade crítica por bloco.")),
                React.createElement("span", { className: "self-start lg:self-auto bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest" },
                    workloadGrid.length,
                    " setores monitorados")),
            React.createElement("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5" },
                workloadGrid.length === 0 && React.createElement("p", { className: "text-slate-500 py-4 font-medium text-sm col-span-full" }, "Nenhum dado de setor disponível no momento."),
                workloadGrid.map(w => {
                    const isOpen = expandedSector === w.setor;
                    const slaColor = w.sla >= 75 ? "text-emerald-700" : w.sla >= 45 ? "text-amber-700" : "text-rose-700";
                    const barColor = w.sla >= 75 ? "bg-emerald-500" : w.sla >= 45 ? "bg-amber-500" : "bg-rose-500";
                    return React.createElement("article", { key: w.setor, className: "bg-slate-50/70 border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow" },
                        React.createElement("div", { className: "flex items-start justify-between gap-3" },
                            React.createElement("div", { className: "min-w-0" },
                                React.createElement("div", { className: "flex items-center gap-2 flex-wrap" },
                                    React.createElement("h4", { className: "font-black text-slate-900 text-lg md:text-xl leading-tight" }, w.setor),
                                    React.createElement("span", { className: `border px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${w.riskClass}` }, w.riskLevel)),
                                React.createElement("p", { className: "text-xs text-slate-500 font-bold mt-1" },
                                    w.totalRegistradas,
                                    " atribuídas • ",
                                    w.pendentes,
                                    " em aberto • ",
                                    w.atrasadas,
                                    " atrasadas")),
                            React.createElement("div", { className: "text-right shrink-0" },
                                React.createElement("span", { className: `block text-2xl md:text-3xl font-black ${slaColor}` },
                                    w.sla,
                                    "%"),
                                React.createElement("span", { className: "text-[10px] uppercase tracking-widest font-black text-slate-400" }, "SLA"))),
                        React.createElement("div", { className: "mt-4" },
                            React.createElement("div", { className: "h-2.5 bg-white border border-slate-200 rounded-full overflow-hidden" },
                                React.createElement("div", { className: `h-full rounded-full ${barColor}`, style: { width: `${w.eficienciaBar}%` } })),
                            React.createElement("div", { className: "mt-3 grid grid-cols-4 gap-2 text-center" },
                                React.createElement("div", { className: "bg-white border border-slate-200 rounded-xl p-2" },
                                    React.createElement("strong", { className: "block text-base md:text-lg text-slate-900" }, w.concluidas),
                                    React.createElement("span", { className: "text-[9px] md:text-[10px] uppercase font-black text-slate-400" }, "Concluídas")),
                                React.createElement("div", { className: "bg-white border border-slate-200 rounded-xl p-2" },
                                    React.createElement("strong", { className: "block text-base md:text-lg text-rose-600" }, w.atrasadas),
                                    React.createElement("span", { className: "text-[9px] md:text-[10px] uppercase font-black text-slate-400" }, "Atrasos")),
                                React.createElement("div", { className: "bg-white border border-slate-200 rounded-xl p-2" },
                                    React.createElement("strong", { className: "block text-base md:text-lg text-purple-600" }, w.apoioAOutros),
                                    React.createElement("span", { className: "text-[9px] md:text-[10px] uppercase font-black text-slate-400" }, "Cruzadas")),
                                React.createElement("div", { className: "bg-white border border-slate-200 rounded-xl p-2" },
                                    React.createElement("strong", { className: "block text-base md:text-lg text-amber-600" }, w.comDependencia),
                                    React.createElement("span", { className: "text-[9px] md:text-[10px] uppercase font-black text-slate-400" }, "Depend.")))),
                        React.createElement("div", { className: "mt-4 bg-white border border-slate-200 rounded-xl p-3 md:p-4" },
                            React.createElement("div", { className: "flex items-center justify-between gap-3 mb-2" },
                                React.createElement("span", { className: "text-[10px] uppercase tracking-widest font-black text-slate-400" }, "Atividade mais crítica"),
                                React.createElement("span", { className: "text-[10px] uppercase tracking-widest font-black text-slate-500 bg-slate-100 rounded-full px-2 py-1" },
                                    "Peso ",
                                    w.pesoOperacional)),
                            w.criticalTask ? React.createElement(React.Fragment, null,
                                React.createElement("p", { className: "font-extrabold text-slate-800 text-sm md:text-base leading-snug line-clamp-2" }, w.criticalTask.descricao),
                                React.createElement("div", { className: "mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] md:text-xs font-bold text-slate-600" },
                                    React.createElement("span", { className: "bg-slate-50 border border-slate-200 rounded-lg px-2 py-1" }, w.criticalTask.complexidade || "Sem complex."),
                                    React.createElement("span", { className: "bg-slate-50 border border-slate-200 rounded-lg px-2 py-1" },
                                        "Prazo ",
                                        shortDateBR(w.criticalTask.conclusaoPrevista)),
                                    React.createElement("span", { className: "bg-slate-50 border border-slate-200 rounded-lg px-2 py-1" },
                                        w.criticalTask.objetivo || "Sem objetivo"),
                                    React.createElement("span", { className: "bg-slate-50 border border-slate-200 rounded-lg px-2 py-1" },
                                        moneyBR(w.criticalTask.valorCusto)))) :
                                React.createElement("p", { className: "font-bold text-emerald-700 text-sm" }, "Sem atividade crítica em aberto.")),
                        React.createElement("button", {
                            type: "button",
                            onClick: () => setExpandedSector(isOpen ? null : w.setor),
                            className: "md:hidden mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-600"
                        }, isOpen ? "Ocultar detalhes" : "Ver detalhes"),
                        React.createElement("div", { className: `${isOpen ? "block" : "hidden"} md:block mt-3` },
                            React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2 text-xs" },
                                React.createElement("div", { className: "rounded-xl bg-white border border-slate-200 p-3" },
                                    React.createElement("span", { className: "block text-slate-400 font-black uppercase text-[10px]" }, "Custo previsto"),
                                    React.createElement("strong", { className: "text-slate-800" }, moneyBR(w.custoPrevisto))),
                                React.createElement("div", { className: "rounded-xl bg-white border border-slate-200 p-3" },
                                    React.createElement("span", { className: "block text-slate-400 font-black uppercase text-[10px]" }, "Demandou"),
                                    React.createElement("strong", { className: "text-slate-800" },
                                        w.demandouParaOutros,
                                        " p/ outros")),
                                React.createElement("div", { className: "rounded-xl bg-white border border-slate-200 p-3" },
                                    React.createElement("span", { className: "block text-slate-400 font-black uppercase text-[10px]" }, "Carga"),
                                    React.createElement("strong", { className: "text-slate-800" }, w.pesoOperacional)),
                                React.createElement("div", { className: "rounded-xl bg-white border border-slate-200 p-3" },
                                    React.createElement("span", { className: "block text-slate-400 font-black uppercase text-[10px]" }, "Gargalo"),
                                    React.createElement("strong", { className: w.atrasadas > 0 ? "text-rose-600" : "text-emerald-700" },
                                        w.atrasadas > 0 ? `${w.atrasadas} atraso(s)` : "Controlado")))));
                }))),
        React.createElement("div", { className: "bg-slate-50/30 rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col" },
            React.createElement("div", { className: "p-5 md:p-8 border-b border-slate-200 bg-white" },
                React.createElement("h2", { className: "text-lg md:text-xl font-extrabold text-slate-800 flex items-center" },
                    React.createElement(FileText, { className: "w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-[#003865]" }),
                    " A\u00E7\u00F5es do Gestor"),
                React.createElement("p", { className: "text-xs md:text-sm text-slate-500 mt-2 font-medium" }, "Os blocos abaixo exigem sua r\u00E1pida tomada de decis\u00E3o (Aprova\u00E7\u00E3o ou Ajuste de Prazos).")),
            React.createElement("div", { className: "p-4 md:p-6 lg:p-8 space-y-4 md:space-y-5 bg-slate-100/50" },
                tasks.length === 0 && (React.createElement("div", { className: "bg-white rounded-xl border border-slate-200 p-8 text-center" },
                    React.createElement("p", { className: "text-slate-500 font-medium" }, "Nenhuma tarefa no sistema no momento."))),
                tasks.map(task => {
                    const schedule = getTaskScheduleState(task, today);
                    const isOverdue = schedule.isOverdue;
                    const colors = statusColors[task.status];
                    // Determina a cor especial da borda para atrasos
                    let borderColorClass = colors.border;
                    if (task.status === STATUS.PENDENTE && isOverdue)
                        borderColorClass = 'border-l-rose-500';
                    return (React.createElement("div", { key: task.id, className: `bg-white rounded-2xl border border-slate-200 border-l-4 ${borderColorClass} p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row gap-5 lg:gap-8 lg:items-center relative` },
                        React.createElement("div", { className: "flex-1 flex flex-col gap-3" },
                            React.createElement("div", { className: "flex flex-wrap items-center gap-2 mb-1" },
                                React.createElement("span", { className: `px-2.5 py-1 rounded-md text-[10px] md:text-[11px] font-black uppercase tracking-widest border ${colors.badge}` }, task.status),
                                React.createElement("span", { className: "flex items-center text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md" },
                                    React.createElement(MapPin, { className: "w-3.5 h-3.5 mr-1" }),
                                    " Resp: ",
                                    task.setorExecutor),
                                task.setorSolicitante !== task.setorExecutor && (React.createElement("span", { className: "flex items-center text-xs font-bold text-slate-500 border border-slate-200 px-2.5 py-1 rounded-md" },
                                    "Solic: ",
                                    task.setorSolicitante)),
                                isOverdue && task.status === STATUS.PENDENTE && (React.createElement("span", { className: "inline-flex items-center gap-1 text-[10px] uppercase font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100" },
                                    React.createElement(AlertCircle, { className: "w-3.5 h-3.5" }),
                                    " ",
                                    schedule.delayDays,
                                    " dia(s) de atraso"))),
                            React.createElement("h4", { className: "text-base md:text-lg font-extrabold text-slate-800 leading-snug" }, task.descricao),
                            React.createElement("div", { className: "flex flex-wrap items-center gap-2 mt-1" },
                                task.objetivo && (React.createElement("span", { className: "flex items-center text-xs font-bold text-[#003865] bg-[#003865]/5 border border-[#003865]/10 px-2.5 py-1.5 rounded-md" },
                                    React.createElement(Target, { className: "w-3.5 h-3.5 mr-1.5" }),
                                    " ",
                                    task.objetivo)),
                                React.createElement("span", { className: "flex items-center text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-md" },
                                    React.createElement(Calendar, { className: "w-3.5 h-3.5 mr-1.5 text-slate-400" }),
                                    " Previsto: ",
                                    formatDateBR(schedule.currentDueDate)),
                                schedule.isReplanned && (React.createElement("span", { className: "flex items-center text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1.5 rounded-md" },
                                    React.createElement(CalendarDays, { className: "w-3.5 h-3.5 mr-1.5" }),
                                    " Original: ",
                                    formatDateBR(schedule.originalDueDate))),
                                task.deslocamento && (React.createElement("span", { className: "flex items-center text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1.5 rounded-md" },
                                    React.createElement(Truck, { className: "w-3.5 h-3.5 mr-1.5" }),
                                    " ",
                                    task.duracaoDeslocamento ? `${task.duracaoDeslocamento} ${task.unidadeDeslocamento}` : 'Logística')),
                                task.geraCusto && (React.createElement("span", { className: "flex items-center text-xs font-bold text-orange-700 bg-orange-50 border border-orange-100 px-2.5 py-1.5 rounded-md" },
                                    React.createElement(DollarSign, { className: "w-3.5 h-3.5 mr-1" }),
                                    " ",
                                    task.valorCusto ? `R$ ${task.valorCusto}` : 'Com Custo')))),
                        React.createElement("div", { className: "w-full lg:w-72 flex-shrink-0 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-200 pt-5 lg:pt-0 lg:pl-8" },
                            task.status === STATUS.AGUARDANDO_AVALIACAO && (React.createElement("button", { onClick: () => setEvaluatingTask(task), className: "w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#003865] text-white hover:bg-blue-800 rounded-xl shadow-lg transition-transform active:scale-95 font-extrabold text-sm" },
                                React.createElement(CheckCircle, { className: "w-5 h-5" }),
                                " Avaliar Entrega Agora")),
                            task.status === STATUS.PENDENTE && isOverdue && (React.createElement("div", { className: "flex flex-col gap-2 bg-rose-50/50 p-4 rounded-xl border border-rose-100 w-full" },
                                React.createElement("label", { className: "text-[11px] text-rose-700 uppercase tracking-widest font-black flex items-center" },
                                    React.createElement(AlertCircle, { className: "w-3.5 h-3.5 mr-1" }),
                                    " Reprogramar Prazo:"),
                                React.createElement("input", { type: "date", className: "w-full px-4 py-2.5 bg-white border-2 border-rose-200 text-rose-700 rounded-lg text-sm font-bold focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 shadow-sm transition-all cursor-pointer hover:border-rose-400", onChange: (e) => {
                                        if (confirm('Confirmar reprogramação do prazo? O atraso histórico será mantido.')) {
                                            onUpdateDeadline(task.id, e.target.value);
                                        }
                                    } }))),
                            task.status === STATUS.CONCLUIDA && (React.createElement("div", { className: "w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl font-black text-sm uppercase tracking-wider" },
                                React.createElement(CheckCircle, { className: "w-5 h-5" }),
                                " Baixa Realizada")),
                            task.status === STATUS.PENDENTE && !isOverdue && (React.createElement("div", { className: "w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl font-bold text-xs uppercase tracking-widest" }, "No Prazo (Aguardando)")))));
                }))),
        evaluatingTask && (React.createElement(EvaluationModal, { task: evaluatingTask, onClose: () => setEvaluatingTask(null) }))));
}
// --- RENDERIZAÇÃO NO DOM ---
try {
    const rootElement = document.getElementById('root');
    const root = createRoot(rootElement);
    root.render(React.createElement(App, null));
    if (rootElement) rootElement.dataset.appStarted = 'true';
} catch (error) {
    console.error('[Render] Erro ao iniciar aplicação:', error);
    const rootElement = document.getElementById('root');
    if (rootElement) {
        rootElement.innerHTML = '<div style="font-family:Arial;padding:24px;color:#334155"><h2>Erro ao carregar o projeto</h2><p>' + String(error && error.message ? error.message : error) + '</p></div>';
    }
}
