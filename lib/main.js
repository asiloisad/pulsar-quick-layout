const { CompositeDisposable } = require("atom");

module.exports = {
  subscriptions: null,
  dockTile: null,
  layoutTile: null,
  titleBar: null,

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
    this.subscriptions.add(
      atom.config.observe("quick-layout.showDockButtons", (value) => {
        if (value) {
          this.addDockButtons();
        } else {
          this.removeDockButtons();
        }
      })
    );
    this.subscriptions.add(
      atom.config.observe("quick-layout.showLayoutButtons", (value) => {
        if (value) {
          this.addLayoutButtons();
        } else {
          this.removeLayoutButtons();
        }
      })
    );
  },

  deactivate() {
    this.removeDockButtons();
    this.removeLayoutButtons();
    this.subscriptions?.dispose();
  },

  addDockButtons() {
    if (!this.titleBar || this.dockTile) return;
    const dockGroup = document.createElement("span");
    dockGroup.classList.add("quick-layout", "quick-layout-toggles");
    DOCK_BUTTONS.forEach(({ icon, command }) => {
      dockGroup.appendChild(createButton(icon, command));
    });
    this.dockTile = this.titleBar.addItem({ item: dockGroup, priority: 10 });
  },

  removeDockButtons() {
    this.dockTile?.destroy();
    this.dockTile = null;
  },

  addLayoutButtons() {
    if (!this.titleBar || this.layoutTile) return;
    const layoutGroup = document.createElement("span");
    layoutGroup.classList.add("quick-layout", "quick-layout-layouts");
    LAYOUT_BUTTONS.forEach(({ icon, command }) => {
      layoutGroup.appendChild(createButton(icon, command));
    });
    this.layoutTile = this.titleBar.addItem({ item: layoutGroup, priority: 20 });
  },

  removeLayoutButtons() {
    this.layoutTile?.destroy();
    this.layoutTile = null;
  },

  consumeTitleBar(titleBar) {
    if (!titleBar) return;
    this.titleBar = titleBar;
    if (atom.config.get("quick-layout.showDockButtons")) {
      this.addDockButtons();
    }
    if (atom.config.get("quick-layout.showLayoutButtons")) {
      this.addLayoutButtons();
    }
  },
};

function getPanes() {
  const allPanes = atom.workspace.getCenter().getPanes(),
    panesFilter = (prop, name) =>
      allPanes.filter(
        (x) =>
          x[prop] && x[prop].constructor && x[prop].constructor.name === name
      );
  let panes = panesFilter("parent", "PaneAxis");
  if (!panes.length) panes = panesFilter("activeItem", "TextEditor");
  return panes;
}

function getOrientationPanes(horizontal) {
  const panes = getPanes(),
    orientation = horizontal ? "horizontal" : "vertical";
  return panes.filter(
    (x) => (x.parent.orientation || orientation) === orientation
  );
}

async function addUntilNPanes(n, horizontal) {
  let panes = getOrientationPanes(horizontal),
    paneCount = panes.length;

  // If no oriented panes, use the active pane to split from
  if (paneCount === 0) {
    const activePane = atom.workspace.getCenter().getActivePane();
    if (activePane) {
      if (horizontal) activePane.splitRight({ copyActiveItem: false });
      else activePane.splitDown({ copyActiveItem: false });
      panes = getOrientationPanes(horizontal);
      paneCount = panes.length;
    }
    if (paneCount === 0) return;
  } else {
    if (horizontal) panes.slice(-1)[0].splitRight({ copyActiveItem: false });
    else panes.slice(-1)[0].splitDown({ copyActiveItem: false });
  }

  if (paneCount + 1 < n) {
    try {
      await addUntilNPanes(n, horizontal);
    } catch (err) {
      return;
    }
  }
  return;
}

function mergeTwoPanes(lastPane, secondToLastPane) {
  const lastPaneItems = lastPane.getItems();
  for (const item of Array.from(lastPaneItems)) {
    lastPane.moveItemToPane(item, secondToLastPane);
  }
  lastPane.destroy();
}

function mergeUntilNPanes(n, horizontal) {
  const result = [];
  let panes = getOrientationPanes(horizontal);
  while (panes.length > n) {
    mergeTwoPanes(panes.slice(-1)[0], panes.slice(-2)[0]);
    result.push((panes = getOrientationPanes(horizontal)));
  }
  return;
}

async function ensurePanes(n, horizontal) {
  const revPaneCount = getOrientationPanes(!horizontal).length;
  let paneCount = getOrientationPanes(horizontal).length;
  if (
    (revPaneCount > 0 && paneCount > 1) ||
    (revPaneCount > 1 && paneCount > 0) ||
    (!horizontal && paneCount >= 4 && paneCount % 2 === 0)
  ) {
    let panes = getPanes();
    while (panes.length > 1) {
      mergeTwoPanes(panes.slice(-1)[0], panes.slice(-2)[0]);
      panes = getPanes();
    }
  } else if (revPaneCount > 1) {
    mergeUntilNPanes(1, !horizontal);
  }
  paneCount = getOrientationPanes(horizontal).length;
  if (paneCount < n && n > 1) await addUntilNPanes(n, horizontal);
  else if (paneCount > n) mergeUntilNPanes(n, horizontal);
  return;
}

function ensureGrid() {
  ensurePanes(2, true)
    .then(() => {
      const panes = getPanes();
      Array.from(panes).map((item) => item.splitDown());
    })
    .catch((err) => {});
}

const ICONS = {
  left: '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="0.5" y="0.5" width="13" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1"/><path d="M5 0.5v13" stroke="currentColor" stroke-width="1"/></svg>',
  bottom: '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="0.5" y="0.5" width="13" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1"/><path d="M0.5 9h13" stroke="currentColor" stroke-width="1"/></svg>',
  right: '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="0.5" y="0.5" width="13" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1"/><path d="M9 0.5v13" stroke="currentColor" stroke-width="1"/></svg>',
  onepane: '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="0.5" y="0.5" width="13" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1"/></svg>',
  twocols: '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="0.5" y="0.5" width="13" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1"/><path d="M7 0.5v13" stroke="currentColor" stroke-width="1"/></svg>',
  threecols: '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="0.5" y="0.5" width="13" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1"/><path d="M5 0.5v13M9 0.5v13" stroke="currentColor" stroke-width="1"/></svg>',
  grid: '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="0.5" y="0.5" width="13" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1"/><path d="M7 0.5v13M0.5 7h13" stroke="currentColor" stroke-width="1"/></svg>',
};

function createButton(icon, command) {
  const btn = document.createElement("button");
  btn.classList.add("inline-block");
  btn.innerHTML = icon;
  btn.addEventListener("click", () => {
    atom.commands.dispatch(atom.views.getView(atom.workspace), command);
  });
  return btn;
}

const DOCK_BUTTONS = [
  { icon: ICONS.left, command: "quick-layout:toggle-left-dock" },
  { icon: ICONS.bottom, command: "quick-layout:toggle-bottom-dock" },
  { icon: ICONS.right, command: "quick-layout:toggle-right-dock" },
];

const LAYOUT_BUTTONS = [
  { icon: ICONS.onepane, command: "quick-layout:one-pane" },
  { icon: ICONS.twocols, command: "quick-layout:two-columns" },
  { icon: ICONS.threecols, command: "quick-layout:three-columns" },
  { icon: ICONS.grid, command: "quick-layout:grid" },
];
