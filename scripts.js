// Seleciona elementos
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');
const formAgendamento = document.getElementById('formAgendamento');
const mensagemSucesso = document.getElementById('mensagemSucesso');

// Menu Mobile
menuToggle.addEventListener('click', () => {
    nav.classList.toggle('ativo');
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('ativo');
    });
});

// Validação e envio do formulário
formAgendamento.addEventListener('submit', (e) => {
    e.preventDefault();

    // Pega os valores do formulário
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const servico = document.getElementById('servico').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const mensagem = document.getElementById('mensagem').value;

    // Validação básica
    if (!nome || !email || !telefone || !servico || !data || !hora) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    // Validação de email simples
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        alert('Por favor, insira um email válido!');
        return;
    }

    // Validação de data (não permitir datas passadas)
    const dataAgendamento = new Date(data);
    const dataHoje = new Date();
    dataHoje.setHours(0, 0, 0, 0);

    if (dataAgendamento < dataHoje) {
        alert('Por favor, selecione uma data futura!');
        return;
    }

    fetch('/api/agendar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome,
            email,
            telefone,
            servico,
            data,
            hora,
            mensagem
        })
    })
    .then(async response => {
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao enviar agendamento.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Agendamento realizado:', data);
        formAgendamento.style.display = 'none';
        mensagemSucesso.textContent = '✓ Agendamento realizado com sucesso! Entraremos em contato para confirmar.';
        mensagemSucesso.style.display = 'block';

        setTimeout(() => {
            formAgendamento.reset();
            formAgendamento.style.display = 'block';
            mensagemSucesso.style.display = 'none';
        }, 3000);
    })
    .catch(error => {
        alert(error.message);
    });
});

// Animação de scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Efeito de fade-in ao rolar a página
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplica observador aos cards
document.querySelectorAll('.servico-card, .galeria-item, .contato-info').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Formatar telefone
const telefonInput = document.getElementById('telefone');
if (telefonInput) {
    telefonInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            value = value.substring(0, 11);
            if (value.length <= 2) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
            } else {
                value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
            }
        }
        
        e.target.value = value;
    });
}

// Definir data mínima como hoje
const inputData = document.getElementById('data');
if (inputData) {
    const hoje = new Date().toISOString().split('T')[0];
    inputData.min = hoje;
}

// Efeito de hover nas cards de serviço
document.querySelectorAll('.servico-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 10px 30px rgba(212, 165, 116, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    });
});

console.log('✂️ BarberStyle - Site carregado com sucesso!');
