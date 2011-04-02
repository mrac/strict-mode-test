(function() {

	var variant;

	
	$(function() {

		variant =  $('#main');
		
		// pageshow event - fade in the variant if it's not displayed
		$(window).bind('pageshow', function() {
			var disp = variant.css('display');
			if(!disp || disp === 'none') {		
				$('#main').fadeIn(200);
			}
		});

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
				location = tr.attr("href");
			});
		});
	}



})();