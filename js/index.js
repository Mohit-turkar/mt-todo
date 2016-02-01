var AppEvent = {
  subscribers:{
  },
  unsubscribe:function(type,func){
    if (typeof this.subscribers[type] == 'undefined'){
      return;
    } 
    for(var idx = 0;idx < this.subscribers[type].length;idx++) {
      if (this.subscribers[type][idx] == func) {
        this.subscribers[type].splice(idx,1);
      }
    }
  },
  haveSubscribers:function(type){
    if (typeof this.subscribers[type] == 'undefined'){
      return false;
    } 
    return this.subscribers[type].length > 0;
  },
  removeSubscribers:function(type){
    if (typeof this.subscribers[type] == 'undefined'){
      return;
    } 
    this.subscribers[type] = [];
  },
  subscribe:function(type,handler){
    if (typeof this.subscribers[type] == 'undefined'){
      this.subscribers[type] = []
    } 
    this.subscribers[type].push(handler);
  },
  fire:function(type,data){
    var handlerList = this.subscribers[type];
    if (!handlerList ) {
      return;
    }
    for(var idx =0;idx < handlerList.length;idx++){
      if (handlerList[idx]){
        handlerList[idx](data); 
      }
    }
  }
};

var TaskManager = function(){

  var self = this;

  Parse.initialize("kT4B4zJ0hzvwZEy7mc2Q7C3UxwTLhcwq8NfQrZql", "HnNMLMqYU3Mpcbr54zl2VD6juuoinUvruPcyOpCQ");
  var Task = Parse.Object.extend("Task");
  var Tasks = Parse.Collection.extend({
    model: Task
  });

  var tasks = new Tasks();
  var task = new Task();

  self.create = function(title,cb){
    task.save({title:title,status:'pending',active:true}).then(function(obj){
      self.fetch();
      cb(obj);
    });
  }
  
  self.fetch = function(cb){
    tasks.fetch({
        success: function(data) {
          if(cb){
            cb.call(null,'success',data.toJSON());
          }
          AppEvent.fire('refresh',data.toJSON());
        },
        error: function(data, error) {
          if(cb){
            cb.call(null,'error');
          }
          console.log(error);
        }
    });
  }
  
  self.update = function(){

  }

  self.remove = function(){

  }
};

var taskManager = new TaskManager();