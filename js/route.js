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

Date.prototype.yyyymmdd = function() {
 var yyyy = this.getFullYear().toString();
 var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
 var dd  = this.getDate().toString();
 return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};