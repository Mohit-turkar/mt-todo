var gUrlParams = {list:0,active:'In Progress'};

var ToDoRouteController = Backbone.Router.extend({
  routes: {
    "list": "renderHome",
    "list(/:idx)": "renderHome",
    "list(/:idx)(/:activeTab)": "renderHome",
    "*path" : "defaultRoute"
  },
  renderHome: function(idx,activeTab) {
    var active = 'In Progress'
    if(activeTab == 'trash'){
      active = 'Trash'
    }else if(activeTab == 'completed'){
      active = 'Completed'
    }

    gUrlParams = {list:idx,active:active};
  },
  defaultRoute: function(path) {
    this.navigate("#list/0/inProgress",{trigger:true});
  }
});

var toDoRouteController = new ToDoRouteController();