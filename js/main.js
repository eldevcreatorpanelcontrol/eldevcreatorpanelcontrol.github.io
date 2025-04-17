class App {
    constructor() {
        this.supabaseService = new SupabaseService();
        this.currentUser = null;
        this.init();
    }

    init() {
        this.initModals();
        this.initNavigation();
        this.loadUsers();
        this.initThemeToggle();
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Обработчики для карточек создания пользователей
        document.querySelectorAll('.open-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userType = e.currentTarget.dataset.type;
                document.getElementById('userType').value = userType;
                this.toggleModal('userModal', true);
            });
        });

        // Обработчик для кнопки быстрого создания
        const createUserBtn = document.getElementById('createUserBtn');
        if (createUserBtn) {
            createUserBtn.addEventListener('click', () => {
                document.getElementById('userType').value = 'student'; // По умолчанию
                this.toggleModal('userModal', true);
            });
        }

        // Обработчики для модального окна
        const closeModalBtns = document.querySelectorAll('.close-modal');
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleModal('userModal', false);
            });
        });

        // Обработчик формы создания пользователя
        const userForm = document.getElementById('userForm');
        if (userForm) {
            userForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.createUser();
            });
        }

        // Обработчики навигации
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveSection(e.currentTarget.dataset.section);
            });
        });
    }

    toggleModal(modalId, show) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.toggle('hidden', !show);
        if (show) {
            modal.classList.add('active');
        } else {
            modal.classList.remove('active');
            // Сброс формы при закрытии
            const form = modal.querySelector('form');
            if (form) form.reset();
        }
    }

    async createUser() {
        const user = {
            email: document.getElementById('userEmail').value,
            password: document.getElementById('userPassword').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            fullName: document.getElementById('fullName').value,
            username: document.getElementById('username').value,
            userType: document.getElementById('userType').value
        };

        if (user.password !== user.confirmPassword) {
            alert('Пароли не совпадают!');
            return;
        }

        try {
            const createdUser = await this.supabaseService.createUserWithRole(
                user.email, 
                user.password, 
                user.fullName, 
                user.userType
            );
            
            alert(`Пользователь ${user.fullName} успешно создан!`);
            this.toggleModal('userModal', false);
            await this.loadUsers(); // Перезагрузка списка пользователей
        } catch (error) {
            console.error('Ошибка создания пользователя:', error);
            alert(`Ошибка: ${error.message}`);
        }
    }

    async loadUsers() {
        try {
            const { data: users, error } = await this.supabaseService.getUsers();
            
            if (error) throw error;
            
            const container = document.getElementById('usersList');
            if (!container) return;

            // Сохраняем карточки создания новых пользователей
            const createCards = container.querySelectorAll('.user-card');
            const createCardsHTML = Array.from(createCards)
                .filter(card => card.querySelector('.open-modal'))
                .map(card => card.outerHTML)
                .join('');

            // Добавляем существующих пользователей
            const usersHTML = users.map(user => `
                <div class="user-card ${user.user_type}">
                    <div class="user-icon">
                        ${this.getUserIcon(user.user_type)}
                    </div>
                    <h3>${user.full_name}</h3>
                    <p>Тип: ${this.getUserType(user.user_type)}</p>
                    <p>Email: ${user.email}</p>
                    <p>Создан: ${new Date(user.created_at).toLocaleString()}</p>
                </div>
            `).join('');

            // Объединяем карточки создания и существующих пользователей
            container.innerHTML = createCardsHTML + usersHTML;
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
        }
    }

    getUserType(type) {
        const types = {
            student: 'Ученик',
            teacher: 'Учитель',
            assistant: 'Помощник',
            admin: 'Администратор'
        };
        return types[type] || 'Неизвестно';
    }

    getUserIcon(type) {
        const icons = {
            student: '<i class="fas fa-user-graduate"></i>',
            teacher: '<i class="fas fa-chalkboard-teacher"></i>',
            assistant: '<i class="fas fa-hands-helping"></i>',
            admin: '<i class="fas fa-user-cog"></i>'
        };
        return icons[type] || '<i class="fas fa-user"></i>';
    }

    setActiveSection(section) {
        // Удаляем активный класс у всех ссылок
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Добавляем активный класс нужной ссылке
        const activeLink = document.querySelector(`.nav-link[data-section="${section}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Здесь можно добавить логику переключения контента разделов
        console.log('Переход в раздел:', section);
    }

    initThemeToggle() {
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'theme-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        document.body.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const icon = toggleBtn.querySelector('i');
            if (document.body.classList.contains('light-theme')) {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
