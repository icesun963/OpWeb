var OpLogService = require("./../../Shared/OpLogRPC.js");

AddService(OpLogService);

AddService(function () {
    CometServer(__dirname  + "/../../Web",8000);
});