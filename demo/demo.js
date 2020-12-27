var Demo = (function () {
	var gridHtml = '';
	function output(node) {
		var existing = $('#result .croppie-result');
		if (existing.length > 0) {
			existing[0].parentNode.replaceChild(node, existing[0]);
		}
		else {
			$('#result')[0].appendChild(node);
		}
	}

	function popupResult(result) {
		var html;
		if (result.html) {
			html = result.html;
		}
		if (result.src) {
			html = '<br/><img src="' + result.src + '" />';
		}
		swal({
			title: "Confirm the Cropped Image",
			html: true,
			text: html,
			type: "info",
			showCancelButton: true,
			closeOnConfirm: false,
			closeOnCancel: false,
			cancelButtonText: "Cancel, Crop again",
			confirmButtonText: "Upload Image",
		},
			function (isConfirm) {
				if (isConfirm) {
					swal("Uploaded", "Image Successfully Uploaded", "success");
					var reader = new FileReader();
					reader.onload = function (e) {
						vanilla.bind({
							url: e.target.result
						});
					}
				} else {
					swal("Cancelled", "Crop your image again", "error");
				}
			});
		setTimeout(function () {
			$('.sweet-alert').css('margin', function () {
				var top = -1 * ($(this).height() / 2),
					left = -1 * ($(this).width() / 2);

				return top + 'px 0 0 ' + left + 'px';
			});
		}, 1);
	}

	function initVanilla() {
		var vEl = $('.vanilla-demo').last()[0],
			vanilla = new Croppie(vEl, {
				viewport: { width: 290, height: 290 },
				boundary: { width: 300, height: 300 },
				showZoomer: true,
				enableOrientation: true,
				enableZoom: true,
				enableResize: true,
				enableExif: false
			});
		vanilla.bind({
			zoom: 0
		});

		$(vEl).parent().find('.vanilla-result').on('click', function (ev) {
			vanilla.result({
				type: 'blob'
			}).then(function (blob) {
				popupResult({
					src: window.URL.createObjectURL(blob)
				});
			});
		});

		$(vEl).parent().find('.vanilla-rotate').on('click', function (ev) {
			vanilla.rotate(parseInt($(this).data('deg')));
		});

		function readFile(input) {
			if (input.files && input.files[0]) {
				var reader = new FileReader();
				var imgH, imgW;
				reader.onload = function (e) {
					vanilla.bind({
						url: e.target.result
					});
				}
				reader.readAsDataURL(input.files[0]);
				
				
			}
			else {
				swal("Sorry - you're browser doesn't support the FileReader API");
			}
		}

		$(vEl).parent().find(".upload").on('change', function () {
			readFile(this);
		});

		$(vEl).parent().find('.remove').on('click', function () {
			$(this).closest('.cropper').remove();
		});
	}
	$('#add').on('click', function () {
		var lastCropper = $('.cropper').last()[0];
		if ($(lastCropper).find('.upload').length) {
			if ($(lastCropper).find('.upload')[0]) {
				var imgSrc = $(lastCropper).find('.upload')[0];
				if (imgSrc.files.length <= 0) {
					swal("","Select an image for the last imagebox", "error");
					return;
				}
			}
		}
		$('.grid').append(gridHtml);
		initVanilla();

	});

	function loadGridHTML() {
		gridHtml = $(".grid").html();
	}


	function init() {
		loadGridHTML();
		initVanilla();
	}

	return {
		init: init
	};
})();