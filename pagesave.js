//just an alias. swipes up data without too much effort.
function swipe(v){return document.querySelector(v)};

//Grabs a comment
function swipeComment(element, id)
{
	let origin = element[id]
	let res = {};
	res.author = {};
	res.author.name = origin.getElementsByClassName("comment-renderer-header")[0].getElementsByTagName("a")[0].innerText;;
	res.author.url = origin.getElementsByClassName("comment-renderer-header")[0].getElementsByTagName("a")[0].href;
	res.author.imageUrl = origin.getElementsByClassName("yt-thumb-clip")[0].getElementsByTagName("img")[0].src;;
	
	res.text = origin.getElementsByClassName("comment-renderer-text-content")[0].innerText;
	try{
		res.upvotes = origin.getElementsByClassName('comment-renderer-like-count off')[0].innerText;
	} catch(error)
	{
		res.upvotes = 0;
	}
	
	return res;
}

//Grabs a suggested video.
function swipeSuggest(element, id)
{
	let origin = element[id];
	let res = {};
	res.author = {};
	try{
		res.author.name = origin.getElementsByClassName("content-wrapper")[0].getElementsByClassName("stat attribution")[0].firstElementChild.innerText;
	} catch (err) {
		res.author.name = '';
	}
	
	res.videoUrl = origin.getElementsByTagName("a")[0].href;
	res.videoImageUrl = origin.getElementsByTagName("img")[0].src;
	res.videoTitle = "[UNABLE TO CAPTURE VIDEO TITLE]";
	
	// Retrieve title.
	try {
		res.videoTitle = origin.getElementsByClassName("title")[0].innerText;
	} catch (err){
		res.videoTitle = origin.getElementsByClassName(" content-link spf-link  yt-uix-sessionlink      spf-link ")[0].title;
	}
	
	// Retrieve view count
	try {
		res.views = origin.getElementsByClassName('stat view-count')[0].firstChild.textContent;
	} catch (err){
		res.views = 0;
	}
	
	// Retrieve video length;
	try {
		res.time = origin.getElementsByClassName('video-time')[0].innerText;
	} catch (err){
		res.time = '00:00';
	}
	
	console.log("Suggested Video: " + res.videoTitle);
	
	return res;
}

// Begin generating a snapshot to rebuild the webpage in the old format.
function swipeall ()
{
	snapshot = {};

	console.log("beginning page content scrape...");
	// video title, author, upload date, and description.
	snapshot.title = swipe('[class=watch-title]').title;
	snapshot.author = {}
	snapshot.sDescription = swipe('[itemprop=description]').content;
	snapshot.lDescription = document.getElementById("eow-description").innerHTML
	snapshot.uploadDate = swipe('[itemprop=uploadDate]').content;
	snapshot.publishDate = document.getElementsByClassName("watch-time-text")[0].innerText.substr(12);
	snapshot.viewCount = swipe('[itemprop=interactionCount]').content;
	
	//find vote count and rating.
	snapshot.upvoteCount = parseInt(document.getElementsByClassName("yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup like-button-renderer-like-button like-button-renderer-like-button-unclicked  yt-uix-post-anchor yt-uix-tooltip")[0].getElementsByTagName("span")[0].innerHTML.replace(/,/g, ''));
	snapshot.downvoteCount = parseInt(document.getElementsByClassName("yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup like-button-renderer-dislike-button like-button-renderer-dislike-button-unclicked  yt-uix-post-anchor yt-uix-tooltip")[0].getElementsByTagName("span")[0].innerHTML.replace(/,/g, ''));
	snapshot.voteCount = snapshot.upvoteCount + snapshot.downvoteCount;
	snapshot.ratingEst = Math.round((snapshot.upvoteCount / snapshot.voteCount) * 10)/2;

	//Get author name, URL, and image.
	let authorContainer = document.getElementById("watch7-user-header");
	snapshot.author.url = authorContainer.getElementsByClassName('yt-user-photo yt-uix-sessionlink      spf-link ')[0].href;
	snapshot.author.imageUrl = authorContainer.getElementsByClassName('yt-thumb-clip')[0].getElementsByTagName("img")[0].src;
	snapshot.author.name = authorContainer.getElementsByClassName('yt-thumb-clip')[0].getElementsByTagName("img")[0].alt;

	//page URL and embed URL
	snapshot.url = swipe('[itemprop=url]').href;
	snapshot.embedUrl = swipe('[itemprop=embedUrl]').href;
	snapshot.videoId = swipe('[itemprop=videoId]').content;

	snapshot.thumbnailUrl = swipe('[itemprop=thumbnailUrl]').href;

	//Gather comments.
	snapshot.comments = [];
	let discuss = document.getElementById("comment-section-renderer-items").getElementsByClassName('comment-thread-renderer  vve-check-visible vve-check-hidden');
	for(i = 0; i < discuss.length; i++)
	{
		snapshot.comments.push(swipeComment(discuss, i));
	}

	//Gather video suggestions.
	let auto = document.getElementById("watch7-sidebar-modules");
	let suggest = document.getElementById("watch-related").getElementsByClassName("video-list-item");

	snapshot.suggestions = [];
	for(i = 0; i < suggest.length; i++)
	{
		console.log(i);
		snapshot.suggestions.push(swipeSuggest(suggest, i));
	}
	
	console.log("Complete!");
	console.log("Title:" + snapshot.title);
	console.log("Author:" + snapshot.author.name);
	console.log("Views:" + snapshot.viewCount + "( " + snapshot.upvoteCount + " up, " + snapshot.downvoteCount + " down)");

	//Gather suggested videos.
	return snapshot;
}
