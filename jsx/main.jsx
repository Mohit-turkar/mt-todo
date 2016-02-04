var ToDoApp = React.createClass({

  render: function() {
    return (
      <div>
        <TaskGroup/>
        <TaskItems/>
      </div>
    );
  }

});

var TaskGroup = React.createClass({
  getInitialState: function() {
    return {
      list:[] 
    };
  },
  componentDidMount: function() {
    var self = this;
    var firstFetch = true;
    
    var processList = function(status,data){
      var list = [];
      for(var idx in data){
        list.push(<TaskGroupRow id={idx} key={idx} item={data[idx]}/>);
      }
      self.setState({list:list});
    }
    
    window.taskGroupManager.fetch();

    window.AppEvent.subscribe('refresh-TaskGroup',function(data){
      processList('success',data);
      if(firstFetch){
        firstFetch = false;
        $('#taskList'+window.gUrlParams.list).trigger('click');
      }
    });
  },
  render: function() {
    return (
      <div className="col-xs-3">
        <h2 className="sub-header">Task Groups</h2>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th className="col-md-1">Name</th>
                <th className="col-md-2 text-right">
                  <input type='button' data-toggle="modal" data-target="#grpModal" value='Create Group' title='Create a new task group.'/>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.list}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

});

var TaskGroupRow = React.createClass({
  handleClick: function(){
    var self = this;
    var id = this.props.item.objectId;
    window.AppEvent.fire('fetchList',id);
    window.AppEvent.fire('ActiveList',id);

    $(this.refs.Row).siblings().removeClass('active');
    $(this.refs.Row).addClass('active');
    self.customHref();
  },
  customHref:function(){
    var active = 'inProgress'
    if(gUrlParams.active == 'Trash'){
      active = 'trash'
    }else if(gUrlParams.active == 'Completed'){
      active = 'completed'
    }
    window.location.hash = "#list/"+this.props.id+"/"+active;
  },
  render: function() {
    var item = this.props.item;
    var actionGrp = {complete:'hidden'};
    return (
      <tr ref="Row" className={'clickable-row'}>
        <td id={"taskList"+this.props.id} style={{'cursor':'pointer'}} className="col-md-1 text-left" 
        onClick={this.handleClick}>{item.name}</td>
        <td className="col-md-2 text-right">
          <UserActions name='taskGroups' actionGrp={actionGrp} item={item}/>
        </td>
      </tr>
    );
  }

});

var TaskItems = React.createClass({

  getInitialState: function() {
    return {
      list:[] 
    };
  },
  componentDidMount: function() {
    var self = this;
    
    var fetchParam = {};
    var processList = function(status,data){
      var list = [];
      for(var idx in data){
        list.push(<TaskItemRow key={idx} item={data[idx]}/>);
      }
      self.setState({list:list});
    }

    
    window.AppEvent.subscribe('fetchList',function(list_id){
      fetchParam = {prop:'list_id',val:list_id};
      window.taskItemManager.fetch(fetchParam,processList);
    });

    window.AppEvent.subscribe('refresh-TaskItems',function(data){
      processList('success',data);
    });
  },
  render: function() {
    return (
      <div className="col-xs-9">
        <h2 className="sub-header">Tasks</h2>
        <TaskTypes/>

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="col-md-3 text-left">Title</th>
                <th className="col-md-2 text-center">Priority</th>
                <th className="col-md-2 text-center">Date</th>
                <th className="col-md-2 text-right">User Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.list}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

});

var TaskItemRow = React.createClass({
  getInitialState: function() {
    return {
      activeTab: window.gUrlParams.active 
    };
  },
  showDataCb : function(name){
    var self = this;
    self.setState({activeTab:name});
  },
  componentDidMount: function() {
    window.AppEvent.subscribe('showData',this.showDataCb);
  },
  componentWillUnmount: function() {
    window.AppEvent.unsubscribe('showData',this.showDataCb);
  },
  render: function() {
    var item = this.props.item;

    var activeTabCls = ''
    var activeTab = this.state.activeTab;

    if( (activeTab == 'Trash') && (item.active) ){
      activeTabCls = 'hidden';
    }else if( (activeTab == 'In Progress') && ((item.status == 'completed') || (!item.active)) ){
      activeTabCls = 'hidden';
    }else if( (activeTab == 'Completed') && ((item.status == 'pending') || (!item.active)) ){
      activeTabCls = 'hidden';
    }
 
    return (
      <tr className={activeTabCls}>
        <td className="col-md-3 text-left">{item.title}</td>
        <td className="col-md-2 text-center">{item.priority}</td>
        <td className="col-md-2 text-center">{item.date.iso}</td>
        <td className="col-md-2 text-right">
          <UserActions name='taskActions' item={item}/>
        </td>
      </tr>
    );
  }

});

var UserActions = React.createClass({

  getInitialState: function() {
    return {
      actionGrp: {edit:'',remove:'',complete:''}
    };
  },
  updateListItem:function(){
    var self = this;
    $('#grpModal').modal('show');
    window.AppEvent.fire('setGrpModal',self.props.item);
  },
  removeList:function(){
    window.taskGroupManager.remove(this.props.item);
  },
  updateTask: function(action){
    var self = this;
    var item = self.props.item;
    
    if(action == 'edit'){
      $('#taskModal').modal('show');
      window.AppEvent.fire('setTaskModal',item);
    }else if(action == 'remove'){
      window.taskItemManager.update(item,{active:false});
    }else if(action == 'statusUpdate'){
      window.taskItemManager.update(item,{status:'completed'});
    }
  },
  handleClick: function(action){
    var self = this;
    var p = self.props;
    if(p.name == 'taskActions'){
      self.updateTask(action);
    }else if(p.name == 'taskGroups'){
      if(action == 'edit'){
        self.updateListItem();
      }else if(action == 'remove'){
        self.removeList();
      }
    }
  },
  render: function() {
    var self = this;
    var p = this.props;
    var actionGrp = this.state.actionGrp;

    if(p.actionGrp){
      for(var idx in p.actionGrp){
        actionGrp[idx] = p.actionGrp[idx];
      }
    }

    var trashCls = '';
    var completeCls = '';

    if(p.name == 'taskActions'){
      if(!p.item.active){
        trashCls = 'hidden';
      }else if(p.item.status == 'completed'){
        completeCls = 'hidden';
      }
    }
    

    return (
      <div className={trashCls}>
        <a href="javascript:void(0)" onClick={self.handleClick.bind(null,'statusUpdate')} className={"btn "+actionGrp.complete + " "+completeCls}>
          <span className="glyphicon glyphicon-ok"></span> 
        </a>
        <a href="javascript:void(0)" onClick={self.handleClick.bind(null,'edit')} className={"btn "+actionGrp.edit + " "+completeCls}>
          <span className="glyphicon glyphicon-pencil"></span>
        </a>
        <a href="javascript:void(0)" onClick={self.handleClick.bind(null,'remove')} className={"btn "+actionGrp.remove}>
          <span className="glyphicon glyphicon-trash"></span> 
        </a>
      </div>
    );
  }

});

var TaskTypes = React.createClass({
  setTab:function(evt){
    $('#taskTypes li').removeClass('active');
    $(evt.target).parent().addClass('active');
    window.AppEvent.fire('showData',evt.target.firstChild.nodeValue);
  },
  render: function() {
    var type1 = (gUrlParams.active == "In Progress")?'active':'';
    var type3 = (gUrlParams.active == "Trash")?'active':'';
    var type2 = (gUrlParams.active == "Completed")?'active':'';

    return (
      <ul id="taskTypes" className="nav nav-tabs">
        <li className={type1}><a href={"#list/"+ gUrlParams.list +"/inProgress"} onClick={this.setTab}>In Progress</a></li>
        <li className={type2}><a href={"#list/"+ gUrlParams.list +"/completed"} onClick={this.setTab}>Completed</a></li>
        <li className={type3}><a href={"#list/"+ gUrlParams.list +"/trash"} onClick={this.setTab}>Trash</a></li>
        <input type="button" data-toggle="modal" data-target="#taskModal" style={{'float':'right'}} value='Add Task'/>
      </ul>
    );
  }
});

ReactDOM.render(
      <ToDoApp/>,
      document.getElementById('todo')
    );