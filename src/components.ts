/**
 * MDX globals registry — components available inside MDX without `import`.
 * Wired via `<Content components={components} />` in `[...slug].astro`.
 * Add new components here as you build (or install) them.
 */

import { Aside } from "./components/ui/aside";
import Render from "./components/Render.astro";
import { Card } from "./components/ui/card";
import { CardGrid } from "./components/ui/card-grid";
import { PackageManagers } from "./components/ui/package-managers";
import { Step, Steps } from "./components/ui/steps";
import { Tabs, TabItem } from "./components/ui/tabs";
import Playground from "./components/demos/Playground.astro";
import FrameworkTabs from "./components/demos/FrameworkTabs.astro";
import ComponentCatalog from "./components/demos/ComponentCatalog.astro";
import BehaviorDemos from "./components/demos/BehaviorDemos.astro";
import CopyCommand from "./components/demos/CopyCommand.astro";
import DocDemo from "./components/demos/DocDemo.astro";

export const components = {
  Aside,
  BehaviorDemos,
  Card,
  CardGrid,
  ComponentCatalog,
  CopyCommand,
  DocDemo,
  FrameworkTabs,
  PackageManagers,
  Playground,
  Render,
  Step,
  Steps,
  TabItem,
  Tabs,
};
