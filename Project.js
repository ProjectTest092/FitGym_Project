// Modal functionality
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const navLogin = document.querySelector('.nav-login');
const navLogout = document.querySelector('.nav-logout');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const closeBtns = document.getElementsByClassName('close-btn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');
const signupSuccess = document.getElementById('signupSuccess');
const usernameDisplay = document.getElementById('username-display');
const profileUsername = document.getElementById('profileUsername');
const profileEmail = document.getElementById('profileEmail');

// Check session state on page load
function checkSessionState() {
    fetch('check_session.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                // Show profile dropdown and hide login button
                navLogin.style.display = 'none';
                document.querySelector('.nav-profile').style.display = 'flex';

                // Update profile information
                usernameDisplay.textContent = data.username;
                profileUsername.value = data.username;
                profileEmail.value = data.email;
            } else {
                // Show login button and hide profile dropdown
                navLogin.style.display = 'flex';
                document.querySelector('.nav-profile').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error checking session:', error);
        });
}

// Call checkSessionState when page loads
document.addEventListener('DOMContentLoaded', checkSessionState);

// Show login modal
loginBtn.onclick = function () {
    loginModal.style.display = 'flex';
};

// Show signup modal
showSignup.onclick = function () {
    loginModal.style.display = 'none';
    signupModal.style.display = 'flex';
};

// Show login modal from signup
showLogin.onclick = function () {
    signupModal.style.display = 'none';
    loginModal.style.display = 'flex';
};

// Close modals
Array.from(closeBtns).forEach((btn) => {
    btn.onclick = function () {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
    };
});

// Close modal when clicking outside
window.onclick = function (event) {
    if (event.target == loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target == signupModal) {
        signupModal.style.display = 'none';
    }
};

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
        document.body.removeChild(toast);
    }, 3000);
}

// Handle login form submission
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML =
        'Logging in... <div class="loading-spinner"></div>';

    fetch('login_process.php', {
        method: 'POST',
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                // Show profile dropdown and hide login button
                navLogin.style.display = 'none';
                document.querySelector('.nav-profile').style.display = 'flex';

                // Update profile information with the logged-in user's data
                const username =
                    data.username || formData.get('email').split('@')[0];
                usernameDisplay.textContent = username;
                profileUsername.value = username;
                profileEmail.value = formData.get('email');

                loginModal.style.display = 'none';
                showToast('Successfully logged in!', 'success');
            } else {
                loginError.textContent =
                    data.message || 'Login failed. Please try again.';
                loginError.style.display = 'block';
                showToast(data.message || 'Login failed', 'error');
            }
        })
        .catch((error) => {
            console.error('Login error:', error);
            loginError.textContent = 'An error occurred. Please try again.';
            loginError.style.display = 'block';
            showToast('Login failed. Please try again.', 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
});

// Handle signup form submission
signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(signupForm);
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Signing up... <div class="loading-spinner"></div>';

    fetch('signup_process.php', {
        method: 'POST',
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                signupError.style.display = 'none';
                signupSuccess.textContent = data.message || 'Account created successfully!';
                signupSuccess.style.display = 'block';

                // Clear form
                signupForm.reset();

                // Switch to login modal after 2 seconds
                setTimeout(() => {
                    signupModal.style.display = 'none';
                    loginModal.style.display = 'flex';
                    signupSuccess.style.display = 'none';
                }, 2000);

                showToast('Account created successfully!', 'success');
            } else {
                signupSuccess.style.display = 'none';
                signupError.textContent = data.message || 'Signup failed. Please try again.';
                signupError.style.display = 'block';
                showToast(data.message || 'Signup failed', 'error');
            }
        })
        .catch((error) => {
            console.error('Signup error:', error);
            signupSuccess.style.display = 'none';
            signupError.textContent = 'An error occurred. Please try again.';
            signupError.style.display = 'block';
            showToast('Signup failed. Please try again.', 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
});

// Handle logout with confirmation
logoutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        const logoutBtn = this;
        logoutBtn.innerHTML =
            '<i class="fa-solid fa-right-from-bracket"></i> Logging out...';
        logoutBtn.style.pointerEvents = 'none';

        fetch('logout.php', {
            method: 'POST',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    // Show login button and hide profile dropdown
                    navLogin.style.display = 'flex';
                    document.querySelector('.nav-profile').style.display = 'none';
                    // Clear profile information
                    usernameDisplay.textContent = 'User';
                    profileUsername.value = '';
                    profileEmail.value = '';
                    showToast('Successfully logged out!', 'success');
                }
            })
            .catch((error) => {
                console.error('Logout error:', error);
                showToast('Logout failed. Please try again.', 'error');
            })
            .finally(() => {
                logoutBtn.innerHTML =
                    '<i class="fa-solid fa-right-from-bracket"></i> Logout';
                logoutBtn.style.pointerEvents = 'auto';
            });
    }
});

// Add keyboard navigation for dropdown
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const dropdowns = document.querySelectorAll('.dropdown-content');
        dropdowns.forEach((dropdown) => {
            dropdown.style.display = 'none';
        });
    }
});

// Profile functionality
const profileModal = document.getElementById('profileModal');
const viewProfileBtn = document.getElementById('viewProfile');

// Show profile modal
viewProfileBtn.onclick = function (e) {
    e.preventDefault();
    profileModal.style.display = 'flex';
};

// Close profile modal
profileModal.querySelector('.close-btn').onclick = function () {
    profileModal.style.display = 'none';
};