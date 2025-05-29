// Administração do site Solaris Power
// Gerenciamento de clientes e acesso protegido

// Configurações de segurança
const ADMIN_PASSWORD = "password"; // Senha em texto puro para facilitar testes
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutos em milissegundos

// Variáveis globais
let clientesList = [];
let sessionTimeout;

// Função para inicializar a página de administração
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o usuário já está logado
    checkLoginStatus();
    
    // Configurar formulário de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Configurar botão de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Configurar tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Configurar busca de clientes
    const searchInput = document.getElementById('search-clients');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            filterClients(searchInput.value);
        });
    }
    
    // Configurar botão de atualização
    const refreshBtn = document.getElementById('refresh-list');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadClientsList);
    }
    
    // Configurar botão de exportação
    const exportBtn = document.getElementById('export-csv');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportClientsToCSV);
    }
});

// Função para verificar o status de login
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    const loginTime = parseInt(sessionStorage.getItem('adminLoginTime') || '0');
    const currentTime = new Date().getTime();
    
    // Verificar se a sessão expirou
    if (isLoggedIn && (currentTime - loginTime > SESSION_DURATION)) {
        handleLogout();
        return;
    }
    
    // Atualizar a interface com base no status de login
    if (isLoggedIn) {
        showAdminDashboard();
        resetSessionTimeout();
    } else {
        showLoginForm();
    }
}

// Função para lidar com o login
function handleLogin(e) {
    e.preventDefault();
    
    const passwordInput = document.getElementById('admin-password');
    const password = passwordInput.value;
    
    // Verificar a senha (em produção, isso seria feito no servidor)
    if (password === ADMIN_PASSWORD) {
        // Armazenar status de login na sessão
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminLoginTime', new Date().getTime().toString());
        
        // Mostrar o painel administrativo
        showAdminDashboard();
        
        // Configurar timeout da sessão
        resetSessionTimeout();
    } else {
        alert('Senha incorreta. Tente novamente.');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Função para lidar com o logout
function handleLogout() {
    // Limpar dados da sessão
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminLoginTime');
    
    // Limpar timeout da sessão
    clearTimeout(sessionTimeout);
    
    // Mostrar o formulário de login
    showLoginForm();
}

// Função para mostrar o formulário de login
function showLoginForm() {
    document.getElementById('admin-login').style.display = 'flex';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
}

// Função para mostrar o painel administrativo
function showAdminDashboard() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    document.getElementById('logout-btn').style.display = 'inline-block';
    
    // Carregar a lista de clientes
    loadClientsList();
}

// Função para resetar o timeout da sessão
function resetSessionTimeout() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        handleLogout();
        alert('Sua sessão expirou. Por favor, faça login novamente.');
    }, SESSION_DURATION);
}

// Função para alternar entre as abas
function switchTab(tabId) {
    // Atualizar botões de abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    
    // Atualizar conteúdo das abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(`${tabId}-tab`).style.display = 'block';
}

// Função para carregar a lista de clientes
function loadClientsList() {
    // Carregar clientes do localStorage
    const clientesSalvos = localStorage.getItem('solarisPowerClientes');
    if (clientesSalvos) {
        clientesList = JSON.parse(clientesSalvos);
    } else {
        clientesList = [];
    }
    
    // Atualizar a tabela
    updateClientsTable();
}

// Função para atualizar a tabela de clientes
function updateClientsTable() {
    const clientesListElement = document.getElementById('admin-clients-list');
    
    // Limpar a tabela atual
    clientesListElement.innerHTML = '';
    
    // Verificar se há clientes
    if (clientesList.length === 0) {
        clientesListElement.innerHTML = '<tr><td colspan="6" class="no-clients">Nenhum cliente registrado ainda.</td></tr>';
        return;
    }
    
    // Adicionar cabeçalho da tabela
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Nome</th>
        <th>Email</th>
        <th>Telefone</th>
        <th>Mensagem</th>
        <th>Data/Hora</th>
        <th>Ações</th>
    `;
    clientesListElement.appendChild(headerRow);
    
    // Adicionar cada cliente à tabela
    clientesList.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.mensagem.substring(0, 30)}${cliente.mensagem.length > 30 ? '...' : ''}</td>
            <td>${cliente.dataHora}</td>
            <td class="client-actions">
                <button class="view-btn" data-id="${cliente.id}" title="Ver detalhes"><i class="fas fa-eye"></i></button>
                <button class="delete-btn" data-id="${cliente.id}" title="Excluir cliente"><i class="fas fa-trash"></i></button>
            </td>
        `;
        clientesListElement.appendChild(row);
    });
    
    // Adicionar event listeners para os botões de ação
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const clientId = parseInt(btn.getAttribute('data-id'));
            viewClientDetails(clientId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const clientId = parseInt(btn.getAttribute('data-id'));
            deleteClient(clientId);
        });
    });
}

// Função para filtrar clientes
function filterClients(searchTerm) {
    if (!searchTerm) {
        updateClientsTable();
        return;
    }
    
    searchTerm = searchTerm.toLowerCase();
    
    const filteredClients = clientesList.filter(cliente => 
        cliente.nome.toLowerCase().includes(searchTerm) ||
        cliente.email.toLowerCase().includes(searchTerm) ||
        cliente.telefone.toLowerCase().includes(searchTerm) ||
        cliente.mensagem.toLowerCase().includes(searchTerm)
    );
    
    const clientesListElement = document.getElementById('admin-clients-list');
    
    // Limpar a tabela atual
    clientesListElement.innerHTML = '';
    
    // Verificar se há clientes filtrados
    if (filteredClients.length === 0) {
        clientesListElement.innerHTML = '<tr><td colspan="6" class="no-clients">Nenhum cliente encontrado com esse termo.</td></tr>';
        return;
    }
    
    // Adicionar cabeçalho da tabela
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Nome</th>
        <th>Email</th>
        <th>Telefone</th>
        <th>Mensagem</th>
        <th>Data/Hora</th>
        <th>Ações</th>
    `;
    clientesListElement.appendChild(headerRow);
    
    // Adicionar cada cliente filtrado à tabela
    filteredClients.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.mensagem.substring(0, 30)}${cliente.mensagem.length > 30 ? '...' : ''}</td>
            <td>${cliente.dataHora}</td>
            <td class="client-actions">
                <button class="view-btn" data-id="${cliente.id}" title="Ver detalhes"><i class="fas fa-eye"></i></button>
                <button class="delete-btn" data-id="${cliente.id}" title="Excluir cliente"><i class="fas fa-trash"></i></button>
            </td>
        `;
        clientesListElement.appendChild(row);
    });
    
    // Adicionar event listeners para os botões de ação
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const clientId = parseInt(btn.getAttribute('data-id'));
            viewClientDetails(clientId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const clientId = parseInt(btn.getAttribute('data-id'));
            deleteClient(clientId);
        });
    });
}

// Função para ver detalhes do cliente
function viewClientDetails(clientId) {
    const cliente = clientesList.find(c => c.id === clientId);
    if (!cliente) return;
    
    alert(`Detalhes do Cliente:
    
Nome: ${cliente.nome}
Email: ${cliente.email}
Telefone: ${cliente.telefone}
Data/Hora: ${cliente.dataHora}

Mensagem:
${cliente.mensagem}`);
}

// Função para excluir cliente
function deleteClient(clientId) {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
    
    // Filtrar o cliente da lista
    clientesList = clientesList.filter(c => c.id !== clientId);
    
    // Salvar a lista atualizada
    localStorage.setItem('solarisPowerClientes', JSON.stringify(clientesList));
    
    // Atualizar a tabela
    updateClientsTable();
}

// Função para exportar clientes para CSV
function exportClientsToCSV() {
    if (clientesList.length === 0) {
        showExportResult('Não há clientes para exportar.', false);
        return;
    }
    
    try {
        // Criar cabeçalho do CSV
        let csvContent = 'Nome,Email,Telefone,Mensagem,Data/Hora\n';
        
        // Adicionar dados dos clientes
        clientesList.forEach(cliente => {
            // Escapar aspas e vírgulas na mensagem
            const mensagemFormatada = `"${cliente.mensagem.replace(/"/g, '""')}"`;
            csvContent += `${cliente.nome},${cliente.email},${cliente.telefone},${mensagemFormatada},${cliente.dataHora}\n`;
        });
        
        // Criar blob e link para download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `solaris_power_clientes_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        
        // Adicionar à página, clicar e remover
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showExportResult('Dados exportados com sucesso!', true);
    } catch (error) {
        console.error('Erro ao exportar dados:', error);
        showExportResult('Erro ao exportar dados. Tente novamente.', false);
    }
}

// Função para mostrar resultado da exportação
function showExportResult(message, success) {
    const resultElement = document.getElementById('export-result');
    resultElement.textContent = message;
    resultElement.className = success ? 'success' : 'error';
    
    // Esconder a mensagem após 5 segundos
    setTimeout(() => {
        resultElement.style.display = 'none';
    }, 5000);
}
