var OpLogService = require("./../../Shared/OpLogRPC.js");

AddService(OpLogService);

AddService(function () {
    var port = process.env.PORT || 8000;
    CometServer(__dirname  + "/../../Web/",port);
});