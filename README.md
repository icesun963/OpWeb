OpWeb
=====
a easy and Real Time develop game/web frame

Try it now!!
Download and unzip to a folder

cd OpWeb

node AppLauncher.js

Open On Browser:

http://localhost:8000

(Don't work in IE)

Update 0.0.2:
1.Move Core to Service/Core/ClrJs/
2.Add ClrLauncher.cs to initialization ClrJs
3.Add Config.json to Config Services
4.Add MongodbSync.js to User Mongodb in OpLog Engine
PS:
Config.Mongo.SyncOn = false (user Memory OpLog Engine)
Config.Mongo.SyncOn = true (user Mongodb OpLog Engine)
