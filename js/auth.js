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

    // Создаем единственный экземпляр SupabaseService
    const supabaseService = window.supabaseService || new SupabaseService();
    window.supabaseService = supabaseService;

    function showAuthContainer() {
        // Сначала удаляем класс hidden
        authContainer.classList.remove('hidden');
        mainContainer.classList.add('hidden');
        // Даем время браузеру обработать изменение display
        requestAnimationFrame(() => {
            authContainer.style.opacity = '1';
            authContainer.style.transform = 'none';
        });
    }

    function showMainContainer(user) {
        // Сначала удаляем класс hidden
        mainContainer.classList.remove('hidden');
        authContainer.classList.add('hidden');
        // Даем время браузеру обработать изменение display
        requestAnimationFrame(() => {
            mainContainer.style.opacity = '1';
            mainContainer.style.transform = 'none';
            updateUserInfo(user);
        });
    }

    function hideLoader() {
        loaderContainer.style.opacity = '0';
        loaderContainer.style.visibility = 'hidden';
        setTimeout(() => {
            loaderContainer.classList.add('hidden');
        }, 500);
    }

    async function initializeAuth() {
        try {
            // Проверяем, не находимся ли мы уже на целевой странице
            const currentUrl = window.location.href;
            const targetUrl = 'https://eldevcreatorpanelcontrol.github.io';
            
            if (currentUrl.includes(targetUrl)) {
                hideLoader();
                return;
            }

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

            hideLoader();

            if (user && user.email === 'eldevcreator@gmail.com') {
                showMainContainer(user);
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
            hideLoader();
            showAuthContainer();
        }
    }

    function updateUserInfo(user) {
        if (!user) return;
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

    // Обработчики событий
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
            
            const { data, error } = await supabaseService.client.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
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

    togglePassword.addEventListener('click', () => {
        if (authPassword.type === 'password') {
            authPassword.type = 'text';
            togglePassword.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            authPassword.type = 'password';
            togglePassword.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });

    // Запускаем инициализацию
    initializeAuth();
});
