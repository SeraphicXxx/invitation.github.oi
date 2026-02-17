document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('envelope-active');
    initializeEnvelope();
});

function initializeEnvelope() {
    const envelope = document.getElementById('envelope');
    const envelopeFlap = document.getElementById('envelopeFlap');
    const envelopeContainer = document.getElementById('envelopeContainer');
    const invitationWrapper = document.querySelector('.invitation-wrapper');
    let animationStep = 0;

    createParticles();

    envelope.addEventListener('click', function () {
        if (animationStep === 0) openEnvelope();
    });

    function openEnvelope() {
        animationStep = 1;
        envelope.classList.add('lifted');
        setTimeout(() => {
            animationStep = 2;
            envelopeFlap.classList.add('open');
            setTimeout(() => {
                animationStep = 3;
                createEnvelopeConfetti();
                setTimeout(() => {
                    animationStep = 4;
                    envelopeContainer.classList.add('fade-out');
                    setTimeout(() => {
                        envelopeContainer.classList.add('hidden');
                        document.body.classList.remove('envelope-active');
                        document.body.classList.add('invitation-visible');
                        if (invitationWrapper) invitationWrapper.classList.add('visible');
                        document.body.style.overflow = 'auto';
                        setTimeout(() => initializeInvitation(), 300);
                    }, 1000);
                }, 2000);
            }, 800);
        }, 400);
    }

    document.body.style.overflow = 'hidden';
}

function createParticles() {
    const container = document.querySelector('.envelope-wrapper');
    const symbols = ['♛', '✦', '❖', '♔'];
    const colors = ['#F6F0D7', '#C5D89D', '#9CAB84', '#89986D'];
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        particle.style.color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.fontSize = (12 + Math.random() * 12) + 'px';
        particle.style.left = (Math.random() * 100) + '%';
        particle.style.top = (Math.random() * 100) + '%';
        particle.style.animationDelay = (Math.random() * 4) + 's';
        particle.style.animationDuration = (3 + Math.random() * 2) + 's';
        container.appendChild(particle);
    }
}

function createEnvelopeConfetti() {
    const colors = ['#F6F0D7', '#C5D89D', '#9CAB84', '#89986D'];
    const symbols = ['♛', '✦', '❖', '♔', '✿'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => createConfettiPiece(colors, symbols), i * 40);
    }
}

function createConfettiPiece(colors, symbols) {
    const piece = document.createElement('div');
    const isSymbol = Math.random() > 0.4;
    piece.style.position = 'fixed';
    piece.style.left = (30 + Math.random() * 40) + '%';
    piece.style.top = '50%';
    piece.style.zIndex = '10001';
    piece.style.pointerEvents = 'none';
    piece.style.opacity = '0.9';
    if (isSymbol) {
        piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        piece.style.fontSize = (14 + Math.random() * 16) + 'px';
        piece.style.color = colors[Math.floor(Math.random() * colors.length)];
    } else {
        piece.style.width = (5 + Math.random() * 8) + 'px';
        piece.style.height = (5 + Math.random() * 8) + 'px';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    }
    document.body.appendChild(piece);
    animateEnvelopeConfetti(piece);
}

function animateEnvelopeConfetti(element) {
    const duration = 2500 + Math.random() * 2000;
    const startTime = Date.now();
    const startLeft = parseFloat(element.style.left);
    const angle = (Math.random() - 0.5) * Math.PI;
    const velocity = 200 + Math.random() * 300;
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        if (progress < 1) {
            const distance = velocity * (elapsed / 1000);
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance + (progress * progress * 300);
            element.style.left = (startLeft + (x / window.innerWidth * 100)) + '%';
            element.style.top = (50 + (y / window.innerHeight * 100)) + '%';
            element.style.transform = `rotate(${progress * 720}deg)`;
            element.style.opacity = 0.9 * (1 - progress);
            requestAnimationFrame(animate);
        } else {
            element.remove();
        }
    }
    animate();
}

document.addEventListener('DOMContentLoaded', function () {
    const envelope = document.getElementById('envelope');
    if (envelope) {
        let hoverInterval;
        envelope.addEventListener('mouseenter', function () {
            hoverInterval = setInterval(() => {
                const seal = document.querySelector('.envelope-seal');
                if (seal && !envelope.classList.contains('lifted')) {
                    seal.style.transform = 'translate(-50%, -50%) scale(1.1) rotate(5deg)';
                    setTimeout(() => { seal.style.transform = 'translate(-50%, -50%) scale(1.1)'; }, 200);
                }
            }, 400);
        });
        envelope.addEventListener('mouseleave', function () {
            clearInterval(hoverInterval);
            const seal = document.querySelector('.envelope-seal');
            if (seal) seal.style.transform = 'translate(-50%, -50%)';
        });
    }
});

function initializeInvitation() {
    setupAttendanceCards();
    setupRSVPForm();
    addScrollAnimations();
    addSubtleInteractions();
}

function setupAttendanceCards() {
    const yesLabel = document.getElementById('choiceYesLabel');
    const noLabel = document.getElementById('choiceNoLabel');
    const yesRadio = document.getElementById('choiceYes');
    const noRadio = document.getElementById('choiceNo');

    function updateCards() {
        if (yesRadio.checked) {
            yesLabel.classList.add('selected');
            noLabel.classList.remove('selected');
        } else if (noRadio.checked) {
            noLabel.classList.add('selected');
            yesLabel.classList.remove('selected');
        }
    }

    yesLabel.addEventListener('click', function () { yesRadio.checked = true; updateCards(); });
    noLabel.addEventListener('click', function () { noRadio.checked = true; updateCards(); });
}

function setupRSVPForm() {
    const form = document.getElementById('rsvpForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('guestName').value.trim();
        const attendanceInput = document.querySelector('input[name="attendance"]:checked');
        if (!name) { showMessage('Please enter your name.', 'error'); return; }
        if (!attendanceInput) { showMessage('Please let us know if you will be attending.', 'error'); return; }
        submitRSVP({ name: name, attendance: attendanceInput.value, timestamp: new Date().toISOString() });
    });
}

function submitRSVP(formData) {
    const button = document.querySelector('.elegant-button');
    const originalText = button.textContent;
    button.textContent = 'Sending...';
    button.disabled = true;

    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScyTevOPVECbAvv9uR5gC78CxfzG-2ka1k0S45RDJBw7-LEaA/formResponse';
    const formBody = new URLSearchParams({
        'entry.749989787': formData.name,
        'entry.1885375203': formData.attendance
    });

    fetch(googleFormUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody
    }).then(() => {
        handleSuccess(formData, button, originalText);
    }).catch(() => {
        handleSuccess(formData, button, originalText);
    });
}

function handleSuccess(formData, button, originalText) {
    saveRSVP(formData);
    const isAttending = formData.attendance === 'Yes';
    const msg = isAttending
        ? `Thank you, ${formData.name}! We're so happy you'll be joining us. 🎉`
        : `Thank you, ${formData.name}. We'll miss you and hope to celebrate together another time. 💚`;
    showMessage(msg, 'success');
    document.getElementById('rsvpForm').reset();
    document.getElementById('choiceYesLabel').classList.remove('selected');
    document.getElementById('choiceNoLabel').classList.remove('selected');
    button.textContent = originalText;
    button.disabled = false;
    if (isAttending) createElegantConfetti();
}

function showMessage(message, type) {
    const messageEl = document.getElementById('responseMessage');
    messageEl.textContent = message;
    messageEl.className = `form-response ${type}`;
    messageEl.style.opacity = '0';
    messageEl.style.transform = 'translateY(10px)';
    setTimeout(() => {
        messageEl.style.transition = 'all 0.4s ease';
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translateY(0)';
    }, 10);
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => { messageEl.textContent = ''; messageEl.className = 'form-response'; }, 400);
    }, 8000);
}

function saveRSVP(data) {
    let rsvps = JSON.parse(localStorage.getItem('elegantRSVPs')) || [];
    rsvps.push(data);
    localStorage.setItem('elegantRSVPs', JSON.stringify(rsvps));
}

function createElegantConfetti() {
    const colors = ['#F6F0D7', '#C5D89D', '#9CAB84', '#89986D'];
    const symbols = ['♛', '✦', '❖'];
    for (let i = 0; i < 40; i++) {
        setTimeout(() => createInvitationConfettiPiece(colors, symbols), i * 50);
    }
}

function createInvitationConfettiPiece(colors, symbols) {
    const piece = document.createElement('div');
    const isSymbol = Math.random() > 0.5;
    piece.style.position = 'fixed';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.top = '-30px';
    piece.style.zIndex = '10000';
    piece.style.pointerEvents = 'none';
    piece.style.opacity = '0.8';
    if (isSymbol) {
        piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        piece.style.fontSize = (12 + Math.random() * 12) + 'px';
        piece.style.color = colors[Math.floor(Math.random() * colors.length)];
    } else {
        piece.style.width = (4 + Math.random() * 6) + 'px';
        piece.style.height = (4 + Math.random() * 6) + 'px';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.borderRadius = '50%';
    }
    document.body.appendChild(piece);
    animateInvitationConfetti(piece);
}

function animateInvitationConfetti(element) {
    const duration = 3000 + Math.random() * 2000;
    const startTime = Date.now();
    const startLeft = parseFloat(element.style.left);
    const drift = (Math.random() - 0.5) * 50;
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        if (progress < 1) {
            element.style.top = (progress * (window.innerHeight + 50)) + 'px';
            element.style.left = (startLeft + (Math.sin(progress * Math.PI * 2) * drift)) + '%';
            element.style.transform = `rotate(${progress * 360}deg)`;
            element.style.opacity = 0.8 * (1 - progress * 0.7);
            requestAnimationFrame(animate);
        } else {
            element.remove();
        }
    }
    animate();
}

function addScrollAnimations() {
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.name-card, .event-info, .ninong-ninang-section, .health-section, .gift-section, .rsvp-container, .quote-container').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    const cardObserver = new IntersectionObserver(function (entries) {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, entry.target.dataset.delay || 0);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.health-card, .gift-card, .godparent-item').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.dataset.delay = i * 80;
        cardObserver.observe(card);
    });
}

function addSubtleInteractions() {
    const crown = document.querySelector('.crown-ornament');
    if (crown) {
        let position = 0;
        let direction = 1;
        setInterval(() => {
            position += direction * 0.3;
            if (position >= 8 || position <= -8) direction *= -1;
            crown.style.transform = `translateY(${position}px)`;
        }, 50);
    }

    document.querySelectorAll('.occasion-item').forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 4px 12px rgba(156, 171, 132, 0.15)';
        });
        item.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

window.elegantInvitation = {
    getAllRSVPs: () => JSON.parse(localStorage.getItem('elegantRSVPs')) || [],
    clearAllRSVPs: () => localStorage.removeItem('elegantRSVPs'),
    getAttendanceSummary: function () {
        const rsvps = this.getAllRSVPs();
        const yes = rsvps.filter(r => r.attendance === 'Yes').length;
        const no = rsvps.filter(r => r.attendance === 'No').length;
        return { yes, no, total: rsvps.length };
    }
};
