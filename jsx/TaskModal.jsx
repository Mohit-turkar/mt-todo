var TaskModal =  React.createClass({
	getInitialState: function() {
		return {
			item:null,
			title :'',
			priority:'medium',
			date: new Date(),
			list_id : null
		};
	},
	componentDidMount: function() {
		var self = this;
		window.AppEvent.subscribe('setTaskModal',function(item){
			self.setState({item:item,title:item.title,priority:item.priority,date:item.date});
		});
		
		window.AppEvent.subscribe('ActiveList',function(id){
			self.setState({list_id:id});
		});

		$('#taskModal').on('hidden.bs.modal', function () {
    		self.setState({item:null,title:'',priority:'medium',date:''});
		});

		$('#datepicker').datepicker();
	},
	handleTitleChange: function(evt){
		this.setState({title: evt.target.value});
	},
	handlePriorityChange: function(evt){
		this.setState({priority: evt.target.value});
	},
	handleDateChange: function(evt){
		this.setState({date: evt.target.value});
	},
	handleSubmit: function(evt){
		var self = this;
		var editedItem = {};
		var arr = $('#taskForm').serializeArray();
		for(var idx in arr){
			editedItem[arr[idx].name] = arr[idx].value;
			if(arr[idx].name == 'date'){
				editedItem[arr[idx].name] = $('#datepicker').datepicker('getDate');
			}
		}
		if(self.state.item){
			window.taskItemManager.update(self.state.item,editedItem,function(){
				$('#taskModal').modal('hide');
			});
		}else{
			editedItem.status = 'pending';
			editedItem.active = true;
			editedItem.list_id = this.state.list_id;
			window.taskItemManager.create(editedItem,function(){
				$('#taskModal').modal('hide');
			});
		}
		evt.preventDefault();
	},
	render: function() {
		return (
			<div id="taskModal" className="modal fade" role="dialog">
			  <div className="modal-dialog">
			    <div className="modal-content">
			      <div className="modal-header">
			        <button type="button" className="close" data-dismiss="modal">&times;</button>
			        <h4 className="modal-title">Create/Edit Task</h4>
			      </div>
			      <div className="modal-body">
			        <form id="taskForm" onSubmit={this.handleSubmit} className="form-horizontal" role="form">
					    <div className="form-group">
					      <label className="control-label col-sm-2" htmlFor="taskName">Task:</label>
					      <div className="col-sm-10">
					        <input type="text" name="title" onChange={this.handleTitleChange} value={this.state.title} className="form-control" id="taskName" placeholder="Task to do."/>
					      </div>
					    </div>
					    <div className="form-group">
					      <label className="control-label col-sm-2" htmlFor="dueDate">Due date:</label>
					      <div className="col-sm-10">
                    		<input name="date" onChange={this.handleDateChange} id='datepicker' type='text' className="form-control" />
					      </div>
					    </div>
					    <div className="form-group">
					      <label className="control-label col-sm-2" htmlFor="priority">Priority:</label>        
					      <div className="col-sm-10">
					      	<select name="priority" onChange={this.handlePriorityChange} style={{'float':'left'}} value={this.state.priority}>
					      		<option value="low">low</option>
					      		<option value="medium">medium</option>
					      		<option value="high">high</option>
					      	</select>
					      </div>
					    </div>
					</form>
			      </div>
			      <div className="modal-footer">
			        <input type="submit" form="taskForm" className="btn btn-default" value="Save"/>
			      </div>
			    </div>
			  </div>
			</div>
		);
	}
});

ReactDOM.render(
      <TaskModal/>,
      document.getElementById('todo-global')
    );