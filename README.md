OpWeb
=====
a easy and Real Time develop game/web frame

一个轻量实时交互的快速游戏/Web开发框架。

原有平台为C#/.Net。
正在运营的是一款线上Web游戏产品，.Net理论性能为:
后台渲染Fps:30/S 推送延迟50Ms
同时理论在线用户数1500,每10-15个玩家在同一个场景下。
（性能优化后并未进行测试，理论上更高。）

现在我通过SharpKit把它移植到到了NodeJs平台!
从刚开始使用SharpKit到移植完成,大约使用了一周，这很酷。
并写了一个TodoList Demo
这部分Demo大约200行Js

这是这个框架的特性：
1.非常高效的数据同步并且拥有低延迟 10MS内
2.允许同步延迟（当你某次同步失败，可以继续同步，这不影响结果）
3.开发过程中无通讯
4.基本无差距的本地/远端开发模式
5.OOP（也许有人不喜欢他）

C＃版本拥有的，但是Js版本并未拥有的特性：
1.分布式的多节点
2.节点中的数据热切换
3.Tcp支持
4.二进制的数据压缩

体验本框架：

你必须安装一个NodeJs
npm install node-static
cd OpWeb
node AppLauncher.js
在浏览器中打开(你可以打开多个)
http://localhost:8000

目录:
Core--核心框架库
    ｜－GameApp.js--日志库和基本配置库（移植于C#)
    ｜－jsclr.js--SharpKit clrjs库（移植于C#)
    ｜－OpLog.js--OpLog核心库（移植于C#)
    ｜－system.js--clr js 兼容库（跨平台桥接库)
Shared--前后端共享库
Service--服务库（所有服务都放此目录下，./web/下js不会被加载)
    |
    --Core--系统服务库
    |    |
    |    --server.js--静态文件服务＋推送服务
    |
    --Demos--或者你的App
        |
        --todos--todos测试demo


