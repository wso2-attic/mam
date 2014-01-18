var TENANT_CONFIGS = 'tenant.configs';
var USER_MANAGER = 'user.manager';
var webconsole = (function () {

    var groupModule = require('group.js').group;
    var group = '';

    var userModule = require('user.js').user;
    var user = '';

    var routes = new Array();
    var log = new Log();
    var db;
    var module = function (dbs) {
        group = new groupModule();
        user = new userModule();
        db = dbs;
        //mergeRecursive(configs, conf);
    };
    var carbon = require('carbon');
    var server = function(){
        return application.get("SERVER");
    }
	var common = require('common.js');


    var configs = function (tenantId) {
        var configg = application.get(TENANT_CONFIGS);
        if (!tenantId) {
            return configg;
        }
        return configs[tenantId] || (configs[tenantId] = {});
    };

    var userManager = function (tenantId) {
        var config = configs(tenantId);
        if (!config || !config[USER_MANAGER]) {
            var um = new carbon.user.UserManager(server, tenantId);
            config[USER_MANAGER] = um;
            return um;
        }
        return configs(tenantId)[USER_MANAGER];
    };

    function mergeRecursive(obj1, obj2) {
        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if (obj2[p].constructor == Object) {
                    obj1[p] = MergeRecursive(obj1[p], obj2[p]);
                } else {
                    obj1[p] = obj2[p];
                }
            } catch (e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }
        return obj1;
    }

    // prototype
    module.prototype = {
        constructor: module,
        getAllUsers: function(ctx){
            ctx.type = 'admin';
            var type = ctx.type;
            var paging = ctx.iDisplayStart||0;
            var pageSize = 10;
            var all_users;
            if(ctx.groupid != null || ctx.groupid != undefined) {
                all_users = user.getAllUserNamesByRole(ctx);
            } else {
                all_users = user.getAllUserNames();
            }
            var totalRecords = all_users.length;
            var upperBound = (paging+1)*pageSize;
            var lowerBound =  upperBound - pageSize;
            var Paginate = require('/modules/paginate.js').Paginate;
            var pager =  new Paginate(all_users, pageSize);
            var paginated_users = pager.page(paging);
            
            var dataArray = new Array();
            for (var i = paginated_users.length - 1; i >= 0; i--) {
                var username = paginated_users[i];
                var userObj = user.getUser({"userid": username});
                var proxyObj = [username, userObj.firstName, userObj.lastName];

                var roles = userObj.roles;
                roles = parse(roles);
                var flag = 0;
                for(var j=0 ;j<roles.length;j++){
                    log.info("Test iteration2"+roles[j]);
                    if(roles[j]=='admin'||roles[j]=='Internal/mdmadmin'){
                        flag = 1;
                        break;
                    }else if(roles[j]=='Internal/publisher'||roles[j]=='Internal/reviewer'||roles[j]=='Internal/store'||roles[j]=='mamadmin'){
                        flag = 2;
                        break;
                    }else{
                        flag = 0;
                    }
                }
                if(flag == 1){
                    if(type == 'admin'){
                        proxyObj.push('administrator');
                        proxyObj.push('');
                        proxyObj.push('');
                    }
                }else if(flag == 2) {;
                    proxyObj.push('mam');
                    proxyObj.push('');
                    proxyObj.push('');
                }else{
                    proxyObj.push('user');
                    proxyObj.push('');
                    proxyObj.push('');
                }
                dataArray.push(proxyObj);
            };
            var finalObj = {};
            finalObj.sEcho = ctx.sEcho;
            finalObj.iTotalRecords = totalRecords
            finalObj.iTotalDisplayRecords = pageSize;
            finalObj.aaData = dataArray;
            return finalObj;
        }
    };
    return module;
})();