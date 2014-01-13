
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

            var appsStore = store.getAppsFromStorePackageAndName();
            var devicesInfo = db.query("SELECT n.id, p.type_name, n.device_id, n.received_data FROM notifications as n JOIN (SELECT device_id, MAX(received_date) as MaxTimeStamp FROM notifications WHERE feature_code = ? AND received_date != 'NULL' GROUP BY device_id) dt ON (n.device_id = dt.device_id AND n.received_date = dt.MaxTimeStamp) JOIN devices as d ON (n.device_id = d.id) JOIN platforms as p ON (p.id = d.platform_id) WHERE feature_code = ? ORDER BY n.id", GET_APP_FEATURE_CODE, GET_APP_FEATURE_CODE);
            var deviceInfo;
            var existingApps =[];

            // Checks the device type and put installed application's package name into an array.
            for (var i=0;i<devicesInfo.length;i++) {
                deviceInfo = parse(devicesInfo[i].received_data);
                for(var j=0;j<deviceInfo.length;j++){
                    if (devicesInfo[i].type_name == "Android") {
                        existingApps.push(deviceInfo[j].package);                       
                    } else if (devicesInfo[i].type_name == "iOS") {
                        existingApps.push(deviceInfo[j].Identifier);
                    }
                }       
            }

            // Gets the installed application's package names which are in the store.   
            var installedApps = [];
            var count; // Installations count.
        	var appName;
            for (var i=0;i<appsStore.length;i++) {
            	count = 0;
            	for (var j=0;j<existingApps.length;j++) {          		
            		if (appsStore[i].package === existingApps[j]) {
            			count++;
            			appName = existingApps[j].name;
            		}           		
            	}
            	if (count) {
					var installedApp = new Object();
					// Get the installed application name.
					installedApp.appName = appsStore[i].name;
					installedApp.count = count;
					installedApps.push(installedApp);
            	}      	
            }
            
            installedApps = installedApps.sort(compare);
            // Get the first 10 applications name list.
            installedApps = installedApps.slice(0,10);
            
            return installedApps;
        },

        getInstalledAppsByUser: function (user_id) {
            var queryString;
            var results = [], app_info, result, device;
            var deviceInfo, devicesInfo;
            //Create the db query based on user id provided
            if (user_id) {
                queryString = "SELECT n.user_id,p.type_name, d.os_version, n.device_id, n.received_data FROM notifications as n JOIN (SELECT device_id, MAX(received_date) as MaxTimeStamp FROM notifications WHERE feature_code=? AND user_id=? AND received_date != 'NULL' GROUP BY device_id) dt ON (n.device_id = dt.device_id AND n.received_date = dt.MaxTimeStamp) JOIN devices as d ON (n.device_id = d.id) JOIN platforms as p ON (p.id = d.platform_id) WHERE feature_code = ? ORDER BY n.user_id,n.device_id";
                devicesInfo = db.query(queryString, GET_APP_FEATURE_CODE, user_id, GET_APP_FEATURE_CODE);
            } else {
                queryString = "SELECT n.user_id,p.type_name, d.os_version, n.device_id, n.received_data FROM notifications as n JOIN (SELECT device_id, MAX(received_date) as MaxTimeStamp FROM notifications WHERE feature_code=? AND received_date != 'NULL' GROUP BY device_id) dt ON (n.device_id = dt.device_id AND n.received_date = dt.MaxTimeStamp) JOIN devices as d ON (n.device_id = d.id) JOIN platforms as p ON (p.id = d.platform_id) WHERE feature_code = ? ORDER BY n.user_id,n.device_id";
                devicesInfo = db.query(queryString, GET_APP_FEATURE_CODE, GET_APP_FEATURE_CODE);
            }
            //Get the list of apps in Store
            var appsStore = store.getAppsFromStorePackageAndName();
            var appList = new Object();
            //create a dictionary using the data retrieved from the appStore for quick reference
            for (var i = 0; i < appsStore.length; i++) {
                appList[appsStore[i].package] = appsStore[i].name;
            }

            for (var i = 0; i < devicesInfo.length;) {
                result = new Object();
                result.user_id = devicesInfo[i].user_id;
                result.devices = [];

                for (var j = i; j < devicesInfo.length;) {
                    device = {"device_id": devicesInfo[j].device_id, "os_version": devicesInfo[j].os_version, "platform": devicesInfo[j].type_name, "apps": []};
                    deviceInfo = parse(devicesInfo[j].received_data);
                    for (var k = 0; k < deviceInfo.length; k++) {
                        //check whether the installed app is available on app store
                        if (appList[deviceInfo[k].package] || appList[deviceInfo[k].Identifier]) {
                            app_info = new Object();
                            if (device.platform === "Android") {
                                app_info.name = appList[deviceInfo[k].package];
                                app_info.package = deviceInfo[k].package;
                            } else if (device.platform === "iOS") {
                                app_info.name = appList[deviceInfo[k].Identifier];
                                app_info.package = deviceInfo[k].Identifier;
                            }
                            device.apps.push(app_info);
                        }
                    }
                    result.devices.push(device);
                    j++;
                    i = j;
                    //break the inner loop when it reaches the data of another user
                    if ((j < devicesInfo.length) && (result.user_id !== devicesInfo[j].user_id)) {
                        break;
                    }
                }
                results.push(result);
            }
            return results;
        }
    };
    
    /* Compares by the count and sort in descending order. */
    function compare(a,b) {
    	  if (a.count > b.count)
    	     return -1;
    	  if (a.count < b.count)
    	    return 1;
    	  return 0;
    }
    
    return module;
})();
