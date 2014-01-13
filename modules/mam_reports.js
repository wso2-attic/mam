
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
