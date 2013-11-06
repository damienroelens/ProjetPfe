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

	function onDeviceReady() {
		navigator.splashscreen.hide();
	}

	$( function(){

		$('.buttonNext').on('click',function(){
			var $context = $(this).parent().parent().parent().attr('id');
			var $currentEtape = $(this).parent();
			var $currentPanel = $('#'+$context+' div.etape');
			if($currentEtape.attr('style')){
				var $currentTranslate = (/\d{1,4}\%/).exec($currentPanel.attr('style'));
				var iNextTranslate = parseInt($currentTranslate[0].substring(0, $currentTranslate[0].length - 1))+100;
				$currentPanel.css({
					'-webkit-transform':'translate3d(-'+iNextTranslate+'%,0,0)'
				});
			} else {
				$currentPanel.css({
					'-webkit-transform':'translate3d(-100%,0,0)'
				});
				
			}
			$('.buttonPrev').show();
		});

		$('.buttonPrev').on('click',function(){
			if($('nav a').hasClass('active')){
				var $context = (/^[\w-]+/).exec($('nav a.active').attr('class'))[0];
				var $currentPanel = $('#'+$context+' div.etape');
				var $currentTranslate = (/\d{1,4}\%/).exec($currentPanel.attr('style'));
				var iPrevTranslate = parseInt($currentTranslate[0].substring(0, $currentTranslate[0].length - 1))-100;
				$currentPanel.css({
					'-webkit-transform':'translate3d(-'+iPrevTranslate+'%,0,0)'
				});
				if(iPrevTranslate === 0){
					$('.buttonPrev').hide();
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
						'-webkit-transform':'translate3d(-400%,0,0)'
					});
					break;
					
				case 'circ':
					$('#declaration div.etape').css({
						'-webkit-transform':'translate3d(-1100%,0,0)'
					});
					break;
					
				case 'croq':
					$('#declaration div.etape').css({
						'-webkit-transform':'translate3d(-1200%,0,0)'
					});
					break;

				case 'phot':
					$('#declaration div.etape').css({
						'-webkit-transform':'translate3d(-1300%,0,0)'
					});
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
				  	'-webkit-transform':'translate3d(0,-100%,0)'
				  });
				  if(!$('#declaration div.etape').attr('style') || (/\d{1,4}\%/).exec($('#declaration div.etape').attr('style'))=='0%'){
				  		$('.buttonPrev').hide();
				  } else {
				  		$('.buttonPrev').show();
				  }
				  break;
				case 'profil':
				  sec.css({
				  	'-webkit-transform':'translate3d(0,-200%,0)'
				  });
				  if(!$('#profil div.etape').attr('style') || (/\d{1,4}\%/).exec($('#profil div.etape').attr('style'))=='0%'){
				  		$('.buttonPrev').hide();
				  } else {
				  		$('.buttonPrev').show();
				  }
				  break;
				case 'assistance':
				  sec.css({
				  	'-webkit-transform':'translate3d(0,-300%,0)'
				  });
				  if ($('.buttonPrev').filter(':visible')){
				  	 $('.buttonPrev').hide();
				  }
				  break;
				case 'options':
				  sec.css({
				  	'-webkit-transform':'translate3d(0,-400%,0)'
				  });
				  if ($('.buttonPrev').filter(':visible')){
				  	 $('.buttonPrev').hide();
				  }
				  break;
				}
		});
		document.addEventListener("deviceready", onDeviceReady, false);
	});

}).call(this,jQuery);

