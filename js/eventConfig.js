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