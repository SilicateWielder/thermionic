// Youtube reformatter script.
// Turns the modern youtube view into 2008-2010 youtube.
// For anyone using this, you'll need to scrape and host your own files.

// Please note, this will break any user features when used. You'll need to refresh for optimal functionality.
function build(snap)
{
	document.head.innerHTML = theme2009.head;
	document.body.innerHTML = theme2009.body;
}


function rewrite(snap)
{
	document.title = "YouTube - " + snapshot.title;
	document.getElementById("player-obj").src = snapshot.embedUrl;
	
	// Rewrite video title.
	document.getElementById("watch-vid-title").innerHTML = `<h1>` + snapshot.title + `</h1>`;
	
	// Rewrite viewcount and rating.
	let ratel = document.getElementsByClassName("master-sprite ratingL")[0];
	ratel.className = "master-sprite ratingL ratingL-5.0";
	ratel.title = snapshot.ratingEst.toPrecision(2);
	document.getElementById("defaultRatingMessage").firstElementChild.innerHTML = snapshot.voteCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	
	document.getElementById("watch-view-count").innerHTML = snapshot.viewCount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	
	// Code to rewrite everything below video rating/vies goes here.
	
	// Rewrite description box.
	
	// Username and link.
	document.getElementById("watch-channel-icon").getElementsByTagName("img")[0].src = snapshot.author.imageUrl;
	document.getElementById("watch-channel-stats").getElementsByClassName("hLink fn n contributor")[0].innerText = snapshot.author.name;
	document.getElementById("watch-channel-stats").getElementsByClassName("hLink fn n contributor")[0].href = snapshot.author.url;
	
	// Upload date.
	document.getElementsByClassName("watch-video-added post-date")[0].innerHTML = snapshot.publishDate;
	
	//fields.
	document.getElementById("watch-url-field").value = snapshot.url;
	document.getElementById("embed_code").value = `<iframe width="560" height="315" src="` + snapshot.embedUrl + `" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
	
	// Description.
	document.getElementsByClassName("description")[0].innerHTML = snapshot.sDescription;
	document.getElementsByClassName("description")[1].innerHTML = snapshot.lDescription;
	
	//More from author
	
	//Related Videos
	let related = document.getElementById("watch-related-vids-body").getElementsByClassName("video-entry");
	for(i = 0; i <= related.length | i <= snapshot.suggestions.length; i++)
	{
		let suggestion = snapshot.suggestions[i];
		if(suggestion != undefined)
		{
			related[i].getElementsByClassName("v90WrapperInner")[0].getElementsByTagName("img")[0].src = suggestion.videoImageUrl;
			related[i].getElementsByClassName("v90WrapperInner")[0].getElementsByTagName("img")[0].title = suggestion.videoTitle;
			related[i].getElementsByClassName("v90WrapperInner")[0].getElementsByTagName("img")[0].alt = suggestion.videoTitle;
			related[i].getElementsByClassName("v90WrapperInner")[0].firstElementChild.href = suggestion.videoUrl;
			related[i].getElementsByClassName("v90WrapperInner")[0].getElementsByClassName("video-time")[0].innerHTML = '<span>' + suggestion.time + '</span>';
			
			related[i].getElementsByClassName("video-main-content")[0].getElementsByClassName("video-mini-title")[0].firstElementChild.title = suggestion.videoTitle;
			related[i].getElementsByClassName("video-main-content")[0].getElementsByClassName("video-mini-title")[0].firstElementChild.innerText = suggestion.videoTitle;
			related[i].getElementsByClassName("video-main-content")[0].getElementsByClassName("video-mini-title")[0].firstElementChild.href = suggestion.videoUrl;
			related[i].getElementsByClassName("video-main-content")[0].getElementsByClassName("video-view-count")[0].innerText = suggestion.views;
			related[i].getElementsByClassName("video-main-content")[0].getElementsByClassName("video-username")[0].firstElementChild.href = suggestion.author.url;
			related[i].getElementsByClassName("video-main-content")[0].getElementsByClassName("video-username")[0].firstElementChild.innerText = suggestion.author.name;
		} else {
			console.log("ERROR: missing suggestion " + i);
		}
	}
	/*
	
	// Begin rewriting the suggestions panel.
	let sgPanel = document.getElementById("watch-related").getElementsByClassName("video-list-item");
	console.log(sgPanel.length + "suggestions available");
	for(i = 0; i < sgPanel.length; i++)
	{
		console.log(i);
		//sgPanel[i].getElementsByClassName("watch-video-date")[0].innerHTML = snapshot.uploadDate;
		
		//Update preview
		sgPanel[i].getElementsByTagName("img")[0].src = snapshot.suggestions[i].videoImageUrl + new Date().getTime();
		
		//Update labels.
		sgPanel[i].getElementsByClassName("title")[0].title = snapshot.suggestions[i].title;
		sgPanel[i].getElementsByClassName("title")[0].innerHTML = snapshot.suggestions[i].videoTitle;
		
		//Update link
		sgPanel[i].getElementsByClassName("video-list-item-link")[0].href = snapshot.suggestions[i].videoUrl;
	}*/
}

function thermsleep (seconds) {
    var start = new Date().getTime();
    while (new Date() < start + seconds*1000) {}
    return 0;
}

if(thermionicActive && !thermionicRan)
{
	$('html, body').animate({
		scrollTop: $("#footer-container").offset().top
	}, 2000).promise().then(function(){
			//code to run after scroll goes here.
			// This second check if it ran is necessary, everything breaks otherwise and I have absolutely no idea why.
				let snapshot = swipeall();
				build(snapshot);
				rewrite(snapshot);
				window.scroll(0, 0);
				thermionicRan = true;
		});
}

