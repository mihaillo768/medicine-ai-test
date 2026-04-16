# Frontend (Vue)

Клиентское приложение медицинского центра — **Vue 3**, **Vite**, **Vue Router** (без Pinia до появления общего состояния).

Кратко о всём репозитории и как клонировать проект: [README в корне](../README.md). Пошаговый план: [docs/frontend/plan.md](../docs/frontend/plan.md). Правила проекта: [AGENTS.md](../AGENTS.md).

## Команды

| Команда            | Назначение                         |
| ------------------ | ---------------------------------- |
| `npm run dev`      | dev-сервер (Vite)                  |
| `npm run build`    | проверка типов и production-сборка |
| `npm run preview`  | предпросмотр сборки                |
| `npm run lint`     | ESLint                             |
| `npm run lint:fix` | ESLint с автоисправлением          |
| `npm run format`   | Prettier                           |

## Структура `src/`

| Каталог                | Назначение                          |
| ---------------------- | ----------------------------------- |
| `components/ui/`       | переиспользуемые UI-элементы        |
| `components/layout/`   | оболочка (хедер, футер и т.п.)      |
| `components/sections/` | секции страниц                      |
| `views/`               | страницы (маршруты)                 |
| `router/`              | конфигурация Vue Router             |
| `assets/`              | статика (в т.ч. будущий `logo.svg`) |
| `styles/`              | глобальные стили и токены           |

Алиас импорта: `@/` → `src/`.

## Шрифт

**Inter** подключается из Google Fonts в `index.html`; в [src/styles/main.css](src/styles/main.css) заданы fallback для кириллицы.
