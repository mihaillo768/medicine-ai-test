/**
 * Спецификация лёгкой дизайн-системы (п.3 плана медцентра).
 *
 * **Основной путь:** MCP **figma-mcp-go** — переменные, фреймы, компоненты, привязки
 * (`create_variable_collection`, `create_variable`, `create_frame`, `create_component`,
 * `bind_variable_to_node`, …). Актуальное состояние файла — блок «Состояние после п.3»
 * в [plan.md](plan.md).
 *
 * **Текстовые стили:** через figma-mcp-go `create_text_style` по `TEXT_STYLE_SPEC` (нужны загружаемые
 * в плагине шрифты, напр. Inter) или вручную в панели Styles. Скрипт для **Plugin API** / `use_figma`
 * не включён: API типографики менялся между версиями; при необходимости соберите стили
 * вручную или через `create_text_style` по этой таблице.
 */

/** Локальные текстовые стили — имена и параметры (Inter). */
const TEXT_STYLE_SPEC = [
  { name: "Heading/H1", fontFamily: "Inter", fontStyle: "Semi Bold", fontSize: 40, lineHeightPx: 48 },
  { name: "Heading/H2", fontFamily: "Inter", fontStyle: "Semi Bold", fontSize: 32, lineHeightPx: 40 },
  { name: "Heading/H3", fontFamily: "Inter", fontStyle: "Medium", fontSize: 24, lineHeightPx: 32 },
  { name: "Body/Regular", fontFamily: "Inter", fontStyle: "Regular", fontSize: 16, lineHeightPx: 24 },
  { name: "Caption/Regular", fontFamily: "Inter", fontStyle: "Regular", fontSize: 14, lineHeightPx: 20 },
  { name: "Button/Label", fontFamily: "Inter", fontStyle: "Semi Bold", fontSize: 15, lineHeightPx: 20 },
];

/** Цветовые токены — коллекция «Medcenter / Tokens». */
const COLOR_TOKEN_SPEC = [
  { name: "Color/Bg/Page", hex: "#F4F7F6" },
  { name: "Color/Bg/Surface", hex: "#FFFFFF" },
  { name: "Color/Text/Primary", hex: "#1A2E32" },
  { name: "Color/Text/Secondary", hex: "#5A6B6F" },
  { name: "Color/Accent/Default", hex: "#0D6B6F" },
  { name: "Color/Accent/Hover", hex: "#095456" },
  { name: "Color/Border/Subtle", hex: "#D8E3E4" },
  { name: "Color/Semantic/Error", hex: "#B42318" },
  { name: "Color/Bg/Muted", hex: "#E8F3F4" },
];

/** Числовые токены (шаг сетки 8). */
const FLOAT_TOKEN_SPEC = [
  { name: "Space/8", value: 8 },
  { name: "Space/16", value: 16 },
  { name: "Space/24", value: 24 },
  { name: "Space/32", value: 32 },
  { name: "Radius/8", value: 8 },
  { name: "Radius/12", value: 12 },
  { name: "Radius/16", value: 16 },
];

/** Компоненты на странице «DS / Компоненты». */
const COMPONENT_NAMES = [
  "Button / Primary",
  "Button / Secondary",
  "Button / Ghost",
  "Input / Default",
  "Input / Error",
  "Card / Service",
  "Card / Doctor",
  "Tag / Default",
];
