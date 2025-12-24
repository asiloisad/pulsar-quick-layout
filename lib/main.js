"use babel";

import Functions from "./functions";
import { CompositeDisposable } from "atom";

const ensurePanes = Functions.ensurePanes,
  ensureGrid = Functions.ensureGrid;

const ICONS = {
  left: '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="0.5" y="0.5" width="13" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1"/><path d="M5 0.5v13" stroke="currentColor" stroke-width="1"/></svg>',
  bottom: '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="0.5" y="0.5" width="13" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1"/><path d="M0.5 9h13" stroke="currentColor" stroke-width="1"/></svg>',
  right: '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="0.5" y="0.5" width="13" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1"/><path d="M9 0.5v13" stroke="currentColor" stroke-width="1"/></svg>',
  onepane: '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="0.5" y="0.5" width="13" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1"/></svg>',
  twocols: '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="0.5" y="0.5" width="13" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1"/><path d="M7 0.5v13" stroke="currentColor" stroke-width="1"/></svg>',
  threecols: '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="0.5" y="0.5" width="13" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1"/><path d="M5 0.5v13M9 0.5v13" stroke="currentColor" stroke-width="1"/></svg>',
  grid: '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="0.5" y="0.5" width="13" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1"/><path d="M7 0.5v13M0.5 7h13" stroke="currentColor" stroke-width="1"/></svg>',
};

function createButton(icon, title, onClick) {
  const btn = document.createElement("button");
  btn.classList.add("quick-layout-btn");
  btn.innerHTML = icon;
  btn.title = title;
  btn.addEventListener("click", onClick);
  return btn;
}

const layoutShortcuts = {
  subscriptions: null,
  tiles: [],

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "quick-layout:one-pane": () => ensurePanes(1, true),
        "quick-layout:two-columns": () => ensurePanes(2, true),
        "quick-layout:three-columns": () => ensurePanes(3, true),
        "quick-layout:four-columns": () => ensurePanes(4, true),
        "quick-layout:two-rows": () => ensurePanes(2, false),
        "quick-layout:three-rows": () => ensurePanes(3, false),
        "quick-layout:grid": () => ensureGrid(),
        "quick-layout:toggle-left-dock": () => atom.workspace.getLeftDock().toggle(),
        "quick-layout:toggle-right-dock": () => atom.workspace.getRightDock().toggle(),
        "quick-layout:toggle-bottom-dock": () => atom.workspace.getBottomDock().toggle(),
      })
    );
  },

  deactivate() {
    this.tiles.forEach((tile) => tile.destroy());
    this.tiles = [];
    this.subscriptions?.dispose();
  },

  consumeTitleBar(titleBar) {
    if (!titleBar) return;

    const buttons = [
      { icon: ICONS.left, title: "Toggle Left Dock", action: () => atom.workspace.getLeftDock().toggle(), priority: 10 },
      { icon: ICONS.bottom, title: "Toggle Bottom Dock", action: () => atom.workspace.getBottomDock().toggle(), priority: 11 },
      { icon: ICONS.right, title: "Toggle Right Dock", action: () => atom.workspace.getRightDock().toggle(), priority: 12 },
      { icon: ICONS.onepane, title: "1 Pane Layout", action: () => ensurePanes(1, true), priority: 20 },
      { icon: ICONS.twocols, title: "2 Columns Layout", action: () => ensurePanes(2, true), priority: 21 },
      { icon: ICONS.threecols, title: "3 Columns Layout", action: () => ensurePanes(3, true), priority: 22 },
      { icon: ICONS.grid, title: "Grid Layout", action: () => ensureGrid(), priority: 23 },
    ];

    buttons.forEach(({ icon, title, action, priority }) => {
      const btn = createButton(icon, title, action);
      const tile = titleBar.addItem({ item: btn, priority });
      this.tiles.push(tile);
    });
  },
};

export default layoutShortcuts;
