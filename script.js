(function () {
    'use strict';

    var CONFIG = {
        formEndpoint: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec',
        gcashNumber:  '09999250731',
        // bankNumber:   '0000-0000-00',
        gcashQrSrc:   'qr.jpg',
        bankQrSrc:    'qr2.jpg',
    };

    function initEnvelope() {
        var container = document.getElementById('envelopeContainer');
        var envelope  = document.getElementById('envelope');
        var flap      = document.getElementById('envelopeFlap');
        var wrapper   = document.querySelector('.invitation-wrapper');

        if (!container || !envelope) return;

        document.body.classList.add('envelope-active');

        envelope.addEventListener('click', openEnvelope);

        function openEnvelope() {
            envelope.removeEventListener('click', openEnvelope);
            envelope.classList.add('lifted');
            flap.classList.add('open');

            setTimeout(function () {
                container.classList.add('hidden');
                document.body.classList.remove('envelope-active');
                document.body.classList.add('invitation-visible');
                if (wrapper) {
                    wrapper.style.display = 'block';
                    wrapper.classList.add('visible');
                }
            }, 900);
        }
    }

    function initScrollReveal() {
        var targets = document.querySelectorAll('.health-section, .gift-section, .qr-gift-section');
        if (!targets.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        targets.forEach(function (el) { observer.observe(el); });
    }

    function initRsvpForm() {
        var form      = document.getElementById('rsvpForm');
        var responseEl = document.getElementById('responseMessage');
        var submitBtn  = form ? form.querySelector('button[type="submit"]') : null;
        var yesLabel   = document.getElementById('choiceYesLabel');
        var noLabel    = document.getElementById('choiceNoLabel');

        if (!form) return;

        [yesLabel, noLabel].forEach(function (label) {
            if (!label) return;
            label.addEventListener('click', function () {
                yesLabel.classList.remove('selected');
                noLabel.classList.remove('selected');
                label.classList.add('selected');
            });
        });

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            var name       = document.getElementById('guestName').value.trim();
            var attendance = form.querySelector('input[name="attendance"]:checked');

            if (!name) { showMsg(responseEl, 'error', 'Please enter your name.'); return; }
            if (!attendance) { showMsg(responseEl, 'error', 'Please select your attendance.'); return; }

            submitBtn.disabled    = true;
            submitBtn.textContent = 'Sending…';

            var payload = {
                type:       'rsvp',
                name:       name,
                attendance: attendance.value,
                timestamp:  new Date().toISOString(),
            };

            try {
                await fetch(CONFIG.formEndpoint, {
                    method:  'POST',
                    mode:    'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify(payload),
                });

                showMsg(
                    responseEl, 'success',
                    attendance.value === 'Yes'
                        ? 'Thank you, ' + name + '! 💚 We can\'t wait to celebrate with you!'
                        : 'Thank you for letting us know, ' + name + '. You\'ll be missed! 💚'
                );
                form.reset();
                yesLabel.classList.remove('selected');
                noLabel.classList.remove('selected');
            } catch (err) {
                showMsg(responseEl, 'error', 'Something went wrong. Please try again.');
            } finally {
                submitBtn.disabled    = false;
                submitBtn.textContent = 'Send My Response';
            }
        });
    }

    function initQrImages() {
        var pairs = [
            { imgId: 'qrCodeImage1', placeholderId: 'qrPlaceholder1', src: CONFIG.gcashQrSrc },
            { imgId: 'qrCodeImage2', placeholderId: 'qrPlaceholder2', src: CONFIG.bankQrSrc  },
        ];

        pairs.forEach(function (pair) {
            var img         = document.getElementById(pair.imgId);
            var placeholder = document.getElementById(pair.placeholderId);
            if (!img || !placeholder) return;

            var srcIsReal = pair.src && !pair.src.includes('your-') && !pair.src.includes('-qr.png');

            if (srcIsReal) {
                img.src = pair.src;
                img.addEventListener('load',  function () { img.style.display = 'block'; placeholder.style.display = 'none'; });
                img.addEventListener('error', function () { img.style.display = 'none';  placeholder.style.display = 'flex'; });
            } else {
                img.style.display         = 'none';
                placeholder.style.display = 'flex';
            }
        });
    }

    function initCopyButtons() {
        var copyTargets = [
            { btnId: 'copyGcashBtn', valueId: 'gcashNumber', value: CONFIG.gcashNumber },
            { btnId: 'copyBankBtn',  valueId: 'bankNumber',  value: CONFIG.bankNumber  },
        ];

        copyTargets.forEach(function (item) {
            var btn    = document.getElementById(item.btnId);
            var numEl  = document.getElementById(item.valueId);
            if (!btn || !numEl) return;

            if (item.value) numEl.textContent = item.value;

            btn.addEventListener('click', async function () {
                var text = numEl.textContent.trim();
                try {
                    if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(text);
                    } else {
                        var ta = document.createElement('textarea');
                        ta.value = text;
                        ta.style.cssText = 'position:fixed;opacity:0;';
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        document.body.removeChild(ta);
                    }

                    btn.classList.add('copied');
                    btn.querySelector('.copy-icon').textContent = '✓';
                    setTimeout(function () {
                        btn.classList.remove('copied');
                        btn.querySelector('.copy-icon').textContent = '⧉';
                    }, 2000);
                } catch (err) {
                    console.warn('Copy failed:', err);
                }
            });
        });
    }

    function showMsg(el, type, message) {
        if (!el) return;
        el.textContent = message;
        el.className   = 'form-response ' + type;
    }

    function init() {
        initEnvelope();
        initScrollReveal();
        initRsvpForm();
        initQrImages();
        initCopyButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
