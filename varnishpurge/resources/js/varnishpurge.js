(function($, undefined) {
	var VarnishPurge, PurgeBan, Modals;

	VarnishPurge = function() {
		this.init();
	}

	VarnishPurge.prototype.init = function() {
		$('form.purgeban').each(function() {
			new PurgeBan(this, $('#purgeban-output .output'));
		});

		new Modals();
	}

	PurgeBan = function(form, $output) {
		this.$form = $(form);
		this.$output = $output;
		this.$form.submit($.proxy(this.submit, this));
	}

	PurgeBan.prototype.submit = function(event) {
		event.preventDefault();

		this.$output.html('');

		$.post(this.$form.attr('action'), this.$form.serialize())
			.then($.proxy(function(response) {
				// Update output
				this.$output.html(
					response.query + '\n\n' +
					response.message
				);

				// Update CSRF token
				this.$form.find('input[name=\'' + response.CSRF.name + '\']')
					.val(response.CSRF.value);
			}, this));
	}

	Modals = function () {
		this.modals = {};

		// Set up cancel buttons
		$('[data-form-cancel]').click($.proxy(function (event) {
			event.preventDefault();
			this.close($(event.target).closest('.modal'));
		}, this));

		// Set up trigger buttons
		$('[data-modal-trigger]').click($.proxy(function(event) {
			var id = $(event.target).data('modal-trigger'),
				$element = $('#' + id);

			event.preventDefault();

			if ($element.length) {
				if (!this.modals[id]) {
					this.modals[id] = {
						$element: $element,
						modal: new Garnish.Modal($element)
					};
				} else {
					this.open(id);
				}
			}
		}, this));
	}

	Modals.prototype.open = function (id) {
		if (this.modals[id]) {
			this.modals[id].modal.show();
		}
	}

	Modals.prototype.close = function($modal) {
		var id = $modal.attr('id');

		if (this.modals[id]) {
			this.modals[id].modal.hide();
		}
	}

	new VarnishPurge();
}(window.jQuery));