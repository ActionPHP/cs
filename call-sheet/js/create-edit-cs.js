(function(){

	window.App = {

		Models: {},
		Views: {},
		Collections: {},
		Router: {}

	}

	var vent = _.extend({}, Backbone.Events);

	App.Models.CallSheet = Backbone.Model.extend({

		'url': '/SAPI/call-sheet',

		defaults: {

			'name': 'Call sheet name',
			'call_time': '07:00 AM',
			'call_date': '2013-06-08',
			'location': 'Location address',
			'contact': 'Contact name and number',
			'meeting_point': 'Meeting point',
			'notes': 'Your notes'

		}

	});

	App.Collections.CallSheet = Backbone.Collection.extend({});

	App.Views.CallSheet = Backbone.View.extend({

		el: '#view-port',

		initialize: function () {
			
			production_id = 2;
			App.call_sheet = new App.Models.CallSheet({ production_id: production_id });
			App.call_sheet.url = '/SAPI/call-sheet';

			this.model = App.call_sheet;
			console.log(this.model);
			this.model.on('change', this.saveCallSheet, this);

			this.render(production_id);

		},
		render: function (production_id) {
			
			var template = _.template($('#edit-call-sheet').html());
			this.$el.html((template(App.call_sheet.toJSON())));

			

		},

		saveCallSheet: function (model) {

			App.call_sheet.save(model.toJSON(),{

				success: function(){

					

				}

			});

					
		},

		events: {

			'blur .ff-clean-input': function (e) {

				var $input = $(e.currentTarget);
				var $value = $input.val();
				var $field = $input.attr('name');

				this.model.set($field, $value);

				console.log($value);
				console.log($field);
				// body...
			}

		}





	});

	// Cast Manager

	//Crew Manager

	new App.Views.CallSheet();


$.fn.fedit = function(){
	
	return this.each(function(_){

		if(this.tagName != 'TEXTAREA'){

			var value = $(this).val()
			console.log(value);
		};

		

	});

}

	

	})();