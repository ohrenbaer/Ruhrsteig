/** gpxfile
 * Revision 23.12.2013 09:00
 * Function calls: after refactoring:
 *
 *     	var track = new gpxTrack("url for GPSies-file.gpx");  
 *          track.id = "GC.....";
 * 			track.bounds = [];
 * 			track.property = {}
 * 			track.trkpt = []
 *		var cache = new gpxGC("geocaching-cachefile.gpx");
 *			cache.id = "GC.....";
 *			cache.bounds = [];
 *			cache.referencepoints = []; 
 * 			cache.stations = [];
 *		var pq = new gpxPQ("pq-file.gpx"); // or my_find
 *			pq.bound = [];
 * 			pq.
 *
 * Altes Interface:
 * 		GPSies + GC + PQ Files supported
 * 		ReadGPSies() 	Liest GPX Track / Wegpunkt Dateien von GPSies (für Garmin)
 * 		ReadPQ ()		Liest GPX Pocket_Query von Geocaching.com 
 *		Object Oriented Design
 * ToDo:
 * 		Function Arguments still primitives (no check on argument values
 *		No getter and setter for private values
 * 		ReadGC() 		Liest GPX Datenen von Geocaching.com
 * 		include current position - fetch a certain area.
 *
 */
 

function gpxTrack (filename) {
        var lon;
        var lat;
        var name;
        var ele;
		var track = new Object;
		    track.property = new Object;
		    track.trackpoints = [];

		//console.log("gpxTrack open url:" + filename); alert("Breakpoint gpxTrack");
        $.ajax({url: filename,
            dataType: "xml",
            async : false,
			error : function(jqXHR,textStatus,errorT) {
				console.log("jqXHR = " + jqXHR);
				console.log("textStatus = " + textStatus);
				console.log("errorT = " + errorT);
				//alert("error");
				switch(jqXHR) {
				     case "parsererror": 
						alert("ReadGPSies: " + filename + " XML file defect"); break;
						console.log(textStatus);
					default: 
						alert("ReadGpsies: " + filename + " error");
						break;
					}
			},
            success: function(xml) {
				//console.log("gpxTrack open url:" + filename); console.log(xml);alert("Breakpoint success");
				$(xml).find("metadata>extensions").each( function (){	
					//console.log("metadata", this); alert("metadata");
					track.property.type = this.getElementsByTagName("gpsies:property")[0].textContent;
					track.property.trackLengthMeter = parseFloat(this.getElementsByTagName("gpsies:trackLengthMeter")[0].textContent);
					track.property.totalAscentMeter = parseFloat(this.getElementsByTagName("gpsies:totalAscentMeter")[0].textContent);
					track.property.totalDescentMeter = parseFloat(this.getElementsByTagName("gpsies:totalDescentMeter")[0].textContent);
					track.property.minHeightMeter = parseFloat(this.getElementsByTagName("gpsies:minHeightMeter")[0].textContent);
					track.property.maxHeightMeter = parseFloat(this.getElementsByTagName("gpsies:maxHeightMeter")[0].textContent);
					//console.log("metadata>extensions");console.log("track.property = " + track.property); alert("Track Property");
				});// end of property
				$(xml).find("trk").each( function (){	
					track.property.url = this.getElementsByTagName("link")[0].getAttribute("href");
					//console.log("metadata>extensions");console.log("track.property = " + track.property); alert("Track Property");

				});// end of property url				
				$(xml).find("trk>trkseg>trkpt").each( function (){	
					var trkpt = {};
					trkpt.lon = parseFloat(this.getAttribute("lon"));
					trkpt.lat = parseFloat(this.getAttribute("lat"));
					trkpt.ele = $(this).find("ele").text();

					track.trackpoints.push(trkpt);
				});// end of trkpt
				//console.log("trackpoints");console.log("track.trackpoints = " + track.trackpoints); alert("Track Property");
				}}); //end of ajax
        //console.log("GPXtrack finished"); console.log(track); alert("B: gpxtrack finished"); 
		return(track);
};// end of function ReadGPSiesTrack

/***
GPXFile.prototype.ReadJSON = function (filename) {
		var that = this;
		console.log("ReadJSON open url:" + filename); 

        $.ajax({url: filename,
            dataType: "json",
            async : false,
			error : function(jqXHR,textStatus,errorT) {
				switch(jqXHR) {
				     case "parsererror": 
						alert("ReadJSON: " + filename + " XML file defect"); break;
						console.log(textStatus);
					default: 
						alert("ReadJSON: " + filename + " error");
						break;
					}
			},
            success: function(jsondaten) {
				that.data = jsondaten;
				}}); //end of ajax
        console.log("GPXFile.ReadJSON finished");
};// end of function ReadJSON
***/

/***
GPXFile.prototype.ReadPQ = function (filename, callback){
        var lon;
        var lat;
        var name;
        var ele;
		var that = this;
        $.ajax({url: filename,
            dataType: "xml",
            async : false,
            success: function(xml) {
                $(xml).find("wpt").each(function () {
                    lon = parseFloat(this.getAttribute("lon"));
                    lat = parseFloat(this.getAttribute("lat"));
                    name = $(this).find("name").text();
                    type = $(this).find("type").text();
                    url = $(this).find("url").text();
					ele = parseFloat($(this).find("ele").text());
                    console.log("ajax: "+name,lon,lat,ele);
                    that.StoreGCWPT (name, lon, lat, ele, type, url );
                }); // End of .each wpt
                that.EndOfFile(callback);
            } // end of function success
        }); //end of ajax
        console.log("GPXFile.ReadGPXwpt finished");
};
***/

function gpxGC (filename){
        var lon;
        var lat;
        var name;
        var ele;
		geocacheID = "xxxxx";
		textRest = "";
		var GC = {};
		GC.bounds = {};
		GC.referencepoints = [];
		GC.stations = [];

		// console.log("ConvertMyFind");console.log("ReadGC open url:" + filename); alert(filename);
        $.ajax({url: filename,
            dataType: "xml",
            async : false,
			error : function(jqXHR,textStatus,errorT) {
				console.log("jqXHR = " + jqXHR);
				console.log("textStatus = " + textStatus);
				console.log("errorT = " + errorT);
				switch(jqXHR) {
				     case "parsererror": 
						alert("ReadGC: " + filename + " XML file defect"); break;
						console.log(textStatus);
					default: 
						alert("ReadGC: " + filename + " error\n" + textStatus);
						break;
					}
			},
            success: function(xml) {
				//console.log(xml); alert("breakpoint");
				$(xml).find("bounds").each( function (){
					minlat = parseFloat(this.getAttribute("minlat"));
					maxlat = parseFloat(this.getAttribute("maxlat"));
					minlon = parseFloat(this.getAttribute("minlon"));
					maxlon = parseFloat(this.getAttribute("maxlon"));
					GC.bounds = [[minlat,minlon],[maxlat,maxlon]];
					console.log("bounds");
					console.log(GC.bounds);
				});
				//console.log(GC.bounds);	alert("breakpoint");
				
				$(xml).find("wpt").each( function (){
					var sym = $(this).find("sym").text();
					// console.log(sym);alert("breakpoint");
					switch (sym) {
						case "Geocache": 
							GC.lon = parseFloat(this.getAttribute("lon"));
							GC.lat = parseFloat(this.getAttribute("lat"));
							GC.id = $(this).find("name").text();
							GC.name = $(this).find("urlname").text();
							GC.type = $(this).find("type").text();
							break;
						case "Final Location": 
							// Ignore
							break;
						case "Parking Area":
						case "Reference Point":
						case "Trailhead":
							var parking = {};
							parking.name = $(this).find("desc").text();
							parking.lon = parseFloat(this.getAttribute("lon"));
							parking.lat = parseFloat(this.getAttribute("lat"));
							GC.referencepoints.push(parking);
							break;
						case "Question to Answer": 
							var station = {};
							station.name = $(this).find("desc").text();
							station.lon = parseFloat(this.getAttribute("lon"));
							station.lat = parseFloat(this.getAttribute("lat"));
							GC.stations.push(station);
							//
							break;
						default :
							alert("Reader for Waypoint: " + sym + " not yet implemented");
							break;
					} // end of switch
				});
			//console.log(GC); alert("Breakpoint");	
		    return(GC);
            } // end of function success
        }); //end of ajax
		//console.log(GC); console.log("gpxGC finished");alert("Breakpoint");
		return(GC);
};


function getGpxJson(url){

		var data = {};
		
		console.log("getCacheJson Url:" + url); 
		
        $.ajax({url: url,
            async : false,
			dataType: "json",
			error : function(jqXHR,textStatus,errorT) {
				switch(jqXHR) {
				    case "parsererror": 
						alert("getCacheJson: " + url + " JSON file defect"); break;
						console.log(textStatus);
					default: 
						alert("getCacheJson: " + url + " error");
						break;
					}
			},
			success: function(result) {
			    console.log(result);
				data = result;	
            } // end of function success
        }); //end of ajax
        console.log("getGpxJson finished");
		return ( data);
};




