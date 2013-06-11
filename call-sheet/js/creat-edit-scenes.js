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
			
			
			this.call_sheet_id = 6;
			this.render(this.call_sheet_id);
			
		},

		render: function (call_sheet_id) {

			App.scenes = new App.Collections.Scenes;

			var template = _.template($('#edit-scenes').html());

			this.$el.html((template()));
			this.renderScenes(call_sheet_id);

			return this;
			
		},

		renderScenes: function (call_sheet_id) {
			

			App.scenes = new App.Collections.Scenes;
			App.scenes.url = '/SAPI/call-sheet/scenes/' + call_sheet_id;
			App.scenes.fetch({

				success: function (scenes) {
					

					 sceneList = new App.Views.SceneList({ collection: scenes});

					
				}

			});



		},

		events: {

			'click #add-scene-button' : 'editSceneModal',
			'submit #scene-details-form' : 'saveScene'

		},

		editSceneModal: function () {
			
		},

		saveScene: function (e) {

			$('#scene-details-form-template').modal('hide');

			e.preventDefault();
			this.setData(e);

			var sceneItem = new App.Views.SceneItem;
			var scenes = App.scenes;
			scenes.url = '/SAPI/scene';

			scenes.create({

				slug_place: this.slug_place,
				slug: this.slug,
				description: this.description,
				day_night: this.day_night,
				pages: this.pages,
				call_sheet_id: this.call_sheet_id

			});

			console.log(this);
			
		},

		setData: function (e) {
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
			this.notes = form('#notes');
		}

	});

	App.Views.SceneList = Backbone.View.extend({
		el: '#call-sheet-scene-list',

		initialize: function () {
			
			this.collection.on('add', this.addOne, this);
			this.render();

		},

		render: function(){

			this.scenes = this.collection;

			_.each(this.scenes.models, function (scene) {

				this.addOne(scene);

			}, this)

			return this;
			
		},

		addOne: function(scene){

			sceneItem = new App.Views.SceneItem({ model: scene});
			var view = sceneItem.render(scene).el;
			this.$el.prepend(view);

		}
	});


	App.Views.SceneItem = Backbone.View.extend({

		tagName: 'li',

		render: function(scene){

			var template = _.template($('#scene-item').html());

			var view = template(scene.toJSON());

			this.$el.html(view);

			return this;
		},

		events: {

			'click .add-cast-button' : 'addCast'

		},

		addCast: function(){

			console.log(this.model.toJSON());

		}

	});
	App.Collections.Scenes = Backbone.Collection.extend({

		model: App.Models.Scene

	});


	new App.Views.Scenes();

})();