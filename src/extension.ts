import * as chokidar from "chokidar";
import * as fs from "fs";
import * as Mustache from "mustache";
import * as os from "os";
import * as path from "path";
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
  const filepath = mode === "theme" ? themePath() : colorsPath();

  watcher?.close();
  watcher = chokidar.watch(filepath).on("change", callback);
  callback();
}

/** Load base16 colors at "dynamic-base16-vscode.colors-path" and generate a theme from "theme.mustache" */
function loadColors() {
  const filepath = colorsPath();

  const colors = JSON.parse(fs.readFileSync(filepath, "utf8"));
  const template = fs.readFileSync(
    path.join(__dirname, "..", "templates", "theme.mustache"),
    "utf8"
  );
  const theme = Mustache.render(template, colors);
  writeTheme(theme);

  console.log("Dynamic Base16 theme loaded from colors.");
}

/** Load the theme at "dynamic-base16-vscode.theme-path" */
function loadTheme() {
  const filepath = themePath();
  const theme = fs.readFileSync(filepath, "utf8");
  writeTheme(theme);

  console.log("Dynamic Base16 theme loaded from theme.");
}

// ********************************************************************************************* //
//                                            HELPERS                                            //
// ********************************************************************************************* //

function colorsPath(): string {
  return resolveHome(
    vscode.workspace
      .getConfiguration("dynamic-base16-vscode")
      .get("colors-path")!
  );
}

function themePath(): string {
  return resolveHome(
    vscode.workspace
      .getConfiguration("dynamic-base16-vscode")
      .get("theme-path")!
  );
}

function extensionMode(): "theme" | "colors" {
  return vscode.workspace
    .getConfiguration("dynamic-base16-vscode")
    .get("mode")!;
}

/** Write the theme to the extension's themes folder */
function writeTheme(theme: object | string) {
  fs.writeFileSync(
    path.join(__dirname, "..", "themes", "dynamic-base16.json"),
    typeof theme === "string" ? theme : JSON.stringify(theme, null, 2)
  );
}

/** Resolve "~" into the actual home path */
function resolveHome(filepath: string): string {
  if (filepath[0] === "~") {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath;
}
