import {resolve, join} from "path";
import {
    shell,
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain,
    Tray,
    BrowserWindowConstructorOptions, Menu
} from "electron";
import * as Socket from "socket.io-client";
import Log from "../lib/log";
import ico from "../assets/icon.ico";
import {IPC_MSG_TYPE, SOCKET_MSG_TYPE, WindowOpt} from "@/lib/interface";
import {Update} from "./update";

const config = require("../lib/cfg/config.json");

declare global {
    namespace NodeJS {
        interface Global {
            sharedObject: { [key: string]: unknown }
        }
    }
}

global.sharedObject = {};

class Main {
    private static instance: Main;

    private mainWin: BrowserWindow = null; //当前主页
    private windows: { [id: number]: WindowOpt } = {}; //窗口组
    private appTray: Tray = null; //托盘
    private socket: SocketIOClient.Socket = null; //socket

    static getInstance() {
        if (!Main.instance) Main.instance = new Main();
        return Main.instance;
    }

    constructor() {
    }

    /**
     * 窗口配置
     * */
    browserWindowOpt(wh: number[]): BrowserWindowConstructorOptions {
        return {
            width: wh[0],
            height: wh[1],
            transparent: true,
            autoHideMenuBar: true,
            resizable: false,
            maximizable: false,
            frame: false,
            show: false,
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true,
                devTools: !app.isPackaged,
                webSecurity: false,
                enableRemoteModule: true
            }
        }
    }

    /**
     * 创建窗口
     * */
    createWindow(args: WindowOpt) {
        try {
            for (let i in this.windows) {
                if (this.windows[i] &&
                    this.windows[i].route === args.route &&
                    !this.windows[i].isMultiWindow) {
                    BrowserWindow.fromId(Number(i)).focus();
                    return;
                }
            }
            let opt = this.browserWindowOpt([args.width, args.height]);
            if (args.parentId) {
                opt.parent = BrowserWindow.fromId(args.parentId);
                opt.x = parseInt((BrowserWindow.fromId(args.parentId).getPosition()[0] + ((BrowserWindow.fromId(args.parentId).getBounds().width - args.width) / 2)).toString());
                opt.y = parseInt((BrowserWindow.fromId(args.parentId).getPosition()[1] + ((BrowserWindow.fromId(args.parentId).getBounds().height - args.height) / 2)).toString());
            } else if (this.mainWin) {
                opt.x = parseInt((this.mainWin.getPosition()[0] + ((this.mainWin.getBounds().width - args.width) / 2)).toString());
                opt.y = parseInt((this.mainWin.getPosition()[1] + ((this.mainWin.getBounds().height - args.height) / 2)).toString());
            }
            opt.modal = args.modal || false;
            opt.resizable = args.resizable || false;
            let win = new BrowserWindow(opt);
            this.windows[win.id] = {
                route: args.route,
                isMultiWindow: args.isMultiWindow
            };
            // //window加载完毕后显示
            win.once("ready-to-show", () => win.show());
            //默认浏览器打开跳转连接
            win.webContents.on("new-window", async (event, url) => {
                event.preventDefault();
                await shell.openExternal(url);
            });
            // 打开开发者工具
            if (!app.isPackaged) win.webContents.openDevTools();
            //注入初始化代码
            win.webContents.on("did-finish-load", () => {
                args.id = win.id;
                win.webContents.send("window-load", args);
            });
            if (!app.isPackaged) win.loadURL(`http://localhost:${config.appPort}`).catch(err => Log.error(err));
            else win.loadFile(join(__dirname, "./index.html")).catch(err => Log.error(err));
            if (args.isMainWin) { //是否主窗口
                if (this.mainWin) {
                    delete this.windows[this.mainWin.id];
                    this.mainWin.close();
                }
                this.mainWin = win;
            }
        } catch (e) {
            Log.error(e.toString())
        }
    }

    /**
     * 关闭所有窗口
     */
    closeAllWindow() {
        for (let i in this.windows) if (this.windows[i]) BrowserWindow.fromId(Number(i)).close();
    }

    /**
     * 创建托盘
     * */
    async createTray() {
        try {
            const contextMenu = Menu.buildFromTemplate([{
                label: "显示",
                click: () => {
                    for (let i in this.windows) if (this.windows[i]) BrowserWindow.fromId(Number(i)).show();
                }
            }, {
                label: "退出",
                click: () => {
                    app.quit();
                }
            }]);
            this.appTray = new Tray(join(__dirname, `./${ico}`));
            this.appTray.setContextMenu(contextMenu);
            this.appTray.setToolTip(app.name);
            this.appTray.on("double-click", () => {
                for (let i in this.windows) if (this.windows[i]) BrowserWindow.fromId(Number(i)).show();
            })
        } catch (e) {
            Log.error(e);
        }
    }

    /**
     * 创建Socket
     * */
    async createSocket() {
        this.socket = Socket.connect(config.socketUrl, {query: `Authorization=${global.sharedObject["Authorization"]}`});
        this.socket.on("connect", () => Log.info("[Socket]connect"));
        // @ts-ignore
        this.socket.on("message", data => {
            if (data.type === SOCKET_MSG_TYPE.ERROR) {
                this.createWindow({
                    route: "/message",
                    isMainWin: true,
                    data: {
                        title: "提示",
                        text: data.value
                    },
                });
                setTimeout(() => {
                    this.closeAllWindow();
                }, 10000)
            }
            for (let i in this.windows) if (this.windows[i]) BrowserWindow.fromId(Number(i)).webContents.send("message-back", data);
        });
        // @ts-ignore
        this.socket.on("error", msg => {
            Log.info(`[Socket]error ${msg.toString()}`);
        });
        this.socket.on("disconnect", () => {
            Log.info("[Socket]disconnect");
            setTimeout(() => {
                if (this.socket && this.socket.io.readyState === "closed") this.socket.open()
            }, 1000 * 60 * 3)
        });
        this.socket.on("close", () => {
            Log.info("[Socket]close");
        });
    }

    /**
     * 初始化并加载
     * */
    async init() {
        app.allowRendererProcessReuse = true;
        if (!app.requestSingleInstanceLock()) {
            app.quit();
        } else {
            app.on("second-instance", () => {
                // 当运行第二个实例时,将会聚焦到myWindow这个窗口
                if (this.mainWin) {
                    if (this.mainWin.isMinimized()) this.mainWin.restore();
                    this.mainWin.focus();
                }
            })
        }
        app.whenReady().then(() => {
            this.createWindow({isMainWin: true, width: 0, height: 0});
            this.createTray();
        });
        app.on("window-all-closed", () => {
            if (process.platform !== "darwin") {
                app.quit();
            }
        })
        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createWindow({isMainWin: true, width: 0, height: 0});
            }
        })
        //获得焦点时发出
        app.on("browser-window-focus", () => {
            //关闭刷新
            globalShortcut.register("CommandOrControl+R", () => {
            });
        });
        //失去焦点时发出
        app.on("browser-window-blur", () => {
            // 注销关闭刷新
            globalShortcut.unregister("CommandOrControl+R");
        });
        //协议调起
        let args = [];
        if (!app.isPackaged) args.push(resolve(process.argv[1]));
        args.push("--");
        app.setAsDefaultProtocolClient(app.name, process.execPath, args);
    }

    async ipc() {
        /**
         * 主体
         * */
        //关闭
        ipcMain.on("closed", (event, winId) => {
            if (winId) {
                BrowserWindow.fromId(Number(winId)).close();
                if (this.windows[Number(winId)]) delete this.windows[Number(winId)];
            } else {
                for (let i in this.windows) if (this.windows[i]) BrowserWindow.fromId(Number(i)).close();
            }
        });
        //隐藏
        ipcMain.on("hide", (event, winId) => {
            if (winId) {
                BrowserWindow.fromId(Number(winId)).hide();
            } else {
                for (let i in this.windows) if (this.windows[i]) BrowserWindow.fromId(Number(i)).hide();
            }
        });
        //显示
        ipcMain.on("show", (event, winId) => {
            if (winId) {
                BrowserWindow.fromId(Number(winId)).show();
            } else {
                for (let i in this.windows) if (this.windows[i]) BrowserWindow.fromId(Number(i)).show();
            }
        });
        //最小化
        ipcMain.on("mini", (event, winId) => {
            if (winId) {
                BrowserWindow.fromId(Number(winId)).minimize();
            } else {
                for (let i in this.windows) if (this.windows[i]) BrowserWindow.fromId(Number(i)).minimize();
            }
        });
        //复原
        ipcMain.on("restore", (event, winId) => {
            if (winId) {
                BrowserWindow.fromId(Number(winId)).restore();
            } else {
                for (let i in this.windows) if (this.windows[i]) BrowserWindow.fromId(Number(i)).restore();
            }
        });
        //重载
        ipcMain.on("reload", (event, winId) => {
            if (winId) {
                BrowserWindow.fromId(Number(winId)).reload();
            } else {
                for (let i in this.windows) if (this.windows[i]) BrowserWindow.fromId(Number(i)).reload();
            }
        });
        //重启
        ipcMain.on("relaunch", () => {
            app.relaunch({args: process.argv.slice(1)});
        });
        //创建窗口
        ipcMain.on("window-new", (event, args) => this.createWindow(args));
        /**
         * socket
         * */
        //初始化
        ipcMain.on("socket-init", async () => {
            if (!this.socket) await this.createSocket();
        });
        //重新连接
        ipcMain.on("socket-reconnection", async () => {
            if (this.socket && this.socket.io.readyState === "closed") this.socket.open();
        });

        /**
         * 检查更新
         * */
        ipcMain.on("update", (event, winId) => new Update(winId));

        /**
         * 全局变量赋值
         */
        ipcMain.on("global-sharedObject", (event, args) => global.sharedObject[args.key] = args.value);

        /**
         * 消息反馈
         */
        ipcMain.on("message-send", (event, args) => {
            switch (args.type) {
                case IPC_MSG_TYPE.WIN:
                    for (let i in this.windows) if (this.windows[i]) BrowserWindow.fromId(Number(i)).webContents.send("message-back", args);
                    break;
                case IPC_MSG_TYPE.SOCKET:
                    if (this.socket && this.socket.io.readyState === "open") this.socket.send(args);
                    break;
            }
        });
    }

}

/**
 * 启动
 * */
(async () => {
    await Main.getInstance().ipc();
    await Main.getInstance().init();
})()
