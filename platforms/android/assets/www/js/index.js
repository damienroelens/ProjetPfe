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
		window.alert('Erreur : '+errors.message);
	}

	function getLocation() {
		navigator.geolocation.getCurrentPosition(onSuccess,onErrors,{
		  timeout: 20000,
		  maximumAge: 20000
		});
	}
	function onDeviceReady() {
		if (window.localStorage.getItem('allDonn')){
			//TODO completition profil
			var allArr = JSON.parse(window.localStorage.getItem('allDonn'));
			var proprio = allArr.arrDonn;
			$('.prop fieldset input:nth-child(3)').val(proprio.nom);
			$('.prop fieldset input:nth-child(5)').val(proprio.prenom);
			$('.prop fieldset input:nth-child(7)').val(proprio.adresse);
			$('.prop fieldset input:nth-child(9)').val(proprio.postal);
			$('.prop fieldset input:nth-child(11)').val(proprio.pays);
			$('.prop fieldset input:nth-child(13)').val(proprio.tel);
			var vehicule = allArr.arrVehi;
			$('.vehi fieldset input:nth-child(3)').val(vehicule.marque);
			$('.vehi fieldset input:nth-child(5)').val(vehicule.numimm);
			$('.vehi fieldset input:nth-child(7)').val(vehicule.paysimm);
			var assur = allArr.arrAssu;
			$('.assu fieldset input:nth-child(3)').val(assur.nomas);
			$('.assu fieldset input:nth-child(5)').val(assur.numcont);
			$('.assu fieldset input:nth-child(7)').val(assur.numcart);
			$('.assu fieldset input:nth-child(9)').val(assur.agence);
			$('.assu fieldset input:nth-child(11)').val(assur.adresseas);
			$('.assu fieldset input:nth-child(13)').val(assur.telas);
			var conduc = allArr.arrCond;
			$('.condu fieldset input:nth-child(3)').val(conduc.nomco);
			$('.condu fieldset input:nth-child(5)').val(conduc.prenomco);
			$('.condu fieldset input:nth-child(7)').val(conduc.naissance);
			$('.condu fieldset input:nth-child(9)').val(conduc.adresseco);
			$('.condu fieldset input:nth-child(11)').val(conduc.telco);
			$('.condu fieldset input:nth-child(13)').val(conduc.numperm);
			$('.condu fieldset input:nth-child(15)').val(conduc.typeperm);
		} else {
			//TODO Redirect vers profil
		}
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

		$('#profil input[type=submit]').on("click",function(e){
			e.preventDefault();
			var arrAll = {
					"arrDonn" : {
					"nom": $('.prop fieldset input:nth-child(3)').val(),
					"prenom": $('.prop fieldset input:nth-child(5)').val(),
					"adresse": $('.prop fieldset input:nth-child(7)').val(),
					"postal": $('.prop fieldset input:nth-child(9)').val(),
					"pays": $('.prop fieldset input:nth-child(11)').val(),
					"tel": $('.prop fieldset input:nth-child(13)').val()
					},
					"arrVehi" : {
					"marque": $('.vehi fieldset input:nth-child(3)').val(),
					"numimm": $('.vehi fieldset input:nth-child(5)').val(),
					"paysimm": $('.vehi fieldset input:nth-child(7)').val()
					},
					"arrAssu" : {
					"nomas": $('.assu fieldset input:nth-child(3)').val(),
					"numcont": $('.assu fieldset input:nth-child(5)').val(),
					"numcart": $('.assu fieldset input:nth-child(7)').val(),
					"agence": $('.assu fieldset input:nth-child(9)').val(),
					"adresseas": $('.assu fieldset input:nth-child(11)').val(),
					"telas": $('.assu fieldset input:nth-child(13)').val()
					},
					"arrCond" : {
					"nomco": $('.condu fieldset input:nth-child(3)').val(),
					"prenomco": $('.condu fieldset input:nth-child(5)').val(),
					"naissance": $('.condu fieldset input:nth-child(7)').val(),
					"adresseco": $('.condu fieldset input:nth-child(9)').val(),
					"telco": $('.condu fieldset input:nth-child(11)').val(),
					"numperm": $('.condu fieldset input:nth-child(13)').val(),
					"typeperm": $('.condu fieldset input:nth-child(15)').val()
					}
					};

			window.localStorage.setItem("allDonn",JSON.stringify(arrAll));
			window.alert('Données enregistrées !')
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
		setTimeout(function(){
		document.addEventListener('deviceready',onDeviceReady,false);		
			},2000);

	});

}).call(this,jQuery);

