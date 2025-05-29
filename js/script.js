// Função para calcular a economia com energia solar
function calcularEconomia() {
    // Obter o valor do gasto mensal
    const gastoMensal = parseFloat(document.getElementById('gasto-mensal').value);
    
    // Verificar se o valor é válido
    if (isNaN(gastoMensal) || gastoMensal <= 0) {
        alert('Por favor, insira um valor válido para o gasto mensal.');
        return;
    }
    
    // Cálculos de economia (estimativas)
    const gastoAnual = gastoMensal * 12;
    const economiaAnual = gastoAnual * 0.85; // Estimativa de 85% de economia
    const retornoInvestimento = 5; // Estimativa de retorno em 5 anos
    const economiaVinteAnos = economiaAnual * 20; // Economia em 20 anos (vida útil média)
    
    // Formatar valores para moeda brasileira
    const formatoMoeda = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    
    // Exibir o resultado
    const resultadoDiv = document.getElementById('resultado-economia');
    resultadoDiv.innerHTML = `
        <h3>Sua Economia Estimada</h3>
        <p><strong>Economia anual:</strong> ${formatoMoeda.format(economiaAnual)}</p>
        <p><strong>Retorno do investimento:</strong> Aproximadamente ${retornoInvestimento} anos</p>
        <p><strong>Economia em 20 anos:</strong> ${formatoMoeda.format(economiaVinteAnos)}</p>
        <p>Entre em contato conosco para um orçamento personalizado!</p>
        <a href="#contato" class="cta-button">Solicitar Orçamento</a>
    `;
    
    // Mostrar o resultado
    resultadoDiv.classList.add('show');
}

// Gerenciamento da lista de clientes
let clientesList = [];

// Função para adicionar cliente à lista
function adicionarCliente(nome, email, telefone, mensagem) {
    const dataHora = new Date().toLocaleString('pt-BR');
    const novoCliente = {
        id: Date.now(), // ID único baseado no timestamp
        nome,
        email,
        telefone: telefone || 'Não informado',
        mensagem,
        dataHora
    };
    
    clientesList.push(novoCliente);
    salvarClientesLocalStorage();
}

// Função para salvar clientes no localStorage
function salvarClientesLocalStorage() {
    localStorage.setItem('solarisPowerClientes', JSON.stringify(clientesList));
}

// Função para carregar clientes do localStorage
function carregarClientesLocalStorage() {
    const clientesSalvos = localStorage.getItem('solarisPowerClientes');
    if (clientesSalvos) {
        clientesList = JSON.parse(clientesSalvos);
    }
}

// Função para navegação suave
document.addEventListener('DOMContentLoaded', () => {
    console.log('Solaris Power website loaded');
    
    // Carregar clientes do localStorage
    carregarClientesLocalStorage();
    
    // Configurar navegação suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Configurar o formulário de contato
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obter valores do formulário
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const mensagem = document.getElementById('mensagem').value;
            
            // Adicionar cliente à lista
            adicionarCliente(nome, email, telefone, mensagem);
            
            // Limpar formulário
            contactForm.reset();
            
            // Mostrar mensagem de sucesso
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        });
    }
    
    // Configurar menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            menuToggle.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                menuToggle.classList.remove('active');
            });
        });
    }
    
    // Animação para elementos quando entram na viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Navegação fixa com mudança de estilo ao rolar
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
});

// Inicialização do mapa (placeholder - seria implementado com Google Maps ou similar)
function initMap() {
    // Código para inicializar o mapa seria colocado aqui
    console.log('Mapa inicializado');
}
