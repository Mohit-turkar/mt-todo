var ToDoApp = React.createClass({
  render: function() {
    return (
      <div id="mainContainer">
        <TaskCreator/>
        <TaskTypes/>
        <TaskTable/>
      </div>
    );
  }
});

var TaskCreator = React.createClass({
  handleSubmit: function(evt){
    var self = this;
    var title = self.refs.title.value;

    window.taskManager.create(title,function(obj){
      self.refs.title.value = '';
      alert('Successfully saved.');
    });
    evt.preventDefault();
  },
  render: function() {
    var self = this;
    return (
      <form id="taskCreator" onSubmit={self.handleSubmit}>
        <input type="text" ref="title" placeholder="Enter the task"/>
        <input type="submit" value="Submit"/>
      </form>
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
    return (
      <ul id="taskTypes" className="nav nav-tabs">
        <li className='active'><a href="#all" onClick={this.setTab}>All</a></li>
        <li><a href="#pending" onClick={this.setTab}>Pending</a></li>
        <li><a href="#completed" onClick={this.setTab}>Completed</a></li>
      </ul>
    );
  }
});

var TaskTable = React.createClass({
  getInitialState: function() {
    return {
      rowItems:[] 
    };
  },
  componentDidMount: function() {
    var self = this;
    window.taskManager.fetch(function(status,data){
      if(status === 'success'){
        self.setState({rowItems:data});
      }else{
        alert('An error occured while Save.Please Try Again');
      }
    });

    window.AppEvent.subscribe('refresh',function(data){
      self.setState({rowItems:data});
    });
  },
  render: function() {
    var rowItems = this.state.rowItems;
    var itemList = [];
    
    for(var idx in rowItems){
      itemList.push(<RowItems key={rowItems[idx].objectId} item={rowItems[idx]}/>);
    }
    
    return (
      <table className="table table-responsive">
        <thead>
          <tr>
            <th className='text-center'>Title</th>
            <th className='text-center'>Status</th>
            <th className='text-center'>Action</th>
            <th className='text-center'>Created At</th>
            <th className='text-center'>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {itemList}
        </tbody>
      </table>
    );
  }

});

var RowItems = React.createClass({
  getInitialState: function() {
    return {
      activeTab:'All' 
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
    var item = this.props.item
    var statusCls = 'danger';
    var activeTabCls = ''
    var activeTab = this.state.activeTab;

    if(activeTab == 'All'){
      activeTabCls = '';
    }else if(activeTab == 'Pending' && (item.status == 'completed')){
      activeTabCls = 'hidden';
    }else if(activeTab == 'Completed' && (item.status == 'pending')){
      activeTabCls = 'hidden';
    }
    
    if(item.status == 'completed'){
      statusCls = 'success';
    }
    
    return (
      <tr className={statusCls + ' ' + activeTabCls}>
        <td>{item.title}</td>
        <td>{item.status}</td>
        <td>
          <TaskActions item={item}/>
        </td>
        <td>{item.createdAt}</td>
        <td>{item.updatedAt}</td>
      </tr>
    );
  }

});

var TaskActions = React.createClass({
  getInitialState: function() {
    return {
      resetVal:'null' 
    };
  },
  handleSelect:function(evt){
    var self = this;
    var item = this.props.item;
    if(evt.target.value == 'remove'){
      window.taskManager.remove(item,self.forceUpdate());
    }else if(evt.target.value == 'mark-complete'){
      window.taskManager.update(item,'completed',self.setState({resetVal:'null'}));
    }else if(evt.target.value == 'mark-pending'){
      window.taskManager.update(item,'pending',self.setState({resetVal:'null'}));
    }
  },
  render: function() {
    var item = this.props.item;
    var customOpt = <option value='mark-complete'>Mark as Completed</option>;

    if(item.status == 'completed'){
      customOpt = <option value='mark-pending'>Mark as Pending</option>;
    }

    return (
      <select value={this.state.resetVal} onChange={this.handleSelect}>
        <option value='null'>Select Action</option>
        <option value='remove'>Remove Task</option>
        {customOpt}
      </select>
    );
  }
});

ReactDOM.render(
      <ToDoApp/>,
      document.getElementById('todo')
    );