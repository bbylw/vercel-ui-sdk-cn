# UI SDK

一套面向智能体（agent）的「行为」库，用于构建下一代用户界面。

键盘导航、焦点管理、选择、关闭、弹出层、拖拽以及它们所需的 ARIA 语义都封装在 `@ui-sdk/core` 中，并提供了适配 React、Vue、Svelte、Solid 与 Web Components 的适配器。

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/vercel-labs/ui/main/assets/behaviors-dark.svg">
  <img alt="An environment selector split into three behaviors: createPopup, createSelection and createTypeahead." src="https://raw.githubusercontent.com/vercel-labs/ui/main/assets/behaviors-light.svg">
</picture>

**[阅读文档](https://ui-sdk.dev/docs)**

## 安装

UI SDK 目前处于 Beta 阶段。请安装核心包以及对应框架的适配器：

```bash
npm install @ui-sdk/react @ui-sdk/core
```

若使用其他框架，请将 `@ui-sdk/react` 替换为 `@ui-sdk/vue`、`@ui-sdk/svelte`、`@ui-sdk/solid` 或 `@ui-sdk/web`。

然后为你的智能体添加 UI SDK skill：

```bash
npx skills add vercel-labs/ui --skill ui-sdk
```

## 示例

UI SDK 中的每个组件都由「行为」构建而成。你首先需要定义带有行为的 primitive。

不用担心，你不需要学习如何编写这些代码，你的智能体会帮你完成，而且我们把它打磨得相当出色。

```ts
import { createFocusRecovery, definePrimitive } from "@ui-sdk/core"

const searchField = definePrimitive({
  name: "search-field",
  state: () => ({ value: "" }),
  api: (context) => ({
    set: (value: string) => context.store.set({ value }),
    recovery: createFocusRecovery({ fallback: () => context.element("input") }),
  }),
  slots: (slot) => ({
    input: slot({
      attrs: (state) => ({ value: state.value }),
      on: {
        input: (event, { api }) =>
          api.set((event.target as HTMLInputElement).value),
      },
    }),
    clear: slot({
      present: (state) => state.value !== "",
      attrs: () => ({ type: "button" }),
      press: ({ api }) => api.set(""),
      bind: (el, part) => part.api.recovery.bind(el, part),
    }),
  }),
})

export { searchField }
```

随后在你的框架中使用 `createParts` 进行渲染。五种框架下的 parts 用法完全一致。

### React

```tsx
import { createParts } from "@ui-sdk/react/primitive"
import { searchField } from "./search-field"

const parts = createParts(searchField, { input: "input", clear: "button" })

const SearchField = parts.Root
const SearchFieldInput = parts.Input
const SearchFieldClear = parts.Clear

function Search() {
  return (
    <SearchField>
      <SearchFieldInput placeholder="Search" />
      <SearchFieldClear>Clear</SearchFieldClear>
    </SearchField>
  )
}

export { Search }
```

### Vue

```vue
<script setup lang="ts">
import { createParts } from "@ui-sdk/vue/primitive"
import { searchField } from "./search-field"

const parts = createParts(searchField, { input: "input", clear: "button" })

const SearchField = parts.Root
const SearchFieldInput = parts.Input
const SearchFieldClear = parts.Clear
</script>

<template>
  <SearchField>
    <SearchFieldInput placeholder="Search" />
    <SearchFieldClear>Clear</SearchFieldClear>
  </SearchField>
</template>
```

### Svelte

```svelte
<script lang="ts">
  import { createParts } from "@ui-sdk/svelte/primitive"
  import { searchField } from "./search-field"

  const parts = createParts(searchField, { input: "input", clear: "button" })

  const SearchField = parts.Root
  const SearchFieldInput = parts.Input
  const SearchFieldClear = parts.Clear
</script>

<SearchField>
  <SearchFieldInput placeholder="Search" />
  <SearchFieldClear>Clear</SearchFieldClear>
</SearchField>
```

### Solid

```tsx
import { createParts } from "@ui-sdk/solid/primitive"
import { searchField } from "./search-field"

const parts = createParts(searchField, { input: "input", clear: "button" })

const SearchField = parts.Root
const SearchFieldInput = parts.Input
const SearchFieldClear = parts.Clear

function Search() {
  return (
    <SearchField>
      <SearchFieldInput placeholder="Search" />
      <SearchFieldClear>Clear</SearchFieldClear>
    </SearchField>
  )
}

export { Search }
```

### Web Components

为每个 part 注册一个自定义元素：

```ts
import { createParts, wrappedButton, wrappedChild } from "@ui-sdk/web"
import { searchField } from "./search-field"

createParts(searchField, {
  root: "search-field",
  input: { tag: "search-field-input", target: wrappedChild("input") },
  clear: { tag: "search-field-clear", target: wrappedButton },
})
```

随后在 HTML 中使用它们：

```html
<search-field>
  <search-field-input><input placeholder="Search" /></search-field-input>
  <search-field-clear><button>Clear</button></search-field-clear>
</search-field>
```

## 参与贡献

我们欢迎任何形式的贡献。请参阅 [CONTRIBUTING.md](https://github.com/vercel-labs/ui/blob/main/CONTRIBUTING.md) 以了解如何在本地运行仓库并提交改动，并通过
[issues](https://github.com/vercel-labs/ui/issues) 反馈问题。参与贡献即表示你同意遵守我们的 [行为准则](https://github.com/vercel-labs/ui/blob/main/CODE_OF_CONDUCT.md)。

## 安全

请勿针对安全漏洞公开提交 issue。请改为遵循
[SECURITY.md](https://github.com/vercel-labs/ui/blob/main/SECURITY.md) 的说明，负责任地报告至
[responsible.disclosure@vercel.com](mailto:responsible.disclosure@vercel.com)。

## Beta 条款

UI SDK 目前处于 Beta 阶段，并受 [Vercel Beta 条款](https://vercel.com/docs/release-phases/public-beta-agreement) 约束；在正式发布之前，框架、API、文档与行为都可能发生变化。
