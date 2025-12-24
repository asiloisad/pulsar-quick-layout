"use babel";

import Functions from "./functions";
import { CompositeDisposable } from "atom";

const ensurePanes = Functions.ensurePanes,
  ensureGrid = Functions.ensureGrid;

const layoutShortcuts = {
  subscriptions: null,
  activate() {
    // Activates and restores the previous session of your package.
    this.subscriptions = new CompositeDisposable();
    return this.subscriptions.add(
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
    return this.subscriptions.dispose();
  },
};

export default layoutShortcuts;
