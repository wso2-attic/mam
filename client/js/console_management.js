$(document).ready(function() {
	// HELPER: #key_value
	//
	// Usage: {{#key_value obj}} Key: {{key}} // Value: {{value}} {{/key_value}}
	//
	// Iterate over an object, setting 'key' and 'value' for each property in
	// the object.
	$.ajaxSetup({
	  contentType : "application/json"
	});
	Handlebars.registerHelper("key_value", function(obj, options) {
	    var buffer = "",
	        key;
		
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) {
	            buffer += options.fn({ 
				                key: key, 
				                value: obj[ key ] 
				            });
	        }
	    }
	    return buffer;
	});
	$(".alert").hide();
	$('.app_box a').click(function(){
		$('.app_box a').removeClass('selected');
		$(this).addClass('selected');
		$(this).parent().css("cursor", "default");
		$(this).fadeTo("slow", 1);
		changeState();
		var packageId = $(this).data('packageid');
		var platform = $(this).data('platform');
		var url = $(this).data('url');
		var type = $(this).data('type');
		$('.stakes > .nav li').each(function(){
			if($(this).hasClass('active')){
				var currentTab = $(this).children('a').attr('href');
				$(currentTab+' .nav li').each(function(){
					if($(this).hasClass('active')){
						if($(this).children('a').hasClass('install')){
							if(currentTab=='#roles'){
								viewRolesInstalled(packageId,platform);
							}else{
								viewUsersInstalled(packageId,platform);
							}
						}else if($(this).children('a').hasClass('not-installed')){
							
							if(currentTab=='#roles'){
								viewRolesNotInstalled(packageId,platform, type, url);
							}else{
								viewUsersNotInstalled(packageId,platform, type, url);
							}
						}
					}
				});
			}
		});
		
	});
	$('#users .nav li a').off('click').click(function(){
		var selectedApp = $('.app_box .selected');
		var packageId = selectedApp.data('packageid');
		var platform = selectedApp.data('platform');
		var url = selectedApp.data('url');
		var type = selectedApp.data('type');
		if($(this).hasClass('install')){
			viewUsersInstalled(packageId,platform);
		}else if($(this).hasClass('not-installed')){
			viewUsersNotInstalled(packageId,platform, type, url);
		}
	});
	$('#roles .nav li a').off('click').click(function(){
		var selectedApp = $('.app_box .selected');
		var packageId = selectedApp.data('packageid');
		var platform = selectedApp.data('platform');
		var url = selectedApp.data('url');
		var type = selectedApp.data('type');
		if($(this).hasClass('install')){
			viewRolesInstalled(packageId,platform);
		}else if($(this).hasClass('not-installed')){
			viewRolesNotInstalled(packageId,platform, type, url);
		}
	});
	
	var viewRolesNotInstalled = function(packageId,platform, type, url){
		$.get('/mam/api/apps/roles/not-installed', {
			'platform':platform,
			'packageid':packageId
		}, function(data){
			compileHandlbarsTemplate('roles_table_notinstalled', data, function(tempGen){
				$('#roles_not-installed').html(tempGen);
				var roles_table_installed = $('#roles_not-installed .main-table').dataTable({
					"sDom" : "<'row-fluid'<'tabel-filter-group span8'T><'span4'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
					"iDisplayLength" : 20,		
					"bStateSave" : false,
					"oTableTools" : {
						"aButtons" : ["copy", "print", {
							"sExtends" : "collection",
							"sButtonText" : 'Save <span class="caret" />',
							"aButtons" : ["csv", "xls", "pdf"]
						}]
					}
				});
				$('#roles button').removeClass('btn-danger');
				$('#roles button').addClass('btn-success').text("Install");
				$('#roles button').off('click').click(function(){
					var roles = [];
					$('#roles_not-installed .main-table input[type=checkbox]:checked').each(function(){
						roles.push($(this).data('role'));
					});
					$.post('/mam/api/apps/roles/install', JSON.stringify({
						'roles' : roles,
						'platform':platform,
						'packageid':packageId,
						'url': url,
						'type': type
					}),function(){
						$(".alert span").html('App will be installed to selected roles');
						$(".alert").show();
					});
				});
			});
		});
	};
	var viewRolesInstalled = function(packageId,platform){
		$.get('/mam/api/apps/roles/installed', {
			'platform':platform,
			'packageid':packageId
		}, function(data){
			compileHandlbarsTemplate('roles_table_installed', data, function(tempGen){
				$('#roles_installed').html(tempGen);
				var roles_table_installed = $('#roles_installed .main-table').dataTable({
					"sDom" : "<'row-fluid'<'tabel-filter-group span8'T><'span4'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
					"iDisplayLength" : 20,		
					"bStateSave" : false,
					"oTableTools" : {
						"aButtons" : ["copy", "print", {
							"sExtends" : "collection",
							"sButtonText" : 'Save <span class="caret" />',
							"aButtons" : ["csv", "xls", "pdf"]
						}]
					}
				});
				$('#roles button').removeClass('btn-success');
				$('#roles button').addClass('btn-danger').text("Uninstall");
				$('#roles button').off('click').click(function(){
					var roles = [];
					$('#roles_installed .main-table input[type=checkbox]:checked').each(function(){
						roles.push($(this).data('role'));
					});
					$.post('/mam/api/apps/roles/uninstall', JSON.stringify({
						'roles' : roles,
						'platform':platform,
						'packageid':packageId
					}),function(){
						$(".alert span").html('App will be uninstalled from the selected roles');
						$(".alert").show();
					});
				});
			});
		});
	};
	
	var viewUsersInstalled = function(packageId,platform){
		$.get('/mam/api/apps/users/installed', {
			'platform':platform,
			'packageid':packageId
		}, function(data){
			compileHandlbarsTemplate('users_table_installed', data, function(tempGen){
				$('#users_installed').html(tempGen);
				var roles_table_installed = $('#users_installed .main-table').dataTable({
					"sDom" : "<'row-fluid'<'tabel-filter-group span8'T><'span4'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
					"iDisplayLength" : 20,		
					"bStateSave" : false,
					"oTableTools" : {
						"aButtons" : ["copy", "print", {
							"sExtends" : "collection",
							"sButtonText" : 'Save <span class="caret" />',
							"aButtons" : ["csv", "xls", "pdf"]
						}]
					}
				});
				$('#users button').removeClass('btn-success');
				$('#users button').addClass('btn-danger').text("Uninstall");
				$('#users button').off('click').click(function(){
					var users = [];
					$('#users_installed .main-table input[type=checkbox]:checked').each(function(){
						users.push($(this).data('user'));
					});
					$.post('/mam/api/apps/users/uninstall', JSON.stringify({
						'users' : users,
						'platform':platform,
						'packageid':packageId
					}),function(){
						$(".alert span").html('App will be uninstalled from the selected users');
						$(".alert").show();
					});
				});
			});
		});
	};
	var viewUsersNotInstalled = function(packageId,platform, type, url){
		
		$.get('/mam/api/apps/users/not-installed', {
			'platform':platform,
			'packageid':packageId
		}, function(data){
			compileHandlbarsTemplate('users_table_notinstalled', data, function(tempGen){
				$('#users_not-installed').html(tempGen);
				var roles_table_installed = $('#users_not-installed .main-table').dataTable({
					"sDom" : "<'row-fluid'<'tabel-filter-group span8'T><'span4'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
					"iDisplayLength" : 20,		
					"bStateSave" : false,
					"oTableTools" : {
						"aButtons" : ["copy", "print", {
							"sExtends" : "collection",
							"sButtonText" : 'Save <span class="caret" />',
							"aButtons" : ["csv", "xls", "pdf"]
						}]
					}
				});
				$('#users button').removeClass('btn-danger');
				$('#users button').addClass('btn-success').text("Install");
				$('#users button').off('click').click(function(){
					var users = [];
					$('#users_not-installed .main-table input[type=checkbox]:checked').each(function(){
						users.push($(this).data('role'));
					});
					$.post('/mam/api/apps/users/install', JSON.stringify({
						'users' : users,
						'platform':platform,
						'packageid':packageId,
						'url': url,
						'type': type
					}),function(){
						$(".alert span").html('App will be installed to selected roles');
						$(".alert").show();
					});
				});
			});
		});
	}
	//Utilities
	var changeState = function(){
		$('.app_box a').not('.selected').each(function(){
			$(this).fadeTo("slow", 0.1);
		});
	};
	var compileHandlbarsTemplate = function(template_name, data, callback){
		$.get('/mam/assets/partials/'+template_name+'.hbs', function(template){
			var tempInstance = Handlebars.compile(template);
			var tempGen = tempInstance(JSON.parse(data));
			callback(tempGen);
		});
	};
});
