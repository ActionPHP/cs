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

App.Models.Cast = Backbone.Model.extend({});
App.Models.Character = Backbone.Model.extend({

	

});

App.Models.Scene = Backbone.Model.extend({});

App.Views.SceneCast = Backbone.View.extend({
	el: '#scene-cast',

	initialize: function(){
		
		this.el = '#scene-cast';
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
		var that = this;
		scene.fetch({

			success: function(response) {

				var the_scene = response.toJSON();
				characters = the_scene.cast;

				that.getCharacters(characters);
				that.getCast(the_scene.production_id, characters);


			}

		});

	},

	getCharacters: function (characters) {

				var that = this;
				console.log(this.el);
				_.each(characters, function(character_id){

						var the_character = new App.Models.Character({ id: character_id});
						the_character.url = '/SAPI/character/' + character_id;
						the_character.fetch({

							success: function (character) {
								
								var characterItemView = new App.Views.CharacterItem;

								var view = characterItemView.render(character).el;

								$(that.el).append(view);

								console.log(view);
							}
						});
				});
	},

	getCast: function(production_id, characters){

			console.log(characters);
		
			productionCast = new App.Collections.ProductionCast;
			productionCast.url = '/SAPI/production/cast/' + production_id;
			productionCast.fetch({

			success: function (cast) {
				var  castList = new App.Views.ProductionCastList;
				castList.collection = cast;
				castList.render(characters);
			}

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

App.Views.ProductionCastList = Backbone.View.extend({

	el: '#available-cast-list',

	initialize: function () {
		
		//this.el = '#available-cast-list';

	},

	render: function (characters) {
		 
		 var that = this;
		 var cast = this.collection;

		 _.each(cast.models, function (the_cast) {

		 	var the_cast = the_cast.toJSON();

		 	presence = $.inArray(the_cast.id, characters); //We're checking if the character is already in the cast list => -1 one means not in array
		 	
		 	if(presence == -1 ){

		 		var productionCastItem = new App.Views.ProductionCastItem({ model: the_cast});
		 		var view = productionCastItem.render().el;

		 		that.$el.append(view);
		 		//console.log(that.$el.html());
		 	}
		 

		 });

		 return this;

	},


});

App.Views.ProductionCastItem = Backbone.View.extend({

	tagName: 'li',
	
	render: function() {
			var that = this;
			var template = _.template($('#character-item-template').html());
			

			var character_id = this.model.id;
			var the_character = new App.Models.Character;
			the_character.url = '/SAPI/character/' + character_id;
			the_character.fetch({

				success: function (character) {
					
					var view = template(character.toJSON());
					that.$el.html(view);
					console.log(that.el);
				}

			})

		return this;
	}

});

App.Collections.ProductionCast = Backbone.Collection.extend({

	//model: 'App.Models.Cast'

});



		$(document).ready(function () {
			
		$('#scene-cast').sortable({ connectWith: "#available-cast-list"});
		$('#available-cast-list').sortable({connectWith: "#scene-cast"});

	})
new App.Views.SceneCast;	
})();