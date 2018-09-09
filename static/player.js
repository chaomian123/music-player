const fs = require('fs')
const path = require('path')



const log = console.log.bind(console)

const e = (selector) => document.querySelector(selector)
const es = (sel) => document.querySelectorAll(sel)
const initPlayer = () => {
    let audioDir = 'audios'
    // readdir 读取文件夹并以函数的形式返回所有文件
    // 我们的音乐都放在 audios 文件夹中
    fs.readdir(audioDir, function(error, files) {
        log(files, files.length)
            let items = files
            let o = {
                song:[],
                img:[],
            }
            for (let file of items) {
                if (file.endsWith('mp3')) {
                    o.song.push(file)
                } else if (file.endsWith('jpg')) {
                    o.img.push(file)
                }
            }
        let template = (song, img, i) => {
            let imagBaseUrl = 'audios/'+img
            let t = `
                <div class="hap-playlist-item" data-index=${i}>
                    <li class="gua-song hap-playlist-selected">
                        <span class="hap-playlist-thumb"><img src=${imagBaseUrl} alt="">${img}</span>
                        <a href="#" class="hap-playlist-title">${song}</a>
                    </li>
                    </div>
                `
            return t
        }

        for (let i = 0; i < o.song.length; i++) {
            let song = o.song[i]
            let img = o.img[i]
            let t = template(song, img, i)
            e('#id-ul-song-list').insertAdjacentHTML('beforeend', t)
        }
    })
}


const bindEventPlay = (event, player) => {
        // self 是被点击的 a 标签
        let self = event.target
        if (self.classList.contains('hap-playlist-title')) {
            log(self)
            let father = self.closest('.hap-playlist-item')
            log(father)
            let allItems = document.querySelectorAll('.hap-active')
            for (let r of allItems) {
                r.classList.remove('hap-active')
            }
            father.classList.add('hap-active')

            let cover = e('.hap-player-thumb-wrapper')
            let songname = self.textContent
            let covername = songname.split('.')[0] + '.jpg'
            let filepath = path.join('audios', self.textContent)
            log(filepath)
            let coverpath = path.join('audios', covername)
            log(coverpath)

            // 设置为 player 的当前音乐
            cover.src = coverpath
            player.src = filepath
            // 播放
            player.play()
        }



}
const bindEventsPlay = (player) => {
    // 给 id 为 id-ul-song-list 的元素下的 a 标签添加一个点击事件
    // 这是 jQuery 的事件委托语法
    // 如果 on 函数有三个参数, 那么第一个参数是 事件类型, 第二个参数是响应事件的元素
    // 第三个参数是事件发生后的回调函数
    let list = e('#id-ul-song-list')
    list.addEventListener('click',  (event) => {

        bindEventPlay(event, player)
    })
}
const changeCover = (index) => {
    const cover = e('#id-audio-cover')

    let audioDir = 'audios'
    let coverPic
    fs.readdir(audioDir, function(error, files) {
        let i = 0
        for (let file of files) {
            if (i === index) {
                coverPic = file.endsWith('jpg')
                break
            }
            i++
        }
        log(coverPic)
        cover.src = coverPic
    })
}
const bindEventPause = (player) => {
    let button = e('.hap-playback-toggle')
    button.addEventListener('click', (event) => {
        log('暂停')
        let self = event.target
        log(self)
        player.pause()
        self.classList.remove('fa-pause')
        self.classList.add('fa-play')
    })
}

const bindEventEnded = (player) => {
    // 给 id 为 id-audio-player 的元素也就是我们的 audio 标签添加一个事件 ended
    // 这样在音乐播放完之后就会调用第二个参数(一个匿名函数)
    let playMode = player.dataset.mode
    $("#id-audio-player").on('ended', function() {
        log("播放结束, 当前播放模式是", playMode)
        // 如果播放模式是 loop 就重新播放
        if (playMode === 'loop') {
            player.play()
        } else {
            log('mode', playMode)
        }
    })
}
const bindEventCurrentTime = function(player) {
    let a = player
    let currentTime = e('.hap-progress-level')
    a.addEventListener('canplay', function(event) {
        setInterval(function() {
            let time = a.currentTime
            let totaltime = a.duration
            let progress = time / totaltime * 280
            currentTime.style.width= `${progress}px`
        },1000)
    })
}

const seekProgress = () => {

}
const bindEventTotalTime = function(player) {
    let a = player
    let totalTime = e('#id-totalTime-span')
    a.addEventListener('canplay', function(event) {
        let time = a.duration
        let minutes = (time / 60).toFixed(0)
        let seconds = (time % 60).toFixed(0)
        log('minutes , seconds',typeof minutes ,seconds )
        setInterval(function() {
            totalTime.innerHTML = `${minutes}分${seconds}秒`
        },1000)
    })
}

const btnAnimation = () => {
    let container = e('#hap-wrapper')
    container.addEventListener('mouseover', (event) => {
        let self = event.target
        if (self.classList.contains('hap-icon-color')) {
            self.classList.add('hap-icon-rollover-color')
            self.classList.remove('hap-icon-color')
        }
    })

    container.addEventListener('mouseout', (event) => {
        let self = event.target
        if (self.classList.contains('hap-icon-rollover-color')) {
            self.classList.add('hap-icon-color')
            self.classList.remove('hap-icon-rollover-color')
        }
    })
}
const bindEvents = (player, cover) => {
    bindEventCurrentTime(player)
    bindEventsPlay(player, cover)
    bindEventEnded(player)
    bindEventPause(player)
}


const __main = () => {
    // 找到 audio 标签并赋值给 player
    const player = e('#id-audio-player')
    initPlayer(player)

    btnAnimation()

    bindEvents(player)
}

__main()