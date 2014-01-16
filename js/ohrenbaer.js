/**
	Funktionalität für die mobile Ruhrsteig/Sauersteig Wandermulti Seite 

	see ReadMe.md for description / backlog / Revisions
	
	*/

 
	var GCcode;
	var GCsupported = {
        "GC45ZGY" : "Isenburg Runde",
        "GC4501D" : "Holthausen Runde",
        "GC4T5NF" : "Blankenstein Runde",
        "GC44NHJ" : "Durchholz Runde",
        "GC4496W" : "Muttental Runde",
        "GC44V93" : "Etappe Witten Hattingen",
        "GC43Y93" : "Etappe Witten Wetter",
//        "GC43Y8V" : "Etappe Wetter Herdecke", // Excluded Bildfehler, Runde wird zzt überarbeitet
        "GC45ZGH" : "Hengsteysee Runde",
        "GC4RNX5" : "Elsebachtal Runde"
    }


    var tabelle = [];
	var Finale = {};
		Finale.found = false;
    var refpoint = [];
	var BildVonStation = []; // Zeigt an welches Bild an Station i gefunden wurde 
	var StationVonBild = []; // Zeigt an, welche Station Bild i zugewiesen wurde
	var bilder = [];
	var waypoint = [];
	var trackPolygon = [];
	var idx = [];
	var bidx = [];
	var zeileAktiv = 0; // Zeiger auf tr
	var tab = []; // Zeiger auf die DOM Segment der Tabelle
	var stationAktiv = 0; // Index der Aktiven Zeile
	//var wegpunktAktiv = ""; // Buchstabe des aktiven Wegpunkts 
	var sumLon = 0;
	var sumLat = 0;
	var dataWorksheet = {};
	var dataCache = {};
	var map;
	var StationIcon = L.icon({
		iconUrl: './images/Ball-Azure.png',
		shadowUrl: '',
		iconSize:     [64, 64], // size of the icon
		shadowSize:   [7, 3], // size of the shadow
		iconAnchor:   [32, 64], // point of the icon which will correspond to marker's location
		shadowAnchor: [0, 10],  // the same for the shadow
		popupAnchor:  [0, -64] // point from which the popup should open relative to the iconAnchor
	});	
	var StationIconDown = L.icon({
		iconUrl: './images/Ball-Azure-down.png',
		shadowUrl: '',
		iconSize:     [26, 26], // size of the icon
		shadowSize:   [7, 3], // size of the shadow
		iconAnchor:   [13, 26], // point of the icon which will correspond to marker's location
		shadowAnchor: [0, 10],  // the same for the shadow
		popupAnchor:  [0, -26] // point from which the popup should open relative to the iconAnchor
	});	
	var ReferenceIcon = L.icon({
		iconUrl: './images/Ball-Chartreuse.png',
		shadowUrl: '',
		iconSize:     [64, 64], // size of the icon
		shadowSize:   [7, 3], // size of the shadow
		iconAnchor:   [32, 64], // point of the icon which will correspond to marker's location
		shadowAnchor: [0, 10],  // the same for the shadow
		popupAnchor:  [0, -64] // point from which the popup should open relative to the iconAnchor
	});	
	var ReferenceIconDown = L.icon({
		iconUrl: './images/Ball-Chartreuse-down.png',
		shadowUrl: '',
		iconSize:     [26, 26], // size of the icon
		shadowSize:   [7, 3], // size of the shadow
		iconAnchor:   [13, 26], // point of the icon which will correspond to marker's location
		shadowAnchor: [0, 10],  // the same for the shadow
		popupAnchor:  [0, -26] // point from which the popup should open relative to the iconAnchor
	});	
	var PositionIcon = L.icon({
		iconUrl: './images/Ball-Pink.png',
		shadowUrl: '',
		iconSize:     [64, 64], // size of the icon
		shadowSize:   [7, 3], // size of the shadow
		iconAnchor:   [32, 64], // point of the icon which will correspond to marker's location
		shadowAnchor: [0, 10],  // the same for the shadow
		popupAnchor:  [0, -64] // point from which the popup should open relative to the iconAnchor
	});	
	var PositionIconDown = L.icon({
		iconUrl: './images/Ball-Pink-down.png',
		shadowUrl: '',
		iconSize:     [26, 26], // size of the icon
		shadowSize:   [7, 3], // size of the shadow
		iconAnchor:   [13, 26], // point of the icon which will correspond to marker's location
		shadowAnchor: [0, 10],  // the same for the shadow
		popupAnchor:  [0, -26] // point from which the popup should open relative to the iconAnchor
	});	
	var FinalIcon = L.icon({
		iconUrl: './images/Flag-Left-Pink.png',
		shadowUrl: '',
		iconSize:     [64, 64], // size of the icon
		shadowSize:   [7, 3], // size of the shadow
		iconAnchor:   [32, 64], // point of the icon which will correspond to marker's location
		shadowAnchor: [0, 10],  // the same for the shadow
		popupAnchor:  [0, -64] // point from which the popup should open relative to the iconAnchor
	});	

	var StationMarker = [];	
	var ReferenceMarker = [];	
	var PositionMarker;
	var FinalMarker;
	var positionGPS = {};
	    positionGPS.lon =0.0;
	    positionGPS.lat = 0.0;
	var controlsVisible = 0;
	var GPSIsOn = false;

function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}


function CoordsConvMIN(deg) {			// 7.416850 Muss werden 007 25.011
			var DDD =0;
			var MMMMM = 0.0;
			var text;
			var LeadingZeros = "";
			    DDD = Math.floor(deg);
			    MMMMM = (deg - DDD) * 60.0;
			//console.log (MMMMM); 
			MM = zweiStellen(Math.floor(MMMMM));
			MMM =  dreiStellen(Math.floor((MMMMM-MM) * 1000)) ;
			var text;
			if (DDD < 10) 	text = "00" + DDD + " " + MM + "." + MMM; // Leading zeros for East ( simple solution for Germany only)
			else 			text =        DDD + " " + MM + "." + MMM;
			//console.log (deg + " -> " + text); 
			return(text);
		}; 


function wegpunktAktiv() {
	if (stationAktiv == -1) return("");
	else {
		return(tabelle[stationAktiv].name);
	}
}

function dreiStellen (a) {
	var b = a.toString();
	while (b.length <3) {
		b="0" + b;
	}
	//console.log("dreiStellen (" + a + ") = " + b );
	return ( b);
}

function zweiStellen (a) {
	var b = a.toString();
	while (b.length <2) {
		b="0" + b;
	}
	//console.log("zweiStellen (" + a + ") = " + b );
	return ( b);
}

/**
		createTable ()  - erzeugt die DOM Teil der tabelle.

 */
function createTable () {
		var items = [];
		items.push('<table id="worksheettable" >');
		items.push('<colgroup> <col width="10"> <col width="100"> <col width="100"> <col width="50"> <col width="50"> </colgroup>');
		items.push('<tr> <th colspan="3">Koordinaten</th> <th with:> Nord </th> <th> Ost </th> </tr>');
		for (i=0; i< tabelle.length; i++){
			var tabRow =  "<tr class='tline' id='t" + i + "'>";
				tabRow +=  "<td>" + tabelle[i].name + "</td>"  ;
				tabRow +=  "<td>" + ": N " + CoordsConvMIN(tabelle[i].lat) + "</td>"  ;
				tabRow +=  "<td>" + "E " + CoordsConvMIN(tabelle[i].lon) + "</td>"  ;
				if (tabelle[i].multiLat == 0)  tabRow +=  "<td>"   ;
				else {
					tabRow +=  "<td class='tsign' id='t10" + i + "'>"  ;
					}
				tabRow +=  tabelle[i].nFeld + "</td>"  ;
				if (tabelle[i].multiLon == 0)  tabRow +=  "<td>" ;
				else {
					tabRow +=  "<td class='tsign' id='t20" + i + "'>"  ;
					}
				tabRow +=  tabelle[i].eFeld + "</td>"  ;
				tabRow += "</tr>" ;
			//console.log(tabRow);
			items.push(tabRow);
		};
		if ((dataWorksheet.worksheet.formula.latSumOffset != 0) || (dataWorksheet.worksheet.formula.lonSumOffset !=0)) { // Mit Korrekturzeile
			var tabRow = "<tr class='tline'> <td colspan='3' style='text-align:right'>Korrektur </td>"; 
			tabRow += "<td style='text-align:right'>" + dataWorksheet.worksheet.formula.latSumOffset + "</td>"; 
			tabRow += "<td style='text-align:right'>" + dataWorksheet.worksheet.formula.lonSumOffset + "</td></tr>";
			items.push(tabRow);
		};  

		tabRow = "<tr> <th colspan='3' style='text-align:right'>Finale (Summe) N" 
					  + dataWorksheet.worksheet.formula.latOffsetDegrees + " " 
					  + dataWorksheet.worksheet.formula.latOffsetMinutes + ". </th> <td id='tNSum' style='text-align:right'></td> <td></td>  </tr>";
		items.push(tabRow);
		var tabRow = "<tr> <th colspan='4' style='text-align:right'>Finale (Summe) E" 
					  + dataWorksheet.worksheet.formula.lonOffsetDegrees + " " 
					  + dataWorksheet.worksheet.formula.lonOffsetMinutes + ". </th> <td id='tESum' style='text-align:right'></td> </tr>";
		items.push(tabRow);
		items.push("</table>");
		//console.log(items)
		$("<div/>",{
			   "id": "tabellePanel",
			   html: items.join( "" )
		}).appendTo( "body" );
		$("#tabellePanel").click(function(){
			hidePanel('#tabellePanel');
			hidePanel("#Controls");
			//$("#Map").removeClass("Controls").addClass("NoControls");
			});
		
		stationAktiv =0; 
		updateTable();
};

function updateMap (lat,lon){
		if (Finale.found == true) {
		    console.log("Finale already defined");
			//alert ( "Finale defined");
			return;
			}			
		console.log("updateMap lat= " + lat + " lon= " + lon + " zoom= " + 15);
		var pos = L.latLng(lat, lon);
		//Marker.setLatLng(pos);
		map.setZoom(15);
		map.panTo(pos);

}

/**
       updateTable   -    neuberechnung der Final Koordinaten + setzen der Tabellen Cursor
 */
function updateTable () {
		if (Finale.found == true) {
		    console.log("Finale already defined");
			//alert ( "Finale defined");
			return;
			}			
		if (stationAktiv == -1) {
			for (i=tabelle.length-1; i>-1; i--) {
				if (BildVonStation[i] == -1) stationAktiv=i;		
				}
		}
		console.log(stationAktiv);
		var nSum=dataWorksheet.worksheet.formula.latSumOffset;
		var eSum=dataWorksheet.worksheet.formula.lonSumOffset;
		for (i=0; i<tabelle.length; i++) {
			nSum += (tabelle[i].nFeld)*1;
			eSum += (tabelle[i].eFeld)*1;
			}
		$("#tNSum").text(dreiStellen(nSum));
		$("#tESum").text(dreiStellen(eSum));						
		if ((stationAktiv == -1) ||(stationAktiv >= tabelle.length)) {
				var paneltext = "Finale: ";
				paneltext += dataWorksheet.worksheet.formula.latOffsetDegrees + " "; 
				paneltext += dataWorksheet.worksheet.formula.latOffsetMinutes + ".";
				paneltext += dreiStellen(nSum);
				paneltext += " E ";
				paneltext += dataWorksheet.worksheet.formula.lonOffsetDegrees + " "; 
				paneltext += dataWorksheet.worksheet.formula.lonOffsetMinutes + ".";
				paneltext += dreiStellen(eSum);
				
				console.log(paneltext);
				$("#coordPanel").html(paneltext);
				//showPanel("#coordPanel");
				
				Finale.found = true;
				Finale.lat = dataWorksheet.worksheet.formula.latOffsetDegrees *1.0
				Finale.lat +=  (dataWorksheet.worksheet.formula.latOffsetMinutes + ( dreiStellen(nSum) / 1000.0))/ 60.0;
				Finale.lon = dataWorksheet.worksheet.formula.lonOffsetDegrees *1.0
				Finale.lon +=  (dataWorksheet.worksheet.formula.lonOffsetMinutes + ( dreiStellen(eSum) / 1000.0))/ 60.0;
				
				localStorage.setItem(GCcode+"-Finale",JSON.stringify(Finale));
				showFinale();
				
				var pos = L.latLng(Finale.lat, Finale.lon);
				console.log("Finale = " + pos);
				FinalMarker = new L.marker(pos,{icon : FinalIcon});
				FinalMarker.addTo(map).bindPopup("paneltext");
				//Marker.setLatLng(pos);
				//map.setZoom(zoom);
				map.panTo(pos);

				alert (paneltext); 
				return;
			}
		else {
			$(".tline").css("font-size","90%");
			$(".tsign").css("background-color","white");
			$(".tsign").parent().css("font-weight","100");
			$("#t"+stationAktiv).css("font-size","100%");
			$("#t"+stationAktiv).css("font-weight","bold");
			if (tabelle[stationAktiv].multiLon !=0) $("#t20"+stationAktiv).css("background-color","yellow");
			if (tabelle[stationAktiv].multiLat !=0) $("#t10"+stationAktiv).css("background-color","yellow");
		}
			
};

function showFinale() {
	if (Finale.found == true) {
				var pos = L.latLng(Finale.lat, Finale.lon);
				console.log("Finale = " + pos);
				FinalMarker = new L.marker(pos,{icon : FinalIcon});
				FinalMarker.addTo(map).bindPopup("paneltext");
				writePanel("<b>Finale: FN <b>", 
					"N " + CoordsConvMIN(Finale.lat) + " E " + CoordsConvMIN(Finale.lon));
				//Marker.setLatLng(pos);
				//map.setZoom(zoom);
				map.panTo(pos);
	}
	else {
		console.log("Finale not yet found ");
	
	}

}

function loadFinale() {
		var key = GCcode + "-Finale";
		console.log("loadFinale " + key);
		if (localStorage.getItem(key) === null) {   
			console.log("Kein  Finale gespeichert");
		}
		else {
			Finale = JSON.parse(localStorage.getItem(key));
			console.log(Finale);
			showFinale();
		
		}
		
}


function updateBilder() {
			var bindex;
			for (var i=0; i<tabelle.length; i++) {
				bindex = BildVonStation[i];
				if (bindex != -1) {
					StationVonBild[bindex] = i;
					BildVonStation[i] = bindex;
					$("#b20"+bindex).text(tabelle[i].name);
					$("#b20"+bindex).css("background-color","green");
					// $("#b10"+bindex).css("opacity","0.5"); geht nicht mehr da Bild über Karte
				}
			}
}


function storeBildVonStation (key) {
	console.log("storeBildVonStation key=" + key);
	console.log("storeBildVonStation value=" + JSON.stringify(BildVonStation));
	localStorage.setItem(key,JSON.stringify(BildVonStation));
}

function loadBildVonStation(key,length) {
		if (length !== tabelle.length) {
				stopOnError("Error: ladeBildVonStation lenght mismatch");
			return;
		}
		for (var i=0; i<length; i++) {
				BildVonStation[i]= -1;
				StationVonBild[i]= -1;
			}
		console.log("loadBildVonStation key=" + key + " length= " + length);
		if (localStorage.getItem(key) === null) {   
			console.log("Keine Daten gespeichert");
		}
		else {
			BildVonStation = JSON.parse(localStorage.getItem(key));
			console.log("loadBildVonStation value=" + localStorage.getItem(key));
			var bindex;
			for (var i=0; i<tabelle.length; i++) {
				bindex = BildVonStation[i];
				if (bindex != -1) {
					StationVonBild[bindex] = i;
					BildVonStation[i] = bindex;
					tabelle[i].nFeld =  tabelle[i].multiLat * bilder[bindex].value;
					tabelle[i].eFeld =  tabelle[i].multiLon * bilder[bindex].value;
					$("#t10"+i).text(tabelle[i].nFeld);
					$("#t20"+i).text(tabelle[i].eFeld);
				}
			}
			
			for (i=tabelle.length-1; i>-1; i--) {
				if (BildVonStation[i] == -1) stationAktiv=i;			
			}
		
		}
		
}

/** 

    ladeCache(GCcode) - läd entsprechenden JSON Dateien in den localstore
	=====================================================================
	key = "GCxxxxx-worksheet"  value = "json-string"
	key = "GCxxxxx-cache"  value = "json-string"
	key = "GCxxxxx-track"  value = "json-string"
	key = "GCxxxxx-assignment"  value = "json-string" // evtl 
	key = "GCxxxxx-issues-count"  value = number   // Zähler für evtl Log-Ergebnisse
	key = "GCxxxxx-issues-i"  value = "string"   // Log-Ergebniss Nummer i
	
	====

    localStorage.setItem("key", "value");
    localStorage.getItem("key");
	localStorage.removeItem('key');
	localStorage.clear();
	examples:  
		key = "GCxxxxx-table"  value = "json-string"
		
		store:
			var dataToStore = JSON.stringify(data);
			localStorage.setItem('someData', dataToStore);
		
		load:
			var localData = JSON.parse(localStorage.getItem('someData'));
			$.each(localData, function(key, value){
				console.log(key + ' = ' + value);
				});
*/

    function ladeCache( GCcode ) {
		var urlWorksheet = "routes/" + GCcode + "/" + GCcode + "-worksheet.json";
		var localStoreWorksheet = urlWorksheet; // GCcode + "-worksheet";
		console.log("ladeCache " + GCcode);
		if (GCcode == "") {
			stopOnError("Error: ladeCache - keine GCcode übergeben");
			return ;
			}
		if (GCsupported[GCcode] == ""){
			stopOnError("Error: ladeCache " + GCcode + " is not in the supported list");
			return;
			}
		console.log("GCcode = " + GCsupported[GCcode]);
		if (localStorage.getItem(localStoreWorksheet) === null) {      
			console.log("urlWorksheet" + urlWorksheet + " calling");
			$.ajax({
				url: urlWorksheet,
				dataType: 'json',
				async: false,
				success: function(dw) {
				var dataWorksheet = dw
				console.log("urlWorksheet" + urlWorksheet + " success");
				console.log(dataWorksheet);
				
				var dataToStore = JSON.stringify(dw);
				localStorage.setItem(localStoreWorksheet, dataToStore);
				}
			
			}); // end of AJAX
		} // end of if - local version not yet loaded
		else {
			console.log(localStoreWorksheet + " is already loaded");
			}
		
	
		console.log(localStorage.getItem(localStoreWorksheet));
		alert("ladeCache completed");

	} // end of ladeCache
	
/**
    ladeDaten(f) 

	- Läd die Cache spezifischen JSON Dateien und speichert Sie lokal
			- legt table und bild Bereich im DOM an. 
			- triggert createmap und schaltet auf Karte

	Input 
		f: Form f.elements["GCcode"].value
	Output:
		tabelle[i] .name .multilon .multilat .nFeld .eFeld


	key = "GCxxxxx-worksheet"  value = "json-string"
	key = "GCxxxxx-cache"  value = "json-string"
	key = "GCxxxxx-track"  value = "json-string"
	key = "GCxxxxx-assignment"  value = "json-string" // evtl 
	key = "GCxxxxx-issues-count"  value = number   // Zähler für evtl Log-Ergebnisse
	key = "GCxxxxx-issues-i"  value = "string"   // Log-Ergebniss Nummer i
	
	====

    localStorage.setItem("key", "value");
    localStorage.getItem("key");
	localStorage.removeItem('key');
	localStorage.clear();
	examples:  
		key = "GCxxxxx-table"  value = "json-string"
		
		store:
			var dataToStore = JSON.stringify(data);
			localStorage.setItem('someData', dataToStore);
		
		load:
			var localData = JSON.parse(localStorage.getItem('someData'));
			$.each(localData, function(key, value){
				console.log(key + ' = ' + value);
				});

*/
 
 
function ladeDaten(gc) {
		if (Finale.found == true) {
		    console.log("Finale already defined");
			//alert ( "Finale defined");
			return;
			}			
		console.log("ladeDaten");
		dataFound = 0;
//		GCcode = f.elements["GCcode"].value;
  		GCcode = gc;

		$("#Landing").hide();
		showPanel("#Controls");
		//$("#Map").removeClass("NoControls").addClass("Controls");


		if (GCcode == "") {
			stopOnError("Error: ladeCache kein GCcode angegeben");
			return ;
			}
		console.log("GCcode = " + GCcode);
		
		//ladeCache(GCcode); // TEST
		

		urlCache = "routes/" + GCcode + "/" + GCcode + "-cache.json";
		urlWorksheet = "routes/" + GCcode + "/" + GCcode + "-worksheet.json";
		urlTrack = "routes/" + GCcode + "/" + GCcode + "-track.json";
		console.log("urlWorksheet" + urlWorksheet + " calling");
		$.ajax({
			url: urlWorksheet,
			dataType: 'json',
			async: false,
			success: function(dw) {
			dataWorksheet = dw
			console.log("urlWorksheet" + urlWorksheet + " success");
			console.log(dataWorksheet);
			
			for (var i = 0; i<  dataWorksheet.worksheet.formula.table.length; i++) {
				var index = dataWorksheet.worksheet.formula.table[i].index;
				var name= dataWorksheet.worksheet.formula.table[i].name;
				var multiLon= dataWorksheet.worksheet.formula.table[i].multiLon;
				var multiLat = dataWorksheet.worksheet.formula.table[i].multiLat;
				idx[name] = index;
				tabelle[index] = new Object;
				tabelle[index].name = name;
				tabelle[index].multiLon = multiLon;
				tabelle[index].multiLat = multiLat;
				//BildVonStation[index] = -1;
				switch (tabelle[index].multiLon ) {
					case 0: 
						tabelle[index].eFeld = "";
						break;
					case 1: 
						tabelle[index].eFeld = "+0";
						break;
					case -1: 
							tabelle[index].eFeld = "-0";
						break;
					default: 
						stopOnError("unknown Multiplicator");
						break;
				} // end of switch
				switch (tabelle[index].multiLat ) {
					case 0: 
						tabelle[index].nFeld = "";
						break;
					case 1: 
						tabelle[index].nFeld = "+0";
						break;
					case -1: 
						tabelle[index].nFeld = "-0";
						break;
					default: 
						stopOnError("unknown Multiplicator");
						break;
				} // end of switch
				//console.log("Tabelle [" + index + "," + name + "] = multiLat (" + multiLat + ") multiLon ( " + multiLon + ")");
				} // for
				
			//for (var i = 0; i<  dataWorksheet.worksheet.pics.length; i++) {
			//	bilder[i] = new Object;
			console.log("urlCache" + urlCache + " calling");
			bilder = dataWorksheet.worksheet.pics;
			$.ajax({
				url: urlCache,
				dataType: 'json',
				async: false,
				success: function(dc) {
				dataCache = dc;
				console.log(" urlCache" + urlCache + " success");
				for (var i = 0; i<  dataCache.stations.length; i++) {
					var name= dataCache.stations[i].name;
					var lon= dataCache.stations[i].lon;
					var lat = dataCache.stations[i].lat;
					tabelle[idx[name]].lon = lon;
					tabelle[idx[name]].lat = lat;
					console.log("Tabelle [" + idx[name] + "," + name + "] = lon (" + lon + ") lat ( " + lat + ")");
					} // for
				for (var i = 0; i<  dataCache.referencepoints.length; i++) {
					var name= dataCache.referencepoints[i].name;
					var lon= dataCache.referencepoints[i].lon;
					var lat = dataCache.referencepoints[i].lat;
					refpoint[i] = {};
					refpoint[i].lon = lon;
					refpoint[i].lat = lat;
					refpoint[i].name = name;
					console.log("Refpoint [" + i + "," + name + "] = lon (" + lon + ") lat ( " + lat + ")");
					} // for
				$.ajax({
					url: urlTrack,
					dataType: 'json',
					async: false,
					success: function(dt) {
					for (var i = 0; i<  dt.trackpoints.length; i++) {
						trackPolygon [i] = [dt.trackpoints[i].lat, dt.trackpoints[i].lon];
						} // for	
					} //end of function(dt)
				}); // end of ajax urlTrack
				// console.log("Tabelle: " + tabelle);
				//console.log("Bilder:  " + bilder);

				createTable();
				//updateMapWaypoints();
				//updateMapTrack();
				
				
				var items = [];
				loadBildVonStation(GCcode+"-BildVonStation",dataWorksheet.worksheet.formula.table.length);

				for (i=0; i< bilder.length; i++) {
						bidx[bilder[i].filename] = i;
						bidx[bilder[i].value] = i;
						// StationVonBild[i] = -1;
						var bildContainer = "<div class='bc' id='" + bilder[i].filename +"'> ";
						bildContainer += "<div id='b10"+ i + "' class='Bild' ><img class='suchBild' src = 'routes/" +GCcode + "/pics/" + bilder[i].filename  + "'>" ;
						bildContainer += "<div id='b20"+ i + "' class='TextAufBild'>"+ bilder[i].value  +"</div></div>" ;
						bildContainer += "</div>" ;
						items.push( bildContainer );
				}; // end of for
				$("<div/>",{
					"id": "bilderPanel",
					html: items.join( "" )
				}).appendTo( "body" );

				$
				$(".bc").click(klickAufBild);
				$(".tline").click(klickAufFeld);
				$("#Landing").hide();

				}}); // end of ajax urlCache
			}}); // end of ajax urlWorksheet		
	
	createMap();
	updateTable();
	updateBilder();
	console.log("Wandern");

	var PanelText="";
	PanelText =  GCcode + ": " + dataCache.name ; 
	//PanelText +=  "</br> Parken:  " +  dataCache.referencepoints[0].name ;
	console.log(PanelText);
	$("#coordPanel").html(PanelText);
	StationMarker[0].setIcon(StationIcon);	
	
	$("#Landing").hide();
	showPanel("#map");

	hidePanel("#bilderPanel");
	hidePanel("#tabellePanel");
	hidePanel("#Controls");
	//$("#Map").removeClass("Controls").addClass("NoControls");

	showPanel("#MenuBar");
	showPanel("#coordPanel");	

	demoMap();

	loadFinale();
	if (Finale.found == true) { showFinale();}

	
} // end of ladeDaten

var demoCount=0;

function demoMap () {
	if (demoCount == tabelle.length) {
		demoCount = 0;
		var pos = L.latLng(tabelle[demoCount].lat, tabelle[demoCount].lon);
		console.log("demoMap lat= " + pos.lat + " lon= " + pos.lng);
		//StationMarker[stationAktiv].setIcon(StationIcon);
		map.panTo(pos);
		return;
	}
	else {
		var pos = L.latLng(tabelle[demoCount].lat, tabelle[demoCount].lon);
		console.log("demoMap lat= " + pos.lat + " lon= " + pos.lng);
		//StationMarker[stationAktiv].setIcon(StationIcon);
		map.panTo(pos);
		demoCount ++;
		window.setTimeout(demoMap,1000)
	}

}


/**
		klickAufBild() 	- verknüpft das Bild mit der aktuellen Station
						- Freigabe von Bildern wird über die Tabelle gelöst.


 */ 
	function klickAufBild () {
		if (Finale.found == true) {
		    console.log("Finale already defined");
			//alert ( "Finale defined");
			return;
			}			
		console.log(this.id);
		var bindex = bidx[this.id];
		var value = bilder[bindex].value;
		console.log("Bild Index " + bindex);
		console.log("Value "+ value);
		//var alerttext = "klick auf Feld " + this.id + " wert: " + value; alert(alerttext);
		if ( StationVonBild[bindex] != -1) { 
			console.log("Bild bereits gebunden");
			return; // Vorerst keine Undo function
		}
		else {
			//console.log(this);
			//this.lastChild.css("background-color","grey");
			var check = confirm("Bildwert " + value + " bei Station " + wegpunktAktiv() + " abspeichern?");
			if (check == true ) {
				index = stationAktiv;
				console.log("index = " + index);
				StationVonBild[bindex] = index;
				BildVonStation[index] = bindex;
				storeBildVonStation(GCcode+"-BildVonStation");
				console.log("StationVonBild: " + StationVonBild);
				console.log("BildVonStation: " + BildVonStation);
							
				tabelle[index].nFeld =  tabelle[index].multiLat * value;
				tabelle[index].eFeld =  tabelle[index].multiLon * value;
				console.log("N Mul " +tabelle[index].multiLat + " E Mul " + tabelle[index].multiLon); 
				console.log("N Feld " +tabelle[index].nFeld + " E Feld " + tabelle[index].eFeld); 
				$("#t10"+index).text(tabelle[index].nFeld);
				$("#t20"+index).text(tabelle[index].eFeld);
				$("#b20"+bindex).text(wegpunktAktiv());
				$("#b20"+bindex).css("background-color","green");
				//$("#b10"+bindex).css("opacity","0.5");     - geht nicht mehr da das Bild über der Karte liegt
				clearPanels();
				hidePanel("#bilderPanel");

			}
		}
		storeBildVonStation(GCcode+"-BildVonStation");
		StationMarker[stationAktiv].setIcon(StationIconDown);	
		stationAktiv = -1;
		updateTable();
		if (Finale.found == true) {			
			updateMap (Finale.lat, Finale.lon,15);
			}
		else {
			StationMarker[stationAktiv].setIcon(StationIcon);
			updateMap (tabelle[stationAktiv].lat, tabelle[stationAktiv].lon,15);
			}
		zeigeKarte();
	} // End Klick auf Bild
					
					
/**
		klickAufFeld() - setzt die station neu oder gibt Bild frei.



 */					

	function klickAufFeld () {
		if (Finale.found == true) {
		    console.log("Finale already defined");
			//alert ( "Finale defined");
			return;
			}			
		console.log(this);
		var stationSelected = idx[this.firstChild.innerHTML];
		if (BildVonStation[stationSelected] == -1) { 
			StationMarker[stationAktiv].setIcon(StationIconDown);	
			stationAktiv = stationSelected;
			StationMarker[stationAktiv].setIcon(StationIcon);	
			console.log("Aktive Stations Nummer: " + stationAktiv); 
			updateTable();
			updateMap (tabelle[stationAktiv].lat, tabelle[stationAktiv].lon);

		}
		else {
			var check = confirm("Soll das Bild wieder von Station" + tabelle[stationSelected].name + " entfernt werden?");
			if (check == true ) {
				console.log("StationVonBild: " + StationVonBild);
				console.log("BildVonStation: " + BildVonStation);
				index = stationSelected;
				var bindex = BildVonStation[index];
				console.log("index = " + index);
				console.log("bindex = " + bindex);	
				StationVonBild[bindex] = -1;
				BildVonStation[index] = -1;
				$("#b20"+bindex).text(bilder[bindex].value);
				$("#b20"+bindex).css("background-color","white");
				//$("#b10"+bindex).css("opacity","1");   geht nicht mehr da das Bild über der Karte liegt
					switch (tabelle[index].multiLon ) {
						case 0: 
							tabelle[index].eFeld = "";
							break;
						case 1: 
							tabelle[index].eFeld = "+0";
							break;
						case -1: 
							tabelle[index].eFeld = "-0";
							break;
						default: 
							alert("unknown Multiplicator");
							break;
					} // end of switch
					switch (tabelle[index].multiLat ) {
						case 0: 
							tabelle[index].nFeld = "";
							break;
						case 1: 
							tabelle[index].nFeld = "+0";
							break;
						case -1: 
							tabelle[index].nFeld = "-0";
							break;
						default: 
							alert("unknown Multiplicator");
							break;
					} // end of switch
				stationAktiv = stationSelected;	
				console.log("stationAktiv = " + stationAktiv);				
				console.log("N Mul " +tabelle[index].multiLat + " E Mul " + tabelle[index].multiLon); 
				console.log("N Feld " +tabelle[index].nFeld + " E Feld " + tabelle[index].eFeld); 
				$("#t10"+index).text(tabelle[index].nFeld);
				$("#t20"+index).text(tabelle[index].eFeld);
				storeBildVonStation(GCcode+"-BildVonStation");

			}
		}
		//alert("klick auf Feld" + this.id);
	} // end of klickAufFeld

	
/**
		zeigeKarte() - Anzeige der Kartenebene
 
 */	
	function zeigeKarte() {
	   if (Finale.found == false) {
			writePanel("<b>Nächste Station:" +tabelle[stationAktiv].name + " <b>", 
					"N " + CoordsConvMIN(tabelle[stationAktiv].lat) + " E " + CoordsConvMIN(tabelle[stationAktiv].lon));
			updateMap (tabelle[stationAktiv].lat, tabelle[stationAktiv].lon);
		}
		else {
			updateMap (Finale.lat, Finale.lon);
		}
		console.log("Wandern");
		showPanel("#map");
		showPanel("#MenuBar");
		
		//hidePanel("#bilderPanel");
		//hidePanel("#tabellePanel");
		showPanel("#coordPanel");	
		//showPanel("#Controls");
		
		
		//map.locate({setView: false, maxZoom: 15, watch: false});
		//map.on('locationfound', onLocationFound);
		
	}
	
/**
		klickMenu() - Anzeige der MenuButtons
 
 */	
	function klickMenu() {
		console.log("Viewport.with = " + viewport().width);
		if ($("#Controls").hasClass("show")) { // is visible
			console.log("Klick Menu - #Controls > Off");
			
			hidePanel("#tabellePanel");
			hidePanel("#bilderPanel");
			$("#Controls").removeClass("show").addClass("hide");
			//$("#Map").removeClass("Controls").addClass("NoControls");
			}
		else{
			console.log("Klick Menu - #Controls > On");
			//$("#Map").removeClass("NoControls").addClass("Controls");
			$("#Controls").show();
			$("#Controls").removeClass("hide").addClass("show");
		
		}
		
		//$("#MenuButton").toggleClass("ButtonPressed");
			
	}
	
	function klickStation() {
		var pos = L.latLng(tabelle[stationAktiv].lat, tabelle[stationAktiv].lon);
		console.log("updateMap lat= " + pos.lat + " lon= " + pos.lng);
		StationMarker[stationAktiv].setIcon(StationIcon);
		//Marker.setLatLng(pos);
		//map.setZoom(zoom);
		map.panTo(pos);
		//map._onResize();		
	//clearPanels();
	}

	function klickPosition() {
		console.log("toggle GPS " );
		if (GPSIsOn == false) { // switch on
			console.log("show GPS" );
			map.locate({
				setView: false, 
				maxZoom: 15, 
				timeout: 15000, 
				maximumAge: 60000, 
				watch: true, 
				enableHighAccuracy:true
				});
			map.on('locationfound', onLocationFound);
			$("#posButton").addClass("ButtonPressed");
			$("#posButton").html("<b> GPS off </b>");

			GPSIsOn = true;
			}
		else { // switch on and animate
			console.log("stop GPS");
			$("#posButton").removeClass("ButtonPressed");
			map.stopLocate();
			$("#posButton").html("GPS on");
			GPSIsOn = false;

		}
	//hidePanel("#Controls");
	//$("#Map").removeClass("Controls").addClass("NoControls");

	//clearPanels();
	}

function klickNext() {
	    if (Finale.found !== true) {
			var i=0;
			StationMarker[stationAktiv].setIcon(StationIconDown);	
			do { 
				stationAktiv ++;
				if (stationAktiv == tabelle.length) stationAktiv = 0;
				i++;
				if (i==tabelle.length) {alert("Error: no empty station found");}
			}
			while (BildVonStation[stationAktiv] !== -1);
			
			StationMarker[stationAktiv].setIcon(StationIcon);	

			writePanel("<b>Nächste Station:" +tabelle[stationAktiv].name + " <b>", 
					"N " + CoordsConvMIN(tabelle[stationAktiv].lat) + " E " + CoordsConvMIN(tabelle[stationAktiv].lon));
			var pos = L.latLng(tabelle[stationAktiv].lat, tabelle[stationAktiv].lon);
			console.log("updateMap lat= " + pos.lat + " lon= " + pos.lng);
			map.panTo(pos);
			updateTable();

		}
		else {
			writePanel("<b>Finale: FN <b>", 
					"N " + CoordsConvMIN(Finale.lat) + " E " + CoordsConvMIN(Finale.lon));

					//togglePanel("#coordPanel");
		}
	} // klickNext

function klickPrev() {
	    if (Finale.found !== true) {
			var i=0;
			StationMarker[stationAktiv].setIcon(StationIconDown);	
			do { 
				if (stationAktiv == 0) stationAktiv = tabelle.length;
				stationAktiv --;
				i++;
				if (i==tabelle.length) {alert("Error: no empty station found");}
			}
			while (BildVonStation[stationAktiv] !== -1);
			StationMarker[stationAktiv].setIcon(StationIcon);	

			writePanel("<b>Nächste Station:" +tabelle[stationAktiv].name + " <b>", 
					"N " + CoordsConvMIN(tabelle[stationAktiv].lat) + " E " + CoordsConvMIN(tabelle[stationAktiv].lon));
			//togglePanel("#coordPanel");
			var pos = L.latLng(tabelle[stationAktiv].lat, tabelle[stationAktiv].lon);
			console.log("updateMap lat= " + pos.lat + " lon= " + pos.lng);
			map.panTo(pos);
			updateTable();

		}
		else {
			writePanel("<b>Finale: FN <b>", 
					"N " + CoordsConvMIN(Finale.lat) + " E " + CoordsConvMIN(Finale.lon));

					//togglePanel("#coordPanel");
		}
	} // klickPrev

function onLocationFound(e) {
    var radius = e.accuracy / 2;
	console.log("Location Found: " + e.latlng + " radius: " + radius); 
	if (true) { // (radius < 100) {
	    positionGPS.lat = e.latlng.lat;
		positionGPS.lon = e.latlng.lng;
		console.log(positionGPS);
		//map.locate({setView: false, maxZoom: 15, watch: false});
		PositionMarker.setLatLng(e.latlng).bindPopup("POS +/- " + radius + " m");
		//L.circle(e.latlng, radius).addTo(map);
		writePanel("<b>GPS Position: Genauigkeit= " + radius + "m<b>", 
					"N " + CoordsConvMIN(positionGPS.lat) + " E " + CoordsConvMIN(positionGPS.lon));
		var pos = L.latLng(positionGPS.lat, e.latlng.lng);
		console.log("updateMap lat= " + pos.lat + " lon= " + pos.lng);
		map.panTo(pos);

		//showPanel("#coordPanel");
		}
		
}

function writePanel(line1,line2){
			var PanelText="";
			PanelText =  line1 + "</br>" + line2;
			console.log(PanelText);
			$("#coordPanel").html(PanelText);
}
	
function clearPanels (){
		console.log("clearPanels");
		if ($("#tabellePanel").hasClass("show")) hidePanel("#tabellePanel");
		if ($("#bilderPanel").hasClass("show")) hidePanel("#bilderPanel");
}

function klickBilder(){
	
	togglePanel('#bilderPanel'); 


}

function klickTabelle(){
	togglePanel('#tabellePanel');

}

function showPanel(panelID) {
		console.log("show Panel " + panelID );

		if ($(panelID).hasClass("hide")) {
			clearPanels();
			$(panelID).show();
			$(panelID).removeClass("hide").addClass("show");
			}
		else {
			return;
		}
	}
	
	function hidePanel(panelID) {
		console.log("hide Panel" + panelID);
		if ($(panelID).hasClass("hide")) {
			return;
			}
		else {
			$(panelID).removeClass("show").addClass("hide");
			$(panelID).hide();
		}
	}

	function togglePanel(panelID) {
		if ($(panelID).hasClass("hide")) { // show it
			console.log("show Panel " + panelID );
			clearPanels();
			$(panelID).show();
			$(panelID).removeClass("hide").addClass("show");
			}
		else { // hide it
			console.log("hide Panel" + panelID);
			$(panelID).removeClass("show").addClass("hide");
			$(panelID).hide();
		}
	}

/**
		createMap() - Anlegen der Karte im DOM mit Leaflet 
					- Poliline des Tracks und Marker für Wegpunkte und Referenzpunkte
					- Anlegen eines aktuellen Positions Markers

 */
 
function createMap() {
		
		var lat = tabelle[stationAktiv].lat;
		var lon = tabelle[stationAktiv].lon;
		var zoom = 15;
		//var southWest = L.latLng(dataCache.bounds[0][0], dataCache.bounds[0][1]);
		//var	northEast = L.latLng(dataCache.bounds[1][0], dataCache.bounds[1][1]);
		//var	bounds = L.latLngBounds(southWest, northEast);
		//console.log(bounds);
		console.log("createMap Lat: " + lat + " lon " + lon + " zoom " + zoom);
		map = L.map('Map', {
		   center: [lat,lon],
		   zoom : zoom,
		   minzoom : 15,
		   maxzoom : 15,
		  // maxbound : bounds,
		  // bounceAtZoomLimits : true,
		   zoomControl : false
		   });
		console.log("center = " + lat + " " + lon);
		map.addControl( L.control.zoom({position: 'bottomright'}) );
		
 		L.tileLayer('tiles/{z}/{x}/{y}.png', {
			minzoom: 15,
			maxZoom: 15,
			maxNativeZoom: 15,
			minNativeZoom: 15,
			unloadInvisibleTiles : false,	
			attribution: 'Map <a href="http://openstreetmap.org">OSM</a> , <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a></a>'
		}).addTo(map);
		
		
		for (var i=0; i< tabelle.length; i++) {
			var lon = tabelle[i].lon;
			var lat = tabelle[i].lat;
			var name = tabelle[i].name;
			var popupstring = "Station " + tabelle[i].name +  ": </br>"  ;
				popupstring += "N " + CoordsConvMIN(tabelle[i].lat) + ", </br>";
				popupstring += "E " + CoordsConvMIN(tabelle[i].lon) + " </br>";
			console.log("add marker "+ name + " at " + lat + " " + lon + " to map");
			StationMarker[i] = new L.marker({lat: lat, lng: lon},{icon : StationIconDown});
			StationMarker[i].addTo(map).bindPopup(popupstring);
			}

		for (var i=0; i< refpoint.length; i++) {
			var lon = refpoint[i].lon;
			var lat = refpoint[i].lat;
			var name = refpoint[i].name;
			var popupstring = refpoint[i].name + ": </br>"  ;
				popupstring += "N " + CoordsConvMIN(refpoint[i].lat) + " </br>";
				popupstring += "E " + CoordsConvMIN(refpoint[i].lon) + " </br>";
			console.log("add marker "+ name + " at " + lat + " " + lon + " to map");
			ReferenceMarker[i] = new L.marker({lat: lat, lng: lon},{icon : ReferenceIconDown});
			ReferenceMarker[i].addTo(map).bindPopup(popupstring);
			}
		PositionMarker = new L.marker({lat: 0, lng: 0},{icon : PositionIcon});
		PositionMarker.addTo(map).bindPopup("default");
		
		console.log("add track to map");
		L.polyline(trackPolygon,
			{
			//fillColor: "#010101",
			//fillOpacity: 0,
			stroke: true,
			color: 'blue', 
			opacity: 1,
			weight : 2,
			}
		).addTo(map);
		// map.setMaxBounds(bounds);
}

