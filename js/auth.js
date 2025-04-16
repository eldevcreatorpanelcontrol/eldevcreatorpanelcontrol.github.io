document.addEventListener('DOMContentLoaded', () => {
    // Объявляем все элементы в начале
    const elements = {
        authForm: document.getElementById('authForm'),
        authContainer: document.getElementById('authContainer'),
        mainContainer: document.getElementById('mainContainer'),
        authError: document.getElementById('authError'),
        logoutBtn: document.getElementById('logoutBtn'),
        togglePassword: document.getElementById('togglePassword'),
        authPassword: document.getElementById('authPassword'),
        googleAuthBtn: document.getElementById('googleAuthBtn'),
        userAvatar: document.getElementById('userAvatar'),
        userName: document.getElementById('userName'),
        loadingOverlay: document.getElementById('loadingOverlay')
    };

    // Проверяем наличие всех необходимых элементов
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Элемент ${key} не найден на странице`);
        }
    }

    const supabaseService = new SupabaseService();

    function showLoading() {
        if (elements.loadingOverlay) {
            elements.loadingOverlay.classList.add('visible');
        }
    }

    function hideLoading() {
        if (elements.loadingOverlay) {
            elements.loadingOverlay.classList.remove('visible');
        }
    }

    if (elements.togglePassword && elements.authPassword) {
        elements.togglePassword.addEventListener('click', () => {
            if (elements.authPassword.type === 'password') {
                elements.authPassword.type = 'text';
                elements.togglePassword.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                elements.authPassword.type = 'password';
                elements.togglePassword.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }

    if (elements.authForm) {
        elements.authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading();
            const email = document.getElementById('authEmail')?.value;
            const password = elements.authPassword?.value;

            if (email !== 'eldevcreator@gmail.com') {
                hideLoading();
                showAuthError('Доступ разрешен только для eldevcreator@gmail.com');
                return;
            }

            try {
                const { data, error } = await supabaseService.signIn(email, password);
                
                if (error) throw error;
                
                localStorage.setItem('sb-auth-token', data.session.access_token);
                elements.authContainer?.classList.add('hidden');
                elements.mainContainer?.classList.remove('hidden');
                updateUserInfo(data.user);
            } catch (error) {
                showAuthError(error.message);
            } finally {
                hideLoading();
            }
        });
    }

    if (elements.googleAuthBtn) {
        elements.googleAuthBtn.addEventListener('click', async () => {
            showLoading();
            try {
                console.log('Инициируем вход через Google...');
                console.log('Redirect URL:', 'https://wmjejaorufcvbmdhxsjy.supabase.co/auth/v1/callback');
                
                const { data, error } = await supabaseService.client.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: 'https://wmjejaorufcvbmdhxsjy.supabase.co/auth/v1/callback'
                    }
                });
                
                if (error) throw error;
                console.log('Успешный запрос OAuth:', data);
            } catch (error) {
                console.error('Ошибка входа через Google:', error);
                showAuthError('Ошибка входа через Google: ' + error.message);
                hideLoading();
            }
        });
    }

    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', async () => {
            showLoading();
            try {
                await supabaseService.signOut();
                localStorage.removeItem('sb-auth-token');
                elements.mainContainer?.classList.add('hidden');
                elements.authContainer?.classList.remove('hidden');
                elements.authForm?.reset();
            } catch (error) {
                console.error('Ошибка при выходе:', error);
            } finally {
                hideLoading();
            }
        });
    }

    function showAuthError(message) {
        if (elements.authError) {
            elements.authError.textContent = message || 'Неверные учетные данные!';
            elements.authError.style.display = 'block';
            setTimeout(() => {
                elements.authError.style.display = 'none';
            }, 3000);
        }
    }

    function updateUserInfo(user) {
        if (elements.userName && elements.userAvatar) {
            const name = user.user_metadata?.full_name || user.email.split('@')[0];
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
            
            elements.userName.textContent = name;
            elements.userAvatar.textContent = initials.slice(0, 2);
        }
    }

    async function initializeAuth() {
        showLoading();
        // Скрываем оба контейнера изначально
        elements.authContainer?.classList.add('hidden');
        elements.mainContainer?.classList.add('hidden');

        try {
            const { data: sessionData, error: sessionError } = await supabaseService.client.auth.getSession();
            
            if (sessionError) throw sessionError;

            let user = null;
            let token = localStorage.getItem('sb-auth-token');

            if (sessionData.session) {
                user = sessionData.session.user;
                token = sessionData.session.access_token;
                localStorage.setItem('sb-auth-token', token);
            } else if (token) {
                const { data: userData, error: userError } = await supabaseService.client.auth.getUser(token);
                if (userError) throw userError;
                user = userData.user;
            }

            if (user) {
                if (user.email !== 'eldevcreator@gmail.com') {
                    await supabaseService.signOut();
                    localStorage.removeItem('sb-auth-token');
                    showAuthError('Доступ разрешен только для eldevcreator@gmail.com');
                    elements.authContainer?.classList.remove('hidden');
                    return;
                }

                elements.authContainer?.classList.add('hidden');
                elements.mainContainer?.classList.remove('hidden');
                updateUserInfo(user);
                redirectToMainPage();
            } else {
                elements.authContainer?.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Ошибка инициализации авторизации:', error);
            localStorage.removeItem('sb-auth-token');
            elements.authContainer?.classList.remove('hidden');
        } finally {
            hideLoading();
        }
    }

    function redirectToMainPage() {
        const mainPageUrl = 'https://eldevcreatorpanelcontrol.github.io';
        console.log('Перенаправляем на главную страницу:', mainPageUrl);
        window.location.href = mainPageUrl;
    }

    // Инициируем проверку авторизации только один раз
    initializeAuth();
});
