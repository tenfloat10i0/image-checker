window.onload = function() {
	let $curve = $(".iocurve").iocurve();
	$curve.on("output", function( ev, data ){
		changeToneCurve(data);
	});
	
	document.getElementById("button").addEventListener("click", function(event) {
		$curve.trigger("destroy");
		$curve = $(".iocurve").iocurve();
		$curve.on("output", function( ev, data ){
			changeToneCurve(data);
		});
	});
};

function changeToneCurve(toneCurve){
	let toneList = "";
	for(tone of toneCurve){
		if(toneList == ""){
			toneList = String(tone);
		}
		else{
			toneList += (" " + String(tone / 255));
		}
	}
	chrome.tabs.query({ active: true, currentWindow: true },function(tab){
		chrome.scripting.executeScript({
			target:{tabId: tab[0].id},
			args: [toneList],
			function: function(args){
				if(document.getElementById("svgFilter") == null){
					const NS = "http://www.w3.org/2000/svg";
					const svg = document.createElementNS(NS,"svg");
					document.getElementsByTagName("head")[0].appendChild(svg);
					const defs = document.createElementNS(NS,"defs");
					svg.appendChild(defs);
					const filter = document.createElementNS(NS,"filter");
					filter.id = "svgFilter";
					defs.appendChild(filter);
					const feComponentTransfer = document.createElementNS(NS,"feComponentTransfer");
					filter.appendChild(feComponentTransfer);
					
					const feFuncR = document.createElementNS(NS,"feFuncR");
					feFuncR.id = "feFuncR";
					feFuncR.setAttribute("type" , "table");
					feFuncR.setAttribute("tableValues" , args);
					feComponentTransfer.appendChild(feFuncR);
					
					const feFuncG = document.createElementNS(NS,"feFuncG");
					feFuncG.id = "feFuncG";
					feFuncG.setAttribute("type" , "table");
					feFuncG.setAttribute("tableValues" , args);
					feComponentTransfer.appendChild(feFuncG);
					
					const feFuncB = document.createElementNS(NS,"feFuncB");
					feFuncB.id = "feFuncB";
					feFuncB.setAttribute("type" , "table");
					feFuncB.setAttribute("tableValues" , args);
					feComponentTransfer.appendChild(feFuncB);
					
					const feFuncA = feComponentTransfer.appendChild(document.createElementNS(NS,"feFuncA"));
					feFuncA.setAttribute("type" , "identity");
					feComponentTransfer.appendChild(feFuncA);
					
					const style = document.getElementsByTagName("head")[0].appendChild(document.createElement("style"));
					style.textContent = "body{filter: url(#svgFilter);}";
				}
				else{
					document.getElementById("feFuncR").setAttribute("tableValues" , args);
					document.getElementById("feFuncG").setAttribute("tableValues" , args);
					document.getElementById("feFuncB").setAttribute("tableValues" , args);
				}
			}
		});
	});
}