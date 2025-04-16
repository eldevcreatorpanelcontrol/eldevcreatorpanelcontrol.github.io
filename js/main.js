class App {
    constructor() {
        this.supabaseService = new SupabaseService();
        this.currentUser = null;
        this.modals = {};
        this.init();
    }

    init() {
        // Ждем полной загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        this.initModals();
        this.initNavigation();
        this.loadUsers();
        this.initThemeToggle();
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

    initModals() {
        // Инициализация всех модальных окон
        document.querySelectorAll('.modal').forEach(modal => {
            const modalId = modal.id;
            this.modals[modalId] = {
                element: modal,
                isOpen: false
            };

            // Добавляем обработчик клика вне модального окна
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.toggleModal(modalId, false);
                }
            });

            // Добавляем обработчик клавиши Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modals[modalId].isOpen) {
                    this.toggleModal(modalId, false);
                }
            });
        });

        // Основная кнопка создания пользователя
        const createUserBtn = document.getElementById('createUserBtn');
        if (createUserBtn) {
            createUserBtn.addEventListener('click', () => {
                this.toggleModal('userModal', true);
            });
        }

        // Кнопки для разных типов пользователей
        document.querySelectorAll('.open-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const userType = btn.dataset.type;
                const userTypeInput = document.getElementById('userType');
                if (userTypeInput) {
                    userTypeInput.value = userType;
                }
                this.toggleModal('userModal', true);
                this.updateModalTitle(userType);
            });
        });

        // Кнопки закрытия
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = btn.closest('.modal');
                if (modal) {
                    this.toggleModal(modal.id, false);
                }
            });
        });

        // Обработка формы
        const userForm = document.getElementById('userForm');
        if (userForm) {
            userForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.createUser();
            });
        }
    }

    updateModalTitle(userType) {
        const modalTitle = document.querySelector('.modal-title');
        if (modalTitle) {
            const titles = {
                student: 'Создание нового ученика',
                teacher: 'Создание нового учителя',
                assistant: 'Создание нового помощника',
                admin: 'Создание нового администратора'
            };
            modalTitle.textContent = titles[userType] || 'Создание нового пользователя';
        }
    }

    toggleModal(modalId, show) {
        const modalData = this.modals[modalId];
        if (!modalData) return;

        const { element } = modalData;
        const form = element.querySelector('form');

        if (show) {
            // Показываем модальное окно
            element.classList.remove('hidden');
            setTimeout(() => element.classList.add('active'), 10);
            this.modals[modalId].isOpen = true;
            
            // Фокус на первое поле ввода
            const firstInput = element.querySelector('input:not([type="hidden"])');
            if (firstInput) {
                firstInput.focus();
            }
        } else {
            // Скрываем модальное окно
            element.classList.remove('active');
            setTimeout(() => element.classList.add('hidden'), 300);
            this.modals[modalId].isOpen = false;
            
            // Сброс формы
            if (form) {
                form.reset();
            }
        }
    }

    async createUser() {
        const form = document.getElementById('userForm');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Получаем все значения формы
        const formData = {
            email: document.getElementById('userEmail')?.value,
            password: document.getElementById('userPassword')?.value,
            confirmPassword: document.getElementById('confirmPassword')?.value,
            fullName: document.getElementById('fullName')?.value,
            username: document.getElementById('username')?.value,
            userType: document.getElementById('userType')?.value
        };

        // Валидация
        if (!this.validateForm(formData)) {
            return;
        }

        try {
            // Блокируем кнопку и показываем загрузку
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Создание...';
            }

            const createdUser = await this.supabaseService.createUserWithRole(
                formData.email,
                formData.password,
                formData.fullName,
                formData.userType
            );
            
            this.showNotification('success', `Пользователь ${formData.fullName} успешно создан!`);
            this.toggleModal('userModal', false);
            this.loadUsers();
        } catch (error) {
            console.error('Ошибка создания пользователя:', error);
            this.showNotification('error', `Ошибка: ${error.message}`);
        } finally {
            // Возвращаем кнопку в исходное состояние
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Создать пользователя';
            }
        }
    }

    validateForm(formData) {
        if (!formData.email || !formData.password || !formData.confirmPassword || 
            !formData.fullName || !formData.username || !formData.userType) {
            this.showNotification('error', 'Пожалуйста, заполните все поля');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            this.showNotification('error', 'Пароли не совпадают');
            return false;
        }

        if (formData.password.length < 6) {
            this.showNotification('error', 'Пароль должен содержать минимум 6 символов');
            return false;
        }

        return true;
    }

    showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        // Анимация появления
        setTimeout(() => notification.classList.add('show'), 10);

        // Автоматическое скрытие
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    async loadUsers() {
        try {
            const { data: users, error } = await this.supabaseService.getUsers();
            
            if (error) throw error;
            
            const container = document.getElementById('usersList');
            container.innerHTML = users.map(user => `
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

    initNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveSection(link.dataset.section);
            });
        });
    }

    setActiveSection(section) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        event.target.classList.add('active');
        console.log('Переход в раздел:', section);
    }
}

// Инициализация приложения
const app = new App();
