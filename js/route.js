var ToDoRouteController = Backbone.Router.extend({

  routes: {
    "list": "renderHome",
    "list(/:name)": "renderHome",
    "list(/:name)(/:activeTab)": "renderHome",
    "*path" : "defaultRoute"
  },
  renderHome: function(name,activeTab) {
    console.log("hello " +name + " " +activeTab);
  },
  defaultRoute: function() {
    console.log("default-Route");
    this.navigate("#mt-todo/list",{trigger:true});
  } 

});

var toDoRouteController = new ToDoRouteController();