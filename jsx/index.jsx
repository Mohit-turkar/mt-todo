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
      console.log(obj);
      console.log(obj.toJSON());
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

  render: function() {
    return (
      <ul id="differentiator" className="nav nav-tabs">
        <li><a href="#">All</a></li>
        <li><a href="#">Pending</a></li>
        <li><a href="#">Completed</a></li>
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

  render: function() {
    var item = this.props.item 
    return (
      <tr className="success">
        <td>{item.title}</td>
        <td>{item.status}</td>
        <td>Delete</td>
        <td>{item.createdAt}</td>
        <td>{item.updatedAt}</td>
      </tr>
    );
  }

});

ReactDOM.render(
      <ToDoApp/>,
      document.getElementById('todo')
    );