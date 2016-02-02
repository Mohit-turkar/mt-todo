var ToDoRouteController = Backbone.Router.extend({

  routes: {
    "list": "renderHome",
    "list(/:name)": "renderHome",
    "list(/:name)(/:activeTab)": "renderHome",
    "*path" : "defaultRoute"
  },
  renderHome: function(name,activeTab) {
    console.log(name + " " +activeTab);
  },
  defaultRoute: function() {
    console.log("defaultRoute");
    this.navigate("#mt-todo/#list",{trigger:true});
  } 

});

var toDoRouteController = new ToDoRouteController();