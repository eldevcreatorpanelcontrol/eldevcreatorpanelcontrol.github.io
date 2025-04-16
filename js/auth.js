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
    const loaderOverlay = document.getElementById('loaderOverlay');

    const supabaseService = new SupabaseService();

    // Показать прелоадер
    function showLoader() {
        loaderOverlay.classList.add('active');
    }

    // Скрыть прелоадер
    function hideLoader() {
        loaderOverlay.classList.remove('active');
    }

    // Показать контейнер с анимацией
    function showContainer(container) {
        container.classList.remove('hidden');
        setTimeout(() => container.classList.add('visible'), 50); // Задержка для анимации
    }

    // Скрыть контейнер с анимацией
    function hideContainer(container) {
        container.classList.remove('visible');
        setTimeout(() => container.classList.add('hidden'), 500); // Синхронизация с длительностью анимации
    }

    // Переключение видимости пароля
    togglePassword.addEventListener('click', () => {
        if (authPassword.type === 'password') {
            authPassword.type = 'text';
            togglePassword.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            authPassword.type = 'password';
            togglePassword.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });

    // Обработка входа через форму
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const password = authPassword.value;

        if (email !== 'eldevcreator@gmail.com') {
            showAuthError('Доступ разрешен только для eldevcreator@gmail.com');
            return;
        }

        showLoader();
        try {
            const { data, error } = await supabaseService.signIn(email, password);
            
            if (error) throw error;
            
            localStorage.setItem('sb-auth-token', data.session.access_token);
            hideContainer(authContainer);
            showContainer(mainContainer);
            updateUserInfo(data.user);
        } catch (error) {
            showAuthError(error.message);
        } finally {
            hideLoader();
        }
    });

    // Обработка входа через Google
    googleAuthBtn.addEventListener('click', async () => {
        showLoader();
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
        } finally {
            hideLoader();
        }
    });

    // Обработка выхода
    logoutBtn.addEventListener('click', async () => {
        showLoader();
        try {
            await supabaseService.signOut();
            localStorage.removeItem('sb-auth-token');
            hideContainer(mainContainer);
            showContainer(authContainer);
            authForm.reset();
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        } finally {
            hideLoader();
        }
    });

    // Инициализация авторизации
    async function initializeAuth() {
        showLoader();
        try {
            // Проверяем, есть ли сессия
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
                    showContainer(authContainer);
                    hideContainer(mainContainer);
                    return;
                }

                hideContainer(authContainer);
                showContainer(mainContainer);
                updateUserInfo(user);
                redirectToMainPage();
            } else {
                showContainer(authContainer);
                hideContainer(mainContainer);
            }
        } catch (error) {
            console.error('Ошибка инициализации авторизации:', error);
            localStorage.removeItem('sb-auth-token');
            showContainer(authContainer);
            hideContainer(mainContainer);
        } finally {
            hideLoader();
        }
    }

    // Обновление информации о пользователе
    function updateUserInfo(user) {
        const name = user.user_metadata?.full_name || user.email.split('@')[0];
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
        
        userName.textContent = name;
        userAvatar.textContent = initials.slice(0, 2);
    }

    // Показ ошибки
    function showAuthError(message) {
        authError.textContent = message || 'Неверные учетные данные!';
        authError.style.display = 'block';
        setTimeout(() => {
            authError.style.display = 'none';
        }, 3000);
    }

    // Перенаправление на главную страницу
    function redirectToMainPage() {
        const mainPageUrl = 'https://eldevcreatorpanelcontrol.github.io';
        console.log('Перенаправляем на главную страницу:', mainPageUrl);
        window.location.href = mainPageUrl;
    }

    // Запуск инициализации
    initializeAuth();
});
