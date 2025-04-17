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
    const loadingSpinner = document.getElementById('loadingSpinner');

    const supabaseService = new SupabaseService();

    function setLoading(isLoading) {
        if (isLoading) {
            authContainer.classList.add('loading');
            loadingSpinner.classList.add('visible');
        } else {
            authContainer.classList.remove('loading');
            loadingSpinner.classList.remove('visible');
        }
    }

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
        setLoading(true);
        const email = document.getElementById('authEmail').value;
        const password = authPassword.value;

        if (email !== 'eldevcreator@gmail.com') {
            showAuthError('Доступ разрешен только для eldevcreator@gmail.com');
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabaseService.signIn(email, password);
            
            if (error) throw error;
            
            localStorage.setItem('sb-auth-token', data.session.access_token);
            updateUserInfo(data.user);
            authContainer.classList.add('hidden');
            mainContainer.classList.remove('hidden');
        } catch (error) {
            showAuthError(error.message);
        } finally {
            setLoading(false);
        }
    });

    googleAuthBtn.addEventListener('click', async () => {
        try {
            setLoading(true);
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
            setLoading(false);
        }
    });

    logoutBtn.addEventListener('click', async () => {
        try {
            setLoading(true);
            await supabaseService.signOut();
            localStorage.removeItem('sb-auth-token');
            mainContainer.classList.add('hidden');
            authContainer.classList.remove('hidden');
            authForm.reset();
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        } finally {
            setLoading(false);
        }
    });

    async function initializeAuth() {
        setLoading(true);
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
                    authContainer.classList.remove('hidden');
                    mainContainer.classList.add('hidden');
                    return;
                }

                updateUserInfo(user);
                authContainer.classList.add('hidden');
                mainContainer.classList.remove('hidden');
            } else {
                authContainer.classList.remove('hidden');
                mainContainer.classList.add('hidden');
            }
        } catch (error) {
            console.error('Ошибка инициализации авторизации:', error);
            localStorage.removeItem('sb-auth-token');
            authContainer.classList.remove('hidden');
            mainContainer.classList.add('hidden');
        } finally {
            setLoading(false);
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

    // Инициируем проверку авторизации
    initializeAuth();
});
