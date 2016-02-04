var GroupModal =  React.createClass({
	getInitialState: function() {
		return {
			item:null,
			val :'' 
		};
	},
	componentDidMount: function() {
		var self = this;
		window.AppEvent.subscribe('setGrpModal',function(item){
			self.setState({item:item,val:item.name});
		});
		
		$('#grpModal').on('hidden.bs.modal', function () {
    		self.setState({item:null,val:''});
		});
	},
	handleChange: function(evt){
		this.setState({val: evt.target.value});
	},
	save: function(){
		var self = this;
		var editedItem = {};
		if(self.state.item){
			window.taskGroupManager.update(self.state.item,{name:self.refs.grpName.value},function(){
				$('#grpModal').modal('hide');
			});
		}else{
			window.taskGroupManager.create({name:self.refs.grpName.value},function(){
				$('#grpModal').modal('hide');
			});
		}
	},
	render: function() {
		var item = this.state.item;

		return (
			<div id="grpModal" className="modal fade" role="dialog">
			  <div className="modal-dialog">
			    <div className="modal-content">
			      <div className="modal-header">
			        <button type="button" className="close" data-dismiss="modal">&times;</button>
			        <h4 className="modal-title">Create/Edit Task Group</h4>
			      </div>
			      <div className="modal-body">
			        <span>Add/Edit task list name</span>
			        <span>{" "}</span>
			        <input type='text' ref='grpName' value={this.state.val} placeholder="Enter the task list name" onChange={this.handleChange}/>
			      </div>
			      <div className="modal-footer">
			        <button type="button" onClick={this.save} className="btn btn-default">Save</button>
			      </div>
			    </div>
			  </div>
			</div>
		);
	}
});

ReactDOM.render(
      <GroupModal/>,
      document.getElementById('todo-modal-grp')
    );