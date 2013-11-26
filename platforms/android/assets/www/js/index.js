/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
;( function($) {
	"use strict";

	var gmap,
		gMarker = new google.maps.Marker({
			map: gmap,
			draggable:true,
		}),
		gPosition,
		gGeocoder;
	//Creation du marqueur pour la carte
	var generateGoogleMap = function(){
	gmap = new google.maps.Map( document.getElementById("gmap"), {
		center: new google.maps.LatLng ( 50.833, 4.333 ) , //Bruxelles
		zoom:10,
		scrollwheel:false,
		draggable:true,
		disableDoubleClickZoom:true,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	} );
	
	setTimeout(function(){
		document.addEventListener('deviceready',onDeviceReady,false);		
			},2000);
	};
	//Creation de la carte google
	function fillInfo(pos){
		gGeocoder.geocode({
			location: pos
		},function (aResults,sStatus){
			if (sStatus === google.maps.GeocoderStatus.OK){
				$('.date input[type=text]').val(aResults[0].formatted_address);
				
				var d = new Date();
				var month = d.getMonth()+1;
				var day = d.getDate();
				var year = d.getFullYear();
				var hours = d.getHours();
				var minutes = d.getMinutes();

				$('.date input[type=time]').val(hours+':'+minutes);
				$('.date input[type=date]').val(day+'/'+month+'/'+year);
			} else {
				window.alert(sStatus);
			}
			
		});
	}

	function onSuccess(position) {
		//TODO tester la connexion du client
		gPosition = new google.maps.LatLng( position.coords.latitude ,position.coords.longitude );
		gmap.panTo(gPosition);
		gmap.setZoom(17);
		gMarker.setMap(gmap);
		gMarker.setIcon("http://googlemaps.googlermania.com/img/google-marker-big.png");
        gMarker.setShadow("http://googlemaps.googlermania.com/img/google-marker-big-shadow.png");
		gMarker.setPosition(gPosition);
	}

	function onErrors(errors){
		window.alert('erreur'+errors);
	}

	function getLocation() {
		navigator.geolocation.getCurrentPosition(onSuccess,onErrors);
	}
	function onDeviceReady() {
		navigator.splashscreen.hide();
	}

	$( function(){

		$('.buttonNext').on('click',function(){
			var $context = $('nav a.active').attr('class');
			$context = (/^[\w]+/).exec($context)[0];
			var $currentPanel = $('#'+$context+' div.etape');
			if($currentPanel.attr('style')){
				var $currentTranslate = (/\d{1,4}\%/).exec($currentPanel.attr('style'));
				var iNextTranslate = parseInt($currentTranslate[0].substring(0, $currentTranslate[0].length - 1))+100;
				$currentPanel.css({
					'-webkit-transform':'translateX(-'+iNextTranslate+'%)'
				});
				if($currentTranslate[0]=='1200%' && $context=='declaration'){
					$('.buttonNext').hide();
				}
				if($currentTranslate[0]=='200%' && $context=='profil'){
					$('.buttonNext').hide();
				}
				if($currentTranslate[0]=='100%' && $context=='declaration'){
					var currentPos = gMarker.getPosition();
					fillInfo(currentPos);
				}
			} else {
				$currentPanel.css({
					'-webkit-transform':'translateX(-100%)'
				});
			}
			$('.buttonPrev').show();
		});

		$('.buttonConfirm').on('click',function(){
				$('#declaration div.etape').css({
					'-webkit-transform':'translateX(-100%)'
				});
				//TODO verifier connexion a internet pour recup map google
				getLocation();
			$('.buttonPrev').show();
			$('.buttonNext').show();

		});

		$('.buttonPrev').on('click',function(){
			if($('nav a').hasClass('active')){
				var $context = (/^[\w-]+/).exec($('nav a.active').attr('class'))[0];
				var $currentPanel = $('#'+$context+' div.etape');
				var $currentTranslate = (/\d{1,4}\%/).exec($currentPanel.attr('style'));
				var iPrevTranslate = parseInt($currentTranslate[0].substring(0, $currentTranslate[0].length - 1))-100;
				$currentPanel.css({
					'-webkit-transform':'translateX(-'+iPrevTranslate+'%)'
				});
				if(iPrevTranslate === 0){
					$('.buttonPrev').hide();
					if ($context == 'declaration' ){
						$('.buttonNext').hide();
					}
				}
				if($currentTranslate[0] == '200%' && $context=='declaration'){
					getLocation();
				}
				if($currentTranslate[0]=='1300%' && $context=='declaration'){
					$('.buttonNext').show();
				}
				if($currentTranslate[0]=='300%' && $context=='profil'){
					$('.buttonNext').show();
				}
			}
		});

		$('p.resu').on('click',function(){
			var $cible = (/[\w]+$/).exec($(this).attr('class'));
			var sNomCible = $cible[0];
			switch(sNomCible)
			{
				case 'donn':
					$('#declaration div.etape').css({
						'-webkit-transform':'translateX(-400%)'
					});
					break;
					
				case 'circ':
					$('#declaration div.etape').css({
						'-webkit-transform':'translateX(-1100%)'
					});
					break;
					
				case 'croq':
					$('#declaration div.etape').css({
						'-webkit-transform':'translateX(-1200%)'
					});
					break;

				case 'phot':
					$('#declaration div.etape').css({
						'-webkit-transform':'translateX(-1300%)'
					});
					$('buttonNext').hide();
					break;
			}
		});

		$('nav a').on('click',function(e){
			e.preventDefault();
			$('nav a').removeClass('active');
			var sNomCat = $(this).attr('class');
			$(this).addClass('active');
			var sec = $('section')
			switch(sNomCat)
				{
				case 'declaration':
				  sec.css({
				  	'-webkit-transform':'translateY(-100%)'
				  });
				  if(!$('#declaration div.etape').attr('style') || (/\d{1,4}\%/).exec($('#declaration div.etape').attr('style'))=='0%'){
				  		$('.buttonPrev').hide();
				  		$('.buttonNext').hide();
				  } else {
				  		$('.buttonPrev').show();
				  		if((/\d{1,4}\%/).exec($('#declaration div.etape').attr('style'))[0]!=='1300%'){
				  			$('.buttonNext').show();
				  		} else {
				  			$('.buttonNext').hide();
				  		}
				  }
				  break;
				case 'profil':
				  sec.css({
				  	'-webkit-transform':'translateY(-200%)'
				  });
				  $('.buttonNext').show();
				  if(!$('#profil div.etape').attr('style') || (/\d{1,4}\%/).exec($('#profil div.etape').attr('style'))=='0%'){
				  		$('.buttonPrev').hide();
				  } else {
				  		$('.buttonPrev').show();
				  		if((/\d{1,4}\%/).exec($('#profil div.etape').attr('style'))[0]!=='300%'){
				  			$('.buttonNext').show();
				  		} else {
				  			$('.buttonNext').hide();
				  		}
				  }
				  break;
				case 'assistance':
				  sec.css({
				  	'-webkit-transform':'translateY(-300%)'
				  });
				  if ($('.buttonPrev').filter(':visible')){
				  	 $('.buttonPrev').hide();
				  } 
				  if ($('.buttonNext').filter(':visible')){
				  	 $('.buttonNext').hide();
				  }
				  break;
				case 'options':
				  sec.css({
				  	'-webkit-transform':'translateY(-400%)'
				  });
				  if ($('.buttonPrev').filter(':visible')){
				  	 $('.buttonPrev').hide();
				  }
				  if ($('.buttonNext').filter(':visible')){
				  	 $('.buttonNext').hide();
				  }
				  break;
				}
		});
		gGeocoder = new google.maps.Geocoder();
		generateGoogleMap();
	});

}).call(this,jQuery);

