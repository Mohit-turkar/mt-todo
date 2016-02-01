var TaskManager = function(){

  var self = this;

  Parse.initialize("kT4B4zJ0hzvwZEy7mc2Q7C3UxwTLhcwq8NfQrZql", "HnNMLMqYU3Mpcbr54zl2VD6juuoinUvruPcyOpCQ");
  var Task = Parse.Object.extend("Task");
  var Tasks = Parse.Collection.extend({
    model: Task
  });

  var tasks = new Tasks();
  var task = new Task();
  var query = new Parse.Query(Task);

  var queryAction = function(item,successCb){
    query.equalTo("objectId", item.objectId);
    query.first({
      success: function(object){
        successCb(object);
      },
      error: function(){
        alert("Error: " + error.code + " " + error.message);  
      }
    });
  }

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
        }
    });
  }
  
  self.update = function(item,status,cb){
    var edit = function(object) {
      object.set("status", status);
      object.save().then(function(){
        self.fetch();
      });
    }
    queryAction(item,edit);
  }

  self.remove = function(item,cb){
    var destroy = function(object) {
      object.destroy({
        success: function(myObject) {
          self.fetch();
        },
        error: function(myObject, error) {
          alert("Error: " + error.code + " " + error.message);
        }
      });
    }
    queryAction(item,destroy);
  }
};

var taskManager = new TaskManager();