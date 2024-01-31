MathJax.Hub.Config({
	skipStartupTypeset: true,
	messageStyle : "none",
	showMathMenu : false,
	displayAlign: "center",
	jax: ["input/MathML","output/HTML-CSS","output/SVG"],
	TeX: { equationNumbers: {autoNumber: "AMS"},
		extensions: ["autoload-all.js"],
		},
	MMLorHTML: {prefer: "HTML"},
	"HTML-CSS": {
		styles: {
			'.MathJax_Display': {
				"margin": 0
			},
			'.mwEquationEditor.editor .MathJax_Display:focus, .mwEquationEditor.editor .MathJax:focus, .mathEditor .toolbarTable .MathJax:focus, .mathEditor .toolbarTable .MathJax_Display:focus':{
				"outline": "none",
				"display": "initial !important"
			}
		},
		linebreaks: {
			automatic: false,
			width: "container"
		},
		availableFonts:["TeX"],
		webFont: "TeX",
		imageFont: "TeX"
	},
	"AssistiveMML": {
	    disabled: false
	}
});

MathJax.Ajax.loadComplete(window.mathJaxConfigUrl);

MathJax.Hub.Register.StartupHook("mml Jax Ready", function () {
	if( typeof openuw == 'undefined' || openuw != true ){
		 // Set the amount that math's font size is multiplied by in fractions
		 // Defaulting to 1 to look like Maple T.A. 8's images., the MathML default is 0.72
		MathJax.ElementJax.mml.math.prototype.defaults.scriptsizemultiplier = 1;
	}
});

MathJax.Hub.processSectionDelay = 0;
MathJax.Hub.Configured();
MathJax.Hub.Register.StartupHook("End", function () {
	if(window.mapleCloudNotifyParentResize != null) {
        window.mapleCloudNotifyParentResize();
    }
});

// Replace some MathML entities
MathJax.Hub.Register.StartupHook("MathML Jax Config", function () {
	try {
		MathJax.InputJax.MathML.Parse.Entity.DifferentialD	='\u0064';
		MathJax.InputJax.MathML.Parse.Entity.ExponentialE	='\u0065';
		MathJax.InputJax.MathML.Parse.Entity.ImaginaryI		='\u0069';
		MathJax.InputJax.MathML.Parse.Entity.InvisibleTimes	='\u200A';
	} catch (e) {
		console.error(e);
	}
});

