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
            
            authContainer.classList.add('hidden');
            mainContainer.classList.remove('hidden');
            updateUserInfo(data.user);
            localStorage.setItem('sb-auth-token', data.session.access_token);
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

    async function checkAuth() {
        const token = localStorage.getItem('sb-auth-token');
        if (!token) return;

        try {
            const { data: { user }, error } = await supabaseService.client.auth.getUser(token);
            
            if (error) throw error;

            if (user.email !== 'eldevcreator@gmail.com') {
                localStorage.removeItem('sb-auth-token');
                showAuthError('Доступ разрешен только для eldevcreator@gmail.com');
                return;
            }
            
            authContainer.classList.add('hidden');
            mainContainer.classList.remove('hidden');
            updateUserInfo(user);
        } catch (error) {
            console.error('Ошибка проверки авторизации:', error);
            localStorage.removeItem('sb-auth-token');
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

    async function handleOAuthCallback() {
        try {
            console.log('Обрабатываем OAuth callback...');
            const { data, error } = await supabaseService.client.auth.getSession();
            
            if (error) throw error;

            if (data.session) {
                console.log('Сессия получена:', data.session);
                const user = data.session.user;

                if (user.email !== 'eldevcreator@gmail.com') {
                    console.log('Пользователь не соответствует email:', user.email);
                    await supabaseService.signOut();
                    localStorage.removeItem('sb-auth-token');
                    showAuthError('Доступ разрешен только для eldevcreator@gmail.com');
                    return;
                }

                localStorage.setItem('sb-auth-token', data.session.access_token);
                authContainer.classList.add('hidden');
                mainContainer.classList.remove('hidden');
                updateUserInfo(user);

                redirectToMainPage();
            } else {
                console.log('Сессия не получена.');
            }
        } catch (error) {
            console.error('Ошибка обработки OAuth:', error);
            showAuthError('Ошибка авторизации: ' + error.message);
        }
    }

    checkAuth();
    handleOAuthCallback();
});
