# Локальный форк figma-mcp-go (инструмент `create_component_instance`)

## Зачем

В апстриме нет вызова, эквивалентного `ComponentNode.createInstance()` в плагине. Из-за этого нельзя было программно вставить **инстанс кнопки** внутрь другого компонента (например `Card / Service`), не дублируя мастер и не требуя ручного drag из Assets.

Новый MCP-инструмент: **`create_component_instance`**.

### Параметры

| Параметр        | Обязательный | Описание |
|-----------------|--------------|----------|
| `componentId`   | да           | ID мастер-компонента (`COMPONENT`), см. `get_local_components` |
| `parentId`      | да           | Родитель (`FRAME` / `COMPONENT` / `INSTANCE` / `PAGE` и т.д.), куда вставить инстанс |
| `replaceNodeId` | нет          | Прямой потомок `parentId`, который удалить после вставки инстанса **на ту же позицию** в списке детей |
| `x`, `y`        | нет          | Если **нет** `replaceNodeId`: позиция после `appendChild` (по умолчанию 0) |
| `copySize`      | нет          | При замене: подогнать размер инстанса под удаляемый узел (по умолчанию `true`) |

### Пример (карточка услуги)

После `get_node` / `search_nodes` узнайте ID фрейма-заглушки CTA и ID родителя (`content`), ID мастера `Button / Primary`:

```json
{
  "componentId": "13:29",
  "parentId": "13:44",
  "replaceNodeId": "13:50"
}
```

## Сборка и подключение

1. **Плагин Figma** (код в `plugin/`): из каталога `plugin/` установите зависимости и соберите bundle, затем в Figma *Development* подключите манифест из **`plugin/manifest.json`** этого форка (или скопируйте собранный `dist/` в ваш каталог плагина, как вы делали для `~/plugin`).

   ```bash
   cd tools/figma-mcp-go/plugin
   npm ci
   npm run build
   ```

2. **MCP-сервер (Go)**: соберите бинарник из корня `tools/figma-mcp-go` и укажите его в конфиге Cursor вместо `npx @vkhanhqui/figma-mcp-go`:

   ```bash
   cd tools/figma-mcp-go
   go build -o figma-mcp-go .
   ```

   Пример **`mcp.json`** (путь к бинарнику подставьте свой):

   ```json
   {
     "mcpServers": {
       "figma-mcp-go": {
         "command": "/media/mikhail/skobeev_test/tools/figma-mcp-go/figma-mcp-go",
         "args": []
       }
     }
   }
   ```

3. Перезапустите MCP / Cursor, откройте файл в Figma с **подключённым плагином** этой сборки.

## В апстрим

Имеет смысл оформить PR в [vkhanhqui/figma-mcp-go](https://github.com/vkhanhqui/figma-mcp-go) с тем же изменением, чтобы вернуться на `npx` без локального пути.
