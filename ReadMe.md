Demo
====
	- Try at http://ruhrsteig.ohrenbaer.bplaced.net




Description
===========
	- HTML5/JS/CSS Web-App for mobile use
	- Access to Ruhrsteig Wandermulti Data 
	- Substitute Printout
	- Integrated access to regional map material
	- optimized for use while hiking ( cached maps material and data)
	- portrait and landscape UI, scaled to different screensized
	- Calculation of final coordinates
	


ToDo
====
	- Feature Backlog
			- Backlog for Rev 1.0 Major release
					- Vorgabe von Werten, wenn Stationen nicht mehr lösbar sind
			- Backlog for Rev 1.1 Major release
					- distance of GPS position to next Station (instead of absolute position) ( Radar View)
					- icons instead of text buttons
					- localisation??
					- additions to table view
						- extend views by elevation plot (plotjs)
	- Quality Backlog
					- prepare (shrink and beautify) code for production
						- log4Javascript instead of console.log
						- add testcases
						- more formal revision template outside of this file + Readme + Docu 
						- github
						- bugzilla
					- redesign to use MVC with backbone.js (oder doch "promise" ?) 
						- more asynchronouse bahaviour
						- extend views by elevation plot (plotjs)
	- Bugs:
					-Bilder im Landscape Format sind nicht vollständig
					- zu kleine Bilder werden nicht geladen und erzeugen ein Fragezeichen
					- Freigegebene Bilder werden in der Bilder Übersicht nicht wieder mit Ihren Werten sichtbar

Revisions
=========	
 
	Revision 0.9.4	14.1.2014 09:00 
					- Feature: Navigation supports back button.
					- Feature: Direct Call via url?GCxxxxx
					- Feature: url?debug option -> weinre
	Revision 0.9.3	10.1.2014 11:00 
					- Added: add media queries for landscape and portrait
						- Feature: Finale abspeichern
						- Feature: Kacheln vorladen
					- Bugs Fixed: 
						Cache Manifest Fehler, Parken Fehler, Erste Station, 
					- Known BUGs: Bilder die freigegeben wurden zeigen kein Wert mehr an
					- Still Missing
						Feature: Zurück Taste fehlt und link zu Hauptseite.
						Feature: 
	Revision 0.9.2	10.1.2014 add media queries for landscape and portrait
					- BUG: Bilder die freigegeben wurden zeigen kein Wert mehr an
					- BUG: Kopfzeile Text Parkplatz raus bis Parkplatz eindeutig
					- Feature: Zurück Taste fehlt und link zu Hauptseite.
					- Feature: Finale abspeichern
					- Feature: Kacheln vorladen
					
	
	Revision 0.9.1	9.1.2014 Bilder Auswahl geht wieder - 
					- dynamische Marker in der Karte
					- neue Schaltflächen
					- localStore für Rundenauswahl
					- BUG: states werden noch nicht vollständig im UI reflektiert.
					- BUG: Portrait/Landscape unschön 

	Revision 0.9	8.1.2014 
					- GPS integrated
					- dynamic landing page
					- BUG: Bilder Auswahl geht nicht mehr
					
	Revision 0.8	4.1.2014
					- localStorage integration for pictures selected
					- cache manifest for all data of one cache.
					- use full screen on Android phone
					- apple icon for homepage references added.
	Revision 0.7 	4.1.2014
					- Leaflet map integration
					- gets cache files, tracks and worksheet via JSON files.
					- Tiles prepared for offline usage (e.g. copy on sd card)
					- geolocation does not work yet with my HTC
					- fixed buttons as navigation controls
					- Cache Manifest


	Revision 0.6	28.12.2013
					- added offset, corrected table.lenght< bilder.length,  Zeigt Map, Zeigt Marker und PolygonTrack
	
	Revision 0.5	27.12.2013 
					- Reads cache,track and worksheet JSON, display table, display pictures, select and unselect 
