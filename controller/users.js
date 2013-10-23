var userModule = require('/modules/user.js').user;
var user = new userModule(db);

var groupModule = require('/modules/group.js').group;
var group = new groupModule(db);


configuration = function(appController) {
	context = appController.context();
	
	try {
        var users = user.getUsersByType({type:context.contextData.user.role});
        log.info("Users >>>>>>>"+stringify(users));
	} catch(e) {
		log.info(e);
		var users = [];
	}
	try {
		var groups = group.getAllGroups({});
	} catch(e) {
		log.info(e);
		var groups = [];
	}
	
	context.title = context.title + " | Configuration";
	context.page = "configuration";
	context.jsFile = "users/configuration.js";
	context.data = {
		configOption : "users",
		users : users,
		groups : groups
	};
	return context;
};


add = function(appController) {
	context = appController.context();

	try {
		var groups = group.getGroupsByType({type:context.contextData.user.role});		
	} catch(e) {		
		var groups = [];
	}
	

	context.title = context.title + " | Add User";
	context.page = "configuration";
	context.jsFile = "users/add.js";
	context.data = {
		configOption : "users",
		groups : groups,
		tenantId : session.get("mdmConsoleUser").tenantId
	};
	return context;

};




assign_groups = function(appController) {

	var username = request.getParameter('user');

	try {
		var groups = user.getRolesByUser({
			username : username
		});
	} catch(e) {
		var groups = [];
	}

	context = appController.context();
	
	// Array Remove - By John Resig (MIT Licensed)
	Array.prototype.remove = function(from, to) {
	  var rest = this.slice((to || from) + 1 || this.length);
	  this.length = from < 0 ? this.length + from : from;
	  return this.push.apply(this, rest);
	};
	
	
	if (context.contextData.user.role != 'masteradmin') {
		for (var i = 0; i < groups.length; i++) {
			if (groups[i].name == 'masteradmin' | groups[i].name == "admin") {
				groups.remove(i);
			}
		}
	}
	
	
	
	context.title = context.title + " | Assign Users to group";
	context.page = "configuration";
	context.jsFile = "users/assign_groups.js";
	context.data = {
		configOption : "policies",
		groups : groups,
		tenantId : session.get("mdmConsoleUser").tenantId,
		username : username

	};
	return context;
};