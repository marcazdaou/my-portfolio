/*===== MENU SHOW =====*/
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
          nav    = document.getElementById(navId);
    if (toggle && nav) {
        toggle.addEventListener('click', () => nav.classList.toggle('show'));
    }
};
showMenu('nav-toggle', 'nav-menu');

/*===== REMOVE MENU ON LINK CLICK =====*/
document.querySelectorAll('.nav__link').forEach(link =>
    link.addEventListener('click', () =>
        document.getElementById('nav-menu').classList.remove('show')
    )
);

/*===== ACTIVE LINK ON SCROLL =====*/
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    sections.forEach(section => {
        const top    = section.offsetTop - 70;
        const height = section.offsetHeight;
        const id     = section.getAttribute('id');
        const link   = document.querySelector(`.nav__menu a[href*=${id}]`);
        if (!link) return;
        link.classList.toggle('active-link', scrollY > top && scrollY <= top + height);
    });
});

/*===== TYPEWRITER =====*/
(function initTypewriter() {
    const el    = document.getElementById('typewriter');
    const words = ['Software Engineer', 'Full-Stack Developer', 'Data Engineer', 'Compiler Builder'];
    let wi = 0, ci = 0, deleting = false;

    function tick() {
        const word = words[wi];
        el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);

        let next = deleting ? 60 : 100;

        if (!deleting && ci > word.length) {
            deleting = true;
            next = 1600;
        } else if (deleting && ci < 0) {
            deleting = false;
            ci = 0;
            wi = (wi + 1) % words.length;
            next = 400;
        }
        setTimeout(tick, next);
    }
    tick();
})();

/*===== TERMINAL ANIMATION =====*/
(function initTerminal() {
    const output = document.getElementById('terminal-output');
    if (!output) return;

    const script = [
        { text: '$ python job_market.py',                  type: 'command'  },
        { text: '  Loading 784 job postings...',            type: 'output'   },
        { text: '  Engineering 46 features...',             type: 'output'   },
        { text: '  Training Ridge / Lasso / RF models...',  type: 'output'   },
        { text: '  ✓ Best model  CV R² = 0.55',            type: 'success'  },
        { text: '  → Salary estimate: $95,400 / yr',        type: 'highlight'},
        { text: '',                                         type: 'output'   },
        { text: '$ ./compile Main.j--',                     type: 'command'  },
        { text: '  Lexing → Parsing → AST → Bytecode',     type: 'output'   },
        { text: '  ✓ 15 language features compiled',        type: 'success'  },
        { text: '  ✓ TABLESWITCH optimization applied',     type: 'success'  },
        { text: '',                                         type: 'output'   },
        { text: '$ python manage.py runserver',             type: 'command'  },
        { text: '  ✓ Django app live on Render',            type: 'success'  },
        { text: '  ✓ PostgreSQL connected',                 type: 'success'  },
        { text: '  ✓ 16-product catalog serving...',        type: 'success'  },
    ];

    let lineIdx = 0, charIdx = 0;
    const rendered = [];

    function escape(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function render(current, currentType, cursor) {
        let html = '';
        rendered.forEach(l => {
            html += `<div class="t-line t-${l.type}">${escape(l.text) || '&nbsp;'}</div>`;
        });
        if (cursor) {
            html += `<div class="t-line t-${currentType}">${escape(current)}<span class="t-cursor"></span></div>`;
        } else {
            html += `<div class="t-line t-command"><span class="t-cursor"></span></div>`;
        }
        output.innerHTML = html;
        output.scrollTop = output.scrollHeight;
    }

    function typeChar() {
        if (lineIdx >= script.length) {
            setTimeout(restart, 2200);
            return;
        }
        const line = script[lineIdx];
        if (charIdx < line.text.length) {
            render(line.text.slice(0, charIdx + 1), line.type, true);
            charIdx++;
            setTimeout(typeChar, line.text[charIdx - 1] === ' ' ? 55 : 38);
        } else {
            rendered.push({ text: line.text, type: line.type });
            charIdx = 0;
            lineIdx++;
            render('', '', false);
            const pause = line.text === '' ? 60 : line.type === 'command' ? 520 : 280;
            setTimeout(typeChar, pause);
        }
    }

    function restart() {
        rendered.length = 0;
        lineIdx = 0;
        charIdx = 0;
        output.innerHTML = '';
        setTimeout(typeChar, 600);
    }

    typeChar();
})();


/*===== HERO MOUSE PARALLAX =====*/
(function initParallax() {
    const hero     = document.querySelector('.home');
    const terminal = document.querySelector('.home__terminal-wrapper');
    const data     = document.querySelector('.home__data');
    if (!hero || !terminal) return;

    let raf = null;
    let tx = 0, ty = 0;   // current applied values
    let mx = 0, my = 0;   // mouse target

    hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width  - .5;
        my = (e.clientY - r.top)  / r.height - .5;
        if (!raf) raf = requestAnimationFrame(step);
    });

    hero.addEventListener('mouseleave', () => {
        mx = 0; my = 0;
        if (!raf) raf = requestAnimationFrame(step);
    });

    function step() {
        // smooth lerp toward target
        tx += (mx - tx) * .07;
        ty += (my - ty) * .07;

        terminal.style.transform =
            `translate(${(tx * -18).toFixed(2)}px, ${(ty * -12).toFixed(2)}px)`;
        data.style.transform =
            `translate(${(tx *  6).toFixed(2)}px, ${(ty *  4).toFixed(2)}px)`;

        const stillMoving = Math.abs(mx - tx) > .0005 || Math.abs(my - ty) > .0005;
        raf = stillMoving ? requestAnimationFrame(step) : null;
    }
})();

/*===== 3-D CARD TILT =====*/
(function initTilt() {
    document.querySelectorAll('.project__card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const x  = (e.clientX - r.left) / r.width  - .5;
            const y  = (e.clientY - r.top)  / r.height - .5;
            card.style.transform =
                `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform .5s ease';
            setTimeout(() => card.style.transition = '', 500);
        });
    });
})();

