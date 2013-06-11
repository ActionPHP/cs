(function () {
	
	window.App = {

		Models: {},
		Views: {},
		Collections: {},
		Router: {}

	}
	var vent = _.extend({}, Backbone.Events);

	App.Models.Scene = Backbone.Model.extend({});
	App.Views.Scenes = Backbone.View.extend({
		el: '#view-port',

		initialize: function () {
			
			this.render();
		},

		render: function () {

			var template = _.template($('#edit-scenes').html());

			this.$el.html((template()));
			
		},

		events: {

			'click #add-scene-button' : 'editSceneModal',
			'submit #scene-details-form' : 'saveScene'

		},

		editSceneModal: function () {
			
			console.log('Will add or edit a scene short.');
		},

		saveScene: function (e) {

			e.preventDefault();

			var form = function (ID) {
				
				var val = $(e.currentTarget).find(ID).val();
				val = $.trim(val);
				return val;

			} 

			this.slug_place = form('#slug_place');
			this.slug = form('#slug');
			this.description = form('#description');
			this.day_night = form('#day_night');
			this.pages = form('#pages');
			console.log(this);
		}

	});
	App.Views.SceneList = Backbone.View.extend({});
	App.Views.SceneItem = Backbone.View.extend({});
	App.Collections.Scenes = Backbone.Collection.extend({});


	new App.Views.Scenes();

})();