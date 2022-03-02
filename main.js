const {
  app,
  Menu,
  BrowserWindow,
  electron,
  dialog,
  shell,
} = require("electron");
const openAboutWindow = require("about-window").default;
const isMac = process.platform === "darwin";
const isOnline = require("is-online");
const Store = require("electron-store");
const store = new Store();

const app_menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideothers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  {
    label: "Application",
    submenu: [
      {
        label: "About 'RailwayApp - Electron'",
        click: () =>
          openAboutWindow({
            icon_path: `${__dirname}/icon.png`,
            product_name: "Railway.app - Electron",
            package_json_dir: __dirname,
            bug_report_url:
              "https://github.com/agam778/RailwayApp-Electron/issues",
            bug_link_text: "Report a bug",
            adjust_window_size: "2",
            show_close_button: "Close",
          }),
      },
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://railway.app/about");
        },
      },
      {
        label: "Open Home Page on Launch",
        type: "radio",
        click() {
          store.set("launchURL", "https://railway.app/");
          dialog.showMessageBox({
            type: "info",
            title: "Restart required",
            message: "You need to restart the app for changes to take effect",
            buttons: ["Ok"],
          });
        },
        checked: store.get("launchURL") === "https://railway.app/",
      },
      {
        label: "Open Dashboard on Launch",
        type: "radio",
        click() {
          store.set("launchURL", "https://railway.app/dashboard");
          dialog.showMessageBox({
            type: "info",
            title: "Restart required",
            message: "You need to restart the app for changes to take effect",
            buttons: ["Ok"],
          });
        },
        checked: store.get("launchURL") === "https://railway.app/dashboard",
      },
      { type: "separator" },
      {
        role: "quit",
        accelerator: process.platform === "darwin" ? "Ctrl+Q" : "Ctrl+Q",
      },
    ],
  },
  {
    label: "Navigation",
    submenu: [
      {
        label: "Back",
        click: () => {
          BrowserWindow.getFocusedWindow().webContents.goBack();
        },
      },
      {
        label: "Forward",
        click: () => {
          BrowserWindow.getFocusedWindow().webContents.goForward();
        },
      },
      {
        label: "Reload",
        click: () => {
          BrowserWindow.getFocusedWindow().webContents.reload();
        },
      },
      {
        label: "Home",
        click: () => {
          BrowserWindow.getFocusedWindow().loadURL(
            `${
              store.get("launchURL")
                ? store.get("launchURL")
                : "https://railway.app/"
            }`
          );
        },
      },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      ...(isMac
        ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
            },
          ]
        : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
    ],
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { type: "separator" },
      { role: "resetZoom" },
      {
        role: "zoomIn",
        accelerator: process.platform === "darwin" ? "Control+=" : "Control+=",
      },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
      {
        label: "Show Menu Bar",
        type: "radio",
        click: () => {
          store.set("autohide-menubar", "false");
          dialog.showMessageBoxSync({
            type: "info",
            title: "Menu Bar Settings",
            message:
              "Menu will be visible now. Please restart the app for changes to take effect.",
            buttons: ["OK"],
          });
        },
        checked: store.get("autohide-menubar") === "false",
      },
      {
        label: "Hide Menu Bar (Press ALT To show for some time)",
        type: "radio",
        click: () => {
          store.set("autohide-menubar", "true");
          dialog.showMessageBoxSync({
            type: "info",
            title: "Menu Bar Settings",
            message:
              "Menu bar will be automatically hidden now. Please restart the app for changes to take effect.",
            buttons: ["OK"],
          });
        },
        checked: store.get("autohide-menubar") === "true",
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(app_menu);
Menu.setApplicationMenu(menu);

function createWindow() {
  const win = new BrowserWindow({
    width: 1181,
    height: 670,
    icon: "./icon.png",
    webPreferences: {
      nodeIntegration: true,
      devTools: false,
    },
  });

  if (store.get("autohide-menubar") === "true") {
    win.setAutoHideMenuBar(true);
  } else {
    win.setAutoHideMenuBar(false);
  }

  win.loadURL(store.get("launchURL") || "https://railway.app", {
    userAgent:
      "Mozilla/5.0 (x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
  });
  var handleRedirect = function (e, url) {
    if (
      url.startsWith("https://docs.railway.app") ||
      url.startsWith("https://discord.gg") ||
      url.includes("up.railway.app") ||
      url.includes("https://github.com/railwayapp") ||
      url.includes("twitter.com") ||
      url.includes("notion.so") ||
      url.includes("feedback.railway.app") ||
      url.includes("blog.railway.app") ||
      url.includes("shop.railway.app")
    ) {
      shell.openExternal(url);
      e.preventDefault();
    }
  };
  win.webContents.on("will-navigate", handleRedirect);
  win.webContents.on("new-window", handleRedirect);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("ready", function () {
  isOnline().then((online) => {
    if (online) {
      console.log("You are connected to the internet!");
    } else {
      const options = {
        type: "warning",
        buttons: ["Ok"],
        defaultId: 2,
        title: "Warning",
        message: "You appear to be offline!",
        detail:
          "Please check your Internet Connectivity. This app cannot run without an Internet Connection!",
      };

      dialog.showMessageBox(null, options);
    }
  });
});
