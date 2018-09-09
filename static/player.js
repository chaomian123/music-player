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
const changeCover = (player) => {
    let songname = player.src
    log(songname)
}

const bindEventsPlay = (player) => {
    let list = e('#id-ul-song-list')
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
    button.addEventListener('click', (event) => {
        let self = event.target
        if (self.classList.contains('fa-play')) {
            log('开始')
            self.classList.remove('fa-play')
            self.classList.add('fa-pause')
            player.play()
        } else {
            log('暂停')
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

const bindEventCoverChange = (player) => {
    player.addEventListener('canplay', () => {
        let songname = player.src
        let cover = e('#id-audio-cover')
        let covername = songname.split('.')[0] + '.jpg'
        cover.src = covername
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
}
const bindEvents = (player, cover) => {
    bindEventCurrentTime(player)
    bindEventsPlay(player, cover)
    bindEventShuffle(player)
    bindEventEnded(player)
    bindEventPause(player)
    bindEventNextSong(player)
    bindEventPreviousSong(player)
    bindEventCoverChange(player)

}


const __main = () => {
    // 找到 audio 标签并赋值给 player
    const player = e('#id-audio-player')
    initPlayer(player)

    btnAnimation()

    bindEvents(player)
}

__main()