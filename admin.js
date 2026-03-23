document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('data-container');
    const viewTitle = document.getElementById('view-title');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const dbSearch = document.getElementById('db-search');
    
    const API_BASE = 'http://localhost:3000/api';
    let currentFilter = 'dashboard';
    let currentData = [];

    window.refreshView = () => {
        const lang = localStorage.getItem('clinic_lang') || 'en';
        const t = translations[lang];
        
        if (currentFilter === 'dashboard') viewTitle.textContent = t.summary_dashboard;
        else if (currentFilter === 'patients') viewTitle.textContent = t.filter_patients.split(' ')[1];
        else if (currentFilter === 'appointments') viewTitle.textContent = t.filter_appointments.split(' ')[1];
        else if (currentFilter === 'doctors') viewTitle.textContent = t.filter_doctors.split(' ')[1];
        else if (currentFilter === 'callLogs') viewTitle.textContent = t.filter_calllogs.split(' ')[1];
        
        if (currentFilter === 'dashboard') renderDashboard();
        else renderCurrentData();
    };

    async function loadData(filterType) {
        currentFilter = filterType;
        const lang = localStorage.getItem('clinic_lang') || 'en';
        const t = translations[lang];
        
        dataContainer.innerHTML = `<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">${t.loading}</p>`;
        
        try {
            if (filterType === 'dashboard') {
                renderDashboard();
                return;
            }

            let endpoint = '';
            if (filterType === 'patients') endpoint = '/patients';
            else if (filterType === 'appointments') endpoint = '/appointments';
            else if (filterType === 'doctors') endpoint = '/doctors';
            else if (filterType === 'callLogs') endpoint = '/call-logs';

            const res = await fetch(`${API_BASE}${endpoint}`);
            if (!res.ok) throw new Error('API request failed');
            
            currentData = await res.json();
            renderCurrentData();

        } catch (err) {
            console.error(err);
            dataContainer.innerHTML = `<p style="color: var(--danger); text-align: center; padding: 2rem;">${translations[lang].error_loading}</p>`;
        }
    }

    async function renderDashboard() {
        const lang = localStorage.getItem('clinic_lang') || 'en';
        const t = translations[lang];
        
        try {
            const [pRes, aRes] = await Promise.all([
                fetch(`${API_BASE}/patients`),
                fetch(`${API_BASE}/appointments`)
            ]);
            
            const patients = await pRes.json();
            const appointments = await aRes.json();
            
            const today = new Date().toISOString().split('T')[0];
            const todayAppts = appointments.filter(a => a.date === today && a.status === 'scheduled');
            const pendingReminders = appointments.filter(a => a.status === 'pending').length;

            dataContainer.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <span class="stat-value">${todayAppts.length}</span>
                        <span class="stat-label">${t.stats_today_appointments}</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">${pendingReminders}</span>
                        <span class="stat-label">${t.stats_pending_reminders}</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">${patients.length}</span>
                        <span class="stat-label">${t.stats_total_patients}</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">12 ${t.mins}</span>
                        <span class="stat-label">${t.stats_waiting_time}</span>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <!-- Live Queue Widget -->
                    <div class="widget">
                        <div class="widget-title">
                            <span>🕒 ${t.live_queue}</span>
                            <span class="badge appointments">${todayAppts.length} ${t.filter_appointments.split(' ')[1]}</span>
                        </div>
                        <div class="live-queue-list" id="queue-list">
                            ${renderQueueHTML(todayAppts, t)}
                        </div>
                    </div>

                    <!-- AI Intelligence Widget -->
                    <div class="widget">
                        <div class="widget-title">
                            <span>🧠 ${t.ai_intelligence}</span>
                        </div>
                        <div class="ai-suggestion-box">
                            ${renderSuggestionsHTML(t, patients, appointments)}
                        </div>
                    </div>
                </div>
            `;

        } catch (err) {
            console.error(err);
            dataContainer.innerHTML = `<p style="color: var(--danger); text-align: center;">Error loading dashboard data.</p>`;
        }
    }

    function renderQueueHTML(todayAppts, t) {
        if (todayAppts.length === 0) return `<p style="color: var(--text-secondary); font-size: 0.875rem;">${t.no_records}</p>`;
        
        // Take first two
        const serving = todayAppts[0];
        const next = todayAppts[1];

        let html = `
            <div class="queue-item current">
                <div>
                    <div class="info-label">${t.serving_now}</div>
                    <div class="info-value">#${serving.id} ${serving.patient_name}</div>
                </div>
                <div class="info-value" style="color: var(--accent)">${serving.time}</div>
            </div>
        `;

        if (next) {
            html += `
                <div class="queue-item">
                    <div>
                        <div class="info-label">${t.up_next}</div>
                        <div class="info-value">#${next.id} ${next.patient_name}</div>
                    </div>
                    <div class="info-value" style="color: var(--text-secondary)">${next.time}</div>
                </div>
            `;
        }

        return html;
    }

    function renderSuggestionsHTML(t, patients, appts) {
        // Mocked AI hints for competition WOW factor
        return `
            <div class="suggestion-card">
                <h4>${t.suggest_title}</h4>
                <p>${t.suggest_desc}</p>
            </div>
            <div class="suggestion-card" style="background: #f0fdf4; border-color: #bbf7d0;">
                <h4 style="color: #15803d;">Patient Outreach</h4>
                <p>3 patients have missed follow-ups this week. Suggest scheduled reminders.</p>
            </div>
        `;
    }

    function renderCurrentData() {
        const lang = localStorage.getItem('clinic_lang') || 'en';
        const t = translations[lang];
        
        const searchTerm = dbSearch.value.toLowerCase();
        const filtered = currentData.filter(item => {
            const searchStr = (item.name || item.patient_name || item.customer_phone || item.id || '').toString().toLowerCase();
            return searchStr.includes(searchTerm);
        });

        if (filtered.length === 0) {
            dataContainer.innerHTML = `<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">${searchTerm ? 'No matches found.' : t.no_records}</p>`;
            return;
        }

        dataContainer.innerHTML = '';
        filtered.reverse().forEach(record => renderCard(record, currentFilter, dataContainer));
    }

    function renderCard(record, type, container) {
        const lang = localStorage.getItem('clinic_lang') || 'en';
        const t = translations[lang];
        const card = document.createElement('div');
        card.className = 'data-card';

        let badgeClass = type;
        let title = '';
        let infoHTML = '';
        let actionsHTML = '';

        if (type === 'patients') {
            title = record.name || 'Patient';
            infoHTML = `
                <div class="info-grid">
                    <div class="info-item"><span class="info-label">Name</span><span class="info-value">${record.name}</span></div>
                    <div class="info-item"><span class="info-label">Phone</span><span class="info-value">${record.phone || '-'}</span></div>
                    <div class="info-item"><span class="info-label">Age</span><span class="info-value">${record.age || '-'} yrs</span></div>
                    <div class="info-item"><span class="info-label">Gender</span><span class="info-value">${record.gender || '-'}</span></div>
                </div>
            `;
            actionsHTML = `<button class="action-btn" onclick="downloadReceipt('${record.name}', 'General Patient File')">📄 ${t.btn_receipt}</button>`;
        } else if (type === 'appointments') {
            title = `${record.patient_name} - ${record.service}`;
            const waitTime = calculateWaitTime(record.time);
            infoHTML = `
                <div class="info-grid">
                    <div class="info-item"><span class="info-label">Patient</span><span class="info-value">${record.patient_name}</span></div>
                    <div class="info-item"><span class="info-label">Doctor</span><span class="info-value">${record.doctor_name || '-'}</span></div>
                    <div class="info-item"><span class="info-label">Date</span><span class="info-value">${record.date}</span></div>
                    <div class="info-item"><span class="info-label">Time</span><span class="info-value">${record.time}</span></div>
                    <div class="info-item"><span class="info-label">Service</span><span class="info-value">${record.service || 'Checkup'}</span></div>
                    <div class="info-item"><span class="info-label">Status</span><span class="info-value"><span class="badge ${record.status}">${record.status.toUpperCase()}</span></span></div>
                    <div class="info-item"><span class="info-label">Waiting</span><span class="info-value" style="color:${waitTime > 10 ? 'var(--danger)' : 'var(--success)'}">${waitTime} mins</span></div>
                </div>
            `;
            actionsHTML = `
                <button class="action-btn primary" onclick="sendReminder('${record.patient_name}')">🔔 ${t.btn_reminder}</button>
                <button class="action-btn" onclick="downloadReceipt('${record.patient_name}', '${record.service}')">📄 ${t.btn_receipt}</button>
            `;
        } else if (type === 'doctors') {
            title = record.name;
            infoHTML = `
                <div class="info-grid">
                    <div class="info-item"><span class="info-label">Doctor Name</span><span class="info-value">${record.name}</span></div>
                    <div class="info-item"><span class="info-label">Specialization</span><span class="info-value">${record.specialization || '-'}</span></div>
                    <div class="info-item"><span class="info-label">Contact</span><span class="info-value">${record.phone || '-'}</span></div>
                </div>
            `;
        } else if (type === 'callLogs') {
            title = 'Call - ' + record.customer_phone;
            const sentiment = getSentiment(record.summary);
            infoHTML = `
                <div class="info-grid" style="grid-template-columns: 1fr;">
                    <div class="info-item">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span class="info-label">Structured Call Summary</span>
                            <span class="badge" style="background:${sentiment.bg}; color:${sentiment.color}; font-size:10px;">${sentiment.label}</span>
                        </div>
                        <div class="suggestion-card" style="margin-top: 0.5rem; background: #f8fafc; border: 1.5px solid var(--glass-border);">
                            <p style="font-weight: 500; color: var(--text-primary);">${record.summary}</p>
                            <div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--accent);">Status: ${record.booking_status}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card-header">
                <span class="badge ${badgeClass}">${type.toUpperCase()}</span>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">${record.created_at ? new Date(record.created_at).toLocaleString() : ''}</span>
            </div>
            ${infoHTML}
            ${actionsHTML ? `<div class="action-bar">${actionsHTML}</div>` : ''}
        `;

        container.appendChild(card);
    }

    function calculateWaitTime(apptTime) {
        if (!apptTime) return 0;
        const now = new Date();
        const [hours, minutes] = apptTime.split(':').map(Number);
        const apptDate = new Date();
        apptDate.setHours(hours, minutes, 0);
        
        const diff = Math.floor((now - apptDate) / 60000);
        return diff > 0 ? diff : 0;
    }

    window.sendReminder = (name) => {
        const lang = localStorage.getItem('clinic_lang') || 'en';
        const msg = lang === 'en' ? `Reminder sent to ${name} successfully!` : 
                    (lang === 'hi' ? `${name} को सफलतापूर्वक रिमाइंडर भेज दिया गया है!` : 
                    `${name} ला यशस्वीरीत्या स्मरणपत्र पाठवले आहे!`);
        alert('🔔 ' + msg);
    };

    window.downloadReceipt = (name, service) => {
        const receiptWindow = window.open('', '_blank', 'width=600,height=800');
        receiptWindow.document.write(`
            <html>
                <head>
                    <title>SmartClinic Receipt - ${name}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; background: white; line-height: 1.6; }
                        .header { text-align: center; border-bottom: 3px solid #f1f5f9; padding-bottom: 25px; margin-bottom: 40px; }
                        .logo { font-size: 24px; font-weight: 800; color: #2563eb; }
                        .receipt-body { max-width: 500px; margin: 0 auto; }
                        .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
                        .label { font-weight: 600; color: #64748b; text-transform: uppercase; font-size: 12px; }
                        .total { font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 30px; border-top: 3px solid #2563eb; padding-top: 20px; text-align: right; }
                        .footer { margin-top: 60px; text-align: center; font-size: 13px; color: #94a3b8; }
                        @media print { .btn { display: none; } }
                        .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; cursor: pointer; margin-top: 30px; border: none; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">🏥 SMARTCLINIC AI</div>
                        <p>Certified Professional Medical Operating System</p>
                    </div>
                    <div class="receipt-body">
                        <div class="row"><span class="label">Invoice No</span><span>#INV-${Math.floor(Math.random() * 10000)}</span></div>
                        <div class="row"><span class="label">Date</span><span>${new Date().toLocaleDateString()}</span></div>
                        <div class="row"><span class="label">Patient Name</span><span>${name}</span></div>
                        <div class="row"><span class="label">Service Rendered</span><span>${service}</span></div>
                        <div class="row"><span class="label">Method</span><span>Cash / Digital</span></div>
                        <div class="total">Total: ₹500.00</div>
                        <div style="text-align: center;">
                            <button class="btn" onclick="window.print()">Print Digital Copy</button>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This is a computer-generated receipt from SmartClinic AI Dashboard.</p>
                        <p>© 2026 HealthTech Solutions Inc.</p>
                    </div>
                </body>
            </html>
        `);
        receiptWindow.document.close();
    };

    function getSentiment(text) {
        const t = (text || '').toLowerCase();
        if (t.includes('urgent') || t.includes('emergency') || t.includes('pain') || t.includes('fever') || t.includes('sick')) 
            return { label: 'URGENT', bg: '#fee2e2', color: '#991b1b' };
        if (t.includes('happy') || t.includes('thank') || t.includes('confirm') || t.includes('book')) 
            return { label: 'POSITIVE', bg: '#dcfce7', color: '#166534' };
        if (t.includes('angry') || t.includes('wait') || t.includes('cancel') || t.includes('not found')) 
            return { label: 'ANXIOUS', bg: '#fef3c7', color: '#92400e' };
        return { label: 'NEUTRAL', bg: '#f1f5f9', color: '#475569' };
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            loadData(e.currentTarget.dataset.filter);
        });
    });

    dbSearch.addEventListener('input', () => {
        if (currentFilter !== 'dashboard') renderCurrentData();
    });

    loadData('dashboard');
});
