


/**** Modal stuff ****/
let divWelcomeModal = document.getElementById("divWelcomeModal");
let divWelcomeModalBackground = document.getElementById("divWelcomeModalBackground");

divWelcomeModalBackground.onmouseup = function(mouse) {
	ToggleHelpModal()
}

divWelcomeModalBackground.ontouchend = function(event) {
	ToggleHelpModal()
}


/******* Handle ui-box collapse/expand *********/
let coll = document.getElementsByClassName("ui-box-header");

//If you're changing which boxes default to open or collapsed, 
//you also need to add/remove the classes from the divs directly in index.html
//var collapsedControls = new Set(['divPosition', 'divPointStats']);
var collapsedControls = new Set();
if (localStorage.getItem("collapsedControls") != null) collapsedControls = new Set(JSON.parse(localStorage.collapsedControls));


for (let i = 0; i < coll.length; i++) {
	
	if(collapsedControls.has(coll[i].parentNode.id)) {
		coll[i].classList.add("collapsed-header");
		coll[i].nextElementSibling.classList.add("collapsed");
		
	} else {
		coll[i].classList.add("expanded-header");
	}
	
	coll[i].addEventListener("click", function() {
		this.classList.toggle("expanded-header");
		this.classList.toggle("collapsed-header");
		let content = this.nextElementSibling;
		content.classList.toggle("collapsed");
		
		if(collapsedControls.has(this.parentNode.id)) {
			collapsedControls.delete(this.parentNode.id);
		} else {
			collapsedControls.add(this.parentNode.id);
		}
		localStorage.setItem('collapsedControls', JSON.stringify([...collapsedControls]));
	});
}

/******* Handle Advanced Settings collapse/expand *********/
let divAdvancedSettingsHeader = document.getElementById("divAdvancedSettingsHeader");
divAdvancedSettingsHeader.addEventListener("click", function() {
		//this.classList.toggle("expanded-header");
		//this.classList.toggle("collapsed-header");
		let content = this.nextElementSibling;
		content.classList.toggle("collapsed");
		
		let label = this.firstElementChild;
		if(label.innerHTML.includes("Show")) {
			label.innerHTML = "Hide Advanced Settings";
		} else {
			label.innerHTML = "Show Advanced Settings";
		}
	});

