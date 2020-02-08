$( document ).ready(function() {

	console.log("Scripts are linked!");
	
	// INITIALIZE ---------------------------------------------------------------------------------
	
	// TITLE MANAGEMENT
	var title = "";
	setTitle();
	
	// Initialize variables
	// make these not global l a t e r
	var accuseNow = false;							// handles accuse page confirmation
	var hasLookedAtCrimeScene = false;				// handles... if user has looked at crime scene
	var hasLookedAtSuspects = false;				// handles if user has moved to suspect page
	var interviewedSuspect;
	var currentDialogue;
	var accused;

	// TITLE SCREEN TRANSITION
	$("#titleScreen button").click( function() {
		$("#titleScreen").fadeOut();
		$("#titleScreen")
			.parent()
			.fadeOut();
		$("#imageViewer")
			.delay(800)
			.fadeIn(800);
		$("#premisePage .textBoxBorder")
			.delay(1300)
			.fadeIn(1300);
		
		// bring in my goils
		$("#premise span:eq(0)").delay(3800).fadeIn();
		$("#premise span:eq(1)").delay(5400).fadeIn();
		$("#premise span:eq(2)").delay(8300).fadeIn();
		$("#premise span:eq(3)").delay(13000).fadeIn();
		$("#premise span:eq(4)").delay(18500).fadeIn();
	});
	
	// NAVIGATING THE SITE ---------------------------------------------------------------------------------
	
	// BACK BOXES
	// These return user to previous page

	$("#suspectPage .backBox").click( function() {
		$("#suspectPage").fadeOut();
		$("#premisePage").fadeIn();
	});
	
	$("#interviewPage .backBox").click( function() {
		$("#interviewPage").fadeOut();
		$("#suspectPage").fadeIn();
	});
	
	$("#helpMeLeaveCrimeScene").click( function() {
		$("#crimescenePage").fadeOut();
		$("#premisePage")
			.delay(500)
			.fadeIn();
	});

	// Main nav links
	// Basically, handle nav on premise page
	$("#suspectLink").click( function() {
		hasLookedAtSuspects = true;
		$("#premisePage").fadeOut();
		$("#suspectPage")
			.delay(500)
			.fadeIn(1000);
	});
	
	$("#reviewLink").click( function() {
		$("#premisePage").fadeOut();
		$("#crimescenePage")
			.delay(500)
			.fadeIn(1000);

		populateCrimeScene();
	});
	
	$("#jaccuseLink").click( function() {
		// Send a confirm message to user
		// If confirmed, unblock accuse option
		// change link color for good ole user feedback
		if (accuseNow == true) {
			$("#premisePage").fadeOut();
			$("#jaccusePage")
				.delay(500)
				.fadeIn();
		} else {
			accuseNow = confirm("Once you begin your accusation, you've crossed the point of no return.\n \nIf this commitment is agreeable, please click the option again.\n\n");
			if (accuseNow == true) {
				$("#jaccuseLink").css("color" , "red");
			}
		}
	});
	
	$("#brokenTextBox").on("click", "#attempt2", function(){
		$("#crimescenePage").fadeOut();
		$("#premisePage")
			.delay(500)
			.fadeIn();
	});
	
	$("#textBox2").on("click", ".movetointerview", function(){
		populateInterviewFirst();
		playerAnswerValue = 0;
		$("#suspectPage").fadeOut();
		$("#interviewPage")
			.delay(500)
			.fadeIn(1000);
	});
	
	$("#chatInput").on("click", ".choiceMessage", function(){
		currentDialogue = $(this).data("point-value");
		makeConversation();
	});
	
	$(".accuseLink").click( function() {
		// change accused variable depending on who is selected
		accused = $(this).data("accused-type");
		$("#jaccusePage").fadeOut(1000);
		$("#finalTextBox")
			.delay(1100)
			.fadeIn(1000);
		populateEnding();
	});
	
	// 
	$(".columns .sus").on("click", populateDossier);
	
	// FUNCTIONS  ---------------------------------------------------------------------------------
	
	// choose one of five titles on load
	// this is just for fun tbh
	function setTitle () {
		var min = 0;
		var max = 4;
		var random = Math.floor(Math.random() * (max - min + 1)) + min;
		var titleSet = [
			"Love it if We Made it",
			"Another Day in Paradise",
			"Business of Misdemeanors",
			"The Poetry is in the Streets",
			"Truth is only Hearsay",
			"It Dies in Darkness"
		];
		title = titleSet[random];
		document.title = title;
	}
	
	function populateCrimeScene() {
		if (hasLookedAtCrimeScene == true) {
			$("#brokenTextBox")
				.empty()
				.append("<p>It doesn't app''''ear that there's an'y''thing e<br/>lse here for you.</p>")
				.append("<a id='attempt2' href='#HereIsAnotherLinkJustForYou'>Leave the Scene</a>");
		}
		hasLookedAtCrimeScene = true;
	}
	
	function populateDossier() {
		var checkColumn = $(this).parent().index();
		var index;
		
		var suspects = [
			"The Impedantic Allstar",
			"The Idol from the Ethereal Plane",
			"The Chief of Concurrent Police",
			"The 4th Dimension's President",
			"The CEO from the Moon Mist",
			"The Victim"
		];
		var descriptions = [
			"The legend who led his team to victory in the last official season. Quietly fiddling with his ring.",
			"The songstress who tops the charts every year, even without a new release. Visibly annoyed with The Chief.",
			"The dutiful enforcer, who exists everywhere at once. Their attempts to calm The Idol are poorly received.",
			"The self-appointed King of the Void. He stands apart from the rest while surveying the scene in amusement.",
			"The richest woman alive finishes her drink nearby. She appears at home, or at least calm, in the chaos.",
			"It doesn't have much to say on account of being dead."
		];
		var suspectImages = [
			"helmet",
			"pinkTrees",
			"intothezone",
			"theDude",
			"idol"
		];
		// set index, make sure to add 3 if second columns class
		if (checkColumn == 0) {
			index = $(this).index();
		} else {
			index = $(this).index();
			index = index + 3;
		}
		
		// need for populateInterviewFirst
		interviewedSuspect = suspects[index];
		$("#suspectTitle").text(suspects[index]);
		$("#interviewPage img").attr("src","assets/"+suspectImages[index]+".gif");
		
		// populate textbox
		$("#textBox2 h2, #textBox2 p").fadeOut(function() {
			$("#textBox2 h2")
				.text(suspects[index] + "    ")
				.append("<a id='interviewLink"+index+"' class='rightThis movetointerview' href='#interview'>Interview</a>");
			$("#interviewLink5").remove();
			$("#textBox2 p").text(descriptions[index])
		}).fadeIn();
	}
	
	function populateInterviewFirst() {
		$("#chat").empty();
		$("#chatInput").empty();
		var firstDialogue = [];
		var playerFirstDialogue = [];
		
		// choose setup depending on suspect
		switch(interviewedSuspect) {
			case "The Impedantic Allstar":
				firstDialogue = [
					"<p>You calmly approach the Impedantic Allstar so as not to get shocked by his static clouds.</p><br/>",
					"<p>Looking rather distant and unavailable, he doesn't seem to notice your approach.</p>"
				];
				playerFirstDialogue = [
					"<p>You take the moment to better observe his state.</p></br>",
					"<p>While you initially assumed he was lost in thought, the movement of his clouds suggest rampant irritability.</p><hr>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='4'>Option Unavailable</p>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='4'>Option Unavailable</p>"
				];
				break;
			case "The Idol from the Ethereal Plane":
				firstDialogue = [
					"<p>You attempt to approach the Idol only to get blown away by her argument with the Chief.</p><br/>",
					"<p>The two are bickering back and forth about anything and everything, it appears.</p>"
				];
				playerFirstDialogue = [
					"<p>You could attempt to pacify the situation, but the reward hardly seems worth the effort.</p></br>",
					"<hr>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='4'>Option Unavailable</p>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='4'>Option Unavailable</p>"
				];
				break;
			case "The Chief of Concurrent Police":
				firstDialogue = [
					"<p>You attempt to approach the Chief only to get blown away by his argument with the Chief.</p><br/>",
					"<p>The two are bickering back and forth about anything and everything, it appears.</p>"
				];
				playerFirstDialogue = [
					"<p>You could attempt to pacify the situation, but the reward hardly seems worth the effort.</p></br>",
					"<hr>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='4'>Option Unavailable</p>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='4'>Option Unavailable</p>"
				];
				break;
			case "The 4th Dimension's President":
				firstDialogue = [
					"<p>You approach The 4th Dimension's President.</p><br/>",
					"<p>Though he seems unmoved by your presence, you can't help but feel your every move is now being evaluated.</p><br/>",
					"<p>Just then, he greets you.</p>",
					"<p class='chatMessage suspectMessage'>Good Evening, Detective.</p>",
					"<p class='chatMessage suspectMessage'>Any leads on finding the one who killed <a href='#HisEyesBetrayHisConcern'>It</a>?</p>"
				];
				playerFirstDialogue = [
					"<p>Bold of him to assume you're bad at your job and would share case details.</p></br>",
					"<p>Well, maybe you are in one of the many worlds across the multiverse. Maybe even this one.</p><hr>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='0'>That's why I'm talking to you.</p>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='1'>No, I must finish preliminary investigations first.</p>"
				]
				break;
			case "The CEO from the Moon Mist":
				firstDialogue = [
					"<p>You wave aside the CEO in order to speak with her.</p><br/>",
					"<p>Appearing quite visibly bored, she steps aside and motions her drink at you.</p>",
					"<p class='chatMessage suspectMessage'>Detective.</p>"
				];
				playerFirstDialogue = [
					"<p>She says nothing else, so you expect you have to be the one to fill the silence.</p></br>",
					"<p>Compared to her presence at a company presentation last month, she seems quite subdued.</p><hr>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='5'>Is something wrong?</p>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='6'>Do you know anything about the victim?</p>"
				];
				break;
			default:
				console.log("no one");
		}
		
		$("#chat").append(firstDialogue);
			$("#chatInput")
				.append(playerFirstDialogue)
				.addClass("playerAnswer");
	}
	
	function makeConversation() {
		$("#chat").empty();
		$("#chatInput").empty();
		
		var presidentDialogue = [];
		var playerPresDialogue = [];
		
		// set dialogue variables depending on choices
		// choices rely on data values stored in messages
		// dialogue is sort of separated by blocks, in that
		// the pres is 0 to 5, CEO beyond that, and etc.
		switch(currentDialogue) {
			// PRESIDENT DIALOGUE
			// act suspicious of President
			case 0:
				suspectDialogue = [
				"<p class='chatMessage suspectMessage'>Well, that's not promising.</p>",
				"<p class='chatMessage suspectMessage'>I'll have you know I'm terribly ineffective at anything tangible.</p>",
				"<p>He pauses, as if to add substance to those words. Then, he leans in and lowers his voice.</p>",
				"<p class='chatMessage suspectMessage'</p>And at any rate, I'd wager <i>I</i> was the only one protecting It from you-know-who.</p>"
				];
				playerDialogue = [
					"<p>Hardly evasive, your knowledge of the year's events and controversy surrounding the President lead you to two possibilities.</p></br>",
					"<p>You consider.</p><hr>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='2'>The Void.</p>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='3'>Are you suggesting I killed It?</p>"
				];
				break;
			// hide your investigation
			case 1:
				suspectDialogue = [
				"<p class='chatMessage suspectMessage'>Of course, Detective.</p>",
				"<p class='chatMessage suspectMessage'>I have the utmost respect for those of your professional and... cautious nature.</p>",
				"<p>He stares at you briefly, smiles, and then he shifts away.</p>",
				];
				playerDialogue = [
					"<p>Any further attempts to converse with him fail spectacularly; He guards his secrets as closely as you do.</p>",
					"<hr>",
					"<br/><p class='chatMessage playerMessage choiceMessage' data-point-value='4'>I'll speak with you another time.</p>"
				];
				break;
			// suspect the void
			case 2:
				suspectDialogue = [
				"<p>The 4th Dimension's President blinks, and then laughs as if completely caught off guard.</p>",
				"<p class='chatMessage suspectMessage'>Remarkable, isn't it? An enemy turned ally.</p>",
				"<p class='chatMessage suspectMessage'>It's not unthinkable that The Void might have killed It.</p>",
				"<p class='chatMessage suspectMessage'>And yet... As its keeper, I can say with utmost certainty, it didn't.</p>",
				];
				playerDialogue = [
					"<p>With that alone, you feel like you should toss him down a ditch, but you persist.</p><br/>",
					"<p>It feels as though you're missing something. Something you won't find here.</p></br>",
					"<p>Instead, an odd headache begins to uncomfortably settle.</p>",
					"<hr>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='4'>Fair enough. I must take my leave.</p>"
				];
				break;
			// suspect the CEO
			case 3:
				suspectDialogue = [
				"<p>The 4th Dimension's President smiles, his eyes squinting, and you feel an inherent sense of danger.</p>",
				"<p class='chatMessage suspectMessage'>A novel idea, that.</p>",
				"<p class='chatMessage suspectMessage'>No one is as dangerous as one who controls and regulates information, Detective.</p>",
				"<p>He crosses his arms and seems to examine you in a new light. Then, he laughs, slaps you on the back, and retires for the night.</p>"
				];
				playerDialogue = [
					"<p>You're left feeling uneasy and unsure.</p><br/>",
					"<p>You know you had nothing to do with It's demise. Your memories and morals remind you of this.</p><br/>",
					"<p>But now you can't help scrutinizing every past action, wondering if you had failed somewhere.</p>",
					"<hr>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='4'>No, it's just his mind games.</p>"
				];
				break;
			// stop interview
			case 4:
				$("#interviewPage").fadeOut();
				$("#suspectPage").fadeIn();
				break;
			// CEO DIALOGUE
			// ask if something's wrong
			case 5:
				suspectDialogue = [
				"<p>The CEO examines you for a moment, considering. She relents.</p>",
				"<p class='chatMessage suspectMessage'>The truth is, Detective, I'm not sure.</p>",
				"<p class='chatMessage suspectMessage'>Contrary to popular belief, It and I were... close rivals, and to see it go so quietly...</p>",
				"<p class='chatMessage suspectMessage'>... It's eerie. What do you think?</p>",
				];
				playerDialogue = [
					"<p>You think it's interesting that she considers their relationship as such, but that's a footnote.</p><br/>",
					"<p>Mulling it over, you wonder how you yourself feel about It's untimely end.</p>",
					"<hr>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='7'>Perhaps it's only natural-- It had enemies.</p>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='8'>It's unfortunate. Things will only get worse now.</p>"
				];
				break;
			// ask if know victim
			case 6:
				suspectDialogue = [
				"<p>The CEO dumps her drink into a nearby planter and sighs, noticeably bothered.</p>",
				"<p class='chatMessage suspectMessage'>Of course, Detective.</p>",
				"<p class='chatMessage suspectMessage'>My line of work often relies on It. Both in presence and in opposition.</p>",
				"<p class='chatMessage suspectMessage'>That is to say, without It, my business model is incomplete.</p>",
				];
				playerDialogue = [
					"<p>That seems far-fetched, or perhaps it's worth investigating.</p><br/>",
					"<p>You don't have much time to spend here, but you have the option.</p>",
					"<hr>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='9'>What do you mean?</p>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='4'>Excuse me, I have other matters to attend.</p>"
				];
				break;
			// it had enemies
			case 7:
				suspectDialogue = [
				"<p class='chatMessage suspectMessage'>As do I, Detective, but here I am, and here It is not.</p>",
				"<p>She takes a sip and nods.</p>",
				"<p class='chatMessage suspectMessage'>I suppose you are right, though. Even I was not kind to It's longevity... Goodnight, Detective.</p>",
				"<p>And with that, she walks away, effectively ending the conversation.</p>"
				];
				playerDialogue = [
					"<p>Her confession seems haphazard and not entirely clear, but you write down some notes regardless.</p><br/>",
					"<p>It appears there's still some investigating to do, at the very least.</p>",
					"<hr>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='4'>Goodnight, I guess.</p>"
				];
				break;
			// it's unfortunate
			case 8:
				suspectDialogue = [
				"<p>The Mistian's eyes move from you to the fog settling on the mansion.</p>",
				"<p class='chatMessage suspectMessage'>Yes... It's unfortunate, isn't it?</p>",
				"<p class='chatMessage suspectMessage'>Who knows if It will ever come back? If we can ever return.</p>",
				"<p>Losing herself in thought, she partially fades from existence, dimming in the moonlight.</p>"
				];
				playerDialogue = [
					"<p>The conversation leaves you feeling drained and with a sense of sadness.</p><br/>",
					"<p>People have always talked about It going to die, but now you begin to feel the impact.</p>",
					"<hr>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='4'>... I have to do something.</p>"
				];
				break;
			// what do you mean
			case 9:
				suspectDialogue = [
				"<p class='chatMessage suspectMessage'>Exactly what I said.</p>",
				"<p class='chatMessage suspectMessage'>Detective, the best way to sell something is to invoke an emotion.</p>",
				"<p class='chatMessage suspectMessage'>To sell a gun, I need anger at an enemy. To sell technology, I need wonder and optimism. To sell...</p>",
				"<p>She stops there, and slowly revolves the empty glass in her hand.</p>",
				];
				playerDialogue = [
					"<p>It's isn't much, but you understand.</p><br/>",
					"<p>If anything, It served as an illusion or idea she could re-possess as needed.</p>",
					"<hr>",
					"<p class='chatMessage playerMessage choiceMessage' data-point-value='4'>I see. I'll take this into consideration.</p>"
				];
				break;
			default:
				console.log("Something went wrong? You're lost to The Void.");
		}
		
		$("#chat").append(suspectDialogue);
		$("#chatInput")
			.append(playerDialogue)
			.addClass("playerAnswer");
	}

	function populateEnding() {
		var endings = [
			"<p>You accuse The Impendantic Allstar.</p><p>Having noticed his nervous possessive nature of his ring, your guided research unveiled an unkind string of events that not only left the man widowed, but also in desperate need of a clean record. As it turns out, <a href='#'>It</a> was not his first victim; that title belonged to his wife... his ex-wife... and the animals in his underground fighting ring.</p><p>You follow up with the accusation with piles and piles of evidence and reliable testimonies, and you feel as if there may be justice yet...</p><p>The day before his trial, you are taken off the case and relocated to a small precinct near Corona. All charges are dropped, and the heinous murders the Allstar committed are swept under the rug. A month after, he returns to the playing field for his team. A year since Its Death, the Allstar's name is cheered in the streets for once again leading his team to victory.",
			"<p>You accuse the Idol from the Ethereal Plane.</p><p>While her connection to <a href='#'>It</a> appeared the most convoluted, that only made you dig deeper, and what a mess you found. Scams, fraud, strange dealings in the dark-- you uncover several shady operations under her command. Worst of all is her crime of hypocrisy, in which she burns those she claims to empower, walking on heels made of servitude</p><p>Showing up to the trial in crocodile tears, it becomes clear that the Idol has no intention of going to prison. In fact, she has made that point clear not only to her fans, but also to the secret society she's a part of. Conveniently, she takes a sudden vacation under the guise of recording her next album. When charges are dropped, and any news of a trial is lost in the wind, you discover a frightening black envelope on your doorstep and become sick soon after.",
			"<p>You accuse The Chief of Concurrent Police.</p><p>The Chief himself is taken aback by the complaint, but he almost immediately steps down and expresses his only regret as not being able to help uncover the truth of the situation. With him out of the picture, you eagerly begin investigating any and all opening doors to try and find out what exactly happened to <a href='#mors-aequitatis'>It</a> and the Chief's involvement.</p><p>In time, you find that the accusation has not actually opened any doors, but rather closed quite a few. Your coworkers grow distant, your bosses uninterested, and when crime starts to rise once more, a low lying scrutiny turns into a searing lens on you at all times. By the time you find evidence to back your claims-- and a terrifying amount of it, you do -- you are shipped off to some remote precinct near Corona. Reinstalled in his position, The Chief gives you and your career a pragmatic farewell.",
			"<p>You accuse The 4th Dimension's President.</p><p>And what a scandal it has made. The 4th Dimen-see-ans are all-knowing, all-seeing, and all-existing. To claim one is less than partial-- less than perfection-- is absurd. To make matters worse, he takes your accusation in stride and even uses it to bolster support.</p><p>You try everything: trial after trial, testimony after testimony, you follow every single lead to ensure you haven't missed that crucial one deciding factor. One day, while investigating another crime scene and subsequently walking away from a particularly gruesome sight, a man pats you on the shoulder in good faith. When you look up, it's none other than The 4th Dimension's President. He smiles as he walks away, leaving a bloody handprint in his wake.</p><p>You never successfully bring him in. His network is too wide-- his image too complete-- 'He must be innocent,' you begin to delude yourself, trying to nurse the headache that has never faded.</p>",
			"You accuse The CEO from the Moon Mist.</p><p>It goes without saying that her crimes are innumerous. Tax evasion, fraud, a few skeletons in the closet-- to climb the entrepreneurial mountain is no small feat, and to do it with clean hands, near impossible. But though these crimes are almost common knowledge and easy to define, the evidence that binds them to existence is much more evasive.</p><p>While investigating one of her factories under the guise of a complaint, you fall victim to the machinery and lose all but the slightest muscle function. Unable to fight the claims shoved upon you, you are forced to live out the rest of your life with the aid of a small but courteous fund-- sponsored, signed, and presented by none other than the CEO herself, of course.</p>",
		]
		
		// if user has actually done their research, they unlock the good endings
		if (hasLookedAtCrimeScene == true && hasLookedAtSuspects == true) {
			console.log("unlockSpecialEndings");
			console.log("These aren't implemented yet.");
		}
		
		switch(accused) {
			case "allstar":
				ending = endings[0]
				break;
			case "idol":
				ending = endings[1]
				break;
			case "police":
				ending = endings[2]
				break;
			case "pres":
				ending = endings[3]
				break;
			case "ceo":
				ending = endings[4]
				break;
			default:
				console.log("Nothing happened???? Which is really odd because you shouldn't be able to get this ending. Congrats though!");
		}
		
		$("#finalTextBox")
			.append(ending)
			.append("<br/><a href='#theUnfortunateEnd' onClick='window.location.reload();'>... Re-enter?</a>")
			.append("<br/><img id='endingImage' src='assets/screenError.gif'/>");
	}
});