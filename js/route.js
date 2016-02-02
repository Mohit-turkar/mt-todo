var ToDoRouteController = Backbone.Router.extend({

  routes: {
    "list(/:index)(/:activeTab)": "renderHome",
    "*path" : "defaultRoute"
  },
  renderHome: function(index,activeTab) {
    console.log(index + " " +activeTab);
  },
  defaultRoute: function() {
    this.navigate("#list",{trigger:true});
  }

});