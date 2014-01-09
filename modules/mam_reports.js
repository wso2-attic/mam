
var mam_reports = (function () {

    var configs = {
        CONTEXT: "/"
    };
    var routes = new Array();
    var log = new Log();
    var db;
    var module = function (dbs) {
        db = dbs;
        //mergeRecursive(configs, conf);
    };
    var storeModule = require('/modules/store.js').store;
    var store = new storeModule(db);

    var GET_APP_FEATURE_CODE = '502A';

    module.prototype = {
        constructor: module,

        getInstalledApps:function(){

            var appsStore = store.getAppsFromStorePackageName();
            log.info("Apps in Store >>>>> " + appsStore);

            //var devicesInfo = db.query("SELECT n.id, n.device_id, n.received_data FROM notifications as n JOIN (SELECT device_id, MAX(received_date) as MaxTimeStamp FROM notifications WHERE feature_code = '502A' AND received_date != 'NULL' GROUP BY device_id) dt ON (n.device_id = dt.device_id AND n.received_date = dt.MaxTimeStamp) AND feature_code = '502A' ORDER BY n.id");

            var devicesInfo = db.query("SELECT n.id, p.type_name, n.device_id, n.received_data FROM notifications as n JOIN (SELECT device_id, MAX(received_date) as MaxTimeStamp FROM notifications WHERE feature_code = ? AND received_date != 'NULL' GROUP BY device_id) dt ON (n.device_id = dt.device_id AND n.received_date = dt.MaxTimeStamp) JOIN devices as d ON (n.device_id = d.id) JOIN platforms as p ON (p.id = d.platform_id) WHERE feature_code = ? ORDER BY n.id", GET_APP_FEATURE_CODE, GET_APP_FEATURE_CODE);
            var deviceInfo;

            for (var i=0;i<devicesInfo.length;i++) {
                deviceInfo = parse(devicesInfo[i].received_data);
                log.info("Device id >>>>>>> " + devicesInfo[i].device_id);
                for(var j=0;j<deviceInfo.length;j++){
                    if (devicesInfo[i].type_name == "Android") {
                        log.info("package name >>>>>>> " + deviceInfo[j].package);
                    } else if (devicesInfo[i].type_name == "iOS") {
                        log.info("package name >>>>>>> " + deviceInfo[j].Identifier);
                    }

                }
            }

        }


    };
    return module;
})();