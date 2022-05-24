import { app, BrowserWindow, session, dialog } from "electron";
// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
import path from "path";

/**
 * Change this to match the protocol you want to use. Make sure to change the same
 * variable inside api-server/index.js as well
 */
const deeplinkProtocol = "supertokens-demo";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    // eslint-disable-line global-require
    app.quit();
}

let mainWindow: BrowserWindow | undefined;

const createWindow = (): void => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    mainWindow.maximize();

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(deeplinkProtocol, process.execPath, [path.resolve(process.argv[1])]);
    }
} else {
    app.setAsDefaultProtocolClient(deeplinkProtocol);
}

app.on("open-url", (event, url) => {
    mainWindow?.focus();
    /**
     * Depending on whether or not the application is running in production mode,
     * we modify the incoming URL.
     */
    if (app.isPackaged) {
        /**
         * In production mode we get the full path of where the app is running and replace
         * the deeplink protocol with a file protocol
         */
        const finalUrl = url.replace(
            `${deeplinkProtocol}://`,
            "file://" + __dirname + "/../renderer/main_window/index.html#/"
        );
        BrowserWindow.getFocusedWindow().loadURL(finalUrl);
    } else {
        /**
         * In development the app uses a webpack server on localhost
         */
        const finalUrl = url.replace(`${deeplinkProtocol}://`, "http://localhost:3000/main_window#/");
        BrowserWindow.getFocusedWindow().loadURL(finalUrl);
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        console.log("headers received", details.url);
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                "Content-Security-Policy": [
                    "style-src-elem 'unsafe-inline' *",
                    "style-src 'self' 'unsafe-inline' *",
                    `default-src 'self' 'unsafe-eval' 'unsafe-inline' *`,
                    `connect-src 'self' 'unsafe-eval' *`,
                ].join(";"),
            },
        });
    });

    createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
