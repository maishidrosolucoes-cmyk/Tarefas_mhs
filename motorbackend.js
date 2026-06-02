const SUPABASE_URL = 'https://pwmgbaxywvyyfmlkygqr.supabase.co';
const SUPABASE_ANON_PUBLIC_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3bWdiYXh5d3Z5eWZtbGt5Z3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNDI3NDAsImV4cCI6MjA5MjkxODc0MH0.kSYonDj0VBHjMZuVlGeVQjAuMmbEBMQfB4OsBcZOecg';
const SUPABASE_SCHEMA = 'gestao_atividades';

(function () {
    const supabaseFactory = window.supabase;
    const core = window.appCore || {};
    const AUTH_USER_EMAIL = String(core.AUTH_USER_EMAIL || 'gestao1@maisintegradora.com.br').toLowerCase();
    const USER_SECTOR_LINKS = core.USER_SECTOR_LINKS || {
        'comercial3@maisintegradora.com.br': { sector: 'Comercial', role: 'colaborador', fullName: 'Comercial' },
        'gestao1@maisintegradora.com.br': { sector: 'Administração', role: 'gestor', fullName: 'Gestão MHS' },
        'projetos@maisintegradora.com.br': { sector: 'Sala_Técnica', role: 'colaborador', fullName: 'Sala Técnica' },
        'automacao@maisintegradora.com.br': { sector: 'Automação', role: 'colaborador', fullName: 'Automação' },
        'producao@tarefas.com': { sector: 'Produção', role: 'colaborador', fullName: 'Produção' },
        'compras1@maisintegradora.com.br': { sector: 'Compras', role: 'colaborador', fullName: 'Compras' }
    };

    const localFallback = {
        client: null,
        online: false,
        userId: null,
        allowedEmail: AUTH_USER_EMAIL,
        async init() { return null; },
        async getSession() { return null; },
        async login() { throw new Error('Login exige conexão com Supabase.'); },
        async logout() { return null; },
        async listar() { return []; },
        async buscarPorId() { return null; },
        async inserir(_tabela, payload) { return Array.isArray(payload) ? payload : [payload]; },
        async atualizar(_tabela, _id, payload) { return [payload]; },
        async remover() { return []; },
        async validarSenhaSetor() { throw new Error('Validação de senha exige conexão com Supabase.'); },
        async autorizarSetorPorSenha() { throw new Error('Autorização do setor exige conexão com Supabase.'); },

        async listarTarefas() { return []; },
        async criarTarefa(payload) { return { ...payload, id: Date.now().toString() }; },
        async completarFichaTarefa(id, payload) { return { id, ...payload }; },
        async editarFichaTarefa(id, payload) { return { id, ...payload }; },
        async solicitarAvaliacao(id, conclusaoRealUser) { return { id, status: 'Aguardando Avaliação', conclusaoRealUser }; },
        async concluirTarefa(id, dados) { return { id, ...dados, status: 'Concluída' }; },
        async atualizarPrazo(id, conclusaoPrevista) { return { id, conclusaoPrevista }; },
        async listarObjetivos() { return []; },
        async listarSetores() { return []; },
        async listarPerfis() { return []; },
        async listarNotificacoes() { return []; },
        async listarHistorico() { return []; },
        async listarComentarios() { return []; },
        async registrarAnexo() { throw new Error('Registro de anexo exige conexão com Supabase.'); },
        async anexarArquivoTarefa() { throw new Error('Upload de anexo exige conexão com Supabase.'); },
        async anexarArquivosTarefa() { throw new Error('Upload de anexo exige conexão com Supabase.'); },
        async listarAnexos() { return []; },
        async listarDependencias() { return []; },
        async listarAvaliacoes() { return []; },
        async listarAcompanhamentos() { return []; },
        subscribeAppChanges() { return () => {}; }
    };

    if (!supabaseFactory || typeof supabaseFactory.createClient !== 'function') {
        console.warn('[motorbackend] Supabase CDN não carregou. A interface continuará funcionando com dados locais.');
        window.supabaseClient = null;
        window.motorBackend = localFallback;
        return;
    }

    const client = supabaseFactory.createClient(SUPABASE_URL, SUPABASE_ANON_PUBLIC_KEY, {
        db: { schema: SUPABASE_SCHEMA },
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });

    const TABLES = {
        profiles: 'profiles',
        sectors: 'sectors',
        macroObjectives: 'macro_objectives',
        tasks: 'tasks',
        dependencies: 'task_dependencies',
        evaluations: 'task_evaluations',
        history: 'task_history',
        comments: 'task_comments',
        attachments: 'task_attachments',
        followups: 'temporary_followups',
        notifications: 'notifications',
        vwTasksDetailed: 'vw_tasks_detailed',
        vwDashboardSummary: 'vw_dashboard_summary',
        vwSectorPerformance: 'vw_sector_performance',
        vwUserWorkload: 'vw_user_workload',
        vwEvaluationMetrics: 'vw_evaluation_metrics',
        vwActiveFollowups: 'vw_active_followups',
        vwMonthlyProductivity: 'vw_monthly_productivity'
    };

    const cache = {
        userId: null,
        profile: null,
        sectors: [],
        objectives: [],
        loadedLookups: false
    };

    const handleSupabaseResponse = (response) => {
        if (response.error) {
            console.error('[Supabase]', response.error);
            throw response.error;
        }
        return response.data;
    };

    const pick = (obj, keys, fallback = '') => {
        for (const key of keys) {
            if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
        }
        return fallback;
    };

    const today = () => core.todayDateOnly ? core.todayDateOnly() : new Date().toISOString().split('T')[0];
    const nowIso = () => new Date().toISOString();
    const normalizeDateOnly = core.normalizeDateOnly || ((value, fallback = '') => {
        if (!value) return fallback;
        const text = String(value).trim();
        const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
        return match ? `${match[1]}-${match[2]}-${match[3]}` : fallback;
    });
    const daysBetweenDateOnly = core.daysBetweenDateOnly || ((start, end) => {
        const startDate = new Date(`${normalizeDateOnly(start)}T00:00:00`);
        const endDate = new Date(`${normalizeDateOnly(end)}T00:00:00`);
        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return 0;
        return Math.round((endDate.getTime() - startDate.getTime()) / 86400000);
    });
    const dateOnlyToIso = (value) => {
        const normalized = normalizeDateOnly(value);
        return normalized ? new Date(`${normalized}T12:00:00`).toISOString() : null;
    };
    const ATTACHMENT_CONFIG = core.ATTACHMENT_CONFIG || {
        bucketName: 'Registros - sobre tarefas',
        maxFiles: 5,
        maxSizeBytes: 10 * 1024 * 1024,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
    };
    const getAttachmentKind = core.getAttachmentKind || ((file) => {
        const mimeType = String(file?.type || '').toLowerCase();
        if (mimeType.startsWith('image/')) return 'imagem';
        if (mimeType === 'application/pdf') return 'pdf';
        return 'outro';
    });
    const validateAttachmentFile = core.validateAttachmentFile || ((file) => {
        const mimeType = String(file?.type || '').toLowerCase();
        const fileSize = Number(file?.size || 0);
        if (!ATTACHMENT_CONFIG.allowedMimeTypes.includes(mimeType)) return { valid: false, message: 'Use apenas imagens ou PDF.' };
        if (fileSize > ATTACHMENT_CONFIG.maxSizeBytes) return { valid: false, message: 'Cada arquivo deve ter no máximo 10 MB.' };
        return { valid: true, message: '' };
    });
    const sanitizeFileName = (value) => String(value || 'arquivo')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 120) || 'arquivo';
    const randomId = () => {
        if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
        return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    };

    const textToSlug = (value) => String(value || '')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().trim();
    const normalizeKey = core.normalizeKey || ((value) => textToSlug(value).replace(/[^a-z0-9]+/g, ''));
    const resolveSectorName = core.resolveSectorName || ((value) => String(value || 'Geral').trim() || 'Geral');
    const resolveObjectiveTitle = core.resolveObjectiveTitle || ((value) => String(value || 'Geral').trim() || 'Geral');
    const getOfficialUserLink = (email) => {
        const cleanEmail = String(email || '').trim().toLowerCase();
        const link = typeof core.getUserSectorLink === 'function'
            ? core.getUserSectorLink(cleanEmail)
            : USER_SECTOR_LINKS[cleanEmail];

        if (!link) return null;

        return {
            email: cleanEmail,
            sector: resolveSectorName(link.sector || link.setor || ''),
            role: String(link.role || 'colaborador').trim().toLowerCase() || 'colaborador',
            fullName: String(link.fullName || link.nome || cleanEmail.split('@')[0] || 'Usuario').trim()
        };
    };

    const priorityToDb = (value) => {
        const v = textToSlug(value);
        if (v.includes('crit')) return 'critica';
        if (v.includes('alta')) return 'alta';
        if (v.includes('baix')) return 'baixa';
        return 'media';
    };

    const complexityToDb = (value) => {
        const v = textToSlug(value);
        if (v.includes('alta')) return 'alta';
        if (v.includes('baix')) return 'baixa';
        return 'media';
    };

    const enumToUi = (value) => {
        const v = String(value || '').toLowerCase();
        if (v === 'alta') return 'Alta';
        if (v === 'baixa') return 'Baixa';
        if (v === 'critica') return 'Crítica';
        return 'Média';
    };

    const statusToDb = (value) => {
        const v = textToSlug(value);
        if (v.includes('avaliacao')) return 'aguardando_avaliacao';
        if (v.includes('conclu')) return 'concluida';
        if (v.includes('cancel')) return 'cancelada';
        if (v.includes('bloq')) return 'bloqueada';
        if (v.includes('andamento')) return 'em_andamento';
        return 'pendente';
    };

    const statusToUi = (value) => {
        const v = String(value || '').toLowerCase();
        if (v === 'aguardando_avaliacao') return 'Aguardando Avaliação';
        if (v === 'concluida') return 'Concluída';
        return 'Pendente';
    };

    const costNumber = (value) => {
        if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
        const cleaned = String(value || '0').replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
        const parsed = Number(cleaned);
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const findByName = (rows, name, fields = ['name', 'title']) => {
        const target = normalizeKey(name);
        if (!target) return null;
        return (rows || []).find((row) => fields.some((field) => normalizeKey(row[field]) === target)) || null;
    };

    const resetCache = () => {
        cache.userId = null;
        cache.profile = null;
        cache.sectors = [];
        cache.objectives = [];
        cache.loadedLookups = false;
    };

    const isManagerUser = (user) => {
        const email = String(user?.email || '').trim().toLowerCase();
        const officialLink = getOfficialUserLink(email);
        return email === AUTH_USER_EMAIL || ['admin', 'gestor', 'lider'].includes(String(officialLink?.role || '').toLowerCase());
    };

    const isManagerProfile = (profile, user) => {
        const role = String(profile?.role || '').toLowerCase();
        return isManagerUser(user) || ['admin', 'gestor', 'lider'].includes(role);
    };

    const getCurrentSession = async () => {
        const existing = await client.auth.getSession();
        if (existing.error) throw existing.error;

        const session = existing.data?.session || null;
        if (!session || !session.user) {
            resetCache();
            return null;
        }

        cache.userId = session.user.id;
        return session;
    };

    const ensureSession = async () => {
        const session = await getCurrentSession();
        if (!session) {
            throw new Error('Login obrigatório para acessar o Supabase.');
        }
        return cache.userId;
    };

    const loginWithPassword = async (email, password) => {
        const cleanEmail = String(email || '').trim().toLowerCase();
        const result = await client.auth.signInWithPassword({
            email: cleanEmail,
            password: String(password || '')
        });

        if (result.error) {
            throw new Error(result.error.message || 'Falha ao autenticar no Supabase.');
        }

        resetCache();
        cache.userId = result.data.user.id;
        await ensureProfile();
        await loadLookups();

        return {
            user: result.data.user,
            profile: cache.profile,
            sectors: cache.sectors,
            objectives: cache.objectives,
            isManager: isManagerProfile(cache.profile, result.data.user)
        };
    };

    const logout = async () => {
        await client.auth.signOut();
        resetCache();
        return null;
    };

    const PROFILE_SELECT = '*, sector:sectors!profiles_sector_fk(name)';

    const ensureProfile = async () => {
        const session = await getCurrentSession();
        if (!session) throw new Error('Login obrigatório para carregar o perfil.');
        const userId = session.user.id;
        if (cache.profile && cache.profile.id === userId) return cache.profile;
        const userEmail = String(session.user.email || '').trim().toLowerCase();
        const officialLink = getOfficialUserLink(userEmail);
        let desiredSectorId = null;
        if (officialLink?.sector) {
            try {
                desiredSectorId = await ensureSector(officialLink.sector);
            } catch (error) {
                console.warn('[motorbackend] Setor oficial ainda nao sincronizado no banco:', officialLink.sector, error.message || error);
            }
        }
        const emailPrefix = String(session.user.email || 'Usuário').split('@')[0];
        const desiredFullName = officialLink?.fullName || (isManagerUser(session.user) ? 'Gestão MHS' : emailPrefix);
        const desiredRole = officialLink?.role || (isManagerUser(session.user) ? 'gestor' : 'colaborador');

        const found = await client.from(TABLES.profiles).select(PROFILE_SELECT).eq('id', userId).maybeSingle();
        if (found.error && found.error.code !== 'PGRST116') throw found.error;

        if (found.data) {
            const updatePayload = {};

            if (session.user.email && String(found.data.email || '').trim().toLowerCase() !== userEmail) {
                updatePayload.email = session.user.email;
            }

            if (officialLink) {
                if (String(found.data.role || '').trim().toLowerCase() !== desiredRole) {
                    updatePayload.role = desiredRole;
                }
                if (desiredSectorId && String(found.data.sector_id || '') !== String(desiredSectorId)) {
                    updatePayload.sector_id = desiredSectorId;
                }
                if (!String(found.data.full_name || '').trim()) {
                    updatePayload.full_name = desiredFullName;
                }
                if (found.data.is_active === false) {
                    updatePayload.is_active = true;
                }
            }
            else if (isManagerUser(session.user) && !['admin', 'gestor', 'lider'].includes(found.data.role)) {
                updatePayload.full_name = found.data.full_name || 'Gestão MHS';
                updatePayload.role = 'gestor';
                updatePayload.is_active = true;
            }

            if (Object.keys(updatePayload).length) {
                const updated = handleSupabaseResponse(await client.from(TABLES.profiles).update({
                    ...updatePayload,
                    email: updatePayload.email || session.user.email || found.data.email || null
                }).eq('id', userId).select(PROFILE_SELECT).single());
                cache.profile = updated;
                return cache.profile;
            }
            cache.profile = found.data;
            return cache.profile;
        }

        const insertPayload = {
            id: userId,
            full_name: desiredFullName,
            email: session.user.email || null,
            role: desiredRole,
            is_active: true,
            preferences: {}
        };

        if (desiredSectorId) insertPayload.sector_id = desiredSectorId;

        const created = handleSupabaseResponse(await client.from(TABLES.profiles).insert(insertPayload).select(PROFILE_SELECT).single());

        cache.profile = created;
        return cache.profile;
    };

    const ensureManagerProfile = async () => {
        const profile = await ensureProfile();
        const session = await getCurrentSession();
        if (!isManagerProfile(profile, session?.user)) {
            throw new Error('Acesso restrito ao gestor.');
        }
        return profile;
    };

    const loadLookups = async () => {
        const [sectors, objectives] = await Promise.all([
            client.from(TABLES.sectors).select('*').order('name', { ascending: true }),
            client.from(TABLES.macroObjectives).select('*').order('title', { ascending: true })
        ]);
        const isActiveLookup = (row) => row && row.is_active !== false;
        cache.sectors = (handleSupabaseResponse(sectors) || []).filter(isActiveLookup);
        cache.objectives = (handleSupabaseResponse(objectives) || []).filter(isActiveLookup);
        cache.loadedLookups = true;
        return cache;
    };

    const ensureSector = async (name) => {
        await loadLookups();
        const cleanName = resolveSectorName(name);
        const existing = findByName(cache.sectors, cleanName, ['name']);
        if (existing) return existing.id;

        const row = handleSupabaseResponse(await client.from(TABLES.sectors).insert({
            name: cleanName || 'Geral',
            description: 'Criado automaticamente pelo frontend.',
            is_active: true
        }).select().single());

        cache.sectors.push(row);
        return row.id;
    };

    const ensureObjective = async (title) => {
        await loadLookups();
        const cleanTitle = resolveObjectiveTitle(title);
        const existing = findByName(cache.objectives, cleanTitle, ['title']);
        if (existing) return existing.id;

        const row = handleSupabaseResponse(await client.from(TABLES.macroObjectives).insert({
            title: cleanTitle || 'Geral',
            description: 'Criado automaticamente pelo frontend.',
            created_by: cache.userId,
            is_active: true,
            metadata: {}
        }).select().single());

        cache.objectives.push(row);
        return row.id;
    };

    const normalizeTask = (row) => {
        const metadata = row.metadata || {};
        const sector = row.sectors || row.sector || null;
        const objective = row.macro_objectives || row.macro_objective || null;
        const currentDueDate = normalizeDateOnly(row.due_date || metadata.conclusaoPrevista || today(), today());
        const originalDueDate = normalizeDateOnly(metadata.conclusaoPrevistaOriginal || metadata.prazoOriginal || currentDueDate, currentDueDate);

        return {
            id: String(row.id),
            setorSolicitante: resolveSectorName(metadata.setorSolicitante || (sector && sector.name) || ''),
            setorExecutor: resolveSectorName(metadata.setorExecutor || (sector && sector.name) || ''),
            dataAbertura: (row.created_at || '').split('T')[0] || metadata.dataAbertura || today(),
            conclusaoPrevista: currentDueDate,
            conclusaoPrevistaOriginal: originalDueDate,
            prazoReprogramado: Boolean(metadata.prazoReprogramado || normalizeKey(originalDueDate) !== normalizeKey(currentDueDate)),
            diasAtrasoUltimaReprogramacao: Number(metadata.diasAtrasoUltimaReprogramacao || 0),
            historicoPrazo: Array.isArray(metadata.historicoPrazo) ? metadata.historicoPrazo : [],
            anexosResumo: Array.isArray(metadata.anexosResumo) ? metadata.anexosResumo : [],
            anexosCount: Array.isArray(metadata.anexosResumo) ? metadata.anexosResumo.length : 0,
            complexidade: enumToUi(row.complexity),
            prioridade: enumToUi(row.priority),
            descricao: row.description || row.title || '',
            objetivo: resolveObjectiveTitle((objective && objective.title) || metadata.objetivo || ''),
            clienteFornecedor: metadata.clienteFornecedor || '',
            deslocamento: Boolean(row.has_displacement),
            local: metadata.local || '',
            duracaoDeslocamento: metadata.duracaoDeslocamento || '',
            unidadeDeslocamento: metadata.unidadeDeslocamento || 'Horas',
            geraCusto: Boolean(metadata.geraCusto) || Number(row.estimated_cost || row.actual_cost || 0) > 0,
            tipoCusto: metadata.tipoCusto || '',
            valorCusto: String(row.estimated_cost || metadata.valorCusto || ''),
            dependencia: metadata.dependencia || '',
            status: statusToUi(row.status),
            avaliacao: metadata.avaliacao || '',
            dataAvaliacao: metadata.dataAvaliacao || '',
            conclusaoReal: row.completed_at ? row.completed_at.split('T')[0] : '',
            conclusaoRealUser: row.requested_evaluation_at ? row.requested_evaluation_at.split('T')[0] : '',
            necessitaAjuste: Boolean(metadata.necessitaAjuste),
            encaminhamento: metadata.encaminhamento || '',
            criadoPorId: row.created_by || metadata.criadoPorId || '',
            criadoPorEmail: metadata.criadoPorEmail || '',
            criadoPorNome: metadata.criadoPorNome || '',
            setorUsuario: metadata.setorUsuario || '',
            setorUsuarioOficial: metadata.setorUsuarioOficial || '',
            vinculoUsuarioSetor: metadata.vinculoUsuarioSetor || '',
            progressPercent: row.progress_percent || 0,
            raw: row
        };
    };

    const toDbTask = async (task) => {
        const profile = await ensureProfile();
        await loadLookups();
        const officialLink = getOfficialUserLink(profile?.email);
        const profileSector = officialLink?.sector || profile?.sector?.name || profile?.sectors?.name || (cache.sectors || []).find((sector) => sector.id === profile?.sector_id)?.name || '';
        const setorSolicitante = resolveSectorName(profileSector || task.setorSolicitante || task.setorExecutor || 'Geral');
        const setorExecutor = resolveSectorName(task.setorExecutor || task.setorSolicitante || 'Geral');
        const objetivo = resolveObjectiveTitle(task.objetivo || 'Geral');
        const sectorId = await ensureSector(setorExecutor);
        const objectiveId = await ensureObjective(objetivo);
        const userId = profile.id;

        return {
            title: String(task.descricao || 'Nova tarefa').slice(0, 120),
            description: task.descricao || 'Sem descrição.',
            sector_id: sectorId,
            macro_objective_id: objectiveId,
            created_by: userId,
            assigned_to: null,
            status: statusToDb(task.status || 'Pendente'),
            priority: priorityToDb(task.prioridade || task.complexidade),
            complexity: complexityToDb(task.complexidade),
            planned_start_at: task.dataAbertura || today(),
            due_date: task.conclusaoPrevista || today(),
            requested_evaluation_at: task.conclusaoRealUser ? dateOnlyToIso(task.conclusaoRealUser) : null,
            completed_at: task.status === 'Concluída' ? nowIso() : null,
            has_displacement: !!task.deslocamento,
            displacement_description: task.deslocamento ? [task.local, task.duracaoDeslocamento, task.unidadeDeslocamento].filter(Boolean).join(' - ') : null,
            estimated_cost: task.geraCusto ? costNumber(task.valorCusto) : 0,
            actual_cost: task.geraCusto ? costNumber(task.valorCusto) : 0,
            progress_percent: task.status === 'Concluída' ? 100 : task.status === 'Aguardando Avaliação' ? 90 : 0,
            tags: [setorSolicitante, setorExecutor, objetivo].filter(Boolean),
            metadata: {
                setorSolicitante,
                setorExecutor,
                dataAbertura: task.dataAbertura || today(),
                conclusaoPrevistaOriginal: normalizeDateOnly(task.conclusaoPrevista || today(), today()),
                prazoReprogramado: false,
                diasAtrasoUltimaReprogramacao: 0,
                historicoPrazo: [],
                anexosResumo: [],
                objetivo,
                clienteFornecedor: task.clienteFornecedor || '',
                local: task.local || '',
                duracaoDeslocamento: task.duracaoDeslocamento || '',
                unidadeDeslocamento: task.unidadeDeslocamento || 'Horas',
                geraCusto: !!task.geraCusto,
                tipoCusto: task.tipoCusto || '',
                valorCusto: task.valorCusto || '',
                dependencia: task.dependencia || '',
                avaliacao: task.avaliacao || '',
                dataAvaliacao: task.dataAvaliacao || '',
                necessitaAjuste: !!task.necessitaAjuste,
                encaminhamento: task.encaminhamento || '',
                origem_frontend: 'controle_tarefas_html',
                criadoPorId: userId,
                criadoPorEmail: profile.email || '',
                criadoPorNome: profile.full_name || '',
                setorUsuario: profileSector || '',
                setorUsuarioOficial: officialLink?.sector || profileSector || '',
                vinculoUsuarioSetor: officialLink ? 'email_oficial' : 'perfil'
            }
        };
    };

    const createHistory = async (taskId, action, note, oldData = null, newData = null) => {
        try {
            await ensureProfile();
            return handleSupabaseResponse(await client.from(TABLES.history).insert({
                task_id: taskId,
                actor_id: cache.userId,
                action,
                old_data: oldData,
                new_data: newData,
                note: note || null
            }).select());
        } catch (error) {
            console.warn('[motorbackend] Histórico não gravado:', error.message || error);
            return [];
        }
    };

    const createNotification = async (recipientId, taskId, title, message, metadata = {}) => {
        if (!recipientId) return [];
        try {
            return handleSupabaseResponse(await client.from(TABLES.notifications).insert({
                recipient_id: recipientId,
                task_id: taskId || null,
                title,
                message,
                metadata
            }).select());
        } catch (error) {
            console.warn('[motorbackend] Notificação não gravada:', error.message || error);
            return [];
        }
    };


    const validarSenhaSetor = async (sectorName, password) => {
        await ensureProfile();

        const cleanSectorName = String(sectorName || '').trim();
        const cleanPassword = String(password || '');

        if (!cleanSectorName) throw new Error('Setor responsável não informado.');
        if (!cleanPassword) throw new Error('Senha do setor não informada.');

        const result = await client.rpc('verify_sector_password', {
            p_sector_name: cleanSectorName,
            p_password: cleanPassword
        });

        if (result.error) {
            console.error('[motorbackend] Falha na RPC verify_sector_password:', result.error);
            throw new Error('A validação segura ainda não está configurada no Supabase. Execute o patch SQL de senhas dos setores.');
        }

        if (result.data !== true) {
            throw new Error('Senha incorreta para o setor responsável.');
        }

        return true;
    };

    const getProfileSectorName = (profile) => profile?.sector?.name
        || profile?.sectors?.name
        || (cache.sectors || []).find((sector) => sector.id === profile?.sector_id)?.name
        || '';

    const getTaskResponsibleSector = (row) => {
        const metadata = row?.metadata || {};
        const sector = row?.sectors || row?.sector || null;
        return resolveSectorName(metadata.setorExecutor || metadata.setorSolicitante || (sector && sector.name) || '');
    };

    const getTaskCreatorId = (row) => String(row?.created_by || row?.metadata?.criadoPorId || '').trim();

    const isProfileTaskCreator = (profile, user, row) => {
        const creatorId = getTaskCreatorId(row);
        if (!creatorId) return false;
        return String(user?.id || profile?.id || '').trim() === creatorId;
    };

    const isProfileLinkedToSector = (profile, sectorName) => {
        const rawProfileSectorName = getProfileSectorName(profile);
        if (!rawProfileSectorName) return false;
        const profileSectorName = resolveSectorName(rawProfileSectorName);
        return Boolean(profileSectorName && normalizeKey(profileSectorName) === normalizeKey(sectorName));
    };

    const isProfileAuthorizedForSector = (profile, user, sectorName) => {
        if (isManagerProfile(profile, user)) return true;
        return isProfileLinkedToSector(profile, sectorName);
    };

    const isProfileAuthorizedForFinalization = (profile, user, row) => {
        return isProfileTaskCreator(profile, user, row) || isProfileLinkedToSector(profile, getTaskResponsibleSector(row));
    };

    const isBlankValue = (value) => value === null || value === undefined || String(value).trim() === '';
    const isDefaultObjectiveValue = (value) => isBlankValue(value) || normalizeKey(value) === normalizeKey('Geral');
    const hasPositiveCost = (value) => costNumber(value) > 0;
    const getTaskParticipantSectors = (row) => {
        const metadata = row?.metadata || {};
        const sector = row?.sectors || row?.sector || null;
        const names = [
            metadata.setorExecutor,
            metadata.setorSolicitante,
            sector && sector.name
        ].map((name) => String(name || '').trim()).filter(Boolean).map(resolveSectorName);

        return core.uniqueNormalized ? core.uniqueNormalized(names, resolveSectorName) : [...new Set(names)];
    };
    const isProfileAuthorizedForTask = (profile, user, row) => {
        if (isManagerProfile(profile, user)) return true;
        const rawProfileSectorName = getProfileSectorName(profile);
        if (!rawProfileSectorName) return false;
        const profileSectorName = resolveSectorName(rawProfileSectorName);

        return getTaskParticipantSectors(row).some((sectorName) => normalizeKey(sectorName) === normalizeKey(profileSectorName));
    };

    const isProfileAuthorizedForTaskEdit = (profile, user, row) => {
        return isManagerProfile(profile, user) || isProfileTaskCreator(profile, user, row) || isProfileAuthorizedForTask(profile, user, row);
    };

    const listSectorAuthProfiles = async (sectorName) => {
        await loadLookups();

        const cleanSectorName = resolveSectorName(sectorName);
        const sector = findByName(cache.sectors, cleanSectorName, ['name']);
        if (!sector) {
            throw new Error(`Setor ${cleanSectorName || 'responsável'} não encontrado no Supabase.`);
        }

        const response = await client
            .from(TABLES.profiles)
            .select(PROFILE_SELECT)
            .eq('sector_id', sector.id)
            .eq('is_active', true);

        if (response.error) {
            console.error('[motorbackend] Falha ao localizar usuário do setor:', response.error);
            throw new Error('Não foi possível localizar o usuário vinculado ao setor. Verifique as permissões de leitura de profiles.');
        }

        return (response.data || []).filter((profile) => profile.email);
    };

    const autorizarSetorPorSenha = async (sectorName, password, options = {}) => {
        const cleanSectorName = resolveSectorName(sectorName);
        const cleanPassword = String(password || '');

        if (!cleanSectorName) throw new Error('Setor responsável não informado.');
        if (!cleanPassword) throw new Error('Senha de login do setor não informada.');

        const existingSession = await getCurrentSession();
        if (existingSession && !options.ignoreExistingSession) {
            const profile = await ensureProfile();
            return {
                user: existingSession.user,
                profile,
                isManager: isManagerProfile(profile, existingSession.user),
                reusedSession: true
            };
        }

        if (existingSession && options.ignoreExistingSession) {
            await logout();
        }

        const sectorProfiles = await listSectorAuthProfiles(cleanSectorName);
        if (!sectorProfiles.length) {
            throw new Error(`Nenhum usuário ativo com e-mail foi vinculado ao setor ${cleanSectorName}.`);
        }

        let lastError = null;

        for (const profile of sectorProfiles) {
            const result = await client.auth.signInWithPassword({
                email: String(profile.email || '').trim().toLowerCase(),
                password: cleanPassword
            });

            if (result.error) {
                lastError = result.error;
                continue;
            }

            resetCache();
            cache.userId = result.data.user.id;
            const authProfile = await ensureProfile();
            await loadLookups();

            const authSectorName = resolveSectorName(getProfileSectorName(authProfile));
            const isManager = isManagerProfile(authProfile, result.data.user);
            if (!isManager && normalizeKey(authSectorName) !== normalizeKey(cleanSectorName)) {
                await logout();
                throw new Error('O usuário autenticado não está vinculado ao setor responsável.');
            }

            return {
                user: result.data.user,
                profile: authProfile,
                isManager,
                reusedSession: false
            };
        }

        console.warn('[motorbackend] Autorização do setor recusada:', lastError?.message || 'Senha inválida.');
        throw new Error('Senha incorreta para o usuário vinculado ao setor responsável.');
    };

    const autorizarCriadorPorSenha = async (taskRow, password) => {
        const creatorId = getTaskCreatorId(taskRow);
        const cleanPassword = String(password || '');

        if (!creatorId) throw new Error('Usuario criador da atividade nao identificado.');
        if (!cleanPassword) throw new Error('Senha de login do usuario criador nao informada.');

        const response = await client
            .from(TABLES.profiles)
            .select(PROFILE_SELECT)
            .eq('id', creatorId)
            .eq('is_active', true)
            .maybeSingle();

        if (response.error && response.error.code !== 'PGRST116') {
            console.error('[motorbackend] Falha ao localizar criador da atividade:', response.error);
            throw new Error('Nao foi possivel localizar o usuario que inseriu a atividade.');
        }

        const creatorProfile = response.data;
        const creatorEmail = String(creatorProfile?.email || taskRow?.metadata?.criadoPorEmail || '').trim().toLowerCase();
        if (!creatorEmail) throw new Error('O usuario que inseriu a atividade nao possui e-mail vinculado.');

        const result = await client.auth.signInWithPassword({
            email: creatorEmail,
            password: cleanPassword
        });

        if (result.error) {
            throw new Error('Senha incorreta para o usuario que inseriu a atividade.');
        }

        if (String(result.data.user?.id || '') !== creatorId) {
            await logout();
            throw new Error('A senha informada nao pertence ao usuario que inseriu a atividade.');
        }

        resetCache();
        cache.userId = result.data.user.id;
        const authProfile = await ensureProfile();
        await loadLookups();

        return {
            user: result.data.user,
            profile: authProfile,
            isManager: isManagerProfile(authProfile, result.data.user),
            reusedSession: false,
            authorizedBy: 'creator'
        };
    };

    const autorizarBaixaPorSenha = async (taskRow, password, options = {}) => {
        const responsibleSector = getTaskResponsibleSector(taskRow);
        const errors = [];

        try {
            const result = await autorizarSetorPorSenha(responsibleSector, password, options);
            return { ...result, authorizedBy: 'sector' };
        } catch (error) {
            errors.push(error);
        }

        try {
            return await autorizarCriadorPorSenha(taskRow, password);
        } catch (error) {
            errors.push(error);
        }

        console.warn('[motorbackend] Autorizacao de baixa recusada:', errors.map((error) => error.message || error).join(' | '));
        throw new Error('Senha incorreta. Use a senha do setor executor ou do usuario que inseriu a atividade.');
    };

    window.supabaseClient = client;
    window.motorBackend = {
        client,
        tables: TABLES,
        online: true,
        allowedEmail: AUTH_USER_EMAIL,
        get userId() { return cache.userId; },

        async getSession() {
            const session = await getCurrentSession();
            if (!session) return null;
            const profile = await ensureProfile().catch(() => null);
            return { user: session.user, profile, isManager: isManagerProfile(profile, session.user) };
        },

        async login(email, password) {
            return loginWithPassword(email, password);
        },

        async logout() {
            return logout();
        },

        async init() {
            const session = await getCurrentSession();
            if (session) {
                await ensureProfile().catch(() => null);
            }
            await loadLookups();
            return {
                userId: cache.userId,
                profile: cache.profile,
                sectors: cache.sectors,
                objectives: cache.objectives,
                isManager: isManagerProfile(cache.profile, session?.user)
            };
        },

        async listar(tabela, colunas = '*') {
            await ensureProfile();
            return handleSupabaseResponse(await client.from(tabela).select(colunas));
        },

        async buscarPorId(tabela, id, colunas = '*') {
            await ensureProfile();
            return handleSupabaseResponse(await client.from(tabela).select(colunas).eq('id', id).single());
        },

        async inserir(tabela, payload) {
            await ensureProfile();
            return handleSupabaseResponse(await client.from(tabela).insert(payload).select());
        },

        async atualizar(tabela, id, payload) {
            await ensureProfile();
            return handleSupabaseResponse(await client.from(tabela).update(payload).eq('id', id).select());
        },

        async remover(tabela, id) {
            await ensureProfile();
            return handleSupabaseResponse(await client.from(tabela).delete().eq('id', id));
        },

        async listarSetores() {
            await loadLookups();
            return cache.sectors;
        },

        async listarObjetivos() {
            await loadLookups();
            const titles = cache.objectives.map((row) => row.title).filter(Boolean);
            return core.uniqueNormalized ? core.uniqueNormalized(titles, resolveObjectiveTitle) : titles;
        },

        async listarPerfis() {
            await ensureProfile();
            return handleSupabaseResponse(await client.from(TABLES.profiles).select('*').order('full_name'));
        },

        async validarSenhaSetor(sectorName, password) {
            return validarSenhaSetor(sectorName, password);
        },

        async autorizarSetorPorSenha(sectorName, password) {
            return autorizarSetorPorSenha(sectorName, password);
        },

        async listarTarefas() {
            await loadLookups();
            const data = handleSupabaseResponse(
                await client
                    .from(TABLES.tasks)
                    .select('*, sectors(name), macro_objectives(title)')
                    .order('created_at', { ascending: false })
            );
            return (data || []).map(normalizeTask);
        },

        async criarTarefa(task) {
            const payload = await toDbTask(task);
            const rows = handleSupabaseResponse(await client.from(TABLES.tasks).insert(payload).select('*, sectors(name), macro_objectives(title)'));
            const saved = rows[0];
            await createHistory(saved.id, 'criada', 'Tarefa criada pelo frontend.', null, saved);

            if (task.dependencia) {
                await this.criarDependencia(saved.id, task.dependencia).catch(() => null);
            }

            return normalizeTask(saved);
        },

        async completarFichaTarefa(id, complementData = {}) {
            const session = await getCurrentSession();
            if (!session) throw new Error('Login obrigatÃ³rio para complementar ficha da atividade.');

            const profile = await ensureProfile();
            const current = handleSupabaseResponse(
                await client.from(TABLES.tasks).select('*, sectors(name), macro_objectives(title)').eq('id', id).single()
            );

            if (!isProfileAuthorizedForTask(profile, session.user, current)) {
                throw new Error('Complemento restrito ao gestor ou aos setores participantes da atividade.');
            }

            const metadata = current.metadata || {};
            const currentObjective = metadata.objetivo || current.macro_objectives?.title || '';
            const patchMetadata = {};
            const updatePayload = {};
            const changedFields = [];
            const rejectFilled = (fieldName) => {
                throw new Error(`O campo ${fieldName} jÃ¡ estÃ¡ preenchido e nÃ£o pode ser alterado por este fluxo.`);
            };

            if (!isBlankValue(complementData.objetivo)) {
                if (!isDefaultObjectiveValue(currentObjective)) rejectFilled('objetivo');
                const objetivo = resolveObjectiveTitle(complementData.objetivo);
                updatePayload.macro_objective_id = await ensureObjective(objetivo);
                patchMetadata.objetivo = objetivo;
                changedFields.push('objetivo');
            }

            if (!isBlankValue(complementData.clienteFornecedor)) {
                if (!isBlankValue(metadata.clienteFornecedor)) rejectFilled('cliente/fornecedor');
                patchMetadata.clienteFornecedor = String(complementData.clienteFornecedor).trim();
                changedFields.push('cliente/fornecedor');
            }

            const wantsDisplacement = complementData.deslocamento === true || !isBlankValue(complementData.local) || !isBlankValue(complementData.duracaoDeslocamento);
            if (wantsDisplacement) {
                const hasExistingDisplacement = Boolean(current.has_displacement);
                const nextLocal = !isBlankValue(complementData.local)
                    ? String(complementData.local).trim()
                    : metadata.local || '';
                const nextDuration = !isBlankValue(complementData.duracaoDeslocamento)
                    ? String(complementData.duracaoDeslocamento).trim()
                    : metadata.duracaoDeslocamento || '';
                const nextUnit = !isBlankValue(complementData.unidadeDeslocamento)
                    ? String(complementData.unidadeDeslocamento).trim()
                    : metadata.unidadeDeslocamento || 'Horas';

                if (!isBlankValue(complementData.local)) {
                    if (!isBlankValue(metadata.local)) rejectFilled('local de deslocamento');
                    patchMetadata.local = nextLocal;
                    changedFields.push('local de deslocamento');
                }

                if (!isBlankValue(complementData.duracaoDeslocamento)) {
                    if (!isBlankValue(metadata.duracaoDeslocamento)) rejectFilled('tempo de deslocamento');
                    patchMetadata.duracaoDeslocamento = nextDuration;
                    patchMetadata.unidadeDeslocamento = nextUnit;
                    changedFields.push('tempo de deslocamento');
                }

                if (!hasExistingDisplacement) {
                    updatePayload.has_displacement = true;
                    patchMetadata.deslocamento = true;
                    changedFields.push('deslocamento');
                }

                updatePayload.displacement_description = [nextLocal, nextDuration, nextUnit].filter(Boolean).join(' - ') || null;
            }

            const wantsCost = complementData.geraCusto === true || !isBlankValue(complementData.tipoCusto) || !isBlankValue(complementData.valorCusto);
            if (wantsCost) {
                const currentCostValue = Math.max(costNumber(current.estimated_cost), costNumber(current.actual_cost), costNumber(metadata.valorCusto));
                const nextCostType = !isBlankValue(complementData.tipoCusto)
                    ? String(complementData.tipoCusto).trim()
                    : metadata.tipoCusto || '';
                const nextCostValue = !isBlankValue(complementData.valorCusto)
                    ? String(complementData.valorCusto).trim()
                    : metadata.valorCusto || '';

                if (!isBlankValue(complementData.tipoCusto)) {
                    if (!isBlankValue(metadata.tipoCusto)) rejectFilled('descriÃ§Ã£o do custo');
                    patchMetadata.tipoCusto = nextCostType;
                    changedFields.push('descriÃ§Ã£o do custo');
                }

                if (!isBlankValue(complementData.valorCusto)) {
                    if (currentCostValue > 0 || hasPositiveCost(metadata.valorCusto)) rejectFilled('valor do custo');
                    patchMetadata.valorCusto = nextCostValue;
                    updatePayload.estimated_cost = costNumber(nextCostValue);
                    updatePayload.actual_cost = costNumber(nextCostValue);
                    changedFields.push('valor do custo');
                }

                if (!metadata.geraCusto && currentCostValue <= 0) {
                    patchMetadata.geraCusto = true;
                    changedFields.push('custo');
                }
            }

            if (!changedFields.length) {
                throw new Error('Nenhum campo vazio foi enviado para complemento.');
            }

            updatePayload.metadata = { ...metadata, ...patchMetadata };
            const rows = handleSupabaseResponse(
                await client.from(TABLES.tasks).update(updatePayload).eq('id', id).select('*, sectors(name), macro_objectives(title)')
            );
            await createHistory(id, 'ficha_complementada', `Ficha complementada: ${changedFields.join(', ')}.`, {
                metadata
            }, updatePayload);

            return normalizeTask(rows[0]);
        },

        async editarFichaTarefa(id, editData = {}) {
            const session = await getCurrentSession();
            if (!session) throw new Error('Login obrigatorio para editar ficha da atividade.');

            const blockedDateFields = [
                'dataAbertura',
                'conclusaoPrevista',
                'conclusaoPrevistaOriginal',
                'prazoOriginal',
                'dataAvaliacao',
                'conclusaoReal',
                'conclusaoRealUser',
                'requested_evaluation_at',
                'completed_at',
                'due_date',
                'planned_start_at'
            ];
            const blockedReceived = blockedDateFields.filter((field) => Object.prototype.hasOwnProperty.call(editData, field));
            if (blockedReceived.length) {
                throw new Error('Datas da atividade nao podem ser editadas por este fluxo.');
            }

            const profile = await ensureProfile();
            const current = handleSupabaseResponse(
                await client.from(TABLES.tasks).select('*, sectors(name), macro_objectives(title)').eq('id', id).single()
            );

            if (!isProfileAuthorizedForTaskEdit(profile, session.user, current)) {
                throw new Error('Edicao restrita ao gestor, ao usuario criador ou aos setores participantes da atividade.');
            }

            const metadata = current.metadata || {};
            const currentSector = current.sectors || current.sector || null;
            const currentSolicitante = resolveSectorName(metadata.setorSolicitante || (currentSector && currentSector.name) || 'Geral');
            const currentExecutor = resolveSectorName(metadata.setorExecutor || (currentSector && currentSector.name) || currentSolicitante);
            const currentObjective = resolveObjectiveTitle((current.macro_objectives && current.macro_objectives.title) || metadata.objetivo || 'Geral');

            const setorSolicitante = !isBlankValue(editData.setorSolicitante) ? resolveSectorName(editData.setorSolicitante) : currentSolicitante;
            const setorExecutor = !isBlankValue(editData.setorExecutor) ? resolveSectorName(editData.setorExecutor) : currentExecutor;
            const objetivo = !isBlankValue(editData.objetivo) ? resolveObjectiveTitle(editData.objetivo) : currentObjective;
            const descricao = !isBlankValue(editData.descricao) ? String(editData.descricao).trim() : String(current.description || current.title || '').trim();
            const complexidade = !isBlankValue(editData.complexidade) ? String(editData.complexidade).trim() : enumToUi(current.complexity);
            const clienteFornecedor = Object.prototype.hasOwnProperty.call(editData, 'clienteFornecedor')
                ? String(editData.clienteFornecedor || '').trim()
                : String(metadata.clienteFornecedor || '').trim();
            const deslocamento = Object.prototype.hasOwnProperty.call(editData, 'deslocamento') ? Boolean(editData.deslocamento) : Boolean(current.has_displacement);
            const local = deslocamento ? String(Object.prototype.hasOwnProperty.call(editData, 'local') ? editData.local || '' : metadata.local || '').trim() : '';
            const duracaoDeslocamento = deslocamento ? String(Object.prototype.hasOwnProperty.call(editData, 'duracaoDeslocamento') ? editData.duracaoDeslocamento || '' : metadata.duracaoDeslocamento || '').trim() : '';
            const unidadeDeslocamento = deslocamento ? String(editData.unidadeDeslocamento || metadata.unidadeDeslocamento || 'Horas').trim() : 'Horas';
            const geraCusto = Object.prototype.hasOwnProperty.call(editData, 'geraCusto')
                ? Boolean(editData.geraCusto)
                : Boolean(metadata.geraCusto) || Number(current.estimated_cost || current.actual_cost || 0) > 0;
            const tipoCusto = geraCusto ? String(Object.prototype.hasOwnProperty.call(editData, 'tipoCusto') ? editData.tipoCusto || '' : metadata.tipoCusto || '').trim() : '';
            const valorCusto = geraCusto ? String(Object.prototype.hasOwnProperty.call(editData, 'valorCusto') ? editData.valorCusto || '' : metadata.valorCusto || current.estimated_cost || '').trim() : '';
            const dependencia = Object.prototype.hasOwnProperty.call(editData, 'dependencia')
                ? String(editData.dependencia || '').trim()
                : String(metadata.dependencia || '').trim();

            if (!descricao) throw new Error('Descricao da atividade e obrigatoria.');
            if (dependencia && String(dependencia) === String(id)) throw new Error('A atividade nao pode depender dela mesma.');

            const sectorId = await ensureSector(setorExecutor);
            const objectiveId = await ensureObjective(objetivo);
            const metadataPatch = {
                ...metadata,
                setorSolicitante,
                setorExecutor,
                objetivo,
                clienteFornecedor,
                local,
                duracaoDeslocamento,
                unidadeDeslocamento,
                geraCusto,
                tipoCusto,
                valorCusto,
                dependencia,
                editadoEm: nowIso(),
                editadoPor: cache.userId
            };
            const updatePayload = {
                title: descricao.slice(0, 120),
                description: descricao,
                sector_id: sectorId,
                macro_objective_id: objectiveId,
                priority: priorityToDb(editData.prioridade || complexidade),
                complexity: complexityToDb(complexidade),
                has_displacement: deslocamento,
                displacement_description: deslocamento ? [local, duracaoDeslocamento, unidadeDeslocamento].filter(Boolean).join(' - ') : null,
                estimated_cost: geraCusto ? costNumber(valorCusto) : 0,
                actual_cost: geraCusto ? costNumber(valorCusto) : 0,
                tags: [setorSolicitante, setorExecutor, objetivo].filter(Boolean),
                metadata: metadataPatch
            };

            const rows = handleSupabaseResponse(
                await client.from(TABLES.tasks).update(updatePayload).eq('id', id).select('*, sectors(name), macro_objectives(title)')
            );
            if (Object.prototype.hasOwnProperty.call(editData, 'dependencia')) {
                try {
                    const removeDependencies = await client.from(TABLES.dependencies).delete().eq('task_id', id);
                    if (removeDependencies.error) throw removeDependencies.error;
                    if (dependencia) {
                        const addDependency = await client.from(TABLES.dependencies).insert({
                            task_id: id,
                            depends_on_task_id: dependencia,
                            created_by: cache.userId
                        });
                        if (addDependency.error) throw addDependency.error;
                    }
                } catch (error) {
                    console.warn('[motorbackend] Dependencia da ficha nao sincronizada:', error.message || error);
                }
            }
            await createHistory(id, 'ficha_editada', 'Ficha da atividade editada sem alterar datas.', {
                metadata
            }, updatePayload);

            return normalizeTask(rows[0]);
        },

        async solicitarAvaliacao(id, conclusaoRealUser, authData = {}) {
            const currentTask = handleSupabaseResponse(
                await client.from(TABLES.tasks).select('*, sectors(name), macro_objectives(title)').eq('id', id).single()
            );
            const responsibleSector = getTaskResponsibleSector(currentTask);
            const session = await getCurrentSession();
            let authorizationMode = 'session';

            if (session) {
                const profile = await ensureProfile();
                if (!isProfileAuthorizedForFinalization(profile, session.user, currentTask)) {
                    if (!authData || !authData.password) {
                        throw new Error(`Baixa restrita ao setor executor ${responsibleSector} ou ao usuario que inseriu a atividade. Informe uma das senhas autorizadas.`);
                    }

                    const authResult = await autorizarBaixaPorSenha(currentTask, authData.password, { ignoreExistingSession: true });
                    authorizationMode = authResult.authorizedBy || 'password';
                }
            }
            else {
                if (!authData || !authData.password) {
                    throw new Error('Finalizacao exige login ativo, senha do setor executor ou senha do usuario que inseriu a atividade.');
                }

                const authResult = await autorizarBaixaPorSenha(currentTask, authData.password);
                authorizationMode = authResult.authorizedBy || 'password';
            }

            const payload = {
                status: 'aguardando_avaliacao',
                requested_evaluation_at: dateOnlyToIso(conclusaoRealUser || today()),
                progress_percent: 90
            };
            const rows = handleSupabaseResponse(
                await client.from(TABLES.tasks).update(payload).eq('id', id).select('*, sectors(name), macro_objectives(title)')
            );
            const historyNote = authorizationMode === 'sector'
                ? `Tarefa enviada para avaliacao apos login por senha do setor ${responsibleSector}.`
                : authorizationMode === 'creator'
                ? 'Tarefa enviada para avaliacao apos login por senha do usuario criador.'
                : session
                ? 'Tarefa enviada para avaliacao por usuario autenticado autorizado.'
                : `Tarefa enviada para avaliacao apos login por senha do setor ${responsibleSector}.`;
            await createHistory(id, 'avaliacao_solicitada', historyNote, null, payload);
            return normalizeTask(rows[0]);
        },

        async concluirTarefa(id, evaluationData = {}) {
            await ensureManagerProfile();

            const statusEvaluation = evaluationData.necessitaAjuste ? 'ajuste_solicitado' : 'aprovada';
            const numericScore = Number(evaluationData.score ?? evaluationData.nota);
            const score = Number.isFinite(numericScore) ? Math.max(0, Math.min(10, numericScore)) : 10;
            const evaluationDate = normalizeDateOnly(evaluationData.dataAvaliacao || today(), today());
            const completionDate = normalizeDateOnly(evaluationData.conclusaoReal || today(), today());

            await client.from(TABLES.evaluations).insert({
                task_id: id,
                evaluator_id: cache.userId,
                status: statusEvaluation,
                score,
                comment: evaluationData.encaminhamento || evaluationData.comment || 'Avaliação registrada pelo frontend.',
                correction_required: evaluationData.necessitaAjuste ? (evaluationData.encaminhamento || 'Ajuste solicitado.') : null
            });

            const metadataPatch = {
                avaliacao: evaluationData.avaliacao || '',
                dataAvaliacao: evaluationDate,
                conclusaoReal: completionDate,
                necessitaAjuste: !!evaluationData.necessitaAjuste,
                encaminhamento: evaluationData.encaminhamento || ''
            };

            const payload = {
                status: evaluationData.necessitaAjuste ? 'pendente' : 'concluida',
                completed_at: evaluationData.necessitaAjuste ? null : dateOnlyToIso(completionDate),
                progress_percent: evaluationData.necessitaAjuste ? 50 : 100,
                metadata: metadataPatch
            };

            const current = handleSupabaseResponse(await client.from(TABLES.tasks).select('metadata').eq('id', id).single());
            payload.metadata = { ...(current.metadata || {}), ...metadataPatch };

            const rows = handleSupabaseResponse(
                await client.from(TABLES.tasks).update(payload).eq('id', id).select('*, sectors(name), macro_objectives(title)')
            );

            await createHistory(id, 'avaliada', 'Avaliação registrada.', null, payload);
            return normalizeTask(rows[0]);
        },

        async atualizarPrazo(id, conclusaoPrevista) {
            await ensureManagerProfile();
            const newDueDate = normalizeDateOnly(conclusaoPrevista);
            if (!newDueDate) throw new Error('Novo prazo inválido.');

            const current = handleSupabaseResponse(
                await client.from(TABLES.tasks).select('*, sectors(name), macro_objectives(title)').eq('id', id).single()
            );
            const metadata = current.metadata || {};
            const previousDueDate = normalizeDateOnly(current.due_date || metadata.conclusaoPrevista || today(), today());
            const originalDueDate = normalizeDateOnly(metadata.conclusaoPrevistaOriginal || metadata.prazoOriginal || previousDueDate, previousDueDate);
            const replanHistory = Array.isArray(metadata.historicoPrazo) ? metadata.historicoPrazo : [];
            const existingDelayDays = Math.max(0, Number(metadata.diasAtrasoUltimaReprogramacao || 0), daysBetweenDateOnly(originalDueDate, today()));
            const delayByNewDeadline = existingDelayDays > 0 ? Math.max(0, daysBetweenDateOnly(originalDueDate, newDueDate)) : 0;
            const nextHistory = [
                ...replanHistory,
                {
                    alteradoEm: nowIso(),
                    alteradoPor: cache.userId,
                    prazoOriginal: originalDueDate,
                    prazoAnterior: previousDueDate,
                    prazoNovo: newDueDate,
                    diasAtrasoReprogramacao: delayByNewDeadline
                }
            ];
            const metadataPatch = {
                ...metadata,
                conclusaoPrevistaOriginal: originalDueDate,
                prazoReprogramado: true,
                diasAtrasoUltimaReprogramacao: delayByNewDeadline,
                historicoPrazo: nextHistory
            };
            const rows = handleSupabaseResponse(
                await client.from(TABLES.tasks).update({ due_date: newDueDate, metadata: metadataPatch }).eq('id', id).select('*, sectors(name), macro_objectives(title)')
            );
            await createHistory(id, 'prazo_alterado', 'Prazo reprogramado pelo gestor mantendo histórico do prazo original.', {
                due_date: previousDueDate,
                metadata
            }, {
                due_date: newDueDate,
                metadata: metadataPatch
            });
            return normalizeTask(rows[0]);
        },

        async criarComentario(taskId, comment, isInternal = false) {
            await ensureProfile();
            const rows = handleSupabaseResponse(await client.from(TABLES.comments).insert({
                task_id: taskId,
                author_id: cache.userId,
                comment,
                is_internal: !!isInternal
            }).select());
            await createHistory(taskId, 'comentario', 'Comentário adicionado.');
            return rows;
        },

        async listarComentarios(taskId) {
            await ensureProfile();
            let query = client.from(TABLES.comments).select('*').order('created_at', { ascending: false });
            if (taskId) query = query.eq('task_id', taskId);
            return handleSupabaseResponse(await query);
        },

        async criarDependencia(taskId, dependsOnTaskId) {
            await ensureProfile();
            if (!taskId || !dependsOnTaskId || taskId === dependsOnTaskId) return [];
            return handleSupabaseResponse(await client.from(TABLES.dependencies).insert({
                task_id: taskId,
                depends_on_task_id: dependsOnTaskId,
                created_by: cache.userId
            }).select());
        },

        async listarDependencias(taskId) {
            await ensureProfile();
            let query = client.from(TABLES.dependencies).select('*');
            if (taskId) query = query.eq('task_id', taskId);
            return handleSupabaseResponse(await query);
        },

        async listarAvaliacoes(taskId) {
            await ensureProfile();
            let query = client.from(TABLES.evaluations).select('*').order('created_at', { ascending: false });
            if (taskId) query = query.eq('task_id', taskId);
            return handleSupabaseResponse(await query);
        },

        async listarHistorico(taskId) {
            await ensureProfile();
            let query = client.from(TABLES.history).select('*').order('created_at', { ascending: false });
            if (taskId) query = query.eq('task_id', taskId);
            return handleSupabaseResponse(await query);
        },

        async registrarAnexo(taskId, fileInfo = {}) {
            await ensureProfile();
            const rows = handleSupabaseResponse(await client.from(TABLES.attachments).insert({
                task_id: taskId,
                uploaded_by: cache.userId,
                file_type: fileInfo.file_type || 'outro',
                bucket_name: fileInfo.bucket_name || ATTACHMENT_CONFIG.bucketName,
                storage_path: fileInfo.storage_path,
                public_url: fileInfo.public_url || null,
                original_file_name: fileInfo.original_file_name || null,
                mime_type: fileInfo.mime_type || null,
                file_size_bytes: fileInfo.file_size_bytes || null,
                metadata: fileInfo.metadata || {}
            }).select());
            try {
                const saved = rows[0] || {};
                const currentTask = handleSupabaseResponse(await client.from(TABLES.tasks).select('metadata').eq('id', taskId).single());
                const metadata = currentTask.metadata || {};
                const existingSummary = Array.isArray(metadata.anexosResumo) ? metadata.anexosResumo : [];
                const nextSummary = [
                    ...existingSummary.filter((item) => String(item.id || '') !== String(saved.id || '')),
                    {
                        id: saved.id || null,
                        nome: saved.original_file_name || fileInfo.original_file_name || 'Anexo',
                        tipo: saved.file_type || fileInfo.file_type || 'outro',
                        mime: saved.mime_type || fileInfo.mime_type || null,
                        tamanho: saved.file_size_bytes || fileInfo.file_size_bytes || null,
                        url: saved.public_url || fileInfo.public_url || null,
                        caminho: saved.storage_path || fileInfo.storage_path || null
                    }
                ];
                await client.from(TABLES.tasks).update({
                    metadata: { ...metadata, anexosResumo: nextSummary }
                }).eq('id', taskId);
            } catch (error) {
                console.warn('[motorbackend] Resumo de anexos não atualizado:', error.message || error);
            }
            await createHistory(taskId, 'anexo_adicionado', 'Anexo registrado.');
            return rows;
        },

        async anexarArquivoTarefa(taskId, file) {
            await ensureProfile();
            if (!taskId) throw new Error('Atividade não informada para anexar arquivo.');

            const validation = validateAttachmentFile(file);
            if (!validation.valid) throw new Error(validation.message);
            if (!client.storage || typeof client.storage.from !== 'function') {
                throw new Error('Supabase Storage não está disponível para upload de anexos.');
            }

            const bucketName = ATTACHMENT_CONFIG.bucketName;
            const safeName = sanitizeFileName(file.name || 'arquivo');
            const storagePath = `${taskId}/${Date.now()}-${randomId()}-${safeName}`;
            const bucket = client.storage.from(bucketName);
            const uploadResult = await bucket.upload(storagePath, file, {
                cacheControl: '3600',
                contentType: file.type || 'application/octet-stream',
                upsert: false
            });

            if (uploadResult.error) {
                console.error('[motorbackend] Falha no upload do anexo:', uploadResult.error);
                throw new Error(uploadResult.error.message || 'Falha ao enviar anexo para o Supabase Storage.');
            }

            const publicUrlResult = bucket.getPublicUrl(storagePath);
            const fileInfo = {
                file_type: getAttachmentKind(file),
                bucket_name: bucketName,
                storage_path: storagePath,
                public_url: publicUrlResult?.data?.publicUrl || null,
                original_file_name: file.name || safeName,
                mime_type: file.type || null,
                file_size_bytes: file.size || null,
                metadata: {
                    origem_frontend: 'controle_tarefas_html',
                    uploaded_at: nowIso()
                }
            };

            try {
                const rows = await this.registrarAnexo(taskId, fileInfo);
                return rows[0] || fileInfo;
            } catch (error) {
                await bucket.remove([storagePath]).catch(() => null);
                throw error;
            }
        },

        async anexarArquivosTarefa(taskId, files = []) {
            const list = Array.from(files || []);
            if (list.length > ATTACHMENT_CONFIG.maxFiles) {
                throw new Error(`Selecione no máximo ${ATTACHMENT_CONFIG.maxFiles} anexos por atividade.`);
            }

            const saved = [];
            for (const file of list) {
                saved.push(await this.anexarArquivoTarefa(taskId, file));
            }
            return saved;
        },

        async listarAnexos(taskId) {
            await ensureProfile();
            let query = client.from(TABLES.attachments).select('*').order('created_at', { ascending: false });
            if (taskId) query = query.eq('task_id', taskId);
            return handleSupabaseResponse(await query);
        },

        async criarAcompanhamento(taskId, data = {}) {
            await ensureProfile();
            const expiresAt = data.expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
            const rows = handleSupabaseResponse(await client.from(TABLES.followups).insert({
                task_id: taskId,
                created_by: cache.userId,
                responsible_id: data.responsible_id || cache.userId,
                title: data.title || 'Acompanhamento',
                description: data.description || '',
                status: 'ativo',
                starts_at: data.starts_at || nowIso(),
                expires_at: expiresAt,
                metadata: data.metadata || {}
            }).select());
            await createHistory(taskId, 'acompanhamento_criado', 'Acompanhamento criado.');
            return rows;
        },

        async listarAcompanhamentos(taskId) {
            await ensureProfile();
            let query = client.from(TABLES.followups).select('*').order('created_at', { ascending: false });
            if (taskId) query = query.eq('task_id', taskId);
            return handleSupabaseResponse(await query);
        },

        async finalizarAcompanhamento(followupId) {
            await ensureProfile();
            return handleSupabaseResponse(await client.from(TABLES.followups).update({
                status: 'finalizado',
                finished_at: nowIso()
            }).eq('id', followupId).select());
        },

        async listarNotificacoes() {
            await ensureProfile();
            return handleSupabaseResponse(
                await client.from(TABLES.notifications).select('*').eq('recipient_id', cache.userId).order('created_at', { ascending: false })
            );
        },

        async marcarNotificacaoLida(id) {
            await ensureProfile();
            return handleSupabaseResponse(await client.from(TABLES.notifications).update({ read_at: nowIso() }).eq('id', id).select());
        },

        subscribeAppChanges(callback) {
            if (!client.channel || typeof callback !== 'function') {
                return () => {};
            }

            const tablesToWatch = [
                TABLES.tasks,
                TABLES.sectors,
                TABLES.macroObjectives,
                TABLES.attachments,
                TABLES.dependencies,
                TABLES.evaluations,
                TABLES.history,
                TABLES.comments,
                TABLES.followups,
                TABLES.notifications,
                TABLES.profiles
            ].filter(Boolean);
            const channel = client.channel('gestao-atividades-app-sync');
            const invalidateCacheForChange = (payload) => {
                if ([TABLES.profiles, TABLES.sectors, TABLES.macroObjectives].includes(payload?.table)) {
                    cache.profile = null;
                    cache.loadedLookups = false;
                }

                callback(payload);
            };

            tablesToWatch.forEach((table) => {
                channel.on('postgres_changes', {
                    event: '*',
                    schema: SUPABASE_SCHEMA,
                    table
                }, invalidateCacheForChange);
            });

            channel.subscribe((status) => {
                if (status === 'CHANNEL_ERROR') {
                    console.warn('[motorbackend] Canal realtime indisponivel para sincronizacao do app.');
                }
            });

            return () => {
                client.removeChannel(channel);
            };
        },

        async painelResumo() {
            await ensureProfile();
            return {
                dashboard: await client.from(TABLES.vwDashboardSummary).select('*').then(handleSupabaseResponse).catch(() => []),
                setores: await client.from(TABLES.vwSectorPerformance).select('*').then(handleSupabaseResponse).catch(() => []),
                workload: await client.from(TABLES.vwUserWorkload).select('*').then(handleSupabaseResponse).catch(() => []),
                avaliacoes: await client.from(TABLES.vwEvaluationMetrics).select('*').then(handleSupabaseResponse).catch(() => []),
                acompanhamentos: await client.from(TABLES.vwActiveFollowups).select('*').then(handleSupabaseResponse).catch(() => [])
            };
        }
    };
})();
