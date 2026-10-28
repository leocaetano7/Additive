(function () {
    'use strict';

    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('menu');

    /* Menu mobile */
    function setMenu(open) {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        nav.classList.toggle('is-open', open);
    }

    toggle.addEventListener('click', function () {
        setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
        if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
            setMenu(false);
            toggle.focus();
        }
    });

    /* Sombra no header ao rolar */
    function onScroll() {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Animação de entrada */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

        reveals.forEach(function (el, i) {
            // Pequeno atraso em cascata entre itens vizinhos
            el.style.transitionDelay = (i % 4) * 70 + 'ms';
            io.observe(el);
        });
    } else {
        reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* Instagram: no celular abre direto no aplicativo */
    var ua = navigator.userAgent;
    var isAndroid = /Android/i.test(ua);
    var isIOS = /iPhone|iPad|iPod/i.test(ua) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    document.querySelectorAll('a[href*="instagram.com/"]').forEach(function (a) {
        if (isAndroid) {
            // Intent abre o app; se não estiver instalado, cai no site
            var web = a.href;
            var path = web.replace(/^https?:\/\/(www\.)?instagram\.com\//, '');
            a.href = 'intent://www.instagram.com/' + path +
                '#Intent;package=com.instagram.android;scheme=https;' +
                'S.browser_fallback_url=' + encodeURIComponent(web) + ';end';
            a.removeAttribute('target');
        } else if (isIOS) {
            // Link universal só abre o app quando navega na mesma aba
            a.removeAttribute('target');
        }
    });

    /* Formulário de orçamento -> WhatsApp */
    var form = document.getElementById('orcamento');
    var errorBox = form.querySelector('.form-error');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var nome = form.nome.value.trim();
        var servico = form.servico.value;
        var cidade = form.cidade.value.trim();
        var mensagem = form.mensagem.value.trim();
        var eng = form.querySelector('input[name="eng"]:checked').value.split('|');

        form.nome.setAttribute('aria-invalid', String(!nome));
        form.servico.setAttribute('aria-invalid', String(!servico));

        if (!nome || !servico) {
            errorBox.hidden = false;
            (nome ? form.servico : form.nome).focus();
            return;
        }
        errorBox.hidden = true;

        var linhas = [
            'Olá, ' + eng[1] + '! Vim pelo site da Additive Engenharia.',
            '',
            '*Nome:* ' + nome,
            '*Serviço:* ' + servico
        ];
        if (cidade) linhas.push('*Local:* ' + cidade);
        if (mensagem) linhas.push('', mensagem);

        var url = 'https://api.whatsapp.com/send?phone=' + eng[0] +
            '&text=' + encodeURIComponent(linhas.join('\n'));

        window.open(url, '_blank', 'noopener');
    });

    ['nome', 'servico'].forEach(function (name) {
        form[name].addEventListener('input', function () {
            if (this.value.trim()) this.setAttribute('aria-invalid', 'false');
        });
    });

    /* Ano no rodapé */
    document.getElementById('ano').textContent = new Date().getFullYear();
})();
