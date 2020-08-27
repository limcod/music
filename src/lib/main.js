'use strict';
const {resolve} = require('path');
const {existsSync, readdirSync, statSync, unlinkSync, rmdirSync} = require('fs');
const {shell, app, BrowserWindow, globalShortcut, ipcMain, screen, Tray} = require('electron');
const config = require('./static/cfg/config.json');

class main {
    static getInstance() {
        if (!main.instance) main.instance = new main();
        return main.instance;
    }

    constructor() {
        this.win = null; //主窗口
        this.dialogs = []; //弹框组
        this.is_Dialogs = []; //弹框组状态
        this.appTray = null;//托盘
        this.menu = null; //托盘窗口
    }

    /**
     * 删除目录和内部文件
     * */
    delDir(path) {
        let files = [];
        if (existsSync(path)) {
            files = readdirSync(path);
            files.forEach((file, index) => {
                let curPath = path + "/" + file;
                if (statSync(curPath).isDirectory()) {
                    this.delDir(curPath); //递归删除文件夹
                } else {
                    unlinkSync(curPath); //删除文件
                }
            });
            rmdirSync(path);
        }
    }

    /**
     * 窗口参数
     * */
    browserWindowOpt(wh) {
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
                nodeIntegration: true,
                devTools: !app.isPackaged,
                webSecurity: false
            }
        }
    }

    /**
     * 创建主窗口
     * */
    async createWindow() {
        this.win = new BrowserWindow(this.browserWindowOpt(config.appSize));
        //加载完毕后显示
        this.win.once('ready-to-show', () => this.win.show());
        //关闭后，这个事件会被触发。
        this.win.on('closed', () => this.win = null);
        //默认浏览器打开跳转连接
        this.win.webContents.on('new-window', (event, url, frameName, disposition, options) => {
            event.preventDefault();
            shell.openExternal(url);
        });
        // 打开开发者工具
        if (!app.isPackaged) this.win.webContents.openDevTools();
        //注入初始化代码
        this.win.webContents.on("did-finish-load", () => {
            this.win.webContents.send('dataJsonPort', encodeURIComponent(JSON.stringify({el: 'app'})));
        });
        // 加载index.html文件
        await this.win.loadFile(resolve(__dirname, '../index.html'));
    }

    /**
     * 创建主托盘
     * */
    async createTray() {
        this.appTray = new Tray(resolve(__dirname, './static/icon/icon.ico'));
        this.appTray.setToolTip(app.name);
        let menu_point = null;
        this.appTray.on('mouse-move', (e, p) => menu_point = p);
        this.appTray.on('double-click', () => {
            for (let i of this.dialogs) if (i) i.show();
            this.win.show();
        })
        this.appTray.on('right-click', async (e, b) => {
            if (!menu_point) menu_point = b;
            if (this.menu) {
                this.menu.show();
                return;
            }
            // 创建浏览器窗口。
            let opt = this.browserWindowOpt(config.menuSize);
            opt.x = menu_point.x - 12;
            if ((opt.x + 300) > screen.getPrimaryDisplay().workAreaSize.width) opt.x = menu_point.x - (config.menuSize[0] - 13);
            opt.y = menu_point.y - (config.menuSize[1] - 13);
            this.menu = new BrowserWindow(opt);
            //window 加载完毕后显示
            this.menu.once('ready-to-show', () => this.menu.show());
            // 当 window 被关闭，这个事件会被触发。
            this.menu.on('closed', () => this.menu = null);
            //默认浏览器打开跳转连接
            this.menu.webContents.on('new-window', (event, url, frameName, disposition, options) => {
                event.preventDefault();
                shell.openExternal(url);
            });
            // 打开开发者工具
            if (!app.isPackaged) this.menu.webContents.openDevTools();
            //隐藏menu任务栏状态
            this.menu.setSkipTaskbar(true);
            //menu最顶层
            this.menu.setAlwaysOnTop(true, 'screen-saver');
            //注入初始化代码
            this.menu.webContents.on("did-finish-load", () => {
                this.menu.webContents.send('dataJsonPort', encodeURIComponent(JSON.stringify({el: 'menu'})));
            });
            // 加载index.html文件
            await this.menu.loadFile(resolve(__dirname, '../index.html'));
        })
    }

    /**
     * 创建弹框
     * */
    async createDialog(args) {
        let id = this.dialogs.length;
        for (let i of this.dialogs) {
            if (i && i.uniquekey === args.v && !i.complex) {
                i.focus();
                return;
            }
        }
        //创建一个与父类窗口同大小、坐标的窗口
        let opt = this.browserWindowOpt([args.width, args.height]);
        if (typeof args.parent === 'string') {
            if (args.parent === 'win') opt.parent = this.win;
            opt.x = this.win.getPosition()[0] //+ ((this.win.getBounds().width - args.width) / 2);
            opt.y = this.win.getPosition()[1] //+ ((this.win.getBounds().height - args.height) / 2);
        } else if (typeof args.parent === 'number') {
            opt.parent = this.dialogs[args.parent];
            opt.x = this.dialogs[args.parent].getPosition()[0] //+ ((this.dialogs[args.parent].getBounds().width - args.width) / 2);
            opt.y = this.dialogs[args.parent].getPosition()[1] //+ ((this.dialogs[args.parent].getBounds().height - args.height) / 2);
        }
        opt.modal = args.modal;
        opt.resizable = args.resizable;
        this.dialogs[id] = new BrowserWindow(opt);
        this.dialogs[id].uniquekey = args.v;
        this.dialogs[id].complex = args.complex;
        //window加载完毕后显示
        this.dialogs[id].once('ready-to-show', () => this.dialogs[id].show());
        //window被关闭，这个事件会被触发。
        this.dialogs[id].on('closed', () => this.dialogs[id] = null);
        //默认浏览器打开跳转连接
        this.dialogs[id].webContents.on('new-window', (event, url, frameName, disposition, options) => {
            event.preventDefault();
            shell.openExternal(url);
        });
        // 打开开发者工具
        if (!app.isPackaged) this.dialogs[id].webContents.openDevTools();
        //注入初始化代码
        this.dialogs[id].webContents.on("did-finish-load", () => {
            args.id = id;
            this.dialogs[id].webContents.send('dataJsonPort', encodeURIComponent(JSON.stringify({
                el: 'dialog',
                data: args
            })));
        });
        await this.dialogs[id].loadFile(resolve(__dirname, '../index.html'));
        this.is_Dialogs[id] = true;
    }

    /**
     * 初始化加载
     * */
    async init() {
        app.allowRendererProcessReuse = true;
        if (!app.requestSingleInstanceLock()) {
            app.quit();
        } else {
            app.on('second-instance', (event, argv, workingDirectory) => {
                // 当运行第二个实例时,将会聚焦到myWindow这个窗口
                if (this.win) {
                    if (this.win.isMinimized()) this.win.restore();
                    this.win.focus();
                }
            })
        }
        app.whenReady().then(() => {
            this.createWindow();
            this.createTray();
        });
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        })
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createWindow();
            }
        })
        //获得焦点时发出
        app.on('browser-window-focus', () => {
            //关闭刷新
            globalShortcut.register('CommandOrControl+R', () => {
            });
        });
        //失去焦点时发出
        app.on('browser-window-blur', () => {
            // 注销快捷键
            globalShortcut.unregister('CommandOrControl+R');
        });
        //协议调起
        let args = [];
        if (!app.isPackaged) args.push(resolve(process.argv[1]));
        args.push('--');
        app.setAsDefaultProtocolClient(app.name, process.execPath, args);
    }

    /**
     * 渲染进程通讯
     * */
    async ipc() {
        /**
         * 主体
         * */
        //关闭
        ipcMain.on('closed', (event, args) => {
            for (let i of this.dialogs) if (i) i.close();
            this.dialogs = [];
            this.is_Dialogs = [];
            if (this.menu) this.menu.close();
            this.win.close();
        });
        //隐藏
        ipcMain.on('hide', (event, args) => {
            for (let i of this.dialogs) if (i) i.hide();
            this.win.hide();
        });
        //显示
        ipcMain.on('show', (event, args) => {
            for (let i of this.dialogs) if (i) i.show();
            this.win.show();
        });
        //最小化
        ipcMain.on('mini', () => {
            for (let i of this.dialogs) if (i) i.minimize();
            this.win.minimize();
        });
        //复原
        ipcMain.on('restore', () => {
            for (let i of this.dialogs) if (i) i.restore();
            this.win.restore();
        });
        //重载
        ipcMain.on('reload', () => {
            for (let i of this.dialogs) if (i) i.reload();
            this.win.reload();
        });
        //重启
        ipcMain.on('relaunch', () => {
            app.relaunch({args: process.argv.slice(1)});
        });

        /**
         * 弹框
         * */
        //创建
        ipcMain.on('new-dialog', (event, args) => {
            this.createDialog(args);
        });
        //反馈
        ipcMain.on('newWin-feedback', (event, args) => {
            this.win.webContents.send('newWin-rbk', args);
        });
        //关闭
        ipcMain.on('newWin-closed', (event, id) => {
            this.is_Dialogs[id] = false;
            this.dialogs[id].close();
            delete this.dialogs[id];
            let is = true;
            for (let i = 0, len = this.is_Dialogs.length; i < len; i++) if (this.is_Dialogs[i]) is = false;
            if (is) {
                this.dialogs = [];
                this.is_Dialogs = [];
            }
        });
        //最小化
        ipcMain.on('newWin-mini', (event, id) => {
            this.dialogs[id].minimize();
        });

        /**
         * global
         * */
        ipcMain.on('global', (event, args) => {
            return this[args]
        });
    }

}

(async () => {
    await main.getInstance().init(); //初始化
    await main.getInstance().ipc(); //开启ipc通讯
})()
