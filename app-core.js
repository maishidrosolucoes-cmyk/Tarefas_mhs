(function () {
    const STATUS = {
        PENDENTE: 'Pendente',
        AGUARDANDO_AVALIACAO: 'Aguardando Avaliação',
        CONCLUIDA: 'Concluída'
    };

    const SETORES = [
        'Administração',
        'Comercial',
        'Compras',
        'Financeiro',
        'Produção',
        'PD_I',
        'Automação',
        'Sala_Técnica',
        'Logística'
    ];

    const COMPLEXIDADES = ['Baixa', 'Média', 'Alta'];
    const INITIAL_OBJETIVOS = ['Fábrica Principal', 'Proposta 2026/05', 'Geral', 'Logística Regional'];
    const AUTH_USER_EMAIL = 'gestao1@maisintegradora.com.br';
    const USER_SECTOR_LINKS = {
        'adm1@maisintegradora.com.br': { sector: 'Administração', role: 'colaborador', fullName: 'adm1' },
        'comercial3@maisintegradora.com.br': { sector: 'Comercial', role: 'colaborador', fullName: 'Comercial' },
        'gestao1@maisintegradora.com.br': { sector: 'Administração', role: 'gestor', fullName: 'Gestão MHS' },
        'projetos@maisintegradora.com.br': { sector: 'Sala_Técnica', role: 'colaborador', fullName: 'Sala Técnica' },
        'automacao@maisintegradora.com.br': { sector: 'Automação', role: 'colaborador', fullName: 'Automação' },
        'producao@tarefas.com': { sector: 'Produção', role: 'colaborador', fullName: 'Produção' },
        'compras1@maisintegradora.com.br': { sector: 'Compras', role: 'colaborador', fullName: 'Compras' }
    };
    const ATTACHMENT_CONFIG = {
        bucketName: 'Registros - sobre tarefas',
        maxFiles: 5,
        maxSizeBytes: 10 * 1024 * 1024,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
    };

    const normalizeText = (value) => String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');

    const normalizeKey = (value) => normalizeText(value).replace(/[^a-z0-9]+/g, '');

    const sectorAliases = {
        adm1: 'Administração',
        administracao: 'Administração',
        administrativo: 'Administração',
        comercial: 'Comercial',
        compras: 'Compras',
        financeiro: 'Financeiro',
        producao: 'Produção',
        operacional: 'Produção',
        pdi: 'PD_I',
        pdiinovacao: 'PD_I',
        pesquisadesenvolvimentoinovacao: 'PD_I',
        automacao: 'Automação',
        sala: 'Sala_Técnica',
        sal: 'Sala_Técnica',
        salatecnica: 'Sala_Técnica',
        projetos: 'Sala_Técnica',
        logistica: 'Logística'
    };

    const objectiveAliases = INITIAL_OBJETIVOS.reduce((acc, title) => {
        acc[normalizeKey(title)] = title;
        return acc;
    }, { geral: 'Geral' });

    const resolveByAlias = (value, aliases, fallback) => {
        const cleanValue = String(value || '').trim();
        if (!cleanValue) return fallback;
        return aliases[normalizeKey(cleanValue)] || cleanValue;
    };

    const resolveSectorName = (value) => resolveByAlias(value, sectorAliases, 'Administração');
    const resolveObjectiveTitle = (value) => resolveByAlias(value, objectiveAliases, 'Geral');
    const getUserSectorLink = (email) => {
        const link = USER_SECTOR_LINKS[String(email || '').trim().toLowerCase()];
        return link ? { ...link, sector: resolveSectorName(link.sector) } : null;
    };
    const MS_PER_DAY = 24 * 60 * 60 * 1000;

    const padDatePart = (value) => String(value).padStart(2, '0');

    const formatLocalDateOnly = (date) => `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;

    const todayDateOnly = () => formatLocalDateOnly(new Date());

    const normalizeDateOnly = (value, fallback = '') => {
        if (!value) return fallback;

        if (value instanceof Date) {
            return Number.isNaN(value.getTime()) ? fallback : formatLocalDateOnly(value);
        }

        const text = String(value).trim();
        const directMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (directMatch) return `${directMatch[1]}-${directMatch[2]}-${directMatch[3]}`;

        const parsed = new Date(text);
        return Number.isNaN(parsed.getTime()) ? fallback : formatLocalDateOnly(parsed);
    };

    const parseDateOnly = (value) => {
        const normalized = normalizeDateOnly(value);
        if (!normalized) return null;

        const [year, month, day] = normalized.split('-').map(Number);
        const date = new Date(year, month - 1, day);

        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            return null;
        }

        return date;
    };

    const daysBetweenDateOnly = (start, end) => {
        const startDate = parseDateOnly(start);
        const endDate = parseDateOnly(end);
        if (!startDate || !endDate) return 0;
        return Math.round((endDate.getTime() - startDate.getTime()) / MS_PER_DAY);
    };

    const formatDateBR = (value, fallback = '-') => {
        const date = parseDateOnly(value);
        return date ? date.toLocaleDateString('pt-BR') : fallback;
    };

    const findByNormalizedName = (rows, value, fields = ['name', 'title']) => {
        const target = normalizeKey(value);
        if (!target) return null;

        return (rows || []).find((row) => fields.some((field) => normalizeKey(row && row[field]) === target)) || null;
    };

    const uniqueNormalized = (items, resolver) => {
        const seen = new Set();
        const result = [];

        (items || []).forEach((item) => {
            const value = resolver ? resolver(item) : String(item || '').trim();
            const key = normalizeKey(value);
            if (!key || seen.has(key)) return;
            seen.add(key);
            result.push(value);
        });

        return result;
    };

    const normalizeTaskInput = (task) => ({
        ...task,
        setorSolicitante: resolveSectorName(task && task.setorSolicitante),
        setorExecutor: resolveSectorName(task && task.setorExecutor),
        objetivo: task && task.objetivo ? resolveObjectiveTitle(task.objetivo) : '',
        complexidade: COMPLEXIDADES.find((item) => normalizeKey(item) === normalizeKey(task && task.complexidade)) || 'Baixa'
    });

    const getTaskScheduleState = (task, referenceDate = todayDateOnly()) => {
        const currentDueDate = normalizeDateOnly(task && task.conclusaoPrevista);
        const originalDueDate = normalizeDateOnly(
            (task && (task.conclusaoPrevistaOriginal || task.prazoOriginal)) ||
            (task && task.raw && task.raw.metadata && task.raw.metadata.conclusaoPrevistaOriginal) ||
            currentDueDate
        );
        const completionDate = normalizeDateOnly(task && (task.conclusaoReal || task.conclusaoRealUser));
        const status = task && task.status;
        const isPending = status === STATUS.PENDENTE;
        const compareDate = completionDate || referenceDate;
        const baselineDelayDays = Math.max(0, daysBetweenDateOnly(originalDueDate, compareDate));
        const currentDelayDays = Math.max(0, daysBetweenDateOnly(currentDueDate, compareDate));
        const storedReprogrammingDelayDays = Number((task && task.diasAtrasoUltimaReprogramacao) || (task && task.raw && task.raw.metadata && task.raw.metadata.diasAtrasoUltimaReprogramacao) || 0);
        const reprogrammingDelayDays = Math.max(0, storedReprogrammingDelayDays);
        const delayDays = Math.max(baselineDelayDays, currentDelayDays, reprogrammingDelayDays);
        const isReplanned = Boolean(task && (task.prazoReprogramado || normalizeKey(originalDueDate) !== normalizeKey(currentDueDate)));

        return {
            currentDueDate,
            originalDueDate,
            completionDate,
            isPending,
            isReplanned,
            baselineDelayDays,
            currentDelayDays,
            reprogrammingDelayDays,
            delayDays,
            isOverdue: isPending && delayDays > 0,
            isCurrentDueOverdue: isPending && currentDelayDays > 0,
            isOnTimeOriginal: Boolean(completionDate && daysBetweenDateOnly(completionDate, originalDueDate) >= 0),
            isOnTimeCurrent: Boolean(completionDate && daysBetweenDateOnly(completionDate, currentDueDate) >= 0)
        };
    };

    const getAttachmentKind = (file) => {
        const mimeType = String(file && file.type || '').toLowerCase();
        if (mimeType.startsWith('image/')) return 'imagem';
        if (mimeType === 'application/pdf') return 'pdf';
        return 'outro';
    };

    const validateAttachmentFile = (file) => {
        const mimeType = String(file && file.type || '').toLowerCase();
        const fileName = String(file && file.name || '').trim();
        const fileSize = Number(file && file.size || 0);

        if (!file) return { valid: false, message: 'Arquivo inválido.' };
        if (!ATTACHMENT_CONFIG.allowedMimeTypes.includes(mimeType)) {
            return { valid: false, message: `Arquivo ${fileName || 'selecionado'} não permitido. Use imagem ou PDF.` };
        }
        if (fileSize > ATTACHMENT_CONFIG.maxSizeBytes) {
            return { valid: false, message: `Arquivo ${fileName || 'selecionado'} excede 10 MB.` };
        }

        return { valid: true, message: '' };
    };

    window.appCore = {
        STATUS,
        SETORES,
        COMPLEXIDADES,
        INITIAL_OBJETIVOS,
        AUTH_USER_EMAIL,
        USER_SECTOR_LINKS,
        ATTACHMENT_CONFIG,
        normalizeText,
        normalizeKey,
        getUserSectorLink,
        resolveSectorName,
        resolveObjectiveTitle,
        findByNormalizedName,
        uniqueNormalized,
        normalizeTaskInput,
        todayDateOnly,
        normalizeDateOnly,
        parseDateOnly,
        daysBetweenDateOnly,
        formatDateBR,
        getTaskScheduleState,
        getAttachmentKind,
        validateAttachmentFile
    };
})();
