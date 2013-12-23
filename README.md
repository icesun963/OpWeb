OpWeb
=====
a easy and Real Time develop game/web frame

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/icesun963/opweb/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

##Try it now!!##

Download and unzip to a folder

	cd OpWeb

	node AppLauncher.js

###Open On Browser:###

	http://localhost:8000

	(Don't work in IE)

	Input txt and hit Enter to AddItem

	Click [DEL] to remove a item

	Doubleclick to edit a item

##Update 0.0.2.1:## 
1. edit item can sync now

##Update 0.0.2:##

1.Move Core to Service/Core/ClrJs/

2.Add ClrLauncher.cs to initialization ClrJs

3.Add Config.json to Config Services

4.Add MongodbSync.js to User Mongodb in OpLog Engine



	Config.Mongo.SyncOn = false (user Memory OpLog Engine)

	Config.Mongo.SyncOn = true (user Mongodb OpLog Engine)


