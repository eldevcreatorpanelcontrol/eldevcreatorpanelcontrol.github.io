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
    const loaderContainer = document.getElementById('loaderContainer');

    const supabaseService = new SupabaseService();

    // Изначально скрываем контейнеры авторизации и главный
    authContainer.classList.add('hidden');
    mainContainer.classList.add('hidden');

    // Показываем загрузку
    loaderContainer.classList.remove('hidden');

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
            showMainContainer(data.user);
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
            showAuthContainer();
            authForm.reset();
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    });

    function showAuthContainer() {
        mainContainer.classList.remove('visible');
        setTimeout(() => {
            mainContainer.classList.add('hidden');
            authContainer.classList.remove('hidden');
            setTimeout(() => {
                authContainer.classList.add('visible');
            }, 50);
        }, 300);
    }

    function showMainContainer(user) {
        authContainer.classList.remove('visible');
        setTimeout(() => {
            authContainer.classList.add('hidden');
            mainContainer.classList.remove('hidden');
            setTimeout(() => {
                mainContainer.classList.add('visible');
            }, 50);
        }, 300);
        updateUserInfo(user);
    }

    async function initializeAuth() {
        try {
            // Имитируем минимальное время загрузки для лучшего UX
            await new Promise(resolve => setTimeout(resolve, 1000));

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

            // Плавно скрываем загрузку
            loaderContainer.classList.add('hidden');

            if (user && user.email === 'eldevcreator@gmail.com') {
                showMainContainer(user);
                redirectToMainPage();
            } else {
                showAuthContainer();
                if (user) {
                    await supabaseService.signOut();
                    localStorage.removeItem('sb-auth-token');
                    showAuthError('Доступ разрешен только для eldevcreator@gmail.com');
                }
            }
        } catch (error) {
            console.error('Ошибка инициализации авторизации:', error);
            localStorage.removeItem('sb-auth-token');
            // Плавно скрываем загрузку при ошибке
            loaderContainer.classList.add('hidden');
            showAuthContainer();
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

    // Инициируем проверку авторизации
    initializeAuth();
});
