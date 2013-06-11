/*FIX:

- character list in call sheet - it runs itself twice
- el undefined in App.Views.Production, when fetching production;
*/
(function(){

	window.App = {

		Models: {},
		Views: {},
		Collections: {},
		Router: {}

	}

	var vent = _.extend({}, Backbone.Events);

	App.Models.Production =  Backbone.Model.extend({

		

	});
	App.Models.CallSheet =  Backbone.Model.extend({});
	App.Models.Cast =  Backbone.Model.extend({});
	App.Models.Character =  Backbone.Model.extend({});
	App.Models.Crew =  Backbone.Model.extend({});
	App.Models.Scene =  Backbone.Model.extend({});

	App.Collections.Productions =  Backbone.Collection.extend({

			model: App.Models.Production

	});
	App.Collections.CallSheets =  Backbone.Collection.extend({});
	App.Collections.CastMembers =  Backbone.Collection.extend({});
	App.Collections.Characters =  Backbone.Collection.extend({})	;
	App.Collections.CrewMembers =  Backbone.Collection.extend({});
	App.Collections.Scenes =  Backbone.Collection.extend({});

	
	App.Views.ProductionItem =  Backbone.View.extend({

		tagName: 'li',

		render: function(){

			var template = _.template($('#production-item').html());

			this.$el.html(template(this.model.toJSON()));

			return this;
		}

	});

	App.Views.Productions =  Backbone.View.extend({

		el: '#view-port',

		initialize: function() {
			
			vent.on('productions:show', this.render, this);

		},

		render: function(){

			this.$el.html($('#productions-main').html());

			App.productions = new App.Collections.Productions;
			App.productions.url = '/SAPI/production';

			App.productions.fetch({

				success: function (productions) {
					
					productionList = new App.Views.ProductionList({ collection: App.productions });

				}
			});
			
			return this;

			},

		events: {

			'submit #create-production-form' : function (e) {

				e.preventDefault();
				console.log(App.productions);
				var name = $('#production-name').val();
				//var productions = new App.Collections.Productions;
				//console.log(productions.toJSON());
				App.productions.url = '/SAPI/production';
				App.productions.create({ name: name}, {wait: true});
				console.log(App.productions);
				return false;
			}

		}

		

	});

	App.Views.ProductionList = Backbone.View.extend({

		el: '#production-list',

		initialize: function(){

			this.collection.on('add', this.addOne, this);
			this.render();

		},

		render: function() {

			this.productions = this.collection;
			
			_.each(this.productions.models, function(production){


				this.addOne(production);

			}, this);
		},

		addOne: function (production) {
			
			var view = new App.Views.ProductionItem({ model: production });
			this.$el.prepend(view.render().el);
		
		}

	});

	App.Views.Production = Backbone.Collection.extend({
		
		el: '#view-port',

		initialize: function(){

			vent.on('production:show', this.render, this);
		},

		render: function(production_id) {
			
			that = this;

			console.log(this);
			var production = new App.Models.Production();
			production.url = '/SAPI/production/' + production_id;
			production.fetch({

				success: function(production) {

					var template = _.template($('#production-view').html());
					
					that.el ='#view-port'; //Strange, el is not passed through.
					$(that.el).html(template(production.toJSON()));
					console.log(production_id);
					that.listCallSheets(production_id);
					that.listCast(production_id);
					that.listCrew(production_id);

				}

			},{wait:true});
			

			
			return this;
		},

		listCallSheets: function (production_id) {
			
			var callSheetsView = new App.Views.CallSheets({ });
			callSheetsView.render(production_id);

		},

		listCast: function (id) {
			// body...
		},

		listCrew: function  (id) {
			// body...
		}

	})

	App.Views.CallSheet =  Backbone.View.extend({

		el: '#view-port',
		initialize: function  (id) {
			
			vent.on('call-sheet:show', this.render, this);

		},

		render: function (id) {
			
			that = this;
			var call_sheet = new App.Models.CallSheet;
			call_sheet.url = '/SAPI/call-sheet/' + id;
			call_sheet.fetch({

				success: function (call_sheet) {

					var template = _.template($('#call-sheet').html());
					that.$el.html(template(call_sheet.toJSON()));

					vent.trigger('scenes:show', id);
				}
			});

		
					
			//console.log(template());
			
			//this.renderScenes(id);	




		}/*,

		renderScenes:  function (call_sheet_id) {
			
			var scenesView = new App.Views.Scenes({ id: call_sheet_id});
			var the_scenes = scenesView.render().el;
			$('#production-scene-table').append(the_scenes);
			console.log(the_scenes);
			
		}*/

	});
	App.Views.CallSheets =  Backbone.View.extend({

		el: '#production-call-sheet-list',

		render: function (production_id) {
			
			
			this.renderCallSheets(production_id);
			
			

			return this;
		},

		renderCallSheets: function (production_id) {
			
			that = this;

			var callSheets = new App.Collections.CallSheets;

			callSheets.url = 'http://famefox.org/SAPI/production/call-sheet/' + production_id;
			callSheets.fetch({ 

				success: function (response) {

					
					this.collection = response;

					_.each(this.collection.models, function(call_sheet){

						callSheetItem = new App.Views.CallSheetItem({model: call_sheet});
						$(that.el).append(callSheetItem.render().el);
						

					});

				}

			});


			
		}


	});

	App.Views.CallSheetItem = Backbone.View.extend({

		tagName: 'li',

		render: function() {

			var template = _.template($('#call-sheet-item').html());
			this.$el.html(template(this.model.toJSON()));
			
			return this;

		}




	});
	App.Views.Cast =  Backbone.View.extend({});
	App.Views.CastMembers =  Backbone.View.extend({});
	App.Views.Character =  Backbone.View.extend({});
	App.Views.Characters =  Backbone.View.extend({
		el: '#production-cast-list',

		initialize: function(){
			//this.el = '#production-character-list';
			vent.on('production-characters:show', this.render, this);
		},

		render: function(cast_array){
			

			that = this;
						
			$.each( cast_array, function(index, character_id){

				var character = new App.Models.Character({id: character_id});
				character.url = '/SAPI/character/' + character_id;
				character.fetch({

					success: function(cast){

						cast.set('num', index )
						var character_item = new App.Views.CharacterItem({model: cast});
						var view = character_item.render().el;
						that.$el.append(view);
						
						

					}

				}).complete(function(){

					$('#production-cast-table').trigger('update');

				});

				

			});

			$('#production-cast-table').tablesorter();

		}	

	});
	App.Views.CharacterItem = Backbone.View.extend({

		tagName: 'tr',
		render: function(){

			var template = _.template($('#production-character-item').html());
			var view = template(this.model.toJSON());
			this.$el.html(view);
			
			return this;
		}

	});
	App.Views.Crew =  Backbone.View.extend({});
	App.Views.CrewMembers =  Backbone.View.extend({});
	App.Views.Scene =  Backbone.View.extend({});

	App.Views.Scenes =  Backbone.View.extend({
		
		el: '#production-scene-list',//For some reason this is not recognised
		//tagName: 'tbody',
		
		initialize: function() {
			
			vent.on('scenes:show', this.render, this)
			//this.el = '#production-scene-list';
			//this.render();
			//console.log(this);

		},

		render: function (call_sheet_id) {

			//console.log(id);
			that = this;
			var scenes = new App.Collections.Scenes;
			console.log('rendering scenes...');
			scenes.url = '/SAPI/call-sheet/scenes/' + call_sheet_id;
			scenes.fetch({
				success: function (scenes) {
					
					
		

					_.each(scenes.models, function(scene){

							var	sceneItem = new App.Views.SceneItem({ model: scene });
							var view = sceneItem.render().el;
							
							$('#production-scene-list').append(view);
							cast_array = scene.get('cast_array');

					});

					new App.Views.Characters;
					vent.trigger('production-characters:show', cast_array);
					cast_array = {};
					console.log(cast_array);
						
				}

			});


	

			return this;/**/
		}


	});
	
	App.Views.SceneItem = Backbone.View.extend({

		tagName: 'tr',

		render: function () {
			
			var template = _.template($('#scene-item').html());

			var view = template(this.model.toJSON());
			this.$el.html(view);
			//console.log(this.$el.html());

			return this;
		}

	});

	App.Router =  Backbone.Router.extend({

		routes: {

			'productions': 'productions',
			'production/:id' : 'production',
			'call-sheet/:id' : 'call_sheet_details',
			'cast': 'cast',
			'cast/:id': 'cast_details',
			'crew': 'crew',
			'crew/:id': 'crew_details'


		},

		productions: function(){

			vent.trigger('productions:show');
		},

		production: function(id){

			vent.trigger('production:show', id);
			
		},

		call_sheet_details: function (id) {

			vent.trigger('call-sheet:show', id);
		},

		cast: function(){

		},

		cast_details: function(id){

		},

		crew: function(){

		},

		crew_details: function(id){

		},

		call_sheet: function(id){

		}
	});

	
})();

$(document).ready(function(){
	var eventListener = _.extend({}, Backbone.Events);
	eventListener.on('all', function(e){console.log(e)}, this);

	router = new App.Router;
	new App.Views.Scenes;
	new App.Views.CallSheet;
	new App.Views.Production;
	new App.Views.Productions;
	
	//Backbone.emulateJSON = true
	Backbone.history.start();
	
});

function getTheKey( needle, array ){
			
		var theKey = '';	
	$.each(array, function(key,value){
		
		if(needle == value){
		
		theKey = key ;
		
		return key;
		
		}
		
		
	});
	
	return theKey;
}
