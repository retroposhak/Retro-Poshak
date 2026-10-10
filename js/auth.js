// ============================================
// LOGIN FORM
// ============================================
function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const errorEl = document.getElementById('loginError');
        const submitBtn = form.querySelector('.auth-submit');

        errorEl.textContent = '';

        if (!email || !password) {
            errorEl.textContent = 'Please fill in all fields.';
            return;
        }

        const result = loginUser(email, password);
        if (!result.success) {
            errorEl.textContent = result.error;
            return;
        }

        // ✅ Success animation
        submitBtn.classList.add('success');
        submitBtn.innerHTML = '<span>✓</span> Welcome Back';
        submitBtn.style.animation = 'none';
        submitBtn.offsetHeight;
        submitBtn.style.animation = 'successPulse 0.6s ease';

        // Add success pulse keyframe dynamically if not present
        if (!document.getElementById('successPulseStyle')) {
            const style = document.createElement('style');
            style.id = 'successPulseStyle';
            style.textContent = `
                @keyframes successPulse {
                    0%   { transform: scale(1); }
                    40%  { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }

        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || 'index.html';

        setTimeout(() => {
            window.location.href = redirect;
        }, 900);
    });

    // Attach ripple to submit button
    attachRipple(form.querySelector('.auth-submit'));
}

// ============================================
// SIGNUP FORM
// ============================================
function initSignupForm() {
    const form = document.getElementById('signupForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const phone = document.getElementById('signupPhone').value.trim();
        const password = document.getElementById('signupPassword').value;
        const errorEl = document.getElementById('signupError');
        const submitBtn = form.querySelector('.auth-submit');

        errorEl.textContent = '';

        if (!name || !email || !password) {
            errorEl.textContent = 'Please fill in all required fields.';
            return;
        }
        if (password.length < 4) {
            errorEl.textContent = 'Password must be at least 4 characters.';
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorEl.textContent = 'Please enter a valid email.';
            return;
        }

        const result = signupUser(name, email, password, phone);
        if (!result.success) {
            errorEl.textContent = result.error;
            return;
        }

        // ✅ Success animation
        submitBtn.classList.add('success');
        submitBtn.innerHTML = '<span>✓</span> Account Created';
        submitBtn.style.animation = 'none';
        submitBtn.offsetHeight;
        submitBtn.style.animation = 'successPulse 0.6s ease';

        if (!document.getElementById('successPulseStyle')) {
            const style = document.createElement('style');
            style.id = 'successPulseStyle';
            style.textContent = `
                @keyframes successPulse {
                    0%   { transform: scale(1); }
                    40%  { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 900);
    });

    attachRipple(form.querySelector('.auth-submit'));
}

// ============================================
// RIPPLE EFFECT ON BUTTONS
// ============================================
function attachRipple(btn) {
    if (!btn) return;

    btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'auth-ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    });
}