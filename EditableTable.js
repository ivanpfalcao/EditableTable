define( ["qlik", "jquery", "text!./style.css"], function ( qlik, $, cssContent ) {
	'use strict';
	$( "<style>" ).html( cssContent ).appendTo( "head" );
	var app; // Global app
	return {
		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 10,
					qHeight : 1000
				}]
			},			
		},
		definition: {
			type: "items",
			component: "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 0,
					max : 10
				},
				measures : {
					uses : "measures",
					min : 0,
					max : 10
				},
				settings: {
					uses: "settings"
				}
			}
		},
		support : {
			snapshot: true,
			export: true,
			exportData : false
		},
		paint: function ( $element,layout ) {
			var me = this;
			var app = qlik.currApp(this);
			var dim_count = layout.qHyperCube.qSize.qcx;	
			var rowcount = 0;
			
			var numberOfRows = this.backendApi.getRowCount();
			
			var paginationLoopControl=0;
			var fieldValueSeparator = '||-||';
			var lastrow = 0;
			var morevalues=false;
			
			var self = this, html = "";
			
			html += '<table>';
			html += '<tr>';
			
			var dimArray = [];
			var dimCounter = 0;
			
			//Construct title by dimension
			$.each(this.backendApi.getDimensionInfos(), function(key, value) {
				//value.qState
				html += '<td class="dimension-title" data-value="' + value.qFallbackTitle + '">';
				html += value.qFallbackTitle;
				html += '</td>';
				dimArray[dimCounter] = ['dim',value.qFallbackTitle];
				dimCounter++;
			});
			
			//Construct title by measure
			$.each(this.backendApi.getMeasureInfos(), function(key, value) {
				//value.qState
				html += '<td class="measure-title" data-value="' + value.qFallbackTitle + '">';
				html += value.qFallbackTitle;
				html += '</td>';
				dimArray[dimCounter] = ['measure',value.qFallbackTitle];
				dimCounter++;
			});
			html += '</tr>';
			
			var oddLine = false;
			this.backendApi.eachDataRow(function(rowNo, row) { 
				lastrow = rowNo;
				html+='<tr>';
				
				oddLine = ((rowNo % 2) != 0);
				
				for (var d=0;d<dim_count;d++) {
					var dataFieldValue = row[d].qText
					var dataValue = dataFieldValue + fieldValueSeparator + dimArray[d][1];
					//+ row[d].qState
					html += '<td class="data-odd-' + oddLine + '" data-value="' + dataValue + '">';
					html += dataFieldValue;
					html += '</td>';	
					
				}
				
				html+='</tr>';
				

								
			});
			/*
			if(numberOfRows > (lastrow + 1)) {
				rowcount = layout.qHyperCube.qDataPages[0].qMatrix.length;
				var requestPage = [{
				qTop : rowcount + 1,
				qLeft : 0,
				qWidth : 10, //should be # of columns
				qHeight : Math.min(1000, numberOfRows - rowcount)
				}];
				
				alert(rowcount);
				me.backendApi.getData(requestPage).then(function(dataPages) {
					me.paint($element);
				});
			};
			*/
					

			
			
			
			
			//layout.qHyperCube.qDataPages[0].qMatrix[3][1].qText);

			
			//qTexto = layout.qHyperCube.qDataPages[0].qMatrix[0][i].qText;
				

			
			
			html += '</table>';
			
			/*
			for (var i=0; i< dim_count; i++) {
				qTexto = parseInt(layout.qHyperCube.qDataPages[0].qMatrix[0][0].qText);
			}
			*/

			
			
			
			
			/*
			layout.qListObject.qDataPages[0].qMatrix.forEach( function ( row ) {
				html += '<li class="data state' + row[0].qState + '" data-value="' + row[0].qElemNumber + '">' + row[0].qText;
				if ( row[0].qFrequency ) {
					html += '<span>' + row[0].qFrequency + '</span>';
				}
				html += '</li>';
			} );
			*/
			
			if ( this.backendApi.getRowCount() > lastrow + 1 ) {
				html += "<button id='more'>More...</button>";
				morevalues = true;
			}
			
			$element.html( html );
			
			if ( morevalues ) {
				var requestPage = [{
					qTop: lastrow + 1,
					qLeft: 0,
					qWidth: dim_count, //should be # of columns
					qHeight: Math.min( 1000, this.backendApi.getRowCount() - lastrow )
				}];
				$element.find( "#more" ).on( "qv-activate", function () {
					self.backendApi.getData( requestPage ).then( function ( dataPages ) {
						self.paint( $element, layout );
					} );
				} );
			}
			
			$( ".data-odd-true" ).click(function() {
				if ( this.hasAttribute( "data-value" ) ) {
					var dataValue = this.getAttribute( "data-value" );
					
					var selectedValue = dataValue.split(fieldValueSeparator)[0];
					//var fieldName = parseInt(dataValue.split(fieldValueSeparator)[1], 10);
					var fieldName = dataValue.split(fieldValueSeparator)[1];
									
					//var value = parseInt( fieldName, 10 ), dim = 0;					
					app.field(fieldName).toggleSelect(selectedValue, true);
					//self.selectValues( fieldDimId, [fieldValue], true );

					//this.classList.toggle("selected");					
					
					/*
					var value = parseInt( this.getAttribute( "data-value" ), 10 ), dim = 0;
					self.selectValues( dim, [value], true );
					this.classList.toggle("selected");
					*/
				}
			});

			return qlik.Promise.resolve();
		}
	};
} );
