var fs = require('fs');

global.window = global;
global.Services = [];

global.log = require('logging');
global.Logger = function(name){
    this.Trace = function (msg) {
        log(msg);
    }
    this.Debug = function (msg) {
        log("{" + msg + "}");
    }
    this.Info = function (msg) {
        log("[" + msg + "]");
    }
    this.Warn = function (msg) {
        log("(" + msg + ")");
    }
    this.Error = function (msg) {
        log("*"  + msg + "*" );
    }
    this.Fatal = function (msg) {
        log("*"  + msg + "*" );
    }

}


global.Config = require("./Config.json")



log("[app start..]");

global.AddService = function (app,lv) {
    //clr class define mast use 5>= lv <= 8
    //app use default lv = 10
    if(lv==undefined)
        lv = 10

    var find = null;
    global.Services.forEach(function(lvSvs){
        if(lvSvs.Lv==lv ){
            find = lvSvs;
        }
    });
    if(find==null){
        find = {
            Lv : lv ,
            Apps : []
        };
        global.Services.push(find);
    }
    find.Apps.push(app);
};

global.StartApps = function () {
    global.Services.forEach(function(lvSvs){
        lvSvs.Apps.forEach(function (app) {
            app();
        });
    })

}

String.prototype.startsWith = function (str) {
    return this.indexOf(str) == 0;
}
String.prototype.endsWith = function (str) {
    return this.substr(this.length - str.length, str.length) == str;
}


var WatchJS = require("./Shared/watch.js");
global.watch = WatchJS.watch;
global.unwatch = WatchJS.unwatch;
global.passProperty  = WatchJS.passProperty;


passProperty.push("PropertyChanged");



log("[Load Services..]");

//Load Services 


var root_path = __dirname + "";

function getAllFiles(root) {
    var res = [], files = fs.readdirSync(root);
    files.forEach(function (file) {
        var pathname = root + '/' + file
            , stat = fs.lstatSync(pathname);

        if (!stat.isDirectory()) {
            res.push(pathname.replace(root_path, '.'));
        } else {
            res = res.concat(getAllFiles(pathname));
        }
    });

    return res
}



var files = getAllFiles(root_path);
files.forEach(function (file) {

    if (file.startsWith("./Service") && file.endsWith(".js")
        && file.indexOf("web") == -1
        && file.indexOf("client") == -1
        && file.indexOf("Lib") == -1
        ) {
        log("[Load:" + file + "]");
        require(file);
    }
});

log("[Start Apps...]");



StartApps();













