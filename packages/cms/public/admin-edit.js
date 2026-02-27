// PsychCombo CMS Admin - JavaScript
const API_BASE = window.location.origin;
let currentData = {
    psychoactives: [],
    combos: [],
    risks: []
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    loadPsychoactives();
});

// Tab switching
function switchTab(tabName) {
    // Update tabs
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    // Load data for the tab
    if (tabName === 'psychoactives' && currentData.psychoactives.length === 0) {
        loadPsychoactives();
    } else if (tabName === 'combos' && currentData.combos.length === 0) {
        loadCombos();
    } else if (tabName === 'risks' && currentData.risks.length === 0) {
        loadRisks();
    }
}

// Alert system
function showAlert(message, type = 'success') {
    const container = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    container.appendChild(alert);
    
    setTimeout(() => alert.remove(), 5000);
}

// Dashboard
async function loadDashboard() {
    try {
        const [psychoactives, combos, risks] = await Promise.all([
            fetch(`${API_BASE}/api/psychoactives?limit=1`).then(r => r.json()),
            fetch(`${API_BASE}/api/combos?limit=1`).then(r => r.json()),
            fetch(`${API_BASE}/api/risks?limit=1`).then(r => r.json())
        ]);
        
        document.getElementById('statPsychoactives').textContent = psychoactives.totalDocs || 0;
        document.getElementById('statCombos').textContent = combos.totalDocs || 0;
        document.getElementById('statRisks').textContent = risks.totalDocs || 0;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Psychoactives
async function loadPsychoactives(page = 1) {
    const loading = document.getElementById('psychoactivesLoading');
    const table = document.getElementById('psychoactivesTable');
    
    loading.style.display = 'block';
    table.style.display = 'none';
    
    try {
        const response = await fetch(`${API_BASE}/api/psychoactives?limit=20&page=${page}`);
        const data = await response.json();
        
        currentData.psychoactives = data.docs;
        renderPsychoactivesTable(data.docs);
        renderPagination('psychoactives', data);
        
        loading.style.display = 'none';
        table.style.display = 'block';
    } catch (error) {
        console.error('Error loading psychoactives:', error);
        showAlert('Failed to load psychoactives', 'error');
        loading.style.display = 'none';
    }
}

function renderPsychoactivesTable(items) {
    const tbody = document.getElementById('psychoactivesTableBody');
    tbody.innerHTML = '';
    
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No psychoactives found</td></tr>';
        return;
    }
    
    items.forEach(item => {
        const row = document.createElement('tr');
        const aka = item.aka?.map(a => a.alias).join(', ') || '-';
        
        row.innerHTML = `
            <td><strong>${escapeHtml(item.title)}</strong></td>
            <td><code>${escapeHtml(item.slug)}</code></td>
            <td>${escapeHtml(aka)}</td>
            <td class="actions">
                <button class="btn btn-sm btn-primary" onclick="editPsychoactive('${item.id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deletePsychoactive('${item.id}', '${escapeHtml(item.title)}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function searchPsychoactives() {
    const search = document.getElementById('searchPsychoactives').value.toLowerCase();
    const filtered = currentData.psychoactives.filter(item =>
        item.title.toLowerCase().includes(search) ||
        item.slug.toLowerCase().includes(search) ||
        item.aka?.some(a => a.alias.toLowerCase().includes(search))
    );
    renderPsychoactivesTable(filtered);
}

function showCreatePsychoactiveModal() {
    const modal = createModal('Create Psychoactive', `
        <form id="psychoactiveForm" onsubmit="savePsychoactive(event)">
            <div class="form-row">
                <div class="form-group">
                    <label>Title *</label>
                    <input type="text" name="title" required>
                </div>
                <div class="form-group">
                    <label>Slug *</label>
                    <input type="text" name="slug" required>
                    <small>URL-friendly identifier (e.g., "lsd", "psilocybin")</small>
                </div>
            </div>
            
            <div class="form-group">
                <label>Also Known As</label>
                <input type="text" name="aka" placeholder="Separate aliases with commas">
                <small>Alternative names, separated by commas</small>
            </div>
            
            <div class="form-group">
                <label>Family Members</label>
                <textarea name="family_members" placeholder="Related substances"></textarea>
            </div>
            
            <div class="form-group">
                <label>Positive Effects</label>
                <textarea name="positive_effects" placeholder="Comma-separated list"></textarea>
            </div>
            
            <div class="form-group">
                <label>Negative Effects</label>
                <textarea name="negative_effects" placeholder="Comma-separated list"></textarea>
            </div>
            
            <div class="form-group">
                <label>Neutral Effects</label>
                <textarea name="neutral_effects" placeholder="Comma-separated list"></textarea>
            </div>
            
            <div class="form-group">
                <label>Warnings</label>
                <textarea name="warnings" placeholder="Safety warnings"></textarea>
            </div>
            
            <div class="form-group">
                <label>Image Location</label>
                <input type="text" name="image_location" placeholder="/images/substance.jpg">
            </div>
            
            <div class="form-group">
                <label>Image Caption</label>
                <input type="text" name="image_caption">
            </div>
            
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button type="submit" class="btn btn-success">Create</button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `);
    showModal(modal);
}

async function savePsychoactive(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        family_members: formData.get('family_members') || undefined,
        positive_effects: formData.get('positive_effects') || undefined,
        negative_effects: formData.get('negative_effects') || undefined,
        neutral_effects: formData.get('neutral_effects') || undefined,
        warnings: formData.get('warnings') || undefined,
        image_location: formData.get('image_location') || undefined,
        image_caption: formData.get('image_caption') || undefined
    };
    
    // Handle aka field
    const akaInput = formData.get('aka');
    if (akaInput) {
        data.aka = akaInput.split(',').map(alias => ({ alias: alias.trim() })).filter(a => a.alias);
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/psychoactives`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errors?.[0]?.message || 'Failed to create psychoactive');
        }
        
        showAlert('Psychoactive created successfully!');
        closeModal();
        loadPsychoactives();
        loadDashboard();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function editPsychoactive(id) {
    try {
        const item = currentData.psychoactives.find(p => p.id == id);
        if (!item) {
            showAlert('Psychoactive not found', 'error');
            return;
        }
        
        const akaString = item.aka?.map(a => a.alias).join(', ') || '';
        
        const modal = createModal('Edit Psychoactive', `
            <form id="psychoactiveForm" onsubmit="updatePsychoactive(event, '${id}')">
                <div class="form-row">
                    <div class="form-group">
                        <label>Title *</label>
                        <input type="text" name="title" value="${escapeHtml(item.title)}" required>
                    </div>
                    <div class="form-group">
                        <label>Slug *</label>
                        <input type="text" name="slug" value="${escapeHtml(item.slug)}" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Also Known As</label>
                    <input type="text" name="aka" value="${escapeHtml(akaString)}">
                </div>
                
                <div class="form-group">
                    <label>Family Members</label>
                    <textarea name="family_members">${escapeHtml(item.family_members || '')}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Positive Effects</label>
                    <textarea name="positive_effects">${escapeHtml(item.positive_effects || '')}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Negative Effects</label>
                    <textarea name="negative_effects">${escapeHtml(item.negative_effects || '')}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Neutral Effects</label>
                    <textarea name="neutral_effects">${escapeHtml(item.neutral_effects || '')}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Warnings</label>
                    <textarea name="warnings">${escapeHtml(item.warnings || '')}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Image Location</label>
                    <input type="text" name="image_location" value="${escapeHtml(item.image_location || '')}">
                </div>
                
                <div class="form-group">
                    <label>Image Caption</label>
                    <input type="text" name="image_caption" value="${escapeHtml(item.image_caption || '')}">
                </div>
                
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button type="submit" class="btn btn-success">Update</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                </div>
            </form>
        `);
        showModal(modal);
    } catch (error) {
        showAlert('Failed to load psychoactive details', 'error');
    }
}

async function updatePsychoactive(event, id) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        family_members: formData.get('family_members') || undefined,
        positive_effects: formData.get('positive_effects') || undefined,
        negative_effects: formData.get('negative_effects') || undefined,
        neutral_effects: formData.get('neutral_effects') || undefined,
        warnings: formData.get('warnings') || undefined,
        image_location: formData.get('image_location') || undefined,
        image_caption: formData.get('image_caption') || undefined
    };
    
    const akaInput = formData.get('aka');
    if (akaInput) {
        data.aka = akaInput.split(',').map(alias => ({ alias: alias.trim() })).filter(a => a.alias);
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/psychoactives/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errors?.[0]?.message || 'Failed to update psychoactive');
        }
        
        showAlert('Psychoactive updated successfully!');
        closeModal();
        loadPsychoactives();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function deletePsychoactive(id, title) {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/psychoactives/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete psychoactive');
        }
        
        showAlert('Psychoactive deleted successfully!');
        loadPsychoactives();
        loadDashboard();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

// Combos
async function loadCombos(page = 1) {
    const loading = document.getElementById('combosLoading');
    const table = document.getElementById('combosTable');
    
    loading.style.display = 'block';
    table.style.display = 'none';
    
    try {
        const response = await fetch(`${API_BASE}/api/combos?limit=20&page=${page}`);
        const data = await response.json();
        
        currentData.combos = data.docs;
        renderCombosTable(data.docs);
        renderPagination('combos', data);
        
        loading.style.display = 'none';
        table.style.display = 'block';
    } catch (error) {
        console.error('Error loading combos:', error);
        showAlert('Failed to load combos', 'error');
        loading.style.display = 'none';
    }
}

function renderCombosTable(items) {
    const tbody = document.getElementById('combosTableBody');
    tbody.innerHTML = '';
    
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No combos found</td></tr>';
        return;
    }
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${escapeHtml(item.title)}</strong></td>
            <td><code>${escapeHtml(item.drug1 || '-')}</code></td>
            <td><code>${escapeHtml(item.drug2 || '-')}</code></td>
            <td class="actions">
                <button class="btn btn-sm btn-primary" onclick="editCombo('${item.id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCombo('${item.id}', '${escapeHtml(item.title)}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function searchCombos() {
    const search = document.getElementById('searchCombos').value.toLowerCase();
    const filtered = currentData.combos.filter(item =>
        item.title.toLowerCase().includes(search) ||
        item.drug1?.toLowerCase().includes(search) ||
        item.drug2?.toLowerCase().includes(search)
    );
    renderCombosTable(filtered);
}

function showCreateComboModal() {
    const modal = createModal('Create Combo', `
        <form id="comboForm" onsubmit="saveCombo(event)">
            <div class="form-group">
                <label>Title *</label>
                <input type="text" name="title" required>
                <small>e.g., "LSD + MDMA"</small>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Drug 1 Slug *</label>
                    <input type="text" name="drug1" required>
                    <small>e.g., "lsd"</small>
                </div>
                <div class="form-group">
                    <label>Drug 2 Slug *</label>
                    <input type="text" name="drug2" required>
                    <small>e.g., "mdma"</small>
                </div>
            </div>
            
            <div class="form-group">
                <label>Slug *</label>
                <input type="text" name="slug" required>
                <small>e.g., "lsd_mdma"</small>
            </div>
            
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button type="submit" class="btn btn-success">Create</button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `);
    showModal(modal);
}

async function saveCombo(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        drug1: formData.get('drug1'),
        drug2: formData.get('drug2')
    };
    
    try {
        const response = await fetch(`${API_BASE}/api/combos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errors?.[0]?.message || 'Failed to create combo');
        }
        
        showAlert('Combo created successfully!');
        closeModal();
        loadCombos();
        loadDashboard();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function editCombo(id) {
    const item = currentData.combos.find(c => c.id == id);
    if (!item) {
        showAlert('Combo not found', 'error');
        return;
    }
    
    const modal = createModal('Edit Combo', `
        <form id="comboForm" onsubmit="updateCombo(event, '${id}')">
            <div class="form-group">
                <label>Title *</label>
                <input type="text" name="title" value="${escapeHtml(item.title)}" required>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Drug 1 Slug *</label>
                    <input type="text" name="drug1" value="${escapeHtml(item.drug1 || '')}" required>
                </div>
                <div class="form-group">
                    <label>Drug 2 Slug *</label>
                    <input type="text" name="drug2" value="${escapeHtml(item.drug2 || '')}" required>
                </div>
            </div>
            
            <div class="form-group">
                <label>Slug *</label>
                <input type="text" name="slug" value="${escapeHtml(item.slug)}" required>
            </div>
            
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button type="submit" class="btn btn-success">Update</button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `);
    showModal(modal);
}

async function updateCombo(event, id) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        drug1: formData.get('drug1'),
        drug2: formData.get('drug2')
    };
    
    try {
        const response = await fetch(`${API_BASE}/api/combos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errors?.[0]?.message || 'Failed to update combo');
        }
        
        showAlert('Combo updated successfully!');
        closeModal();
        loadCombos();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function deleteCombo(id, title) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/combos/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete combo');
        }
        
        showAlert('Combo deleted successfully!');
        loadCombos();
        loadDashboard();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

// Risks
async function loadRisks(page = 1) {
    const loading = document.getElementById('risksLoading');
    const table = document.getElementById('risksTable');
    
    loading.style.display = 'block';
    table.style.display = 'none';
    
    try {
        const response = await fetch(`${API_BASE}/api/risks?limit=20&page=${page}`);
        const data = await response.json();
        
        currentData.risks = data.docs;
        renderRisksTable(data.docs);
        renderPagination('risks', data);
        
        loading.style.display = 'none';
        table.style.display = 'block';
    } catch (error) {
        console.error('Error loading risks:', error);
        showAlert('Failed to load risks', 'error');
        loading.style.display = 'none';
    }
}

function renderRisksTable(items) {
    const tbody = document.getElementById('risksTableBody');
    tbody.innerHTML = '';
    
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No risks found</td></tr>';
        return;
    }
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><code>${escapeHtml(item.drug1 || '-')}</code></td>
            <td><code>${escapeHtml(item.drug2 || '-')}</code></td>
            <td><span class="badge badge-info">${escapeHtml(item.risk_level || 'N/A')}</span></td>
            <td><span class="badge badge-success">${escapeHtml(item.confidence || 'N/A')}</span></td>
            <td class="actions">
                <button class="btn btn-sm btn-primary" onclick="editRisk('${item.id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteRisk('${item.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function searchRisks() {
    const search = document.getElementById('searchRisks').value.toLowerCase();
    const filtered = currentData.risks.filter(item =>
        item.drug1?.toLowerCase().includes(search) ||
        item.drug2?.toLowerCase().includes(search) ||
        item.risk_level?.toLowerCase().includes(search)
    );
    renderRisksTable(filtered);
}

function showCreateRiskModal() {
    const modal = createModal('Create Risk', `
        <form id="riskForm" onsubmit="saveRisk(event)">
            <div class="form-row">
                <div class="form-group">
                    <label>Drug 1 Slug *</label>
                    <input type="text" name="drug1" required>
                </div>
                <div class="form-group">
                    <label>Drug 2 Slug *</label>
                    <input type="text" name="drug2" required>
                </div>
            </div>
            
            <div class="form-group">
                <label>Combo Slug</label>
                <input type="text" name="combo">
                <small>e.g., "lsd_mdma"</small>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Risk Level *</label>
                    <select name="risk_level" required>
                        <option value="">Select...</option>
                        <option value="SR">SR - Significant Risk</option>
                        <option value="GR">GR - Greater Risk</option>
                        <option value="MR">MR - Minor Risk</option>
                        <option value="LRS">LRS - Low Risk Synergy</option>
                        <option value="LRD">LRD - Low Risk Decrease</option>
                        <option value="LR">LR - Low Risk</option>
                        <option value="ND">ND - No Data</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Confidence *</label>
                    <select name="confidence" required>
                        <option value="">Select...</option>
                        <option value="HC">HC - High Confidence</option>
                        <option value="MC">MC - Medium Confidence</option>
                        <option value="LC">LC - Low Confidence</option>
                        <option value="NC">NC - No Confidence</option>
                    </select>
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button type="submit" class="btn btn-success">Create</button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `);
    showModal(modal);
}

async function saveRisk(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        drug1: formData.get('drug1'),
        drug2: formData.get('drug2'),
        combo: formData.get('combo') || undefined,
        risk_level: formData.get('risk_level'),
        confidence: formData.get('confidence')
    };
    
    try {
        const response = await fetch(`${API_BASE}/api/risks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errors?.[0]?.message || 'Failed to create risk');
        }
        
        showAlert('Risk created successfully!');
        closeModal();
        loadRisks();
        loadDashboard();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function editRisk(id) {
    const item = currentData.risks.find(r => r.id == id);
    if (!item) {
        showAlert('Risk not found', 'error');
        return;
    }
    
    const modal = createModal('Edit Risk', `
        <form id="riskForm" onsubmit="updateRisk(event, '${id}')">
            <div class="form-row">
                <div class="form-group">
                    <label>Drug 1 Slug *</label>
                    <input type="text" name="drug1" value="${escapeHtml(item.drug1 || '')}" required>
                </div>
                <div class="form-group">
                    <label>Drug 2 Slug *</label>
                    <input type="text" name="drug2" value="${escapeHtml(item.drug2 || '')}" required>
                </div>
            </div>
            
            <div class="form-group">
                <label>Combo Slug</label>
                <input type="text" name="combo" value="${escapeHtml(item.combo || '')}">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Risk Level *</label>
                    <select name="risk_level" required>
                        <option value="">Select...</option>
                        <option value="SR" ${item.risk_level === 'SR' ? 'selected' : ''}>SR - Significant Risk</option>
                        <option value="GR" ${item.risk_level === 'GR' ? 'selected' : ''}>GR - Greater Risk</option>
                        <option value="MR" ${item.risk_level === 'MR' ? 'selected' : ''}>MR - Minor Risk</option>
                        <option value="LRS" ${item.risk_level === 'LRS' ? 'selected' : ''}>LRS - Low Risk Synergy</option>
                        <option value="LRD" ${item.risk_level === 'LRD' ? 'selected' : ''}>LRD - Low Risk Decrease</option>
                        <option value="LR" ${item.risk_level === 'LR' ? 'selected' : ''}>LR - Low Risk</option>
                        <option value="ND" ${item.risk_level === 'ND' ? 'selected' : ''}>ND - No Data</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Confidence *</label>
                    <select name="confidence" required>
                        <option value="">Select...</option>
                        <option value="HC" ${item.confidence === 'HC' ? 'selected' : ''}>HC - High Confidence</option>
                        <option value="MC" ${item.confidence === 'MC' ? 'selected' : ''}>MC - Medium Confidence</option>
                        <option value="LC" ${item.confidence === 'LC' ? 'selected' : ''}>LC - Low Confidence</option>
                        <option value="NC" ${item.confidence === 'NC' ? 'selected' : ''}>NC - No Confidence</option>
                    </select>
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button type="submit" class="btn btn-success">Update</button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `);
    showModal(modal);
}

async function updateRisk(event, id) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        drug1: formData.get('drug1'),
        drug2: formData.get('drug2'),
        combo: formData.get('combo') || undefined,
        risk_level: formData.get('risk_level'),
        confidence: formData.get('confidence')
    };
    
    try {
        const response = await fetch(`${API_BASE}/api/risks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errors?.[0]?.message || 'Failed to update risk');
        }
        
        showAlert('Risk updated successfully!');
        closeModal();
        loadRisks();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function deleteRisk(id) {
    if (!confirm('Are you sure you want to delete this risk?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/risks/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete risk');
        }
        
        showAlert('Risk deleted successfully!');
        loadRisks();
        loadDashboard();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

// Pagination
function renderPagination(type, data) {
    const container = document.getElementById(`${type}Pagination`);
    container.innerHTML = '';
    
    if (data.totalPages <= 1) return;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Previous';
    prevBtn.disabled = !data.hasPrevPage;
    prevBtn.onclick = () => {
        if (type === 'psychoactives') loadPsychoactives(data.page - 1);
        else if (type === 'combos') loadCombos(data.page - 1);
        else if (type === 'risks') loadRisks(data.page - 1);
    };
    container.appendChild(prevBtn);
    
    // Page info
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${data.page} of ${data.totalPages}`;
    pageInfo.style.padding = '0 1rem';
    container.appendChild(pageInfo);
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next →';
    nextBtn.disabled = !data.hasNextPage;
    nextBtn.onclick = () => {
        if (type === 'psychoactives') loadPsychoactives(data.page + 1);
        else if (type === 'combos') loadCombos(data.page + 1);
        else if (type === 'risks') loadRisks(data.page + 1);
    };
    container.appendChild(nextBtn);
}

// Modal system
function createModal(title, content) {
    return `
        <div class="modal active">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal" onclick="closeModal()">×</button>
                </div>
                ${content}
            </div>
        </div>
    `;
}

function showModal(modalHtml) {
    document.getElementById('modalContainer').innerHTML = modalHtml;
}

function closeModal() {
    document.getElementById('modalContainer').innerHTML = '';
}

// Utility functions
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
