var PEXETO = {};

PEXETO.doc = {

	init : function(){
		this.$menu = $('#doc-menu');
		this.setDropDownClick();
		this.setCurrentElement();
		this.setExpandFunctionality();
		this.setSelectedElement();
		this.setWayPoints();
	},

	setSelectedElement : function(){
		var hash = location.hash,
			self = this,
			$anchor;

		if(hash){
			$anchor = this.$menu.find('a[href="'+hash+'"]');
			if($anchor.length){
				$anchor.parents('li').addClass('current');
				var $parentLi = $anchor.parents('li:last');
				if($parentLi.has('ol')){
					self.showSubmenu($parentLi.find('ol'));
				}
			}
		}
	},

	setWayPoints : function(){
		var self = this,
			offsets = [],
			refreshOffsets = function(){
				offsets = [];
				$('.container>h2, .container>h3').each(function(){
					offsets.push({$el:$(this), offset:$(this).offset().top});
				});
			};
		
		$(window).on('load', function(){
			refreshOffsets();
			$(document).scrollStopped(function(){
				var scrollTop = $(document).scrollTop();

				for(var i=1, len = offsets.length; i<len; i++){
					if(offsets[i].offset > scrollTop + 400){
						//get the previous element
						var $anchor = offsets[i-1].$el.find('a');

						if($anchor.length){
							var href = $anchor.attr('name'),
								$menuAnchor = self.$menu.find('a[href="#'+href+'"]');

							if($menuAnchor.length){

								self.$menu.find('.current').removeClass('current');
								$menuAnchor.parents('li').addClass('current');
							}

						}

						break;
					}
				}


			});

		}).on('resize', refreshOffsets);
	

	},



	setDropDownClick : function(){
		var self = this;

		$('#doc-menu>ol>li>a').on('click', function(e){
			var $li = $(this).parent('li');
			self.showSubmenu($li.find('ol'));
		});
	},

	setCurrentElement : function(){
		var self = this;

		this.$menu.on('click', 'a', function(e){
		// e.preventDefault();
			e.stopPropagation();

			var href = $(this).attr('href'),
				$el;

			if(href){
				$el = $('a[name="'+href.replace('#','')+'"]');

				if($el.length){
					$.scrollTo($el, {duration:500});
				}
			}
			
			self.$menu.find('.current').removeClass('current');
			$(this).parents('li').addClass('current');
		});

	},

	setExpandFunctionality : function(){
		var self = this,
			$parentLis = this.$menu.children('ol').children('li').has('ol');

		$parentLis.append('<span class="expand"></span>');

		this.$menu.on('click', '.expand', function(e){
			var $ol = $(this).siblings('ol');
			if($ol.is(':visible')){
				self.hideSubmenu($ol);
			}else{
				self.showSubmenu($ol);
			}
			
		});
	},

	showSubmenu : function($ol){
		$ol.stop().slideDown(300, 'linear')
			.siblings('.expand').addClass('expanded');
	},

	hideSubmenu : function($ol){
		$ol.stop().slideUp(300, 'linear')
			.siblings('.expand').removeClass('expanded');
	}

};


$.fn.scrollStopped = function(callback) {          
    $(this).scroll(function(){
        var self = this, $this = $(self);
        if ($this.data('scrollTimeout')) {
          clearTimeout($this.data('scrollTimeout'));
        }
        $this.data('scrollTimeout', setTimeout(callback,250,self));
    });
};

jQuery(document).ready(function($){
	PEXETO.doc.init();
});