(function () {

window.App = {

		Models: {},
		Views: {},
		Collections: {},
		Router: {}

	}

var vent = _.extend({}, Backbone.Events);

App.Models.SceneCast = Backbone.Collection.extend({

	model: 'App.Models.Character'

});

App.Models.Character = Backbone.Model.extend({

	

});

App.Models.Scene = Backbone.Model.extend({});

App.Views.SceneCast = Backbone.View.extend({
	el: '#scene-cast',

	initialize: function(){
		
		this.scene_id = 5;
		this.render();
		this.getScene();
		

	} ,

	render: function(){

		$('#view-port').html($('#scene-cast-template').html());

		return this;

	},

	getScene: function () {
		
		var scene = new App.Models.Scene;

		scene.url = '/SAPI/scene/' + this.scene_id;
		that = this;
		scene.fetch({

			success: function(response) {

				var the_scene = response.toJSON();
				characters = the_scene.cast;

				that.getCharacters(characters);

				
			}

		});

	},

	getCharacters: function (characters) {

				_.each(characters, function(character_id){

						the_character = new App.Models.Character({ id: character_id});
						the_character.url = '/SAPI/character/' + character_id;
						the_character.fetch({

							success: function (character) {
								
								characterItemView = new App.Views.CharacterItem;

								var view = characterItemView.render(character).el;

								console.log(character.toJSON())
							}
						});
				});
			}

});

App.Views.CharacterItem = Backbone.View.extend({

	tagName: 'li',

	render: function (character) {
		
		template = _.template($('#character-item-template').html());

		var view = template(character.toJSON());

		this.$el.html(view);

		return this;
	}


});

App.Collections.ProductionCast = Backbone.Collection.extend({});



		$(document).ready(function () {
			
		$('#scene-cast').sortable({ connectWith: "#available-cast-list"});
		$('#available-cast-list').sortable({connectWith: "#scene-cast"});

	})
new App.Views.SceneCast;	
})();