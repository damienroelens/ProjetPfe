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

	$( function(){
		
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
				  break;
				case 'profil':
				  sec.css({
				  	'-webkit-transform':'translate3d(0,-200%,0)'
				  });
				  break;
				case 'assistance':
				  sec.css({
				  	'-webkit-transform':'translate3d(0,-300%,0)'
				  });
				  break;
				case 'options':
				  sec.css({
				  	'-webkit-transform':'translate3d(0,-400%,0)'
				  });
				  break;
				}
		})

		
		
	});

}).call(this,jQuery);

