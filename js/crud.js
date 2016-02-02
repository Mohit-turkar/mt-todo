var DbManager = function(className){
  /*className : table name in use*/
  var self = this;

  Parse.initialize("kT4B4zJ0hzvwZEy7mc2Q7C3UxwTLhcwq8NfQrZql", "HnNMLMqYU3Mpcbr54zl2VD6juuoinUvruPcyOpCQ");
  var DbObj = Parse.Object.extend(className);

  var dbObj = new DbObj();
  var query = new Parse.Query(DbObj);

  var queryAction = function(item,successCb){
    query.equalTo("objectId", item.objectId);
    query.first({
      success: function(object){
        successCb(object);
      },
      error: function(error){
        alert("Error: " + error.code + " " + error.message);  
      }
    });
  }

  /*item: item that needs to be saved*/
  self.create = function(item,cb){
    dbObj.save(item).then(function(obj){
      self.fetch();
      cb(obj);
    });
  }
  
  self.fetch = function(fetchParam,cb){
    if(fetchParam){
      query.equalTo(fetchParam.prop, fetchParam.val);
    }
    query.find({
      success: function(data){
        var jsonData = [];
        for(var idx in data){
          jsonData.push(data[idx].toJSON());
        }
        if(cb){
          cb.call(null,'success',jsonData);
        }
        //AppEvent.fire('refresh',data);
      },
      error: function(error){
        alert("Error: " + error.code + " " + error.message);
      }
    });
  }
  
  self.update = function(updatedItem,cb){
    var edit = function(object) {
      for(var idx in updatedItem){
        object.set(idx, updatedItem[idx]);
      }
      
      object.save().then(function(){
        self.fetch();
      });
    }
    queryAction(updatedItem,edit);
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

var taskGroupManager = new DbManager('TaskGroup');
var taskItemManager = new DbManager('TaskItems');

$(function(){
  // if (typeof toDoRouteController != 'undefined') {
  //   Backbone.history.start({pushState:true});  
  // }
});