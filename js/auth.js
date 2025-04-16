document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('authForm');
    const authContainer = document.getElementById('authContainer');
    const mainContainer = document.getElementById('mainContainer');
    const authError = document.getElementById('authError');
    const logoutBtn = document.getElementById('logoutBtn');
    const togglePassword = document.getElementById('togglePassword');
    const authPassword = document.getElementById('authPassword');
    const googleAuthBtn = document.getElementById('googleAuthBtn');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;
    loadingOverlay.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loadingOverlay);

    const supabaseService = new SupabaseService();

    togglePassword.addEventListener('click', () => {
        if (authPassword.type === 'password') {
            authPassword.type = 'text';
            togglePassword.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            authPassword.type = 'password';
            togglePassword.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const password = authPassword.value;

        if (email !== 'eldevcreator@gmail.com') {
            showAuthError('Доступ разрешен только для eldevcreator@gmail.com');
            return;
        }

        try {
            const { data, error } = await supabaseService.signIn(email, password);
            
            if (error) throw error;
            
            localStorage.setItem('sb-auth-token', data.session.access_token);
            authContainer.classList.add('hidden');
            mainContainer.classList.remove('hidden');
            updateUserInfo(data.user);
        } catch (error) {
            showAuthError(error.message);
        }
    });

    googleAuthBtn.addEventListener('click', async () => {
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
        }
    });

    logoutBtn.addEventListener('click', async () => {
        try {
            await supabaseService.signOut();
            localStorage.removeItem('sb-auth-token');
            mainContainer.classList.add('hidden');
            authContainer.classList.remove('hidden');
            authForm.reset();
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    });

    async function initializeAuth() {
        // Сначала скрываем обе панели и показываем загрузку
        authContainer.classList.add('hidden');
        mainContainer.classList.add('hidden');
        loadingOverlay.style.display = 'flex';

        try {
            // Проверяем, есть ли сессия (например, после OAuth-редиректа)
            const { data: sessionData, error: sessionError } = await supabaseService.client.auth.getSession();
            
            if (sessionError) throw sessionError;

            let user = null;
            let token = localStorage.getItem('sb-auth-token');

            if (sessionData.session) {
                // Если есть сессия после OAuth
                user = sessionData.session.user;
                token = sessionData.session.access_token;
                localStorage.setItem('sb-auth-token', token);
            } else if (token) {
                // Если есть токен в localStorage, проверяем его
                const { data: userData, error: userError } = await supabaseService.client.auth.getUser(token);
                if (userError) throw userError;
                user = userData.user;
            }

            if (user) {
                // Проверяем email пользователя
                if (user.email !== 'eldevcreator@gmail.com') {
                    await supabaseService.signOut();
                    localStorage.removeItem('sb-auth-token');
                    showAuthError('Доступ разрешен только для eldevcreator@gmail.com');
                    authContainer.classList.remove('hidden');
                    loadingOverlay.style.display = 'none';
                    return;
                }

                // Пользователь авторизован, показываем панель
                mainContainer.classList.remove('hidden');
                updateUserInfo(user);
                loadingOverlay.style.display = 'none';
                redirectToMainPage();
            } else {
                // Нет сессии и токена, показываем страницу входа
                authContainer.classList.remove('hidden');
                loadingOverlay.style.display = 'none';
            }
        } catch (error) {
            console.error('Ошибка инициализации авторизации:', error);
            localStorage.removeItem('sb-auth-token');
            authContainer.classList.remove('hidden');
            loadingOverlay.style.display = 'none';
        }
    }

    function updateUserInfo(user) {
        const name = user.user_metadata?.full_name || user.email.split('@')[0];
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
        
        userName.textContent = name;
        userAvatar.textContent = initials.slice(0, 2);
    }

    function showAuthError(message) {
        authError.textContent = message || 'Неверные учетные данные!';
        authError.style.display = 'block';
        setTimeout(() => {
            authError.style.display = 'none';
        }, 3000);
    }

    function redirectToMainPage() {
        const mainPageUrl = 'https://eldevcreatorpanelcontrol.github.io';
        console.log('Перенаправляем на главную страницу:', mainPageUrl);
        window.location.href = mainPageUrl;
    }

    // Инициируем проверку авторизации только один раз
    initializeAuth();
});
