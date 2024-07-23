import * as chokidar from "chokidar";
import * as vscode from "vscode";

let watcher: chokidar.FSWatcher | undefined;

export function activate(context: vscode.ExtensionContext) {
  // Start the watcher
  restartWatcher();

  // Register config watcher
  const configListener = vscode.workspace.onDidChangeConfiguration((e) => {
    if (!e.affectsConfiguration("dynamic-base16-vscode")) {
      return;
    }

    // Restart the watcher
    restartWatcher();
  });

  context.subscriptions.push(configListener);
}

export function deactivate() {
  watcher?.close();
}

// ********************************************************************************************* //
//                                          PROCESSING                                           //
// ********************************************************************************************* //

/** Start a watcher and register the correct callback to dynamically update the theme */
function restartWatcher() {
  const mode = extensionMode();
  const callback = mode === "theme" ? loadTheme : loadColors;
  const path = mode === "theme" ? themePath() : colorsPath();

  watcher?.close();
  watcher = chokidar.watch(path).on("change", callback);
}

/** Load base16 colors at "dynamic-base16-vscode.colors-path" and generate a theme from "theme.mustache" */
function loadColors() {
  const path = colorsPath();
  // TODO
}

/** Load the theme at "dynamic-base16-vscode.theme-path" */
function loadTheme() {
  const path = themePath();
  // TODO
}

// ********************************************************************************************* //
//                                            HELPERS                                            //
// ********************************************************************************************* //

function colorsPath(): string {
  return vscode.workspace
    .getConfiguration("dynamic-base16-vscode")
    .get("colors-path")!;
}

function themePath(): string {
  return vscode.workspace
    .getConfiguration("dynamic-base16-vscode")
    .get("theme-path")!;
}

function extensionMode(): "theme" | "colors" {
  return vscode.workspace
    .getConfiguration("dynamic-base16-vscode")
    .get("mode")!;
}
