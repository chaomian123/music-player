const fs = require('fs')
const path = require('path')

const log = console.log.bind(console)

const e = (selector) => document.querySelector(selector)
const es = (sel) => document.querySelectorAll(sel)
const templatePlayerList = (song, img, i) => {
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
const initPlayer = () => {
    let audioDir = 'audios'
    // readdir 读取文件夹并以函数的形式返回所有文件
    // 我们的音乐都放在 audios 文件夹中
    fs.readdir(audioDir, function(error, files) {
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
        for (let i = 0; i < o.song.length; i++) {
            let song = o.song[i]
            let img = o.img[i]
            let t = templatePlayerList(song, img, i)
            e('#id-ul-song-list').insertAdjacentHTML('beforeend', t)
        }
    })
}


const bindEventPlay = (event, player) => {
        // self 是被点击的 a 标签
        let self = event.target
        if (self.classList.contains('hap-playlist-title')) {
            let father = self.closest('.hap-playlist-item')
            let allItems = document.querySelectorAll('.hap-active')
            for (let r of allItems) {
                r.classList.remove('hap-active')
            }
            father.classList.add('hap-active')
            let filepath = path.join('audios', self.textContent)
            player.src = filepath
            // 播放
            player.play()
        }
}

const togglePlayPause = (t) => {
    if (t.classList.contains('fa-play')) {
        t.classList.remove('fa-play')
        t.classList.add('fa-pause')
    } else if (t.classList.contains('fa-pause')) {
        t.classList.remove('fa-pause')
        t.classList.add('fa-play')
    }
}
const bindEventsPlay = (player) => {
    let button = e('.hap-playback-toggle')
    let list = e('#id-ul-song-list')
    player.addEventListener('canplay', () => {
        togglePlayPause(button)
    })
    list.addEventListener('click',  (event) => {
        bindEventPlay(event, player)
    })
}

const hapToggleClass = (element, classNameA, classNameB) => {
    if (element.classList.contains(classNameA)) {
        element.classList.remove(classNameA)
        element.classList.remove(classNameB)

    }
}

const bindEventPause = (player) => {
    let button = e('.hap-playback-toggle')
    player.addEventListener('pause', () => {
        button.classList.remove('fa-pause')
        button.classList.add('fa-play')
    })
    button.addEventListener('click', (event) => {
        let self = event.target
        if (self.classList.contains('fa-play')) {
            self.classList.remove('fa-play')
            self.classList.add('fa-pause')
            player.play()
        } else {
            self.classList.remove('fa-pause')
            self.classList.add('fa-play')
            player.pause()
        }
    })
}

const allSongs = () => {
    let musics = es('.hap-playlist-title')
    log(musics)
    let songs = []
    for (let i = 0; i < musics.length; i++) {
        let m = musics[i]
        let path = `audios\\`+ m.textContent
        songs.push(path)
    }
    return songs
}


const nextSong = (songs) => {
    let currentSong = e('.hap-active')
    let index = (Number(currentSong.dataset.index) + 1) % songs.length
    return songs[index]
}

const previousSong = (songs) => {
    let currentSong = e('.hap-active')
    let index = (Number(currentSong.dataset.index) - 1 + songs.length) % songs.length
    log(index)
    return songs[index]
}

const choice = (array) => {
    let a = Math.random()
    a = a * array.length
    let index = Math.floor(a)
    log('index', index)
    return array[index]
}

const randomSong = () => {
    let songs = allSongs()
    let s = choice(songs)
    return s
}


const bindEventNextSong = (player) => {
    let next = e('.fa-step-forward')
    next.addEventListener('click', (event) => {
        let songs = allSongs()
        let song = nextSong(songs)
        let currentSong = e('.hap-active')
        let i = (Number(currentSong.dataset.index) + 1) % songs.length
        let next = es('.hap-playlist-item')[i]
        currentSong.classList.remove('hap-active')
        next.classList.add('hap-active')
        player.src = song
        player.play()
    })
}
const bindEventPreviousSong = (player) => {
    let next = e('.fa-step-backward')
    next.addEventListener('click', (event) => {
        let songs = allSongs()
        let song = previousSong(songs)
        let currentSong = e('.hap-active')
        let i = (Number(currentSong.dataset.index) - 1 + songs.length) % songs.length
        let next = es('.hap-playlist-item')[i]
        currentSong.classList.remove('hap-active')
        next.classList.add('hap-active')
        player.src = song
        player.play()
    })
}

const bindEventShuffle = () => {
    let randombtn = e('.fa-random')
    randombtn.addEventListener('click', (event) => {
        let player = e('#id-audio-player')
        let self = randombtn

        if (player.dataset.mode !== 'shuffle') {
            self.classList.add('hap-icon-rollover-color')
            self.classList.remove('hap-icon-color')
            player.dataset.mode = 'shuffle'
        } else {
            self.classList.add('hap-icon-color')
            self.classList.remove('hap-icon-rollover-color')
            player.dataset.mode = 'loop'
        }
    })
}

const bindEventEnded = (player) => {
    // 给 id 为 id-audio-player 的元素也就是我们的 audio 标签添加一个事件 ended
    // 这样在音乐播放完之后就会调用第二个参数(一个匿名函数)
    let playMode = player.dataset.mode
    e('#id-audio-player').addEventListener('ended', () => {
        log("播放结束, 当前播放模式是", playMode)
        // 如果播放模式是 loop 就重新播放
        if (playMode === 'loop') {
            player.play()
        } else if (playMode === 'list') {
            log('mode', playMode)
        } else if (playMode === 'shuffle') {
            let randomsong = randomSong()
            log('mode', playMode)
            player.src = randomsong
            player.play()
        }
    })

}
const bindEventCurrentTime = function(player) {
    let a = player
    let currentTime = e('.hap-progress-level')
    a.addEventListener('canplay', (event) => {
        setInterval(function() {
            let time = a.currentTime
            let totaltime = a.duration
            let progress = time / totaltime * 280
            currentTime.style.width= `${progress}px`
        },1000)
    })
}

const seekProgress = (player) => {
    let a = player
    let o = {}
    o.time = a.duration
    o.totalMinutes = (o.time / 60).toFixed(0)
    o.totalSeconds = (o.time % 60).toFixed(0)
    o.current = a.currentTime
    o.minutes = (o.current / 60).toFixed(0)
    o.Seconds = (o.current % 60).toFixed(0)
    return o
}

const secondFillZero = (second) => {
    let t = second
    if (t < 10) {
        t = '0' + t
    }
    return t
}
const bindEventShowTime = function(player) {
    let seekbar = e('.hap-seekbar')
    let tooltip = e('.hap-tooltip')
    seekbar.addEventListener('mousemove', (event) => {
        let seekX = Number(event.offsetX)
        let totalTime = player.duration
        if (!totalTime) {
            return
        }
        tooltip.style.display = 'block'

        let current = seekX / 280 * totalTime
        let minutes = (current / 60).toFixed(0)
        let seconds = (current % 60).toFixed(0)
        seconds = secondFillZero(seconds)
        let totalMinutes = (totalTime / 60).toFixed(0)
        let totalSeconds = (totalTime % 60).toFixed(0)
        totalSeconds = secondFillZero(totalSeconds)
        tooltip.innerHTML = `<p>${minutes}:${seconds} / ${totalMinutes}:${totalSeconds} </p>`
        if (seekX < 250) {
            tooltip.style.left = event.offsetX + 'px'
        } else {
            tooltip.style.left = '250px'
        }
    })

    seekbar.addEventListener('mouseout', () => {
        tooltip.style.display = 'none'
    })

    seekbar.addEventListener('click', (event) => {
        let seekX = Number(event.offsetX)
        let totalTime = player.duration
        if (!totalTime) {
            return
        }
        let time = seekX / 280 * totalTime
        player.currentTime = time
    })
}

const songTitle = (songname) => {
    let title = e('#id-song-title')
    title.innerHTML = songname
}
const bindEventCoverChange = (player) => {
    player.addEventListener('canplay', () => {
        let song = player.src
        let cover = e('#id-audio-cover')
        let covername = song.split('.')[0] + '.jpg'
        cover.src = covername
        let father = e('.hap-active')
        let child = father.querySelector('a')
        let text = child.textContent.split('.')[0]
        songTitle(text)
    })
}
const bindEventCanplay = function(player) {
    player.addEventListener('canplay', function() {
        let promise = player.play()
        if (promise !== undefined) {
            promise.then(() => {
                // 进入这个函数说明音乐已经自动播放
                player.play()
            }).catch(() => {
                // 进入这个函数说明音乐不能自动播放
                showCurrentTime(audio)
            })
        }
    })
}

const BindEventLoadLevel = (player) => {

}
const btnAnimation = () => {
    let container = e('#hap-wrapper')
    container.addEventListener('mouseover', (event) => {
        let self = event.target
        if (self.classList.contains('hap-icon-color') && !self.classList.contains('fa-random')) {
            self.classList.add('hap-icon-rollover-color')
            self.classList.remove('hap-icon-color')
        }
    })

    container.addEventListener('mouseout', (event) => {
        let self = event.target
        if (self.classList.contains('hap-icon-rollover-color') && !self.classList.contains('fa-random')) {
            self.classList.add('hap-icon-color')
            self.classList.remove('hap-icon-rollover-color')
        }
    })
    scrollSongsList()

}


const scrollSongsList = () => {
    const list = e('#id-ul-song-list')
    list.addEventListener('mousewheel', (event) => {
        let top = window.getComputedStyle(list, null).getPropertyValue("top")
        top = Number(top.split('p')[0])
        let down = true
        if (event.wheelDelta < 0) {
            down = true
        } else if (event.wheelDelta > 0) {
            down = false
        }
        if (down) {
            top  = top - 10
        } else {
            top  = top + 10
        }
        if (top < 10 && top > -200) {
            list.style.top = top + 'px'
        }
    })
}
const bindEvents = (player) => {
    bindEventCurrentTime(player)
    bindEventsPlay(player)
    bindEventShuffle(player)
    bindEventEnded(player)
    bindEventPause(player)
    bindEventNextSong(player)
    bindEventPreviousSong(player)
    bindEventCoverChange(player)
    bindEventShowTime(player)
}


const __main = () => {
    // 找到 audio 标签并赋值给 player
    const player = e('#id-audio-player')
    initPlayer(player)
    btnAnimation()
    bindEvents(player)
}

__main()