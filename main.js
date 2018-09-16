const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')


let win

function createWindow() {
    // 创建浏览器窗口。
    win = new BrowserWindow({width: 500, height: 800})

    // 应用的 index.html。
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // 打开开发者工具。
    win.webContents.openDevTools()

    // 当 window 被关闭，触发事件
    win.on('closed', () => {

        win = null
    })
}


app.on('ready', createWindow)


app.on('window-all-closed', () => {

    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {

    if (win === null) {
        createWindow()
    }
})


