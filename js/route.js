var ToDoRouteController = Backbone.Router.extend({

  routes: {
    "list": "renderHome",
    "list(/:name)": "renderHome",
    "list(/:name)(/:activeTab)": "renderHome",
    "*path" : "defaultRoute"
  },
  renderHome: function(name,activeTab) {
    console.log(index + " " +activeTab);
  },
  defaultRoute: function() {alert('default');
    this.navigate("#list",{trigger:true});
  }

});

var toDoRouteController = new ToDoRouteController();