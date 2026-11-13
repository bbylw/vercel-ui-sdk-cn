import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import nimbus, {
  defineConfig as defineNimbusConfig,
} from "@cloudflare/nimbus-docs";
import { tableScroll } from "@cloudflare/nimbus-docs/markdown";

const nimbusConfig = defineNimbusConfig({
  site: "https://ui-sdk.dev",
  title: "UI SDK",
  description:
    "面向智能体时代的界面行为库：键盘导航、焦点管理、选择、弹出层与 ARIA 语义，一次编写，五个框架通用。",
  locale: "zh-CN",
  github: "https://github.com/vercel-labs/ui",
  socialImageAlt: "UI SDK — 界面行为，而非样式",
  sidebar: {
    items: [
      { label: "快速开始", autogenerate: { directory: "docs/getting-started" } },
      { label: "核心概念", autogenerate: { directory: "docs/concepts" } },
      { label: "组件", autogenerate: { directory: "docs/components" } },
      { label: "智能体", autogenerate: { directory: "docs/agents" } },
      { label: "框架适配", link: "/docs/frameworks" },
      { label: "行为与自定义组件", link: "/docs/core" },
    ],
  },
});

export default defineConfig({
  output: "static",
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  integrations: [
    react(),
    nimbus(nimbusConfig, {
      rules: {
        "nimbus/frontmatter-shape": "error",
        "nimbus/internal-link": "error",
      },
      markdown: {
        hastPlugins: [tableScroll()],
        features: { headingAttributes: true },
      },
    }),
  ],
});