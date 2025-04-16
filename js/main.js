class App {
    constructor() {
        this.supabaseService = new SupabaseService();
        this.currentUser = null;
        this.init();
    }

    init() {
        this.initI18next();
        this.initModals();
        this.initNavigation();
        this.loadUsers();
        this.initSettings();
    }

    initI18next() {
        i18next
            .use(i18nextBrowserLanguageDetector)
            .init({
                fallbackLng: 'ru',
                debug: true,
                resources: {
                    ru: {
                        translation: {
                            login: {
                                title: "Вход в систему",
                                email: "Email",
                                password: "Пароль",
                                signIn: "Войти",
                                googleSignIn: "Войти через Google",
                                or: "или"
                            },
                            logout: "Выйти",
                            header: {
                                title: "Eldevcreator Panel"
                            },
                            navigation: {
                                title: "Навигация",
                                users: "Управление пользователями",
                                security: "Безопасность",
                                stats: "Статистика",
                                settings: "Настройки"
                            },
                            administration: {
                                title: "Администрирование",
                                database: "База данных",
                                server: "Сервер"
                            },
                            content: {
                                createUserTitle: "Создание новых пользователей",
                                quickCreate: "Быстрое создание"
                            },
                            roles: {
                                createStudent: "Создать ученика",
                                studentDescription: "Добавьте нового ученика в систему с ограниченными правами доступа.",
                                createTeacher: "Создать учителя",
                                teacherDescription: "Добавьте преподавателя с доступом к учебным материалам.",
                                createAssistant: "Создать помощника",
                                assistantDescription: "Добавьте ассистента преподавателя с ограниченными правами.",
                                createAdmin: "Создать администратора",
                                adminDescription: "Добавьте нового администратора системы с полными правами.",
                                create: "Создать",
                                student: "Ученик",
                                teacher: "Учитель",
                                assistant: "Помощник",
                                admin: "Администратор"
                            },
                            modal: {
                                createUserTitle: "Создание нового пользователя",
                                fullName: "Полное имя",
                                username: "Логин",
                                email: "Email",
                                password: "Пароль",
                                confirmPassword: "Подтверждение пароля",
                                createUser: "Создать пользователя"
                            },
                            settings: {
                                title: "Настройки",
                                theme: "Тема",
                                darkTheme: "Тёмная",
                                lightTheme: "Светлая",
                                language: "Язык"
                            },
                            languages: {
                                ru: "Русский",
                                en: "English",
                                es: "Español",
                                fr: "Français",
                                de: "Deutsch",
                                zh: "中文",
                                ja: "日本語",
                                ko: "한국어",
                                it: "Italiano",
                                pt: "Português"
                            },
                            errors: {
                                accessDenied: "Доступ разрешен только для eldevcreator@gmail.com",
                                invalidCredentials: "Неверные учетные данные!",
                                googleSignInError: "Ошибка входа через Google: ",
                                passwordsMismatch: "Пароли не совпадают!"
                            }
                        }
                    },
                    en: {
                        translation: {
                            login: {
                                title: "Sign In",
                                email: "Email",
                                password: "Password",
                                signIn: "Sign In",
                                googleSignIn: "Sign in with Google",
                                or: "or"
                            },
                            logout: "Logout",
                            header: {
                                title: "Eldevcreator Panel"
                            },
                            navigation: {
                                title: "Navigation",
                                users: "User Management",
                                security: "Security",
                                stats: "Statistics",
                                settings: "Settings"
                            },
                            administration: {
                                title: "Administration",
                                database: "Database",
                                server: "Server"
                            },
                            content: {
                                createUserTitle: "Create New Users",
                                quickCreate: "Quick Create"
                            },
                            roles: {
                                createStudent: "Create Student",
                                studentDescription: "Add a new student to the system with limited access rights.",
                                createTeacher: "Create Teacher",
                                teacherDescription: "Add a teacher with access to educational materials.",
                                createAssistant: "Create Assistant",
                                assistantDescription: "Add a teacher's assistant with limited rights.",
                                createAdmin: "Create Administrator",
                                adminDescription: "Add a new system administrator with full rights.",
                                create: "Create",
                                student: "Student",
                                teacher: "Teacher",
                                assistant: "Assistant",
                                admin: "Administrator"
                            },
                            modal: {
                                createUserTitle: "Create New User",
                                fullName: "Full Name",
                                username: "Username",
                                email: "Email",
                                password: "Password",
                                confirmPassword: "Confirm Password",
                                createUser: "Create User"
                            },
                            settings: {
                                title: "Settings",
                                theme: "Theme",
                                darkTheme: "Dark",
                                lightTheme: "Light",
                                language: "Language"
                            },
                            languages: {
                                ru: "Русский",
                                en: "English",
                                es: "Español",
                                fr: "Français",
                                de: "Deutsch",
                                zh: "中文",
                                ja: "日本語",
                                ko: "한국어",
                                it: "Italiano",
                                pt: "Português"
                            },
                            errors: {
                                accessDenied: "Access allowed only for eldevcreator@gmail.com",
                                invalidCredentials: "Invalid credentials!",
                                googleSignInError: "Google sign-in error: ",
                                passwordsMismatch: "Passwords do not match!"
                            }
                        }
                    },
                    es: {
                        translation: {
                            login: {
                                title: "Iniciar sesión",
                                email: "Correo electrónico",
                                password: "Contraseña",
                                signIn: "Iniciar sesión",
                                googleSignIn: "Iniciar sesión con Google",
                                or: "o"
                            },
                            logout: "Cerrar sesión",
                            header: {
                                title: "Eldevcreator Panel"
                            },
                            navigation: {
                                title: "Navegación",
                                users: "Gestión de usuarios",
                                security: "Seguridad",
                                stats: "Estadísticas",
                                settings: "Configuración"
                            },
                            administration: {
                                title: "Administración",
                                database: "Base de datos",
                                server: "Servidor"
                            },
                            content: {
                                createUserTitle: "Crear nuevos usuarios",
                                quickCreate: "Creación rápida"
                            },
                            roles: {
                                createStudent: "Crear estudiante",
                                studentDescription: "Añade un nuevo estudiante al sistema con derechos de acceso limitados.",
                                createTeacher: "Crear profesor",
                                teacherDescription: "Añade un profesor con acceso a materiales educativos.",
                                createAssistant: "Crear asistente",
                                assistantDescription: "Añade un asistente de profesor con derechos limitados.",
                                createAdmin: "Crear administrador",
                                adminDescription: "Añade un nuevo administrador del sistema con derechos completos.",
                                create: "Crear",
                                student: "Estudiante",
                                teacher: "Profesor",
                                assistant: "Asistente",
                                admin: "Administrador"
                            },
                            modal: {
                                createUserTitle: "Crear nuevo usuario",
                                fullName: "Nombre completo",
                                username: "Nombre de usuario",
                                email: "Correo electrónico",
                                password: "Contraseña",
                                confirmPassword: "Confirmar contraseña",
                                createUser: "Crear usuario"
                            },
                            settings: {
                                title: "Configuración",
                                theme: "Tema",
                                darkTheme: "Oscuro",
                                lightTheme: "Claro",
                                language: "Idioma"
                            },
                            languages: {
                                ru: "Русский",
                                en: "English",
                                es: "Español",
                                fr: "Français",
                                de: "Deutsch",
                                zh: "中文",
                                ja: "日本語",
                                ko: "한국어",
                                it: "Italiano",
                                pt: "Português"
                            },
                            errors: {
                                accessDenied: "Acceso permitido solo para eldevcreator@gmail.com",
                                invalidCredentials: "¡Credenciales inválidas!",
                                googleSignInError: "Error al iniciar sesión con Google: ",
                                passwordsMismatch: "¡Las contraseñas no coinciden!"
                            }
                        }
                    },
                    fr: {
                        translation: {
                            login: {
                                title: "Connexion",
                                email: "Email",
                                password: "Mot de passe",
                                signIn: "Se connecter",
                                googleSignIn: "Se connecter avec Google",
                                or: "ou"
                            },
                            logout: "Déconnexion",
                            header: {
                                title: "Eldevcreator Panel"
                            },
                            navigation: {
                                title: "Navigation",
                                users: "Gestion des utilisateurs",
                                security: "Sécurité",
                                stats: "Statistiques",
                                settings: "Paramètres"
                            },
                            administration: {
                                title: "Administration",
                                database: "Base de données",
                                server: "Serveur"
                            },
                            content: {
                                createUserTitle: "Créer de nouveaux utilisateurs",
                                quickCreate: "Création rapide"
                            },
                            roles: {
                                createStudent: "Créer un étudiant",
                                studentDescription: "Ajoutez un nouvel étudiant au système avec des droits d'accès limités.",
                                createTeacher: "Créer un enseignant",
                                teacherDescription: "Ajoutez un enseignant avec accès aux matériels pédagogiques.",
                                createAssistant: "Créer un assistant",
                                assistantDescription: "Ajoutez un assistant d'enseignant avec des droits limités.",
                                createAdmin: "Créer un administrateur",
                                adminDescription: "Ajoutez un nouvel administrateur du système avec des droits complets.",
                                create: "Créer",
                                student: "Étudiant",
                                teacher: "Enseignant",
                                assistant: "Assistant",
                                admin: "Administrateur"
                            },
                            modal: {
                                createUserTitle: "Créer un nouvel utilisateur",
                                fullName: "Nom complet",
                                username: "Nom d'utilisateur",
                                email: "Email",
                                password: "Mot de passe",
                                confirmPassword: "Confirmer le mot de passe",
                                createUser: "Créer un utilisateur"
                            },
                            settings: {
                                title: "Paramètres",
                                theme: "Thème",
                                darkTheme: "Sombre",
                                lightTheme: "Clair",
                                language: "Langue"
                            },
                            languages: {
                                ru: "Русский",
                                en: "English",
                                es: "Español",
                                fr: "Français",
                                de: "Deutsch",
                                zh: "中文",
                                ja: "日本語",
                                ko: "한국어",
                                it: "Italiano",
                                pt: "Português"
                            },
                            errors: {
                                accessDenied: "Accès autorisé uniquement pour eldevcreator@gmail.com",
                                invalidCredentials: "Identifiants incorrects !",
                                googleSignInError: "Erreur de connexion avec Google : ",
                                passwordsMismatch: "Les mots de passe ne correspondent pas !"
                            }
                        }
                    },
                    de: {
                        translation: {
                            login: {
                                title: "Anmelden",
                                email: "Email",
                                password: "Passwort",
                                signIn: "Anmelden",
                                googleSignIn: "Mit Google anmelden",
                                or: "oder"
                            },
                            logout: "Abmelden",
                            header: {
                                title: "Eldevcreator Panel"
                            },
                            navigation: {
                                title: "Navigation",
                                users: "Benutzerverwaltung",
                                security: "Sicherheit",
                                stats: "Statistiken",
                                settings: "Einstellungen"
                            },
                            administration: {
                                title: "Administration",
                                database: "Datenbank",
                                server: "Server"
                            },
                            content: {
                                createUserTitle: "Neue Benutzer erstellen",
                                quickCreate: "Schnell erstellen"
                            },
                            roles: {
                                createStudent: "Schüler erstellen",
                                studentDescription: "Fügen Sie einen neuen Schüler mit eingeschränkten Zugriffsrechten zum System hinzu.",
                                createTeacher: "Lehrer erstellen",
                                teacherDescription: "Fügen Sie einen Lehrer mit Zugriff auf Lehrmaterialien hinzu.",
                                createAssistant: "Assistent erstellen",
                                assistantDescription: "Fügen Sie einen Assistenten eines Lehrers mit eingeschränkten Rechten hinzu.",
                                createAdmin: "Administrator erstellen",
                                adminDescription: "Fügen Sie einen neuen Administrator des Systems mit vollen Rechten hinzu.",
                                create: "Erstellen",
                                student: "Schüler",
                                teacher: "Lehrer",
                                assistant: "Assistent",
                                admin: "Administrator"
                            },
                            modal: {
                                createUserTitle: "Neuen Benutzer erstellen",
                                fullName: "Vollständiger Name",
                                username: "Benutzername",
                                email: "Email",
                                password: "Passwort",
                                confirmPassword: "Passwort bestätigen",
                                createUser: "Benutzer erstellen"
                            },
                            settings: {
                                title: "Einstellungen",
                                theme: "Thema",
                                darkTheme: "Dunkel",
                                lightTheme: "Hell",
                                language: "Sprache"
                            },
                            languages: {
                                ru: "Русский",
                                en: "English",
                                es: "Español",
                                fr: "Français",
                                de: "Deutsch",
                                zh: "中文",
                                ja: "日本語",
                                ko: "한국어",
                                it: "Italiano",
                                pt: "Português"
                            },
                            errors: {
                                accessDenied: "Zugriff nur für eldevcreator@gmail.com erlaubt",
                                invalidCredentials: "Ungültige Anmeldeinformationen!",
                                googleSignInError: "Fehler bei der Anmeldung mit Google: ",
                                passwordsMismatch: "Passwörter stimmen nicht überein!"
                            }
                        }
                    },
                    zh: {
                        translation: {
                            login: {
                                title: "登录",
                                email: "电子邮件",
                                password: "密码",
                                signIn: "登录",
                                googleSignIn: "使用 Google 登录",
                                or: "或"
                            },
                            logout: "退出",
                            header: {
                                title: "Eldevcreator Panel"
                            },
                            navigation: {
                                title: "导航",
                                users: "用户管理",
                                security: "安全",
                                stats: "统计",
                                settings: "设置"
                            },
                            administration: {
                                title: "管理",
                                database: "数据库",
                                server: "服务器"
                            },
                            content: {
                                createUserTitle: "创建新用户",
                                quickCreate: "快速创建"
                            },
                            roles: {
                                createStudent: "创建学生",
                                studentDescription: "向系统添加具有有限访问权限的新学生。",
                                createTeacher: "创建教师",
                                teacherDescription: "添加具有访问教学材料的教师。",
                                createAssistant: "创建助理",
                                assistantDescription: "添加具有有限权限的教师助理。",
                                createAdmin: "创建管理员",
                                adminDescription: "添加具有完整权限的新系统管理员。",
                                create: "创建",
                                student: "学生",
                                teacher: "教师",
                                assistant: "助理",
                                admin: "管理员"
                            },
                            modal: {
                                createUserTitle: "创建新用户",
                                fullName: "全名",
                                username: "用户名",
                                email: "电子邮件",
                                password: "密码",
                                confirmPassword: "确认密码",
                                createUser: "创建用户"
                            },
                            settings: {
                                title: "设置",
                                theme: "主题",
                                darkTheme: "暗色",
                                lightTheme: "亮色",
                                language: "语言"
                            },
                            languages: {
                                ru: "Русский",
                                en: "English",
                                es: "Español",
                                fr: "Français",
                                de: "Deutsch",
                                zh: "中文",
                                ja: "日本語",
                                ko: "한국어",
                                it: "Italiano",
                                pt: "Português"
                            },
                            errors: {
                                accessDenied: "仅允许 eldevcreator@gmail.com 访问",
                                invalidCredentials: "无效凭据！",
                                googleSignInError: "Google 登录错误：",
                                passwordsMismatch: "密码不匹配！"
                            }
                        }
                    },
                    ja: {
                        translation: {
                            login: {
                                title: "ログイン",
                                email: "メール",
                                password: "パスワード",
                                signIn: "ログイン",
                                googleSignIn: "Googleでログイン",
                                or: "または"
                            },
                            logout: "ログアウト",
                            header: {
                                title: "Eldevcreator Panel"
                            },
                            navigation: {
                                title: "ナビゲーション",
                                users: "ユーザー管理",
                                security: "セキュリティ",
                                stats: "統計",
                                settings: "設定"
                            },
                            administration: {
                                title: "管理",
                                database: "データベース",
                                server: "サーバー"
                            },
                            content: {
                                createUserTitle: "新しいユーザーを作成",
                                quickCreate: "クイック作成"
                            },
                            roles: {
                                createStudent: "学生を作成",
                                studentDescription: "制限されたアクセス権を持つ新しい学生をシステムに追加します。",
                                createTeacher: "教師を作成",
                                teacherDescription: "教育資料にアクセスできる教師を追加します。",
                                createAssistant: "アシスタントを作成",
                                assistantDescription: "制限された権限を持つ教師のアシスタントを追加します。",
                                createAdmin: "管理者を作成",
                                adminDescription: "完全な権限を持つ新しいシステム管理者を追加します。",
                                create: "作成",
                                student: "学生",
                                teacher: "教師",
                                assistant: "アシスタント",
                                admin: "管理者"
                            },
                            modal: {
                                createUserTitle: "新しいユーザーを作成",
                                fullName: "フルネーム",
                                username: "ユーザー名",
                                email: "メール",
                                password: "パスワード",
                                confirmPassword: "パスワードの確認",
                                createUser: "ユーザーを作成"
                            },
                            settings: {
                                title: "設定",
                                theme: "テーマ",
                                darkTheme: "ダーク",
                                lightTheme: "ライト",
                                language: "言語"
                            },
                            languages: {
                                ru: "Русский",
                                en: "English",
                                es: "Español",
                                fr: "Français",
                                de: "Deutsch",
                                zh: "中文",
                                ja: "日本語",
                                ko: "한국어",
                                it: "Italiano",
                                pt: "Português"
                            },
                            errors: {
                                accessDenied: "eldevcreator@gmail.comのみアクセスが許可されています",
                                invalidCredentials: "無効な資格情報！",
                                googleSignInError: "Googleログインエラー：",
                                passwordsMismatch: "パスワードが一致しません！"
                            }
                        }
                    },
                    ko: {
                        translation: {
                            login: {
                                title: "로그인",
                                email: "이메일",
                                password: "비밀번호",
                                signIn: "로그인",
                                googleSignIn: "Google로 로그인",
                                or: "또는"
                            },
                            logout: "로그아웃",
                            header: {
                                title: "Eldevcreator Panel"
                            },
                            navigation: {
                                title: "내비게이션",
                                users: "사용자 관리",
                                security: "보안",
                                stats: "통계",
                                settings: "설정"
                            },
                            administration: {
                                title: "관리",
                                database: "데이터베이스",
                                server: "서버"
                            },
                            content: {
                                createUserTitle: "새 사용자 생성",
                                quickCreate: "빠른 생성"
                            },
                            roles: {
                                createStudent: "학생 생성",
                                studentDescription: "제한된 접근 권한을 가진 새 학생을 시스템에 추가합니다.",
                                createTeacher: "교사 생성",
                                teacherDescription: "교육 자료에 접근할 수 있는 교사를 추가합니다.",
                                createAssistant: "조수 생성",
                                assistantDescription: "제한된 권한을 가진 교사의 조수를 추가합니다.",
                                createAdmin: "관리자 생성",
                                adminDescription: "전체 권한을 가진 새 시스템 관리자를 추가합니다.",
                                create: "생성",
                                student: "학생",
                                teacher: "교사",
                                assistant: "조수",
                                admin: "관리자"
                            },
                            modal: {
                                createUserTitle: "새 사용자 생성",
                                fullName: "전체 이름",
                                username: "사용자 이름",
                                email: "이메일",
                                password: "비밀번호",
                                confirmPassword: "비밀번호 확인",
                                createUser: "사용자 생성"
                            },
                            settings: {
                                title: "설정",
                                theme: "테마",
                                darkTheme: "다크",
                                lightTheme: "라이트",
                                language: "언어"
                            },
                            languages: {
                                ru: "Русский",
                                en: "English",
                                es: "Español",
                                fr: "Français",
                                de: "Deutsch",
                                zh: "中文",
                                ja: "日本語",
                                ko: "한국어",
                                it: "Italiano",
                                pt: "Português"
                            },
                            errors: {
                                accessDenied: "eldevcreator@gmail.com만 접근이 허용됩니다",
                                invalidCredentials: "잘못된 자격 증명!",
                                googleSignInError: "Google 로그인 오류: ",
                                passwordsMismatch: "비밀번호가 일치하지 않습니다!"
                            }
                        }
                    },
                    it: {
                        translation: {
                            login: {
                                title: "Accedi",
                                email: "Email",
                                password: "Password",
                                signIn: "Accedi",
                                googleSignIn: "Accedi con Google",
                                or: "o"
                            },
                            logout: "Esci",
                            header: {
                                title: "Eldevcreator Panel"
                            },
                            navigation: {
                                title: "Navigazione",
                                users: "Gestione utenti",
                                security: "Sicurezza",
                                stats: "Statistiche",
                                settings: "Impostazioni"
                            },
                            administration: {
                                title: "Amministrazione",
                                database: "Database",
                                server: "Server"
                            },
                            content: {
                                createUserTitle: "Crea nuovi utenti",
                                quickCreate: "Creazione rapida"
                            },
                            roles: {
                                createStudent: "Crea studente",
                                studentDescription: "Aggiungi un nuovo studente al sistema con diritti di accesso limitati.",
                                createTeacher: "Crea insegnante",
                                teacherDescription: "Aggiungi un insegnante con accesso ai materiali didattici.",
                                createAssistant: "Crea assistente",
                                assistantDescription: "Aggiungi un assistente dell'insegnante con diritti limitati.",
                                createAdmin: "Crea amministratore",
                                adminDescription: "Aggiungi un nuovo amministratore del sistema con diritti completi.",
                                create: "Crea",
                                student: "Studente",
                                teacher: "Insegnante",
                                assistant: "Assistente",
                                admin: "Amministratore"
                            },
                            modal: {
                                createUserTitle: "Crea nuovo utente",
                                fullName: "Nome completo",
                                username: "Nome utente",
                                email: "Email",
                                password: "Password",
                                confirmPassword: "Conferma password",
                                createUser: "Crea utente"
                            },
                            settings: {
                                title: "Impostazioni",
                                theme: "Tema",
                                darkTheme: "Scuro",
                                lightTheme: "Chiaro",
                                language: "Lingua"
                            },
                            languages: {
                                ru: "Русский",
                                en: "English",
                                es: "Español",
                                fr: "Français",
                                de: "Deutsch",
                                zh: "中文",
                                ja: "日本語",
                                ko: "한국어",
                                it: "Italiano",
                                pt: "Português"
                            },
                            errors: {
                                accessDenied: "Accesso consentito solo per eldevcreator@gmail.com",
                                invalidCredentials: "Credenziali non valide!",
                                googleSignInError: "Errore di accesso con Google: ",
                                passwordsMismatch: "Le password non corrispondono!"
                            }
                        }
                    },
                    pt: {
                        translation: {
                            login: {
                                title: "Entrar",
                                email: "Email",
                                password: "Senha",
                                signIn: "Entrar",
                                googleSignIn: "Entrar com Google",
                                or: "ou"
                            },
                            logout: "Sair",
                            header: {
                                title: "Eldevcreator Panel"
                            },
                            navigation: {
                                title: "Navegação",
                                users: "Gestão de usuários",
                                security: "Segurança",
                                stats: "Estatísticas",
                                settings: "Configurações"
                            },
                            administration: {
                                title: "Administração",
                                database: "Banco de dados",
                                server: "Servidor"
                            },
                            content: {
                                createUserTitle: "Criar novos usuários",
                                quickCreate: "Criação rápida"
                            },
                            roles: {
                                createStudent: "Criar estudante",
                                studentDescription: "Adicione um novo estudante ao sistema com direitos de acesso limitados.",
                                createTeacher: "Criar professor",
                                teacherDescription: "Adicione um professor com acesso a materiais educacionais.",
                                createAssistant: "Criar assistente",
                                assistantDescription: "Adicione um assistente de professor com direitos limitados.",
                                createAdmin: "Criar administrador",
                                adminDescription: "Adicione um novo administrador do sistema com direitos completos.",
                                create: "Criar",
                                student: "Estudante",
                                teacher: "Professor",
                                assistant: "Assistente",
                                admin: "Administrador"
                            },
                            modal: {
                                createUserTitle: "Criar novo usuário",
                                fullName: "Nome completo",
                                username: "Nome de usuário",
                                email: "Email",
                                password: "Senha",
                                confirmPassword: "Confirmar senha",
                                createUser: "Criar usuário"
                            },
                            settings: {
                                title: "Configurações",
                                theme: "Tema",
                                darkTheme: "Escuro",
                                lightTheme: "Claro",
                                language: "Idioma"
                            },
                            languages: {
                                ru: "Русский",
                                en: "English",
                                es: "Español",
                                fr: "Français",
                                de: "Deutsch",
                                zh: "中文",
                                ja: "日本語",
                                ko: "한국어",
                                it: "Italiano",
                                pt: "Português"
                            },
                            errors: {
                                accessDenied: "Acesso permitido apenas para eldevcreator@gmail.com",
                                invalidCredentials: "Credenciais inválidas!",
                                googleSignInError: "Erro ao entrar com Google: ",
                                passwordsMismatch: "As senhas não coincidem!"
                            }
                        }
                    }
                }
            }, () => {
                this.updateLanguage();
            });
    }

    updateLanguage() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = i18next.t(key);
        });
        document.documentElement.lang = i18next.language;
    }

    initModals() {
        document.getElementById('createUserBtn').addEventListener('click', () => {
            this.toggleModal('userModal', true);
        });

        document.querySelectorAll('.open-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                const userType = btn.dataset.type;
                document.getElementById('userType').value = userType;
                this.toggleModal('userModal', true);
            });
        });

        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleModal('userModal', false);
            });
        });

        document.getElementById('userForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.createUser();
        });
    }

    toggleModal(modalId, show) {
        const modal = document.getElementById(modalId);
        modal.classList.toggle('hidden', !show);
        if (show) {
            modal.classList.add('active');
        } else {
            modal.classList.remove('active');
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
            alert(i18next.t('errors.passwordsMismatch'));
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
            document.getElementById('userForm').reset();
            this.loadUsers();
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
            container.innerHTML = users.map(user => `
                <div class="user-card ${user.user_type}">
                    <div class
