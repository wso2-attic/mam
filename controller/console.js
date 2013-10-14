var dashboard = function(appController){
	context = appController.context();
	context.title = context.ui.TITLE + " | Dashboard";	
	context.jsFile= "console_dashboard.js";
	context.page = "dashboard";
	context.data = {		
	}
	return context;
};

var management = function(appController){
	context = appController.context();
	context.title = context.ui.TITLE + " | Manage Apps";	
	context.jsFile= "console_management.js";
	context.page = "management";
	context.data = {		
	}
	return context;
};