OpWeb
=====
a easy and Real Time develop game/web frame

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/icesun963/opweb/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


一个轻量高效的实时交互开发框架，用于开发实时Web App 或者 网络游戏。

##这是什么？##


这是一个Web在线对战射击游戏（MMOA）的开源版本，该游戏依然在运行中。

原有平台为C＃，现在我通过SharpKit把它移植到到了NodeJs平台!

发现NodeJs给我带来更好的体验和想法，虽然有些地方很糟糕，但是这并不是问题。

现在已经升级到0.0.3版本，虽然还不算成熟，但是却拥有了C＃版本并不拥有的特性和特征。

我们有理由相信，这将是一个更加便捷的分支版本。

同时，一些核心部分我依然会采用C＃编写，但是会保持同步的。


##特性和特点？##

1.简单的数据同步模式，并且只有一个简单的数据规则。（所有的对象只有一层，并且拥有唯一Id）

2.高效的差异同步方式，只有改变才推送，并且允许推送间隔，因为我们的模式是结果一致。不管你是10ms同步一次，还是1000ms同步一次，结果都不会有区别！

3.允许同步延迟／再次同步，当你同步失败可以尝试再次同步，最后依然会一致。

4.网络协议无关，第一个测试版本使用的是http定时刷新，经过几个版本的变化，不管是http心跳，http comet 还是 socket 都能完美的使用，而无需改变一行代码。

5.高效！对于MMOA来说，延迟是可怕的，视线路质量，我们最低延迟在10MS－100MS都能流畅游戏。

6.非常简单的开发模式，网路层全隔离，开发人员完全可以无视底层，仅关注应用逻辑开发。

7.OOP ，数据同步基于对象结构，如果你喜欢它，那么非常容易。如果不喜欢它，请尝试把它当NOSQL来认识。

8.低侵入，开发者仅需要初始化一次，框架并无更多的规则需要注意。

看到这里有点激动了么？上面我们说过NodeJs带来了c＃版本更加便捷的特性，这里我们拥有了新的特性：

9.无服务端式开发。（这点我会再使用一个小示例，用于介绍，相信你会喜欢它的！）


###在线体验地址###

现在我把它部署到了HeroKu上了，你可以通过使用Chrome打开2个用于测试：http://opweb.herokuapp.com/todos/


###下载和测试？###


首先你需要安装nodejs，请移步：http://nodejs.org/download/

如果你拥有了nodejs，

github地址：

    https://github.com/icesun963/OpWeb

现在有csdn版本：

    https://code.csdn.net/IceSun963/opweb

下载项目并解压缩

    cd OpWeb

    Node AppLauncher.js

在浏览器中打开 http://localhost:8000/todos/ (暂不支持IE系列 可以打开2个用于测试。）

    1.在输入框上回车（进行添加）
    2.单击[del]进行删除
    3.双击一条数据编辑并回车进行修改


最后，如果大家有兴趣加入这个项目，欢迎联系我，

可以在评论中留言联系我或者发我站内短信！

##历史版本更新：##

###0.0.4版本更新:###
1.替换Hashtable库

2.移动MongoDbSync中NoSQL部分到Shared／NoSQLSync

3.移动OpLogService中RPC服务到Shared／OpLogRPC

4.Web下增加了nedbLib，用于WebBrowser端同步，而不使用jsclr部分代码

5.Web下nedbLib，增加p2p支持，现在可以chrome<－>chrom ，firefox<－>firefox 下通讯，demo制作中

6.重写Shared/util.js部分代码
（JsClr部分发现GetTime函数有些Bug待修复)

###0.0.3版本更新:###

1.添加OpLogService RPC服务

2.添加Web目录为默认目录,并绑定端口8000

3.移动并升级todos Demo到无服务版本



###0.0.2版本更新：###
1.添加了基于Mongodb的支持，
原有同步方案基于内存中的对象维持，一些用户会比较担心此类问题，（作者说服老板也费了不少口水）

现在可以用简单的方案拥有Mongodb的特性了：

　　1.1快速的扩容，基于Mongodb多节点同步

　　1.2无需担心的数据丢失，直接在Mongodb中维护

＊虽然没有非基于对象的写入模式，但是相信我，以后会有的。

2.重新调整了目录，如果你不喜欢内存模式可以直接关闭，或者删除。