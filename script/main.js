(function() {

	var variant;

	$(function() {

		variant =  $('#main');
		variant.hide();
		
		variant.fadeIn(200, function() {
			whenDocumentFadeIn();
		});
		
		makeLinksFadeOut();
		
	});



	function whenDocumentFadeIn() {
	}



	function makeLinksFadeOut() {
		$("a").click(function(event) {
			var tr = $(event.target);
			event.preventDefault();
			variant.fadeOut(200, function() {
				setTimeout(function() {
					variant.show();
				},1000);
				location = tr.attr("href");
			});
		});
	}



})();