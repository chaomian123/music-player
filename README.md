

### 项目介绍
技术栈: Electron JavaScript HTML5 CSS3
原生JavaScript实现 没有任何依赖

##### 代码风格介绍(talk is cheap, show me the code)
1. 函数及变量命名符合《code complete》规范
2. 所有代码至多一层循环嵌套, No EventLoop Hell
3. player.js文件只留一个主函数出口
4. 对所有绑定事件进行了封装并提取可复用部分封装为函数
5. 使用ES6语法, 使用JavaScript standard 代码规范书写JS代码

##### 已实现的功能
1. 歌曲的播放, 暂停
2. 播放器进度条展示
3. 音量调整
4. 主界面歌曲封面图与歌曲曲目的绑定
5. 可以通过动态目录audio放入本地音乐, 在程序中播放

##### 尚在开发中的功能
1. 功能已经实现的随机播放
  还需要解决图片跟歌曲曲目在乱序状态下绑定的问题
2. 利用原生文件拖放的功能将新本地音乐, 直接插入播放列表并自动化命名与音乐文件同时传入的图片名称
  还需要解决曲目标题有异常字符时, fs API读取文件的bug(文件名截断残缺)的问题
3. 播放列表的排序与曲目搜索
  功能还在设计中

#### 项目结构图
![Image text](https://wx1.sinaimg.cn/mw1024/77b25649gy1fvbyfwon6hj20cb0ccjry.jpg)

#### 已经编译好的音乐播放器文件下载地址
    (绿色解压版, 已内置了几首好听的纯音乐, 可以打开文件目录里的audio进行替换)
    链接： https://share.weiyun.com/5IJ6BVD （密码：MSM）
---
#### 项目展示动图
![Image text](http://wx1.sinaimg.cn/large/77b25649gy1fv44kulywpg20c30jbwu8.gif
)
