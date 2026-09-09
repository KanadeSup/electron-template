import path from "node:path";
import { IpcResponseStatusCodes } from "@shared/ipc-channel/channel-status.constant";
import type { IpcChannelResponse } from "@shared/ipc-channel/ipc-channel.type";
import { app, BrowserWindow, ipcMain } from "electron";
import log from "electron-log/main";
import started from "electron-squirrel-startup";
import {
  changeAIModelPositionChannel,
  changeAIProviderPositionChannel,
  deleteAIModelChannel,
  getAIModelsChannel,
  getAIProvidersChannel,
  updateAIModelChannel,
  updateAIProviderChannel,
} from "./modules/ai-model/ai-model.channel";
import {
  checkAPIKeyChannel,
  fetchModelByProviderChannel,
} from "./modules/ai-model/ai-provider.channel";
import { BaseError } from "./modules/common/errors/base.error";
import type { BaseChannel } from "./modules/common/ipc-channel/base-channel";
import { sqliteDatabase } from "./modules/database/sqlite-database";
import { sayHelloChannel } from "./modules/hello/hello.channel";

// Initialize the logger to be available in renderer process
log.initialize();

log.transports.console.format = "%c[{processType}] {h}:{i}:{s} [{level}] [{scope}]%c > {text}";
log.transports.file.format = "%c[{processType}] {h}:{i}:{s} [{level}] [{scope}]%c > {text}";
log.transports.file.level = "debug";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

class Main {
  // biome-ignore lint/suspicious/noExplicitAny: ipcChannels is a list of channels that will be registered
  public init(ipcChannels?: BaseChannel<any, any>[]): void {
    this.overrideAppDataPath();

    app.whenReady().then(async () => {
      this.onReady();
    });

    app.on("window-all-closed", this.onWindowAllClosed.bind(this));
    app.on("activate", this.onActivate.bind(this));

    // Initialize the database
    sqliteDatabase.init();

    // Register IPC channels
    this.registerIpcChannels(ipcChannels ?? []);
  }

  private onReady(): void {
    this.createWindow();
  }

  private onWindowAllClosed(): void {
    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    if (process.platform !== "darwin") {
      app.quit();
    }
  }

  private onActivate(): void {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createWindow();
    }
  }

  /** This change the default path where electron stores its data and application data
   * (only for linux)
   */
  private overrideAppDataPath() {
    if (process.platform !== "linux") return;
    const dataPath = path.join(app.getPath("home"), ".data");
    app.setPath("appData", dataPath);
  }

  private createWindow(): void {
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
      autoHideMenuBar: true,
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
      mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }
  }

  private registerIpcChannels(ipcChannels: BaseChannel<unknown, unknown>[]): void {
    ipcChannels.forEach((channel) => {
      ipcMain.handle(channel.name, async (_, request): Promise<IpcChannelResponse<unknown>> => {
        try {
          return {
            success: true,
            data: await channel.handle(request),
          };
        } catch (error) {
          if (error instanceof BaseError) {
            if (error.statusCode === IpcResponseStatusCodes.INTERNAL_ERROR) {
              log.error(`Internal error caused by channel: [${channel.name}]`);
              log.error(error.stack);
              log.error("----------------------------");
            }
            return {
              data: null,
              success: false,
              statusCode: error.statusCode,
              errorCode: error.errorCode,
              errorMessage: error.message,
            };
          }

          // unexpected error
          log.error(`Unexpected internal error caused by channel: [${channel.name}]`);
          if (error instanceof Error) {
            log.error(error.stack);
          }
          log.error("----------------------------");
          return {
            data: null,
            success: false,
            statusCode: IpcResponseStatusCodes.INTERNAL_ERROR,
            errorMessage: "Unexpected internal error happened",
          };
        }
      });
    });
  }
}

new Main().init([
  sayHelloChannel,
  getAIModelsChannel,
  getAIProvidersChannel,
  updateAIProviderChannel,
  changeAIProviderPositionChannel,
  updateAIModelChannel,
  changeAIModelPositionChannel,
  deleteAIModelChannel,
  checkAPIKeyChannel,
  fetchModelByProviderChannel,
]);
