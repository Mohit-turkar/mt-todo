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
  defaultRoute: function(path) {
    console.log("default-Route",path);
    this.navigate("/",{trigger:true});
  }
});

var toDoRouteController = new ToDoRouteController();