define( ["qlik", "jquery", "text!./style.css"], function ( qlik, $, cssContent ) {
	'use strict';
	$( "<style>" ).html( cssContent ).appendTo( "head" );
	var app; // Global app
	var linesToFetch = 10;
	return {
		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 10,
					qHeight : 20
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
					uses: "settings",				
					items: {  
						tableTitle: {                        
							type: "string",                  
							ref: "CSS_Table_Title",                 
							label: "Title CSS",				     
							expression: "",
							defaultValue:""
						},						
						tableSelected: {                        
							type: "string",                  
							ref: "CSS_Table",                 
							label: "<table> CSS",				     
							expression: "",
							defaultValue:""
						},	
						trSelectedOdd: {                        
							type: "string",                  
							ref: "CSS_TR_Selected_Odd",                 
							label: "<tr> Odds Selected CSS",				     
							expression: "",
							defaultValue:""
						},	
						trUnselectedOdd: {                        
							type: "string",                  
							ref: "CSS_TR_Unelected_Odd",                 
							label: "<tr> Odds Not Selected CSS",				     
							expression: "",
							defaultValue:""
						},	
						trSelectedEven: {                        
							type: "string",                  
							ref: "CSS_TR_Selected_Even",                 
							label: "<tr> Even Selected CSS",				     
							expression: "",
							defaultValue:""
						},	
						trUnselectedEven: {                        
							type: "string",                  
							ref: "CSS_TR_Unelected_Even",                 
							label: "<tr> Even Not Selected CSS",				     
							expression: "",
							defaultValue:""
						},							
						tdselectedOdd: {                        
							type: "string",                  
							ref: "CSS_TD_Selected_Odd",                 
							label: "<td> Odds Selected CSS",				     
							expression: "",
							defaultValue:""
						},	
						tdUnselectedOdd: {                        
							type: "string",                  
							ref: "CSS_TD_Unelected_Odd",                 
							label: "<td> Odds Not Selected CSS",				     
							expression: "",
							defaultValue:""
						},							
						tdselectedEven: {                        
							type: "string",                  
							ref: "CSS_TD_Selected_Even",                 
							label: "<td> Even Selected CSS",				     
							expression: "",
							defaultValue:""
						},	
						tdUnselectedEven: {                        
							type: "string",                  
							ref: "CSS_TD_Unelected_Even",                 
							label: "<td> Even Not Selected CSS",				     
							expression: "",
							defaultValue:""
						}								
					}
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

			var CSSTable = ' style="' + layout.CSS_Table + ';"';
			var CSSTitle = ' style="' + layout.CSS_Table_Title + ';"';

			var CSSTRSelectedOdd 		= ' style="' + layout.CSS_TR_Selected_Odd + '" ';
			var CSSTRUnSelectedOdd 		= ' style="' + layout.CSS_TR_Unelected_Odd + ';" ';
			var CSSTRSelectedEven 		= ' style="' + layout.CSS_TR_Selected_Even + '" ';
			var CSSTRUnSelectedEven 	= ' style="' + layout.CSS_TR_Unelected_Even + ';" ';			
			
			var CSSTDSelectedOdd 	= ' style="' + layout.CSS_TD_Selected_Odd + ';" ';
			var CSSTDUnSelectedOdd	= ' style="' + layout.CSS_TD_Unelected_Odd + ';" ';	
			var CSSTDSelectedEven	= ' style="' + layout.CSS_TD_Selected_Even + ';" ';
			var CSSTDUnSelectedEven	= ' style="' + layout.CSS_TD_Unelected_Even + ';" ';	
			
			var numberOfRows = this.backendApi.getRowCount();
			
			var paginationLoopControl=0;
			var fieldValueSeparator = '||-||';
			var lastrow = 0;
			var morevalues=false;
			
			var dimArray = [];
			var dimCounter = 0;		
			var self = this, html = "";			
			
			html += '<table' + CSSTable + '>';
			html += '<tr'+ CSSTitle +'>';
			

			
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
				
				if ((rowNo % 2) != 0) {
					oddLine = true;
					var CSSTDOddSel = CSSTDSelectedOdd;
					var CSSTDOddUns = CSSTDUnSelectedOdd;
				} else {
					oddLine = false;
					var CSSTDOddSel = CSSTDSelectedEven;
					var CSSTDOddUns = CSSTDUnSelectedEven;
					
				}
				
				for (var d=0;d<dim_count;d++) {
					var dataFieldValue = row[d].qText
					var dataValue = dataFieldValue + fieldValueSeparator + dimArray[d][1];
					//+ row[d].qState
					if (row[d].qState == 'S') {
						html += '<td class="data-odd-' + oddLine + '" data-value="' + dataValue + '"'+ CSSTDOddSel +'>';
						html += dataFieldValue;
						html += '</td>';	
					} else {
						html += '<td class="data-odd-' + oddLine + '" data-value="' + dataValue + '"'+ CSSTDOddUns +'>';
						html += dataFieldValue;
						html += '</td>';	
						
					}
					
				}
				
				html+='</tr>';
				

								
			});				
			
			
			html += '</table>';
			
			
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
					qHeight: Math.min( linesToFetch, this.backendApi.getRowCount() - lastrow )
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
					var fieldName = dataValue.split(fieldValueSeparator)[1];
										
													
					app.field(fieldName).toggleSelect(selectedValue, true);
					//app.field(fieldName).selectValues([String(selectedValue)], true, true);

				}
			});
			
			$( ".data-odd-false" ).click(function() {
				if ( this.hasAttribute( "data-value" ) ) {
					var dataValue = this.getAttribute( "data-value" );					
					var selectedValue = dataValue.split(fieldValueSeparator)[0];
					var fieldName = dataValue.split(fieldValueSeparator)[1];
													
					app.field(fieldName).toggleSelect(selectedValue, true);
					//app.field(fieldName).selectValues([String(selectedValue)], true, true);

				}
			});			

			return qlik.Promise.resolve();
		}
	};
} );
