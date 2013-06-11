// JavaScript Document


$(document).ready( function(){
	
	window.cast_array = Array();//Let's make sure this global var starts out clean
	//////////////FIX THIS! At the moment window.cast_array persists on the page!
	Backbone.emulateJSON = false;
	var CastFormView = Backbone.View.extend({
		
		el: '#forms',
		
		initialize: function(){
			
			
			
		},
		
		render: function(options){
			
			var template = _.template($('#cast-details-template').html(), options);
			this.$el.html(template);
			
		}
		
	});
	
	
	var CallSheetFormView = Backbone.View.extend({
		
		el: '#forms',
		
		initialize: function(){
			
			
			
		},
		
		render: function(options){
			
			var template = _.template($('#call-sheet-details-template').html(), options);
			this.$el.html(template);
			
		}
		
	});
	
		var SceneFormView = Backbone.View.extend({
		
		el: '#forms',
		
		initialize: function(){
			
			
			
		},
		
		render: function(options){
			
			var template = _.template($('#scene-details-template').html(), options);
			this.$el.html(template);
			
		}
		
	});
	
	var	ProductionView = Backbone.View.extend({
		
		el: '#view-port',
		
		initialize: function(){
			
			console.log('Initializing...');	
			
		},
			
		render: function(options){
			
			console.log('Displaying production details.');
			var template = _.template( $('#production-details-form').html(), options);
			this.$el.html(template);
			
			var production_collection_view = new ProductionCollectionView();
			production_collection_view.render();
			
			
		},
		
		events: {
			
			'submit #production': function(ev){
				
					production_name = $('.production-title-name').val();	
					var production = new Production();
					//console.log(production);
					
					production.save({name: production_name},{ 
						
						success: function(response){
					//	alert('Responding');
						console.log('Production response:' );
						console.log(response.toJSON());
						thing = response.toJSON();
						console.log(thing.title);
						//movement = response.toJSON().post;
						//movement = movement.toJSON(movement);
					//	console.log(movement.title);
						
						}
						
					});
				return false;
		
					
			}
			
		}
		
		
	});
	
	
	
	
	
	var CastView = Backbone.View.extend({
		
			el: '#view-port',
			render: function(options){
			
		
			
			var template = _.template( $('#cast-template').html(), options);
			this.$el.html(template);
				
			},
			
			events: {
				
				'click #add-cast': function(){
					
					var cast_form_view = new CastFormView();
					cast_form_view.render();
					
				},
				'click #add-call-sheet': function(){
					
					var call_sheet_form_view = new CallSheetFormView();
					call_sheet_form_view.render();
					
				},
				'click #add-scene': function(){
					
					var scene_form_view = new SceneFormView();
					scene_form_view.render();
					
				}
								
				
			}
		
		
	});
	
	var CrewView = Backbone.View.extend({
		
			el: '#view-port',
			render: function(options){
				
				var template = _.template( $('#crew-template').html(), options);
				this.$el.html(template);
				
				
			}
		
	});
	
	var CallSheetListView = Backbone.View.extend({
		
			el: '#call-sheet-list'
			 
		
	});
	
	var CallSheetView = Backbone.View.extend({
			
			initialize: function(){
				
				window.cast_array = Array();//This resets the array used to create the cast table and relate the cast to the scene table	
				
			},
			el: '#view-port',
			render: function(options){
				
				var template = _.template( $('#call-sheet-template').html(), options);
				this.$el.html(template(this.model.toJSON()));
			
			
				//Let's load up our scenes
				scene_collection_view = new SceneCollectionView();
				
				scene_collection_view.render(this.model.id);
				
				//console.log(this.model.id);
				

			}
		
		
	});
	
	var SceneCollectionView = Backbone.View.extend({
		
		el: '#call-sheet-scene-list',
		
		
		model: 'Scene',
		
		render: function(id){
			//id gives us the call sheet id
			that = this;
			var scenes = new SceneCollection();
			scenes.url = '/SAPI/call-sheet/scenes/' + id;
			scenes.fetch({
				
				success: function(response){
						
					this.model = response;
						
					_.each(this.model.models, function(scene){
						
							var the_view = new SceneItemView({ model: scene}).render().el;
							
							
							that.$el.append(the_view);
							
							console.log();
							//
					}, this);
				
				var array = $.map(window.cast_array, function(k, v) {
						
						
						return [k];
					
					});
				
				$.each(array, function(index, value){
					
					character_view = new CharacterView();
					character_view.render(value);
					console.log(index);
					
				});
				
				console.log(array);
					//console.log(response.toJSON());		
						
				}
				
			});
		}
		
	});
	
	var SceneItemView = Backbone.View.extend({
		tagName: 'tr',
		render: function(options){
		
		
		
		
		var template = _.template( $('#scene-table-row').html(), options);
		
		this.$el.html(template(this.model.toJSON()));
		window.cast_array = this.model.toJSON().cast_array;	
		return this;
			
		}
		
	});
	
	CharacterView = Backbone.View.extend({
		
			el: '#scene-character-list',
			model: 'Character',
			
			render: function(id){
				that = this;
				this.character = new Character();
				
				this.character.url = '/SAPI/character/' + id;
				this.character.fetch({
					
					success: function(response){
							
						this.model = response.toJSON();
						
						this.model.num = getTheKey(this.model.id, window.cast_array);
						console.log();
						character_item = new CharacterItemView({ model: this.model});
						var the_view = character_item.render().el;
						console.log(window.cast_array);	
						
						
						that.$el.append(the_view);
					}
					
				});
				
				//var template = _.template( $('#scene-table-row').html(), {});
				
				
			}
		
		});
		
	CharacterItemView = Backbone.View.extend({
		
		tagName: 'tr',
		
		render: function(options){
			
			var template = _.template( $('#character-table-row').html(), options);
		
			this.$el.html(template(this.model));
			
			return this;
			
			
			
		}
		
		
	});
		
		
		
		
	
	
	var production_view = new ProductionView();
	var cast_view = new CastView();
	var crew_view = new CrewView();
	var call_sheet_view = new CallSheetView();
	
	var Router = Backbone.Router.extend({
		
		routes:{
			
			'': 'welcome',
			'production': 'production',
			'production/:id' : 'production_details',
			'crew' : 'crew',
			'cast' : 'cast',
			'call-sheet/:id' : 'call-sheet'			
			
		}
		
		
	});
	
	//Models
	
	Cast = Backbone.Model.extend({
		
		url: '/SAPI/cast'	
		
		
	});
	
	Scene = Backbone.Model.extend({
		
		url: '#'
		
	});
	
	CallSheet = Backbone.Model.extend({
		
		url: '/SAPI/call-sheet'
		
	});
	
	Production = Backbone.Model.extend({
		
			urlRoot: '/SAPI/production',
			defaults:{
				
				name: 'Working title'
			
			}
		});
		
	Character = Backbone.Model.extend({
		
		url: '#'
		
	});
	
	
	

	//Collections
	
	var SceneCollection = Backbone.Collection.extend({
		
		model: Scene
		
	});
	
	var Productions = Backbone.Collection.extend({
		
		initialize: function(){
			
			
		},
		url: '/SAPI/production',
		model: Production,
		comparator: function(item) {
			
				return -item.get('id');
			
			}
		
	});
	
	var productions = new Productions();
	var ProductionCollectionView = Backbone.View.extend({
		
		el: '#production-list',
		
		initialize: function(){
			
			
			//this.render();
			
		},
		
		tagName:'ul',
		render: function(ev){
			
			console.log(this.el);
			var that = this;
			
				productions.fetch({
				
				success: function(response){
					
					this.model = response;
					_.each(this.model.models, function(production){
				
					var the_view = new ProductionListItemView({ model: production}).render().el;
					that.$el.append(the_view);		
					//
			}, this);
			
					
					
				}
				
				
			});
			
			
		}

		
	});
	
	
	var ProductionListItemView = Backbone.View.extend({
	
		tagName: 'li',
		render: function(){
			
			var template = _.template($('#production-list-template').html());
			
			this.$el.html(template(this.model.toJSON())); 
			//console.log(this.el);
			return this;
			
			
		}
		
		
	});
	
	
	var ProductionDetailsView = Backbone.View.extend({
		
		el: '#view-port',
		
		render: function(){
			
			var template = _.template($('#production-details').html());
			
			this.$el.html(template(this.model.toJSON()));
		
			var call_sheet_url = '/SAPI/production/call-sheet/'+this.model.id;
			this.call_sheet = new CallSheet();
			this.call_sheet.url = call_sheet_url;
			this.call_sheet.fetch({
				
				success: function(response){
						
					call_sheet_data = response;
					var calls_sheet_data_collection_view = new CallSheetCollectionView({ model: call_sheet_data});
					calls_sheet_data_collection_view.render();
						
				}
				
			});
		
			return this;
			
		}
		
		
	});
	
	var CallSheetCollection = Backbone.Collection.extend({
	
		
		model: CallSheet
		
	});
	
	var CallSheetCollectionView = Backbone.View.extend({
		
		el: '#call-sheet-list',
		
		render: function(){
			
			that = this;
			
			_.each(this.model.attributes, function(call_sheet){
				
					var the_view = new CallSheetItemView({ model: call_sheet}).render().el;
					that.$el.append(the_view);
					
					//
			}, this);
			//console.log(this.model);
			
		}
		
	});
	
	var CallSheetItemView = Backbone.View.extend({
		
		tagName: 'li',
		render: function(){
			
			var template = _.template($('#call-sheet-list-template').html());
			
			this.$el.html(template(this.model)); 
			//console.log(this.el);
			return this;
			
			
		}
		
	});
	
	
	
	var Tester = Backbone.Model.extend({
		
		initialize: function(){
		
		//	console.log('Testering');
			
		},
		defaults: {
				
				name: 'Jean Paul',
				trueName: 'The Master'
				
		}
		
	});
	
	var TesterView = Backbone.View.extend({
		
		initialize: function(){
		
			//console.log('Testering view');
			
		},
			el: '#view-port',
			template: $('#tester-template').html(),
			
			render: function(){
				
				var tmpl = _.template(this.template);
				
				this.$el.html( tmpl(this.model.toJSON())); //console.log(this.$el.html( ));
				return this;
			}
			
	});
	
	var tester = new Tester();
	
	testerView = new TesterView({
		
		el: '#view-port',
		model: tester
		
	});
	
	testerView.render();
	
		//Routing
	router = new Router();
	router.on('route:welcome', function(){
	
	//	console.log('This will lead us to the welcome screen');
		
	});
	router.on('route:production', function(){
	
			production_view.render();
			
		
	});
	
	router.on('route:production_details', function(id){
			
			that = this;
			this.production = new Production({ id: id});
			this.production.fetch({
				
				success: function(response){
					
					production_data = response;
					
					var production_details_view = new ProductionDetailsView({ model: production_data});
					production_details_view.render();
					
				//	production_details_view.render();
					
					
				}
				
				});
			
			
			
		
	});
	
	router.on('route:cast', function(){
	
		console.log('This is the cast');
		cast_view.render();
		
	});
	
	router.on('route:crew', function(){
	
		console.log('This is the crew');
		crew_view.render();
		
	});
	router.on('route:call-sheet', function(id){
		that = this;
		//console.log('This is the call sheet.' + id);
		this.call_sheet = new CallSheet({ id: id });
		this.scenes = new SceneCollection({id:id});

		this.call_sheet.url = '/SAPI/call-sheet/' + id;
		this.call_sheet.fetch({
						
			success: function(response){
				
				var call_sheet_view = new CallSheetView({ model: response});
				call_sheet_view.render();
				
			
				}
			
		});
	
		
	});
	
	
	
	Backbone.history.start();

	/**/
});






















jQuery(document).ready(function(){
jQuery('.cast-check').change(
	
	function(){
		
		
		cast_id = jQuery(this).val();
		cast_li_id = 'scene-cast-'+cast_id;
		if(jQuery(this).is(':checked')){
			
			cast = jQuery(this).parent().text();
			cast_li = '<li id="'+cast_li_id+'" >'+cast+'</li>';
			jQuery('#scene-cast-list').append(cast_li);
		
			
		}else{
			
			cast_li_id = '#'+cast_li_id;
			jQuery(cast_li_id).remove();
			
			
		}
		
	}
	);
	
	});
	
	function apc(content){
		
		console.log(content)	;
		
		
	}