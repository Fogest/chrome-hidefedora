var fedoras = [],
	removalMethod = 'hide';

chrome.storage.sync.get("removalMethod", function(items) {
	if(_.has(items, "removalMethod")) {
		removalMethod = items.removalMethod;
	}
});

chrome.storage.local.get("fedoras", function(items) {
	if(_.has(items, "fedoras")) {
		fedoras = items.fedoras;
	}
});

var randomInt = function(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
};

var submitReport = function(profileId) {
	$.ajax({
		url: 'https://jhvisser.com/hidefedora/index.php',
		type: 'POST',
		data: {
			submit: 1,
			profileUrl: profileId
		}
	});
};

var onReportClick = function(e) {
	$(this).prop('disabled', true);
	submitReport($(this).attr("profileId"));
};

var process = function(outerSelector, innerSelector) {
	$(outerSelector).each(function(index, element) {
		var el = $(element),
			profileId = el.find('[oid]').first().attr('oid');
			thisEl = $(this);

		if(_.contains(fedoras, profileId)) {

			switch(removalMethod) {
				// Hide
				case "hide":
					thisEl.remove();
					break;
				// Replace
				case "replace-fedora-cat":
					if(!thisEl.hasClass("hide-fedora-found")) {

						thisEl.addClass("hide-fedora-found");

						var fileUrl = chrome.extension.getURL('resources/pics/fedora-cats/' + randomInt(1,22) + '.jpg');

						// Title
						el.find(".Ub.gna")
							.html("Fedora replaced with a cat")
							.parent()
							.removeAttr('oid')
							.attr("href", fileUrl);
						// Text
						el.find(".Ct").html("Meow meow");
						// Img
						el.find(".Uk.vKa")
							.removeAttr('oid')
							.attr("src", "")
							.attr("src", fileUrl)
							.parent()
							.attr("href", fileUrl);
						// Controls
						el.find(".REa.Sea").remove();
						// Replies
						el.find(".Cx.fr").remove();
					}
					break;
			}

		}
		else {
			if(!thisEl.hasClass("hide-fedora-tagged")) {

				thisEl.addClass("hide-fedora-tagged");
				thisEl
					.find('.RN.f8b')
					.first()
					.after('<button type="button" profileId="' + profileId + '" class="hide-fedora-report-btn">Report Reddit Armie</button>');

				thisEl.find('.hide-fedora-report-btn').click(onReportClick);
			}
		}
	});
};

var execute = function() {
	process(".Yp.yt.Xa", ".ve.oba.HPa > a");
	process(".Ik.Wv", ".fR > a");
};

$.getJSON("https://jhvisser.com/hidefedora/getJSON.php", function(res) {
	fedoras = res.fedoras;
    chrome.storage.local.set({
      fedoras: res.fedoras
    });
});


$(function() {

	var target = document.querySelector('.yJa');
	 
	if(target !== null) {

		// Set MutationObserver
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		var observer = new MutationObserver(function() {
			execute();
		});
		 
		var config = { childList: true, subtree: true };
		 
		observer.observe(target, config);

		// Execute removal a couple of times before MutationObserver kicks in
		var counter = 0;
		var interval = setInterval(function() {
			execute();

	    	counter++;
	    	if(counter === 8) {
	        	clearInterval(interval);
	    	}
		}, 1000);
	}

});
