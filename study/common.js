'use strict';
( function() {
	dk.makeFunction( 'goReady', function() {
		window.alert( '준비 중 입니다.' );
	} );

	// BtAlpha--------------------------------------------------------------------------------------//
	dk.makeClass( 'BtAlpha', ( function() {
		var init;
		var $sel = {
			el: null,
			currentEl: null
		};
		var _addEvent, _move, _resize;

		/**
		 * @method	: init
		 */
		init = function() {
			$sel.el = $( '.bt_alpha' );
			if( $sel.el.length == 0 ) return;
			$sel.el.css( 'background-color', 'rgba(0, 0, 0, 0.5)' );
			$sel.currentEl = null;
			_addEvent();
		};

		_addEvent = function() {
			var isDown, initX, initY, initW, initH, initClientX, initClientY;
			var $doc, move;
			$doc = $( document );

			$sel.el.on( 'click', function( e ) {
				e.preventDefault();
			} );

			$sel.el.on( 'mousedown touchstart', function( e ) {
				e.preventDefault();
				$sel.currentEl = $( this );
				isDown = true;
				initX = $sel.currentEl[ 0 ].style.left;
				initY = $sel.currentEl[ 0 ].style.top;
				initW = $sel.currentEl[ 0 ].style.width;
				initH = $sel.currentEl[ 0 ].style.height;
				initClientX = e.clientX || e.originalEvent.touches[ 0 ].clientX;
				initClientY = e.clientY || e.originalEvent.touches[ 0 ].clientY;

				$doc.on( 'mousemove.BtAlpha touchmove.BtAlpha', move );
			} );

			move = function( e ) {
				e.preventDefault();
				if( !isDown ) return;
				var unitX, numX, unitW, numW, gapX = ( e.clientX || e.originalEvent.touches[ 0 ].clientX ) - initClientX;
				var unitY, numY, unitH, numH, gapY = ( e.clientY || e.originalEvent.touches[ 0 ].clientY ) - initClientY;

				if( e.ctrlKey ) {
					unitW = initX.replace( /[0-9]/g, "" );
					unitW = unitW.split( '.' );
					unitW = unitW[ unitW.length - 1 ];

					unitH = initY.replace( /[0-9]/g, "" );
					unitH = unitH.split( '.' );
					unitH = unitH[ unitH.length - 1 ];

					numW = Number( initW.split( unitW )[ 0 ] );
					numH = Number( initH.split( unitH )[ 0 ] );

					$sel.currentEl.css( 'width', ( numW + gapX ) + unitW );
					$sel.currentEl.css( 'height', ( numH + gapY ) + unitH );
				} else {
					unitX = initX.replace( /[0-9]/g, "" );
					unitX = unitX.split( '.' );
					unitX = unitX[ unitX.length - 1 ];

					unitY = initY.replace( /[0-9]/g, "" );
					unitY = unitY.split( '.' );
					unitY = unitY[ unitY.length - 1 ];

					numX = Number( initX.split( unitX )[ 0 ] );
					numY = Number( initY.split( unitY )[ 0 ] );

					$sel.currentEl.css( 'left', ( numX + gapX ) + unitX );
					$sel.currentEl.css( 'top', ( numY + gapY ) + unitY );
				}
			};


			$sel.el.on( 'mouseup touchend', function( e ) {
				e.preventDefault();
				isDown = false;
				if( e.shiftKey ) {
					var t0 = $sel.currentEl.css( 'background-color' );
					$sel.currentEl.css( 'background-color', '' );
					prompt( 'style', $sel.currentEl.attr( 'style' ) );
					$sel.currentEl.css( 'background-color', t0 );
				}
				$doc.off( '.BtAlpha', move );
			} );

			$( window ).on( 'keydown', function( e ) {
				if( $sel.currentEl == null ) return;

				var gap;
				var direction;
				if( e.keyCode == 37 ) direction = 'hor', gap = -1;
				else if( e.keyCode == 39 ) direction = 'hor', gap = 1;
				else if( e.keyCode == 38 ) direction = 'ver', gap = -1;
				else if( e.keyCode == 40 ) direction = 'ver', gap = 1;
				else return;

				e.preventDefault();
				if( e.shiftKey ) gap = gap * 10;
				if( e.altKey ) gap = gap / 10;

				if( e.ctrlKey ) _resize( direction, gap );
				else _move( direction, gap );
			} );
		};

		_move = function( direction, gap ) {
			var v, unit, num;
			if( direction == 'hor' ) v = $sel.currentEl[ 0 ].style.left;
			if( direction == 'ver' ) v = $sel.currentEl[ 0 ].style.top;

			unit = v.replace( /[0-9]/g, "" );
			unit = unit.split( '.' );
			unit = unit[ unit.length - 1 ];

			num = Number( v.split( unit )[ 0 ] );
			gap = unit == '%' ? gap / 10 : gap;

			if( direction == 'hor' ) $sel.currentEl.css( 'left', ( num + gap ) + unit );
			if( direction == 'ver' ) $sel.currentEl.css( 'top', ( num + gap ) + unit );
		};

		_resize = function( direction, gap ) {
			var v, unit, num;
			if( direction == 'hor' ) v = $sel.currentEl[ 0 ].style.width;
			if( direction == 'ver' ) v = $sel.currentEl[ 0 ].style.height;

			unit = v.replace( /[0-9]/g, "" );
			unit = unit.split( '.' );
			unit = unit[ unit.length - 1 ];

			num = Number( v.split( unit )[ 0 ] );
			gap = unit == '%' ? gap / 10 : gap;

			if( direction == 'hor' ) $sel.currentEl.css( 'width', ( num + gap ) + unit );
			if( direction == 'ver' ) $sel.currentEl.css( 'height', ( num + gap ) + unit );
		};

		return {
			init: init
		}
	} )() );

	// Cookie--------------------------------------------------------------------------------------//
	dk.makeClass( 'Cookie', ( function() {
		var get, set;

		get = function( name ) {
			var nameOfCookie = name + '=';
			var i = 0;
			var j;
			var endOfCookie;
			while( i <= document.cookie.length ) {
				j = ( i + nameOfCookie.length );
				if( document.cookie.substring( i, j ) == nameOfCookie ) {
					if( ( endOfCookie = document.cookie.indexOf( ';', j ) ) == -1 )
						endOfCookie = document.cookie.length;
					return unescape( document.cookie.substring( j, endOfCookie ) );
				}
				i = document.cookie.indexOf( ' ', i ) + 1;
				if( i == 0 )
					break;
			}
			return '';
		};

		set = function( name, value, expiredays ) {
			var today = new Date();
			today.setDate( today.getDate() + expiredays );
			document.cookie = name + '=' + escape( value ) + '; path=/; expires=' + today.toGMTString() + ';';
		};

		return {
			get: get,
			set: set
		}
	} )() );

	// Pop--------------------------------------------------------------------------------------//
	dk.makeClass( 'Pop', ( function() {
		var factory;
		var _checkOption, _checkCookie, _getDom;
		var Pop, fn;

		factory = function( opt ) {
			opt = _checkOption( opt );
			if( !_checkCookie( opt.name ) ) return;
			new Pop( _getDom(), opt );
		};

		_checkOption = function( opt ) {
			if( opt.name == undefined ) return dk.err( 'Pop : name 값이 있어야 합니다.' );
			if( opt.left == undefined ) return dk.err( 'Pop : left 값이 있어야 합니다.' );
			if( opt.top == undefined ) return dk.err( 'Pop : top 값이 있어야 합니다.' );
			if( opt.list == undefined || opt.list.length < 1 ) return dk.err( 'Pop : list가 1개 이상이어야 합니다.' );

			var i, j, leng, leng2;
			var list;
			leng = opt.list.length;
			for( i = 0; i < leng; i++ ) {
				list = opt.list[ i ];
				if( list.img == undefined ) return dk.err( 'Pop : list img 값이 있어야 합니다.' );
				if( list.bts == undefined || list.bts.length < 1 ) continue;
				leng2 = list.bts.length;
				for( j = 0; j < leng2; j++ ) list.bts[ j ] = $.extend( {
					href: '#',
					target: '_self',
					style: 'width: 100%; height: 100%; left: 0; top: 0;'
				}, list.bts[ j ] );
			}
			return opt;
		};

		_checkCookie = function( name ) {
			if( dk.Cookie.get( name ) == 'done' ) return false;
			else return true;
		};

		_getDom = ( function() {
			var _templete;
			return function() {
				if( _templete ) return _templete.clone();
				_templete = $( '.pop' );
				_templete.remove();
				if( _templete.length < 1 ) return dk.err( 'Pop : .pop templete html 이 있어야 합니다' );
				return _templete.clone();
			};
		} )();

		Pop = function( $dom, opt ) {
			this.$dom = $dom;
			this.opt = opt;
			this._initPosition();
			this._initClose();
			this._initToday();
			this._initList();
			$( 'body' ).append( $dom.show() );
		};

		fn = Pop.prototype;

		fn._initPosition = function() {
			this.$dom.css( { left: this.opt.left, top: this.opt.top } );
		};

		fn._initClose = function() {
			var self = this;
			this.$dom.find( '.close' ).on( 'click', function( e ) {
				e.preventDefault();
				self.$dom.remove();
			} );
		};

		fn._initToday = function() {
			var self = this;
			this.$dom.find( '.today' ).on( 'click', function( e ) {
				e.preventDefault();
				dk.Cookie.set( self.opt.name, 'done', 1 );
				self.$dom.remove();
			} );
		};

		fn._initList = function() {
			var i, leng;
			var $ul = this.$dom.find( '.list' );
			var $li;
			leng = this.opt.list.length;
			for( i = 0; i < leng; i++ ) {
				$li = $( '<li><img src="' + this.opt.list[ i ].img + '"></li>' );
				this._addBts( $li, this.opt.list[ i ].bts );
				$ul.append( $li );
			}
			if( leng > 1 ) {
				$ul.slick( this.opt.slickOption );
			}
		};

		fn._addBts = function( $li, bts ) {
			if( !bts ) return;
			var i = bts.length;
			var $a;
			while( i-- ) {
				$a = $( '<a class="bt_alpha" style="' + bts[ i ].style + '"></a>' ).attr( {
					href: bts[ i ].href,
					target: bts[ i ].target
				} );
				$li.append( $a );
			}
		};

		return factory
	} )() );

	// LocationId--------------------------------------------------------------------------------------//
	dk.makeClass( 'LocationId', ( function() {
		var init, getId;
		var $sel;
		var _actId = null;
		var _locationId;

		/**
		 * @method	: init
		 */
		init = function() {
			$sel = {
				depth0Li: $( '.gnb .depth0>li' ),
				depth1Ul: $( '.gnb .depth0>li .depth1' )
			};
			if( _actId === null ) _actId = _locationId(); // 결과값이 없을때만 계산
			log( 'LocationId : ' + _actId );
		};

		/**
		 * @method	: getId
		 * @return	: array - [ id0, id1 ]
		 */
		getId = function() {
			if( _actId === null ) {
				log( 'LocationId : 초기화가 필요합니다.' );
				return;
			}

			return _actId.slice();
		};

		_locationId = function() {
			var pathName = location.pathname; // 현재 페이지 주소
			// var extension = '.asp';
			var id0 = -1,
				id1 = -1;

			// pathName = pathName.split( extension )[ 0 ];

			// index 페이지 일때
			if( pathName === "/" || pathName === "/index" ) {
				return [ id0, id1 ];
			}

			$sel.depth0Li.each( function( i ) {
				// li>a 구조
				var $a = $( this ).find( '>a' );
				var href = $a.prop( 'pathname' );
				var dataLink = $a.attr( 'data-link' ) || '';

				// href = href.split( extension )[ 0 ];

				if( $a.attr( 'href' ) == '/' ) return true;
				if( pathName.indexOf( href ) > -1 ) {
					id0 = i;
					return false;
				}
				if( dataLink != '' && pathName.indexOf( dataLink ) > -1 ) {
					id0 = i;
					return false;
				}
			} );

			$sel.depth1Ul.each( function( i ) {
				// ul>li>a 구조
				$( this ).find( '>li' ).each( function( j ) {
					var $a = $( this ).find( '>a' );
					var href = $a.prop( 'pathname' );
					var dataLink = $a.attr( 'data-link' ) || '';
					// gnb에 노출되지 않는 페이지 처리
					// attribute data-link 값으로 처리 ( data-link 가 포함 된 주소 활성화 )
					// <a href="url0" data-link="url"></a>

					// href = href.split( extension )[ 0 ];

					if( $a.attr( 'href' ) == '/' ) return true;
					if( pathName.indexOf( href ) > -1 ) {
						id0 = i;
						id1 = j;
						return false;
					}
					if( dataLink != '' && pathName.indexOf( dataLink ) > -1 ) {
						id0 = i;
						id1 = j;
						return false;
					}

				} );
			} );

			return [ id0, id1 ];
		};

		return {
			init: init,
			getId: getId
		}
	} )() );

	// Gnb --------------------------------------------------------------------------------------//
	dk.makeClass( 'Gnb', ( function() {
		var init, getActA, getActDepth1UlLi;
		var $sel;
		var _isInitialized, _actId;
		var _act, _ready;

		/**
		 * @method	: init
		 * @param	: $gnb - gnb 제이쿼리
		 * @param	: $depth0Li - 뎁스0 li 제이쿼리
		 * @param	: $depth1Ul - 뎁스1 ul 제이쿼리
		 */
		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			_actId = dk.LocationId.getId();

			$sel = {
				depth0Li: $( '.gnb .depth0>li' ),
				depth1Ul: $( '.gnb .depth0>li .depth1' ),
				readyA: $( '.gnb a.ready' )
			};

			_act( _actId[ 0 ], _actId[ 1 ] );
			_ready();
		};

		/**
		 * @method	: getActA
		 * @return	: jquery a element - 현재 페이지 해당 a 엘리먼트
		 */
		getActA = function() {
			var $depth0A, $depth1A;
			if( _actId[ 0 ] == -1 ) return;
			$depth0A = $sel.depth0Li.eq( _actId[ 0 ] ).find( '>a' );
			$depth1A = $sel.depth1Ul.eq( _actId[ 0 ] ).find( '>li' ).eq( _actId[ 1 ] ).find( '>a' );
			if( _actId[ 1 ] == -1 ) {} else {}
			return [ $depth0A.clone(), $depth1A.length > 0 ? $depth1A.clone() : false ];
		};

		/**
		 * @method	: getActDepth1UlLi
		 * @return	: jquery li list element - 현재 페이지 해당 depth1 li 리스트
		 */
		getActDepth1UlLi = function() {
			return $sel.depth1Ul.eq( _actId[ 0 ] ).find( '>li' ).clone();
		};

		_act = function( id0, id1 ) {
			// log( 'Gnb act : ' + id0 + ', ' + id1 );
			var $actDepth1Ul, $actDepth1UlLi;

			// depth0
			$sel.depth0Li.removeClass( 'on' );
			if( id0 != -1 ) $sel.depth0Li.eq( id0 ).addClass( 'on' );

			// depth1
			$sel.depth1Ul.each( function( i ) {
				var $this = $( this );
				if( i == id0 ) {
					$actDepth1UlLi = $this.find( '>li' );
					if( $actDepth1UlLi.length != 0 ) {
						$actDepth1UlLi.eq( id1 ).addClass( 'on' );
					}
				}
			} );
		};

		_ready = function() {
			$sel.readyA.css( 'opacity', 0.3 ).on( 'click', function( e ) {
				e.preventDefault();
				dk.goReady();
			} );
		};

		return {
			init: init,
			getActA: getActA,
			getActDepth1UlLi: getActDepth1UlLi
		}
	} )() );

	// Family --------------------------------------------------------------------------------------//
	dk.makeClass( 'Family', ( function() {
		var init;
		var $sel;
		var _isInitialized, _isOpen = true;
		var _toggle, _addEvent;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				family: $( '#footer .family' ),
				familyTitle: $( '#footer .family .title' ),
				familyUl: $( '#footer .family>ul' ),
				familyA: $( '#footer .family>ul>li>a' )
			};

			_addEvent();
			_toggle( 0 );
		};

		_toggle = function( time ) {
			_isOpen = !_isOpen;
			$sel.familyUl.stop();
			if( _isOpen ) {
				$sel.family.addClass( 'open' );
				$sel.familyUl.slideDown( time );
			} else {
				$sel.family.removeClass( 'open' );
				$sel.familyUl.slideUp( time );
			}
		};

		_addEvent = function() {
			$sel.familyTitle.on( 'click', function( e ) {
				e.preventDefault();
				_toggle( 300 );
			} );

			$sel.familyA.on( 'click', function( e ) {
				_toggle( 300 );
			} );
		};

		return {
			init: init
		}
	} )() );

	// SubTitle --------------------------------------------------------------------------------------//
	dk.makeClass( 'SubTitle', ( function() {
		var init;
		var _isInitialized;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			var $arr = dk.Gnb.getActA();
			// sub_title_depth0
			$( '.sub_title_depth0' ).css( 'background-image', 'url(/resource/img/common/sub_title_bg' + dk.LocationId.getId()[ 0 ] + '.jpg)' );
			$( '.sub_title_depth0 h2' ).text( $arr[ 0 ].text() );
			$( '.sub_title_depth0 .eng' ).text( $arr[ 0 ].attr( 'data-eng' ) );
			$( '.sub_title_depth0 .txt' ).text( $arr[ 0 ].attr( 'data-txt' ) );

			if( !$arr[ 1 ] ) return;

			$( '.sub_title_depth1 h3' ).text( $arr[ 1 ].text() );
			$( '.sub_title_depth1 .txt' ).html( $arr[ 1 ].attr( 'data-txt' ) );
		};

		return {
			init: init
		}
	} )() );

	// Lnb --------------------------------------------------------------------------------------//
	dk.makeClass( 'Lnb', ( function() {
		var init;
		var $sel;
		var _isInitialized;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				lnb: $( '.lnb' ),
				ul: $( '.lnb>ul' )
			};

			var $depth1UlLi = dk.Gnb.getActDepth1UlLi();
			$sel.ul.empty();
			if( $depth1UlLi.length <= 1 ) return $sel.lnb.remove();
			$depth1UlLi.css( 'width', 100 / $depth1UlLi.length + '%' );
			$sel.ul.append( $depth1UlLi );
		};

		return {
			init: init
		}
	} )() );

	// FixedNavi lnb depth2--------------------------------------------------------------------------------------//
	dk.makeClass( 'FixedNavi', ( function() {
		var init;
		var $sel;
		var _isInitialized;
		var _addEvent;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				win: $( window ),
				lnb: $( '.lnb' ),
				depth2: $( '.depth2' )
			};
			_addEvent();
		};

		_addEvent = function() {
			// lnb
			dk.ScrollCheck.add( $sel.lnb, function( y, winHeight, target ) {
				if( y > 0 ) target.removeClass( 'fixed' ).css( 'top', '' );
				else target.addClass( 'fixed' ).css( 'top', 0 );
			} );
			// depth2
			dk.ScrollCheck.add( $sel.depth2, function( y, winHeight, target ) {
				var gap = 80;
				if( y > gap ) target.removeClass( 'fixed' ).css( 'top', '' );
				else target.addClass( 'fixed' ).css( 'top', gap );
			} );
		};

		return {
			init: init
		}
	} )() );

	// PortfolioVisual --------------------------------------------------------------------------------------//
	dk.makeClass( 'PortfolioVisual', ( function() {
		var init;
		var $sel;
		var _isInitialized;
		var _initSlider;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				ul: $( '#container.portfolio .visual ul.slider' ),
				li: $( '#container.portfolio .visual ul.slider>li' ),
				dot: $( '#container.portfolio .visual ul.dot' ),
				arrow: $( '#container.portfolio .visual .arrow' )
			};

			_initSlider();
		};

		_initSlider = function() {
			dk.Slider( $sel.ul, {
				$dot: $sel.dot,
				$arrow: $sel.arrow,
				touch: true,
				autoPlay: false,
				autoPlaySpeed: 4,
				motionType: 'fixed',
				onAct: function( id, oldId, direction ) {
					// log( 'act : ' + id + ', ' + oldId + ', ' + direction );
					var $children;
					$children = $sel.li.eq( id ).find( '>div>*' );
					TweenLite.set( $children, { opacity: 0 } );
					TweenLite.to( $children, 2, { delay: 0.4, opacity: 1, ease: Power2.easeOut } );
				}
			} );
		};

		return {
			init: init
		}
	} )() );

	// Portfolio --------------------------------------------------------------------------------------//
	dk.makeClass( 'Portfolio', ( function() {
		var init, initMain;
		var _isInitialized;
		var State, Category, Select, ListManager, Thumb, More;

		// 포트폴리오 일때
		init = function( initId ) {
			if( _isInitialized ) return;
			_isInitialized = true;

			ListManager.init();
			More.init();
			Thumb.init();
			Category.init( initId );
		};

		// 메인 일때
		initMain = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			// More, Category 사용안함
			State.thumbNum = 6;
			ListManager.init();
			Thumb.init();
			ListManager.reset( State.category0, State.category1, State.category2 );
		};

		// State--------------------------------------------------------------------------------------//
		State = {
			category0: 'all',
			category1: 'all',
			category2: 'all',
			page_current: 1,
			thumbNum: 9
		};

		// Category --------------------------------------------------------------------------------------//
		Category = ( function() {
			var init;
			var $sel, $clone;
			var _isInitialized;
			var _change, _initAll, _initSelect0, _select0Click, _initSelect1, _select1Click, _initSelect2, _select2Click;
			var _select0, _select1, _select2;

			init = function( initId ) {
				if( _isInitialized ) return;
				_isInitialized = true;

				$sel = {
					category: $( '.portfolio_category' ),
					all: $( '.portfolio_category .cell.all .select .title' ),
					clone: $( '.portfolio_category .cell.clone' )
				};

				$clone = $sel.clone.clone();
				$sel.clone.remove();

				_initAll();
				_initSelect0( initId );
				_initSelect1();
				_initSelect2();
			};

			_initAll = function() {
				$sel.all.on( 'click', function( e ) {
					e.preventDefault();
					if( dk.PortfolioData.isLoading() ) return;
					_select0.load( 'all', _change );
					_select1.reset();
					_select2.reset();
				} );
			};

			_initSelect0 = function( initId ) {
				_select0 = Select( $sel.category, $clone.clone(), _select0Click );
				_select0.load( 'all', _change, initId );
			};
			_select0Click = function() {
				if( dk.PortfolioData.isLoading() ) return;
				_select0.close();
				_select1.close();
				_select2.close();
				_select1.load( _select0.getState(), _change );
				_select2.reset();
			};

			_initSelect1 = function() {
				_select1 = Select( $sel.category, $clone.clone(), _select1Click )
			};
			_select1Click = function() {
				if( dk.PortfolioData.isLoading() ) return;
				_select0.close();
				_select1.close();
				_select2.close();
				_select2.load( _select1.getState(), _change );
			};

			_initSelect2 = function() {
				_select2 = Select( $sel.category, $clone.clone(), _select2Click )
			};
			_select2Click = function() {
				if( dk.PortfolioData.isLoading() ) return;
				_select0.close();
				_select1.close();
				_select2.close();
				_change();
			};

			_change = function() {
				ListManager.reset( _select0.getState(), _select1.getState(), _select2.getState() );
			};

			return {
				init: init
			}
		} )();

		// Select --------------------------------------------------------------------------------------//
		Select = ( function() {
			var Select, fn, factory;

			Select = function( $parent, $el, cb ) {
				$parent.append( $el );
				this.$el = $el;
				this.$el.fadeOut( 0 );
				this.$select = this.$el.find( '.select' );
				this.$title = this.$el.find( '.title' );
				this.$ul = this.$el.find( 'ul' );
				this.$li = null;

				this._cb = cb;
				this._isOpen = true;
				this._leng = 0;
				this._time = 150;
				this._state = 'all';

				this._initTitle();
				this.close( 0 );
				this._checkLength();
			};
			fn = Select.prototype;

			fn.load = function( parentState, cb, initId ) {
				var self = this;
				dk.PortfolioData.getCategory( parentState, function( data ) {
					var i, leng = data.list.length;
					var r = '';
					var oldId = -1;
					for( i = 0; i < leng; i++ ) {
						r += '<li><a href="#" data-value="' + data.list[ i ].value + '">' + data.list[ i ].txt + '</a></li>';
					}

					if( self.$li ) {
						self.$li.find( '>a' ).off();
						self.$li.remove();
						self.$ul.empty();
					}

					self.$title.text( data.title );
					self.$li = $( r );
					self.$ul.append( self.$li );
					self._leng = self.$li.length;
					self._state = 'all';
					self._checkLength();

					self.$li.find( '>a' ).on( 'click', function( e ) {
						e.preventDefault();
						if( dk.PortfolioData.isLoading() ) return;
						var $this = $( this );
						var id = $this.parent().index();
						self.close();
						if( id == oldId ) return;
						oldId = id;
						self.$title.text( $this.text() );
						self._state = $this.data( 'value' );
						self._cb();
					} );

					if( initId == undefined ) {
						cb();
					} else {
						self.$li.find( '>a' ).eq( initId ).trigger( 'click' );
					}

				} );
			};

			fn.close = function( time ) {
				this._isOpen = false;
				this.$el.removeClass( 'open' );
				this.$ul.slideUp( time == undefined ? this._time : time );
			};

			fn.reset = function() {
				if( !this.$li ) return;
				this.$li.remove();
				this.$ul.empty();
				this._leng = 0;
				this._state = 'all';
				this._checkLength();
			};

			fn.getState = function() {
				return this._state;
			};

			fn._toggle = function( time ) {
				this._isOpen = !this._isOpen;
				this.$ul.stop();
				if( this._isOpen ) {
					this.$el.addClass( 'open' );
					this.$ul.slideDown( time );
				} else {
					this.$el.removeClass( 'open' );
					this.$ul.slideUp( time );
				}
			};

			fn._initTitle = function() {
				var self = this;
				this.$title.on( 'click', function( e ) {
					e.preventDefault();
					if( self._leng == 0 ) return;
					self._toggle( self._time );
				} );
			};

			fn._checkLength = function() {
				this.$el.stop();
				if( this._leng == 0 ) {
					// this.$el.hide();
					this.$el.fadeOut( 100 );
					// this.$el.css( 'opacity', 0.2 );
				} else {
					this.$el.fadeIn( 400 );
					// this.$el.css( 'opacity', 1 );
					// this.$el.css( 'width', '' );
				}
			};

			factory = function( $parent, $el, cb ) {
				return new Select( $parent, $el, cb );
			};

			return factory;
		} )();

		// ListManager --------------------------------------------------------------------------------------//
		ListManager = ( function() {
			var init, reset, add;
			var $sel;
			var _isInitialized;
			var _addList;
			var _page_current = 0;

			init = function() {
				if( _isInitialized ) return;
				_isInitialized = true;

				$sel = {
					ul: $( '.portfolio_list>ul' )
				};
			};

			reset = function( category0, category1, category2 ) {
				// 기존 리스트 제거
				$sel.ul.empty();
				State.category0 = category0;
				State.category1 = category1;
				State.category2 = category2;
				State.page_current = 0;
				add();
			};

			add = function() {
				// data 로드
				State.page_current++;
				dk.PortfolioData.getList( State, function( data ) {
					State.page_current = parseInt( data.page_current );
					More.setNum( data.page_current, data.page_total );
					_addList( data.list );
				} );
			};

			_addList = function( data ) {
				var i, leng, $el, $bg, $client, $project, $tag;
				leng = data.length;
				for( i = 0; i < leng; i++ ) {
					$el = Thumb.add( data[ i ] ).$el;
					$bg = $el.find( '>a .bg' );
					$client = $el.find( '.txt_client' );
					$project = $el.find( '.txt_project' );
					$tag = $el.find( '.txt_tag' );

					$sel.ul.append( $el );
					// TweenLite.set( $el, { opacity: 0, y: 200, z: -200, rotationX: -40, rotationY: 40, rotationZ: 40, transformPerspective: 1000, transformOrigin: 'center 30%' } );
					// TweenLite.to( $el, 0.7, { delay: i * 0.15, opacity: 1, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, ease: Back.easeOut } );
					TweenLite.set( $el, { opacity: 0 } );
					TweenLite.set( $bg, { width: 0, height: 1 } );
					TweenLite.set( $client, { opacity: 0, x: 100 } );
					TweenLite.set( $project, { opacity: 0, x: 100 } );
					TweenLite.set( $tag, { opacity: 0, x: 60 } );
					TweenLite.to( $el, 0.5, { delay: i * 0.15, opacity: 1, ease: Power2.easeOut } );
					TweenLite.to( $bg, 0.5, { delay: i * 0.15, width: '100%', ease: Power4.easeOut } );
					TweenLite.to( $bg, 1, { delay: i * 0.15 + 0.5, height: '100%', ease: Power4.easeOut } );
					TweenLite.to( $client, 1, { delay: i * 0.15 + 1.1, opacity: 1, x: 0, ease: Power4.easeOut } );
					TweenLite.to( $project, 1, { delay: i * 0.15 + 1.2, opacity: 1, x: 0, ease: Power4.easeOut } );
					TweenLite.to( $tag, 1, { delay: i * 0.15 + 1.3, opacity: 1, x: 0, ease: Power4.easeOut } );
				}
				dk.ScrollCheck.reset();
			};

			return {
				init: init,
				reset: reset,
				add: add
			}
		} )();

		// Thumb --------------------------------------------------------------------------------------//
		Thumb = ( function() {
			var init, add;
			var $sel, $clone;
			var _isInitialized;
			var Thumb, fn;

			init = function() {
				if( _isInitialized ) return;
				_isInitialized = true;

				$sel = {
					clone: $( '.portfolio_list>ul>li:first-child' )
				};

				$clone = $sel.clone.clone();
				$sel.clone.remove();
			};

			add = function( data ) {
				return new Thumb( data );
			};

			Thumb = function( data ) {
				this.data = data;
				this.$el = $clone.clone();
				this.$el.addClass( data.field_value );
				this.$el.find( '>a .bg' ).css( 'background-image', 'url(' + data.thumb_img + ')' );
				this.$el.find( '>a .field>span' ).html( data.field_txt == '디지털분양솔루션' ? '디지털<br>분양솔루션' : data.field_txt );
				this.$el.find( '.txt_client' ).html( data.client );
				this.$el.find( '.txt_project' ).html( data.project );
				this.$el.find( '.txt_tag' ).html( data.tag );

				this._setBt();
			};
			fn = Thumb.prototype;

			fn._setBt = function() {
				var view_id = this.data.view_id;
				var homepage_url = this.data.homepage_url;

				if( view_id == '' && homepage_url == '' ) {
					this.$el.addClass( 'no_detail' );
					this.$el.find( '>a .over' ).hide();
					this.$el.find( '>a' ).on( 'click', function( e ) {
						e.preventDefault();
					} );
					return;
				}
				if( view_id != '' ) {
					this.$el.find( '>a .over>span' ).text( '자세히보기' );
					this.$el.find( '>a' ).on( 'click', function( e ) {
						e.preventDefault();
						if( dk.PortfolioData.isLoading() ) return;
						dk.Hasher.portfolioViewAct( view_id, State.category0, State.category1, State.category2 );
					} );
					return;
				}
				if( homepage_url != '' ) {
					this.$el.find( '>a .over>span' ).text( '사이트 바로가기' );
					this.$el.find( '>a' ).attr( {
						href: homepage_url,
						target: '_blank',
					} );
					return;
				}
			};

			return {
				init: init,
				add: add
			}
		} )();

		// More --------------------------------------------------------------------------------------//
		More = ( function() {
			var init, setNum;
			var $sel;
			var _isInitialized, _listEnd;
			var _addEvent, _next;

			init = function() {
				if( _isInitialized ) return;
				_isInitialized = true;

				$sel = {
					bt: $( '.portfolio_list .more_bt' ),
					current: $( '.portfolio_list .more_bt>p>span.current' ),
					total: $( '.portfolio_list .more_bt>p>span.total' ),
					win: $( window ),
					doc: $( document )
				};

				$sel.current.text( 1 );
				$sel.total.text( 1 );

				_addEvent();
			};

			setNum = function( current, total ) {
				if( !_isInitialized ) return;
				$sel.current.text( current );
				$sel.total.text( total );
				_listEnd = current >= total ? true : false;
				TweenLite.to( $sel.bt, 0.5, { autoAlpha: _listEnd ? 0 : 1, ease: Power2.easeOut } );
			};

			_addEvent = function() {
				$sel.bt.on( 'click', function( e ) {
					e.preventDefault();
					if( dk.PortfolioData.isLoading() ) return;
					if( _listEnd ) return;
					_next();
				} );

				// scroll
				$sel.win.on( 'mousewheel DOMMouseScroll', function( e ) {
					if( dk.PortfolioData.isLoading() ) return;
					if( _listEnd ) return;
					var ev = window.event || e.originalEvent;
					var delta = ev.detail ? ev.detail < 0 ? -1 : 1 : ev.wheelDelta > 0 ? -1 : 1;

					if( delta > 0 && $sel.win.scrollTop() + $sel.win.height() == $sel.doc.height() ) {
						_next();
					}
				} );
			};

			_next = function() {
				log( 'next' );
				ListManager.add();
			};

			return {
				init: init,
				setNum: setNum
			}
		} )();

		return {
			init: init,
			initMain: initMain
		}
	} )() );

	// PortfolioData --------------------------------------------------------------------------------------//
	dk.makeClass( 'PortfolioData', ( function() {
		var _isLoading = false;
		var getCategory, getList, getView, getViewId;

		var _isLocal = false;
		//var _isLocal = true;
		var _url = ( function() {
			var localUrl = {
				category: '/resource/local/portfolioDataCategory.json',
				category0: '/resource/local/portfolioDataCategory0.json',
				list: '/resource/local/portfolioDataList.json',
				view: '/resource/local/portfolioDataView.json'
			};
			var serverUrl = {
				category: '/pages/portfolio/portfolioDataCategory',
				category0: '/pages/portfolio/portfolioDataCategory',
				list: '/pages/portfolio/portfolioDataList',
				view: '/pages/portfolio/portfolioDataView',
				viewId: '/pages/portfolio/portfolioDataViewId',
			}
			return _isLocal ? localUrl : serverUrl;
		} )();

		/**
		 * @method	: getCategory
		 * @param	: v - 카테고리 value 값
		 * @param	: cb - 로드 완료 함수
		 */
		getCategory = function( v, cb ) {
			log( 'ajax getCategory : ' + v );
			_isLoading = true;
			$.ajax( {
				url: v == 'all' ? _url.category : _url.category0,
				method: _isLocal ? 'GET' : 'POST',
				data: { value: v },
				dataType: 'json'
			} ).done( function( data ) {
				_isLoading = false;
				cb( data );
			} ).fail( function() {
				log( "getCategory fail" );
				_isLoading = false;
			} );
		};

		/**
		 * @method	: getList
		 * @param	: state - 카테고리, 썸네일갯수
		 * @param	: cb - 로드 완료 함수
		 */
		getList = function( state, cb ) {
			log( 'ajax getList - state : ' );
			log( state );
			_isLoading = true;
			$.ajax( {
				url: _url.list,
				method: _isLocal ? 'GET' : 'POST',
				data: state,
				dataType: 'json'
			} ).done( function( data ) {
				log( data );
				cb( data );
				_isLoading = false;
			} ).fail( function() {
				log( "getList fail" );
				_isLoading = false;
			} );
		};

		/**
		 * @method	: getView
		 * @param	: view_id, category0, category1, category2
		 * @param	: cb - 로드 완료 함수
		 */
		getView = function( view_id, category0, category1, category2, cb ) {
			log( 'ajax getView - view_id : ' + view_id );
			_isLoading = true;
			$.ajax( {
				url: _url.view,
				method: _isLocal ? 'GET' : 'POST',
				data: { view_id: view_id, category0: category0, category1: category1, category2: category2 },
				dataType: 'json'
			} ).done( function( data ) {
				cb( data );
				_isLoading = false;
			} ).fail( function() {
				log( "getView fail" );
				_isLoading = false;
			} );
		};

		/**
		 * @method	: getViewId
		 * @param	: direction - prev, next 문자열
		 * @param	: view_id - 현재 view_id
		 * @param	: cb - 로드 완료 함수
		 */
		getViewId = function( direction, view_id, cb ) {
			log( 'ajax getViewId - view_id : ' + view_id );
			_isLoading = true;
			if( _isLocal ) {
				view_id = direction == 'prev' ? --view_id : direction == 'next' ? ++view_id : view_id;
				cb( view_id );
			} else {
				$.ajax( {
					url: _url.viewId,
					method: 'POST',
					data: { direction: direction, view_id: view_id },
					dataType: 'text'
				} ).done( function( data ) {
					cb( data );
				} ).fail( function() {
					log( "getViewId fail" );
					_isLoading = false;
				} );
			}
		};

		return {
			isLoading: function() { return _isLoading; },
			getCategory: getCategory,
			getList: getList,
			getView: getView,
			getViewId: getViewId
		}
	} )() );

	// PortfolioView --------------------------------------------------------------------------------------//
	dk.makeClass( 'PortfolioView', ( function() {
		var init, act, deAct;
		var $sel;
		var _isInitialized, _data, _state = {},
			_isNext = true,
			_isLive = false;
		var _initBt, _show, _hide, _changeShow, _changeHide,
			_imgLoad, _txtAni,
			_initVisual, _addVisual, _delVisual, _addMovie, _delMovie, _addDetail, _delDetail;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				html: $( 'html' ),
				quick: $( '.quick' ),
				view: $( '.portfolio_view' ),
				visual: $( '.portfolio_view .visual' ),
				visualIn: $( '.portfolio_view .visual .visual_in' ),
				visualBg: $( '.portfolio_view .visual .visual_in .visual_bg' ),
				client: $( '.portfolio_view .visual .visual_in .visual_bg .txt_client' ),
				project: $( '.portfolio_view .visual .visual_in .visual_bg .txt_project' ),
				category: $( '.portfolio_view .visual .visual_in .visual_bg .txt_category' ),
				homepage: $( '.portfolio_view .visual .visual_in .visual_bg a.homepage' ),
				movie: $( '.portfolio_view .movie' ),
				movieIframe: $( '.portfolio_view .movie>iframe' ),
				detail: $( '.portfolio_view .detail' ),
				editor: $( '.portfolio_view .editor' ),
				bt: $( '.portfolio_view .bt>a' ),
				closeBt: $( '.portfolio_view .bt>a.close' ),
				prevBt: $( '.portfolio_view .bt>a.prev' ),
				nextBt: $( '.portfolio_view .bt>a.next' )
			};

			dk.Hasher.init();
			_initBt();
		};

		act = function( view_id, category0, category1, category2 ) {
			log( 'PortfolioView act' );
			_state.view_id = view_id, _state.category0 = category0, _state.category1 = category1, _state.category2 = category2;
			if( _isLive ) {
				// next, prev
				dk.PortfolioData.getView( view_id, category0, category1, category2, function( data ) {
					_data = data;
					_changeShow();
				} );
			} else {
				// new
				_isLive = true;
				_isNext = true;
				dk.PortfolioData.getView( view_id, category0, category1, category2, function( data ) {
					_data = data;
					_show();
				} );
			}
			dk.Scroll.changeTarget( $sel.view );
		};

		deAct = function() {
			if( !_isLive ) return;
			_isLive = false;
			log( 'PortfolioView deAct' );
			_hide();
			dk.Scroll.changeTarget( $( window ) );
		};

		_initBt = function() {
			$sel.closeBt.on( 'click', function( e ) {
				e.preventDefault();
				if( dk.PortfolioData.isLoading() ) return;
				dk.Hasher.portfolioViewDeAct();
			} );
			$sel.prevBt.on( 'click', function( e ) {
				e.preventDefault();
				if( dk.PortfolioData.isLoading() ) return;
				log( 'prev' );
				_isNext = false;
				dk.PortfolioData.getViewId( 'prev', _state.view_id, function( view_id ) {
					dk.Hasher.portfolioViewAct( view_id, _state.category0, _state.category1, _state.category2 );
				} );
			} );
			$sel.nextBt.on( 'click', function( e ) {
				e.preventDefault();
				if( dk.PortfolioData.isLoading() ) return;
				log( 'next' );
				_isNext = true;
				dk.PortfolioData.getViewId( 'next', _state.view_id, function( view_id ) {
					dk.Hasher.portfolioViewAct( view_id, _state.category0, _state.category1, _state.category2 );
				} );
			} );
		};

		_show = function() {
			$sel.view.css( { overflowY: 'hidden' } );
			TweenLite.set( $sel.view, { autoAlpha: 1, x: '-100%' } );
			TweenLite.to( $sel.view, 1, {
				x: '0%',
				ease: Power4.easeOut,
				onComplete: function() {
					$sel.html.css( { overflow: 'hidden', marginRight: 17 } );
					$sel.view.css( { overflowY: 'scroll', 'transform': '' } );
					$sel.quick.css( { right: 17 } );
				}
			} );
			_initVisual();
			setTimeout( function() {
				_addVisual();
			}, 300 );
		};

		_hide = function() {
			TweenLite.killTweensOf( $sel.view );
			TweenLite.to( $sel.view, 0.5, {
				autoAlpha: 0,
				ease: Power4.easeOut,
				onComplete: function() {
					$sel.view.css( { overflowY: 'hidden' } );
					$sel.html.css( { overflow: 'auto', marginRight: 0 } );
					$sel.quick.css( { right: 0 } );
					_delVisual();
					_delMovie();
					_delDetail();
				}
			} );
		};

		_changeShow = function() {
			_changeHide();

			setTimeout( function() {
				_initVisual();
				_addVisual();
			}, 500 );
		};

		_changeHide = function() {
			TweenLite.to( $sel.visualIn, 0.5, { opacity: 0, ease: Power4.easeOut } );
			TweenLite.to( $sel.movie, 0.5, { opacity: 0, ease: Power4.easeOut } );
			TweenLite.to( $sel.detail, 0.5, { opacity: 0, ease: Power4.easeOut } );
			TweenLite.to( $sel.editor, 0.5, { opacity: 0, ease: Power4.easeOut } );
			TweenLite.to( $sel.bt, 0.5, { opacity: 0, ease: Power4.easeOut } );
			setTimeout( function() {
				_delVisual();
				_delMovie();
				_delDetail();
			}, 500 );
		};

		_initVisual = function() {
			$sel.view.css( { overflowX: 'hidden' } );
			if( _isNext ) TweenLite.set( $sel.visualIn, { width: '50%', height: 1, x: '-200%', y: 427 } );
			else TweenLite.set( $sel.visualIn, { width: '50%', height: 1, x: '250%', y: 427 } );
			TweenLite.set( $sel.visualBg, { opacity: 0 } );
			TweenLite.set( $sel.bt, { x: 120 } );
			TweenLite.set( $sel.homepage, { autoAlpha: 0 } );
			TweenLite.set( $sel.visualIn, { opacity: 1 } );
			TweenLite.set( $sel.movie, { opacity: 1 } );
			TweenLite.set( $sel.detail, { opacity: 1 } );
			TweenLite.set( $sel.bt, { opacity: 1 } );
		};

		_addVisual = function() {
			// TweenLite.to( $sel.visualIn, 0.5, { x: '50%', ease: Back.easeOut, easeParams: [ 1 ] } );
			TweenLite.to( $sel.visualIn, 0.8, { x: '50%', skewX: 0, ease: Elastic.easeOut.config( 0.8, 0.8 ) } ); //config (overshoot) (period)
			TweenLite.to( $sel.visualIn, 0.5, {
				delay: 0.8,
				width: '100%',
				height: '100%',
				x: '0%',
				y: '0%',
				ease: Power2.easeOut,
				onComplete: function() {
					$sel.view.css( { overflowX: 'auto' } );
					_imgLoad( _data.view_img, function( img ) {
						$sel.visualBg.css( 'background-image', 'url(' + _data.view_img + ')' );
						TweenLite.to( $sel.visualBg, 1, { opacity: 1, ease: Power2.easeOut } );
					} );
					TweenMax.staggerTo( $sel.bt, 0.5, { x: 0, ease: Power4.easeOut }, 0.1 );
					// $sel.client.text( _data.client );
					// $sel.project.text( _data.project );
					// $sel.category.text( _data.category );
					_txtAni( $sel.client, _data.client, 0.05 );
					_txtAni( $sel.project, _data.project, 0.05, 0.5 );
					_txtAni( $sel.category, _data.category, 0.05, 1 );
					if( _data.homepage_url != '' ) {
						$sel.homepage.attr( 'href', _data.homepage_url );
						TweenLite.set( $sel.homepage, { autoAlpha: 0 } );
						TweenLite.to( $sel.homepage, 1, { delay: 3, autoAlpha: 1, ease: Power2.easeOut } );
					}
					_addMovie();
					_addDetail();
				}
			} );
		};

		_delVisual = function() {
			TweenLite.killTweensOf( $sel.visualIn );
			TweenLite.killTweensOf( $sel.visualBg );
			$sel.visualBg.css( 'background-image', '' );
			$sel.client.text( '' );
			$sel.project.text( '' );
			$sel.category.text( '' );
			TweenLite.killTweensOf( $sel.homepage );
			TweenLite.set( $sel.homepage, { autoAlpha: 0 } );
			$sel.homepage.attr( 'href', '' );
		};

		_addMovie = function() {
			if( _data.movie_url == '' ) {
				$sel.movie.hide();
			} else {
				$sel.movie.show();
				TweenLite.set( $sel.movie, { height: 0 } );
				TweenLite.to( $sel.movie, 1, { delay: 2, height: $sel.movieIframe.height(), ease: Power4.easeOut, onComplete: function() { $sel.movieIframe.attr( 'src', _data.movie_url + '?enablejsapi=1&iv_load_policy=3&rel=0&showinfo=0' ); } } );
			}
		};

		_delMovie = function() {
			TweenLite.killTweensOf( $sel.movie );
			TweenLite.set( $sel.movie, { height: 0 } );
			$sel.movie.hide();
			$sel.movieIframe.attr( 'src', '' );
		};

		_addDetail = function() {
			_imgLoad( _data.detail_img, function( img ) {
				$sel.detail.css( { 'background-image': 'url(' + _data.detail_img + ')' } );
				TweenLite.to( $sel.detail, 2, { height: img.height, ease: Power4.easeOut } );
			} );
			TweenLite.set( $sel.detail, { height: 0 } );

			$sel.editor.html( _data.contents );
		};

		_delDetail = function() {
			TweenLite.killTweensOf( $sel.detail );
			TweenLite.set( $sel.detail, { height: 0 } );
			$sel.detail.css( { 'background-image': '', 'height': '' } );

			$sel.editor.html( '' );
		};

		_imgLoad = function( url, cb ) {
			var img = document.createElement( 'img' );
			img.onload = function() { cb( img ); };
			img.src = url;
		};

		_txtAni = function( $s, str, time, delay ) {
			var arr = str.split( '' );
			var i, leng = arr.length;
			var $el;
			delay = delay || 0;
			for( i = 0; i < leng; i++ ) {
				$el = $( '<span style="display:inline-block;">' + arr[ i ].replace( /\s/gi, "&nbsp;" ) + '</span>' );
				$s.append( $el );
				TweenLite.set( $el, { opacity: 0, x: 50 } );
				TweenLite.to( $el, 0.5, { delay: i * time + delay, opacity: 1, x: 0, ease: Power2.easeOut } );
			}
		};

		return {
			init: init,
			act: act,
			deAct: deAct
		}
	} )() );

	// Hasher --------------------------------------------------------------------------------------//
	dk.makeClass( 'Hasher', ( function() {
		var init, portfolioViewAct, portfolioViewDeAct;
		var _isInitialized;
		var _handleChanges;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			hasher.changed.add( _handleChanges ); //add hash change listener
			hasher.initialized.add( _handleChanges ); //add initialized listener (to grab initial value in case it is already set)
			hasher.init(); //initialize hasher (start listening for history changes)
		};

		portfolioViewAct = function( view_id, category0, category1, category2 ) {
			var r = '';
			r += 'category0' + '=' + category0 + '&';
			r += 'category1' + '=' + category1 + '&';
			r += 'category2' + '=' + category2 + '&';
			r += 'view_id' + '=' + view_id;
			hasher.setHash( r );
		};

		portfolioViewDeAct = function() {
			hasher.setHash( 'list' );
		};

		_handleChanges = function( newHash, oldHash ) {
			log( 'hasher newHash : ' + newHash );

			if( newHash == 'list' ) {
				dk.PortfolioView.deAct();
				return;
			}

			var obj, arr, i, t0, t1;
			obj = {};
			arr = newHash.split( '&' );
			i = arr.length;
			while( i-- ) {
				t0 = arr[ i ];
				if( t0 ) t1 = t0.split( '=' ), obj[ t1[ 0 ] ] = t1[ 1 ];
			}
			if( obj.view_id == undefined ) return;
			if( obj.category0 == undefined ) return;
			if( obj.category1 == undefined ) return;
			if( obj.category2 == undefined ) return;
			dk.PortfolioView.act( obj.view_id, obj.category0, obj.category1, obj.category2 );
		};

		return {
			init: init,
			portfolioViewAct: portfolioViewAct,
			portfolioViewDeAct: portfolioViewDeAct
		}
	} )() );

	// MainVisual --------------------------------------------------------------------------------------//
	dk.makeClass( 'MainVisual', ( function() {
		var init;
		var $sel;
		var _isInitialized;
		var _initLoad, _initSlider;
		var Bg;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				ul: $( '#container.main .visual .slider' ),
				li: $( '#container.main .visual .slider>li' ),
				dot: $( '#container.main .visual .dot' )
			};

			_initLoad();
		};

		_initLoad = function() {
			var loader = new PIXI.loaders.Loader();
			loader.add( 'bg', $sel.ul.data( 'bg' ) )
			$sel.li.each( function( i ) {
				loader.add( 'bg' + i, $( this ).data( 'bg' ) )
			} );
			loader.load( function( loader, resources ) {
				Bg.init( resources );
				_initSlider();
			} );
		};

		_initSlider = function() {
			var s = dk.Slider( $sel.ul, {
				$dot: $sel.dot,
				touch: true,
				autoPlay: true,
				autoPlaySpeed: 8,
				motionType: 'fade',
				motionEaseAct: Power2.easeIn,
				motionEaseOld: Power2.easeOut,
				// freezeTime: 2,
				motionTime: 4,
				onAct: function( id, oldId, direction ) {
					// log( 'act : ' + id + ', ' + oldId + ', ' + direction );
					Bg.act( id, oldId, direction );
				}
			} );
		};

		Bg = ( function() {
			var init, act;
			var $sel;
			var _isInitialized;
			var _resources, _canvas, _container;
			var _initCanvas, _initBg, _posBg, _initContainer, _posContainer, _initResize, _ani;
			var _docW = 1920,
				_docH = 999;

			init = function( resources ) {
				// pixi.min.js 로드 필요
				if( _isInitialized ) return;
				_isInitialized = true;

				$sel = {
					win: $( window ),
					canvas: $( '#container.main .visual .canvas' )
				};

				_resources = resources;

				_initCanvas();
				_initBg();
				_initContainer();
				_initResize();
			};

			act = function( id, oldId, direction ) {
				// log( 'Bg act : ' + id + ', ' + oldId + ', ' + direction );
				var w = 480;
				var gap = 0;
				var delay = 0.2;
				var x = 0;
				var oldX;
				for( var i = 0; i < 4; i++ ) {
					if( i > 0 ) x = oldX + ( w - ( i - 1 ) * gap );
					_ani( id, w - i * gap, x, delay * i, direction );
					oldX = x;
				}
				_posContainer();
			};

			_ani = function( id, w, x, delay, direction ) {
				var skewX = 0;
				var img = new PIXI.Sprite( _resources[ 'bg' + id ].texture );
				img.blendMode = PIXI.BLEND_MODES.ADD;
				_container.addChild( img );

				var img2 = new PIXI.Sprite( _resources[ 'bg' + id ].texture );
				_container.addChild( img2 );

				// mask
				var mask = new PIXI.Graphics();
				mask.x = direction == 'next' ? _docW + skewX : -w;
				mask.y = 0;
				mask.beginFill( 0x8bc5ff, 0.4 );
				mask.moveTo( -1, 0 );
				mask.lineTo( w + 2, 0 );
				mask.lineTo( w + 2 - skewX, _docH );
				mask.lineTo( -skewX - 1, _docH );
				_container.addChild( mask );

				img.mask = mask;
				img2.mask = mask;

				TweenLite.set( img, { x: ( _docW * -1.3 + _docW ) / 2, y: ( _docH * -1.3 + _docH ) / 2, alpha: 0 } );
				TweenLite.to( img, 12, { x: 0, y: 1, ease: Power1.easeOut } );
				TweenLite.to( img, 1, { alpha: 0.5, ease: Power2.easeOut } );
				TweenLite.set( img.scale, { x: 1.3, y: 1.3 } );
				TweenLite.to( img.scale, 12, { x: 1, y: 1, ease: Power1.easeOut } );

				TweenLite.set( img2, { x: ( _docW * -1.3 + _docW ) / 2, y: ( _docH * -1.3 + _docH ) / 2, alpha: 0 } );
				TweenLite.to( img2, 12, { x: 0, y: 1, ease: Power1.easeOut } );
				TweenLite.to( img2, 4, { alpha: 1, ease: Power2.easeInOut } );
				TweenLite.set( img2.scale, { x: 1.3, y: 1.3 } );
				TweenLite.to( img2.scale, 12, { x: 1, y: 1, ease: Power1.easeOut } );

				TweenLite.to( mask, 3, { delay: delay, x: x, ease: Power3.easeInOut } );

				setTimeout( function() {
					img.mask = null;
					img2.mask = null;

					_container.removeChild( img );
					_container.removeChild( img2 );
					_container.removeChild( mask );
				}, 20000 );
			};

			_initCanvas = function() {
				_canvas = new PIXI.Application( {
					// antialias: true, // default: false
					transparent: true, // default: false
					// backgroundColor : 0xffffff,
					// forceCanvas : true,
					resolution: 1 // default: 1
				} );
				$sel.canvas[ 0 ].appendChild( _canvas.view );
			};

			_initBg = function() {
				var bg = new PIXI.Sprite( _resources.bg.texture );
				bg.anchor.set( 0.5 );
				_canvas.stage.addChild( bg );
				TweenLite.from( bg, 2, { alpha: 0, ease: Power4.easeOut } );

				_posBg = function() {
					bg.x = _canvas.screen.width / 2;
					bg.y = _canvas.screen.height / 2;
				};
			};

			_initContainer = function() {
				_container = new PIXI.Container();
				_canvas.stage.addChild( _container );

				_posContainer = function() {
					_container.x = _canvas.screen.width / 2;
					_container.y = _canvas.screen.height / 2;

					_container.pivot.x = _docW / 2;
					_container.pivot.y = _docH / 2;
				};
			};

			_initResize = function() {
				_canvas.renderer.autoResize = true;
				var resize = function() {
					_canvas.renderer.resize( $sel.canvas.width(), $sel.canvas.height() );
					_posBg();
					_posContainer();
				};
				$sel.win.on( 'resize', resize );
				resize();
			};

			return {
				init: init,
				act: act
			}
		} )();

		return {
			init: init
		}
	} )() );

	// MainPartner --------------------------------------------------------------------------------------//
	dk.makeClass( 'MainPartner', ( function() {
		var init;
		var $sel;
		var _isInitialized;
		var _ListManager;
		var _leng, _winWidth, _liWidth, _actId;
		var _initResize, _initSlider, _initListManager, _act;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				win: $( window ),
				ul: $( '#container.main .partner .slider' ),
				li: $( '#container.main .partner .slider>li' )
			};

			_leng = $sel.li.length;

			_initResize();
			_initSlider();
			_initListManager();
		};

		_initResize = function() {
			var resize;
			resize = function() {
				_winWidth = $sel.win.width();
				_act( _actId, 0 );
			};
			$sel.win.on( 'resize', resize );
			resize();
		};

		_initSlider = function() {
			var clone, leng;
			clone = function() {
				$sel.ul.append( $sel.li.clone() );
				leng = $sel.ul.children().length;
				if( leng < 22 ) clone();
			};
			clone();
			$sel.li = $sel.ul.find( '>li' );

			_liWidth = $sel.li.width();
			TweenLite.set( $sel.ul, { skewX: 0.001 } );
		};

		_initListManager = function() {
			_ListManager = dk.ListManager( _leng, function( id, oldId, direction ) { _act( id, oldId, 2 ); }, { autoPlay: true, autoPlaySpeed: 3 } );
		};

		_act = function( id, oldId, time ) {
			var posX, initX;
			_actId = id;
			if( id < 3 ) {
				id = id + _leng;
			}
			posX = parseInt( _winWidth / 2 - 1180 / 2 - _liWidth * id );
			initX = posX + _liWidth
			TweenLite.killTweensOf( $sel.ul );
			TweenLite.set( $sel.ul, { x: initX } );
			TweenLite.to( $sel.ul, time, { x: posX, ease: Power2.easeInOut } );

			if( id <= 3 ) {
				$sel.li.each( function( i ) {
					var $this = $( this ),
						leng = 7,
						r;
					if( i >= oldId - 2 && i <= oldId + leng ) {
						r = Math.sin( Math.PI * ( i - oldId + 2 ) / ( oldId + leng - oldId + 2 ) ) * 0.9 + 0.1;
						TweenLite.set( $this, { opacity: r } );
					} else {
						TweenLite.set( $this, { opacity: 0.1 } );
					}
				} );
			}

			$sel.li.each( function( i ) {
				var $this = $( this ),
					leng = 7,
					r;
				if( i >= id - 2 && i <= id + leng ) {
					r = Math.sin( Math.PI * ( i - id + 2 ) / ( id + leng - id + 2 ) ) * 0.9 + 0.1;
					TweenLite.to( $this, time, { opacity: r, ease: Power2.easeInOut } );
				} else {
					TweenLite.to( $this, time, { opacity: 0.1, ease: Power2.easeInOut } );
				}
			} );
		};

		return {
			init: init
		}
	} )() );

	// MainIntroduction --------------------------------------------------------------------------------------//
	dk.makeClass( 'MainIntroduction', ( function() {
		var init;
		var $sel;
		var _isInitialized, _isMotion, _initHeight;
		var _act, _deAct, _initScrollCheck;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				li: $( '#container.main .introduction>ul>li' )
			};

			_initHeight = $sel.li.height();
			_isMotion = false;
			_deAct();
			_initScrollCheck();
		};

		_act = function() {
			TweenMax.set( $sel.li, { height: '0%' } );
			TweenMax.staggerTo( $sel.li, 2, { height: '100%', ease: Power4.easeOut }, 0.2 );
		};

		_deAct = function() {
			TweenMax.killTweensOf( $sel.li );
			TweenMax.set( $sel.li, { height: '0%' } );
		};

		_initScrollCheck = function() {
			dk.ScrollCheck.add( $sel.li, function( y, winHeight, target ) {
				if( y / winHeight < 0.9 ) {
					if( _isMotion ) return;
					_isMotion = true;
					_act();
				} else if( y - winHeight > 50 ) {
					if( !_isMotion ) return;
					_isMotion = false;
					_deAct();
				}
			} );
		};

		return {
			init: init
		}
	} )() );

	// MidasitOverview --------------------------------------------------------------------------------------//
	dk.makeClass( 'MidasitOverview', ( function() {
		var init;
		var $sel;
		var _isInitialized, _isMotion;
		var _act, _deAct, _initScrollCheck;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				li: $( '#container.midasit .overview>ul>li' ),
				img: $( '#container.midasit .overview>ul>li .img' ),
				txt: $( '#container.midasit .overview>ul>li .txt' ),
				txt_eng: $( '#container.midasit .overview>ul>li .txt_eng' )
			};

			_isMotion = false;
			_deAct();
			_initScrollCheck();
		};

		_act = function() {
			TweenMax.set( $sel.img, { opacity: 0, scale: 0, skewX: 0.01 } );
			TweenMax.staggerTo( $sel.img, 1, { opacity: 1, scale: 1, ease: Power2.easeOut }, 0.2 );
			TweenMax.set( $sel.txt, { opacity: 0, y: 40 } );
			TweenMax.staggerTo( $sel.txt, 1, { delay: 0.6, opacity: 1, y: 0, ease: Power4.easeOut }, 0.2 );
			TweenMax.set( $sel.txt_eng, { opacity: 0, y: 40 } );
			TweenMax.staggerTo( $sel.txt_eng, 1, { delay: 0.7, opacity: 1, y: 0, ease: Power4.easeOut }, 0.2 );
		};

		_deAct = function() {
			TweenMax.killTweensOf( $sel.img );
			TweenMax.killTweensOf( $sel.txt );
			TweenMax.killTweensOf( $sel.txt_eng );
			TweenMax.set( $sel.img, { opacity: 0 } );
			TweenMax.set( $sel.txt, { opacity: 0 } );
			TweenMax.set( $sel.txt_eng, { opacity: 0 } );
		};

		_initScrollCheck = function() {
			dk.ScrollCheck.add( $sel.li, function( y, winHeight, target ) {
				if( y / winHeight < 0.7 ) {
					if( _isMotion ) return;
					_isMotion = true;
					_act();
				} else if( y / winHeight > 1 ) {
					if( !_isMotion ) return;
					_isMotion = false;
					_deAct();
				}
			} );
		};

		return {
			init: init
		}
	} )() );

	// MidasitCompanySize --------------------------------------------------------------------------------------//
	dk.makeClass( 'MidasitCompanySize', ( function() {
		var init;
		var $sel;
		var _isInitialized, _isMotion;
		var _act, _deAct, _initScrollCheck;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				ul: $( '#container.midasit .company_size>ul' ),
				li: $( '#container.midasit .company_size>ul>li' ),
				number: $( '#container.midasit .company_size>ul>li>p.number' )
			};

			$sel.number.each( function( i ) {
				var $this = $( this );
				$this.data( 'num', $this.text() );
			} );

			_isMotion = false;
			_deAct();
			_initScrollCheck();
		};

		_act = function() {
			TweenMax.set( $sel.li, { opacity: 0, y: 50 } );
			TweenMax.staggerTo( $sel.li, 0.5, { opacity: 1, ease: Power2.easeOut }, 0.2 );
			TweenMax.staggerTo( $sel.li, 2, { y: 0, ease: Power4.easeOut }, 0.2 );
			$sel.number.each( function( i ) {
				var $this = $( this );
				var obj = { num: parseInt( $this.data( 'num' ) ) };
				TweenLite.from( obj, 1, { delay: i * 0.2, num: 0, ease: Power1.easeOut, onUpdate: function() { $this.text( parseInt( obj.num ) ); } } );
			} );
		};

		_deAct = function() {
			TweenMax.killTweensOf( $sel.li );
			TweenMax.set( $sel.li, { opacity: 0 } );
		};

		_initScrollCheck = function() {
			dk.ScrollCheck.add( $sel.ul, function( y, winHeight, target ) {
				if( y / winHeight < 0.7 ) {
					if( _isMotion ) return;
					_isMotion = true;
					_act();
				} else if( y / winHeight > 1 ) {
					if( !_isMotion ) return;
					_isMotion = false;
					_deAct();
				}
			} );
		};

		return {
			init: init
		}
	} )() );

	// MidasitOrganization --------------------------------------------------------------------------------------//
	dk.makeClass( 'MidasitOrganization', ( function() {
		var init;
		var $sel;
		var _isInitialized, _isMotion;
		var _act, _deAct, _initScrollCheck;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				ul: $( '#container.midasit .organization .percent>ul' ),
				number: $( '#container.midasit .organization .percent>ul>li .graphic>p>span.num' )
			};

			$sel.number.each( function( i ) {
				var $this = $( this );
				$this.data( 'num', $this.text() );
			} );

			_isMotion = false;
			_deAct();
			_initScrollCheck();
		};

		_act = function() {
			$sel.number.each( function( i ) {
				var $this = $( this );
				var obj = { num: parseInt( $this.data( 'num' ) ) };
				TweenLite.from( obj, 2, { delay: i * 0.2, num: 0, ease: Power1.easeOut, onUpdate: function() { $this.text( parseInt( obj.num ) ); } } );
			} );
		};

		_deAct = function() {};

		_initScrollCheck = function() {
			dk.ScrollCheck.add( $sel.ul, function( y, winHeight, target ) {
				if( y / winHeight < 0.7 ) {
					if( _isMotion ) return;
					_isMotion = true;
					_act();
				} else if( y / winHeight > 1 ) {
					if( !_isMotion ) return;
					_isMotion = false;
					_deAct();
				}
			} );
		};

		return {
			init: init
		}
	} )() );

	// MidasitTech --------------------------------------------------------------------------------------//
	dk.makeClass( 'MidasitTech', ( function() {
		var init;
		var $sel;
		var _isInitialized, _isMotion;
		var _act, _deAct, _initScrollCheck;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				ul: $( '#container.midasit .field .tech ul' ),
				li: $( '#container.midasit .field .tech ul>li' )
			};

			_isMotion = false;
			_deAct();
			_initScrollCheck();
		};

		_act = function() {
			TweenMax.set( $sel.li, { height: 0 } );
			TweenMax.staggerTo( $sel.li, 1.5, { height: 280, ease: Power4.easeOut }, 0.3 );
		};

		_deAct = function() {
			TweenMax.killTweensOf( $sel.li );
			TweenMax.set( $sel.li, { height: 0 } );
		};

		_initScrollCheck = function() {
			dk.ScrollCheck.add( $sel.ul, function( y, winHeight, target ) {
				if( y / winHeight < 0.7 ) {
					if( _isMotion ) return;
					_isMotion = true;
					_act();
				} else if( y / winHeight > 1 ) {
					if( !_isMotion ) return;
					_isMotion = false;
					_deAct();
				}
			} );
		};

		return {
			init: init
		}
	} )() );

	// AwardSkillAward2 --------------------------------------------------------------------------------------//
	dk.makeClass( 'AwardSkillAward2', ( function() {
		var init;
		var $sel;
		var _isInitialized;
		var _initScrollCheck;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				award2: $( '#container.award_skill .award2' ),
				visual: $( '#container.award_skill .award2 .visual' )
			};

			_initScrollCheck();
		};

		_initScrollCheck = function() {
			dk.ScrollCheck.add( $sel.award2, function( y, winHeight, target ) {
				if( y / winHeight > 0 && y / winHeight < 1 ) {
					TweenMax.to( $sel.visual, 2, { y: -400 * ( y / winHeight ), ease: Power2.easeOut } );
				}
			} );
		};

		return {
			init: init
		}
	} )() );

	// SolutionOverviewBenefit --------------------------------------------------------------------------------------//
	dk.makeClass( 'SolutionOverviewBenefit', ( function() {
		var init;
		var $sel;
		var _isInitialized, _isMotion;
		var _act, _deAct, _initScrollCheck;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				ul: $( '#container.solution.overview .benefit>ul' ),
				li: $( '#container.solution.overview .benefit>ul>li' )
			};

			_isMotion = false;
			_deAct();
			_initScrollCheck();
		};

		_act = function() {
			TweenMax.set( $sel.li, { opacity: 0, y: 100 } );
			TweenMax.staggerTo( $sel.li, 0.5, { opacity: 1, ease: Power4.easeOut }, 0.2 );
			TweenMax.staggerTo( $sel.li, 2, { y: 0, ease: Power4.easeOut }, 0.2 );
		};

		_deAct = function() {
			TweenMax.killTweensOf( $sel.li );
			TweenMax.set( $sel.li, { opacity: 0 } );
		};

		_initScrollCheck = function() {
			dk.ScrollCheck.add( $sel.ul, function( y, winHeight, target ) {
				if( y / winHeight < 0.7 ) {
					if( _isMotion ) return;
					_isMotion = true;
					_act();
				} else if( y / winHeight > 1 ) {
					if( !_isMotion ) return;
					_isMotion = false;
					_deAct();
				}
			} );
		};

		return {
			init: init
		}
	} )() );

	// SolutionStrength --------------------------------------------------------------------------------------//
	dk.makeClass( 'SolutionStrength', ( function() {
		var init;
		var $sel;
		var _isInitialized, _isMotion;
		var _act, _deAct, _initScrollCheck;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				ul: $( '#container.solution .strength>ul' ),
				li: $( '#container.solution .strength>ul>li' )
			};

			_isMotion = false;
			_deAct();
			_initScrollCheck();
		};

		_act = function() {
			TweenMax.set( $sel.li, { opacity: 0, y: 100 } );
			TweenMax.staggerTo( $sel.li, 0.5, { opacity: 1, ease: Power4.easeOut }, 0.2 );
			TweenMax.staggerTo( $sel.li, 2, { y: 0, ease: Power4.easeOut }, 0.2 );
		};

		_deAct = function() {
			TweenMax.killTweensOf( $sel.li );
			TweenMax.set( $sel.li, { opacity: 0 } );
		};

		_initScrollCheck = function() {
			dk.ScrollCheck.add( $sel.ul, function( y, winHeight, target ) {
				if( y / winHeight < 0.7 ) {
					if( _isMotion ) return;
					_isMotion = true;
					_act();
				} else if( y / winHeight > 1 ) {
					if( !_isMotion ) return;
					_isMotion = false;
					_deAct();
				}
			} );
		};

		return {
			init: init
		}
	} )() );

	// MonitorSlider --------------------------------------------------------------------------------------//
	dk.makeClass( 'MonitorSlider', ( function() {
		var init;
		var $sel;
		var _isInitialized;
		var _initResize, _initFront, _initBack, _initPhone, _actTxt, _txtAni, _actBack, _actPhone;
		var _actId, _winWidth, _leng, _liWidth, _liMarginLeft, _isPhone;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				win: $( window ),
				ul: $( '#container.solution .monitor_slider .front>ul' ),
				li: $( '#container.solution .monitor_slider .front>ul>li' ),
				arrow: $( '#container.solution .monitor_slider .bt' ),
				txt: $( '#container.solution .monitor_slider .bt .txt' ),
				prev: $( '#container.solution .monitor_slider .bt a.prev>span' ),
				next: $( '#container.solution .monitor_slider .bt a.next>span' ),
				back: $( '#container.solution .monitor_slider .back' ),
				backUl: $( '#container.solution .monitor_slider .back>ul' ),
				phone: $( '#container.solution .monitor_slider .phone' ),
				phoneUl: $( '#container.solution .monitor_slider .phone>ul' ),
				phoneLi: $( '#container.solution .monitor_slider .phone>ul>li' )
			};

			_leng = $sel.li.length;

			_initResize();
			_initBack();
			_initFront();
			_initPhone();
		};

		_initResize = function() {
			var resize;
			resize = function() {
				_winWidth = $sel.win.width();
				_actBack( _actId, 0 );
			};
			$sel.win.on( 'resize', resize );
			resize();
		};

		_initBack = function() {
			var clone, leng;
			$sel.backUl.append( $sel.li.clone() );
			clone = function() {
				$sel.backUl.append( $sel.li.clone() );
				leng = $sel.backUl.children().length;
				if( leng < 10 ) clone();
			};
			clone();
			$sel.backLi = $sel.backUl.find( '>li' );

			_liWidth = $sel.backLi.width();
			_liMarginLeft = parseInt( $sel.backLi.eq( 1 ).css( 'marginLeft' ) );
			$sel.backUl.css( 'width', ( _liWidth + _liMarginLeft ) * leng );
		};

		_initFront = function() {
			dk.Slider( $sel.ul, {
				$arrow: $sel.arrow,
				touch: true,
				// autoPlay: false,
				autoPlaySpeed: 3,
				motionType: 'slide',
				freezeTime: 0.5,
				motionTime: 1.5,
				onAct: function( id, oldId, direction ) {
					// log( 'act : ' + id + ', ' + oldId + ', ' + direction );
					_actTxt( id );
					_actBack( id, 1.5, direction );
					_actPhone( id, oldId, direction );
				}
			} );
		};

		_initPhone = function() {
			if( $sel.phone.length == 0 ) return;

			_isPhone = true;
			$sel.phoneUl.css( { 'position': 'relative', 'overflow': 'hidden' } );
			TweenLite.set( $sel.phoneLi, { x: '100%' } );
			TweenLite.set( $sel.phoneLi.eq( 0 ), { x: '0%' } );
		};

		_actTxt = function( id ) {
			$sel.txt.text( '' );
			_txtAni( $sel.txt, $sel.li.eq( id ).text(), 0.05 );

			TweenLite.set( $sel.prev, { opacity: 0 } );
			$sel.prev.text( $sel.li.eq( id - 1 < 0 ? _leng - 1 : id - 1 ).text() );
			TweenLite.to( $sel.prev, 1, { opacity: 1, ease: Power2.easeOut } );

			TweenLite.set( $sel.next, { opacity: 0 } );
			$sel.next.text( $sel.li.eq( id + 1 >= _leng ? 0 : id + 1 ).text() );
			TweenLite.to( $sel.next, 1, { opacity: 1, ease: Power2.easeOut } );
		};

		_txtAni = function( $s, str, time, delay ) {
			var arr = str.split( '' );
			var i, leng = arr.length;
			var $el;
			delay = delay || 0;
			for( i = 0; i < leng; i++ ) {
				$el = $( '<span style="display:inline-block;">' + arr[ i ].replace( /\s/gi, "&nbsp;" ) + '</span>' );
				$s.append( $el );
				TweenLite.set( $el, { opacity: 0, x: 50 } );
				TweenLite.to( $el, 0.5, { delay: i * time + delay, opacity: 1, x: 0, ease: Power2.easeOut } );
			}
		};

		_actBack = function( id, time, direction ) {
			var posX, initX;
			_actId = id;
			if( id < 3 ) id = id + _leng;
			posX = parseInt( _winWidth / 2 - ( _liWidth + _liMarginLeft ) / 2 - ( _liWidth + _liMarginLeft ) * id );
			initX = direction == 'prev' ? posX - _liWidth - _liMarginLeft : posX + _liWidth + _liMarginLeft;
			TweenLite.killTweensOf( $sel.back );
			TweenLite.set( $sel.back, { x: initX } );
			TweenLite.to( $sel.back, time, { x: posX, ease: Power4.easeOut } );
		};

		_actPhone = function( id, oldId, direction ) {
			if( !_isPhone ) return;

			var $actLi, $oldLi;

			$actLi = $sel.phoneLi.eq( id );
			TweenLite.set( $actLi, { x: direction == 'next' ? '100%' : '-100%' } );
			TweenLite.to( $actLi, 1.5, { x: '0%', ease: Power4.easeOut } );

			if( oldId < 0 ) return;
			$oldLi = $sel.phoneLi.eq( oldId );
			TweenLite.to( $oldLi, 1.5, { x: direction == 'next' ? '-100%' : '100%', ease: Power4.easeOut } );
		};

		return {
			init: init
		}
	} )() );

	// YouTubeIframe --------------------------------------------------------------------------------------//
	dk.makeClass( 'YouTubeIframe', ( function() {
		var init;
		var $sel;
		var _isInitialized, _isMotion, _player, _videoId, _width, _height;
		var _initYT, _initScrollCheck;

		init = function( videoId, width, height ) {
			if( _isInitialized ) return;
			_isInitialized = true;

			_videoId = videoId;
			_width = width;
			_height = height;

			$sel = {
				YTplayer: $( '#YTplayer' )
			};
			$sel.YTplayer.height( _height );

			_isMotion = false;
			_initYT();
			_initScrollCheck();
		};

		_initYT = function() {
			var tag = document.createElement( 'script' );
			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName( 'script' )[ 0 ];
			firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );
		};

		window.onYouTubeIframeAPIReady = function() {
			_player = new YT.Player( 'YTplayer', {
				width: _width,
				height: _height,
				videoId: _videoId + '?enablejsapi=1&iv_load_policy=3&rel=0&showinfo=0'
			} );
		}

		_initScrollCheck = function() {
			dk.ScrollCheck.add( $sel.YTplayer, function( y, winHeight, target ) {
				if( _player == undefined ) return;
				if( y / winHeight < 0.3 ) {
					if( _isMotion ) return;
					_isMotion = true;
					if( _player.playVideo ) _player.playVideo();
				} else if( y / winHeight > 1 ) {
					if( !_isMotion ) return;
					_isMotion = false;
					if( _player.pauseVideo ) _player.pauseVideo();
				}
			} );
		};

		return {
			init: init
		}
	} )() );

	// Sell2Type --------------------------------------------------------------------------------------//
	dk.makeClass( 'Sell2Type', ( function() {
		var init;
		var $sel;
		var _isInitialized, _isMotion;
		var _act, _deAct, _initScrollCheck;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				ul: $( '#container.solution.sell2 .type>ul' ),
				li: $( '#container.solution.sell2 .type>ul>li' ),
				img: $( '#container.solution.sell2 .type>ul>li .img' ),
				txt_main: $( '#container.solution.sell2 .type>ul>li .txt_main' ),
				txt_sub: $( '#container.solution.sell2 .type>ul>li .txt_sub' )
			};

			_isMotion = false;
			_deAct();
			_initScrollCheck();
		};

		_act = function() {
			TweenMax.set( $sel.img, { opacity: 0, scale: 0, skewX: 0.01 } );
			TweenMax.staggerTo( $sel.img, 1, { opacity: 1, scale: 1, ease: Power2.easeOut }, 0.2 );
			TweenMax.set( $sel.txt_main, { opacity: 0, y: 40 } );
			TweenMax.staggerTo( $sel.txt_main, 1, { delay: 0.6, opacity: 1, y: 0, ease: Power4.easeOut }, 0.2 );
			TweenMax.set( $sel.txt_sub, { opacity: 0, y: 40 } );
			TweenMax.staggerTo( $sel.txt_sub, 1, { delay: 0.7, opacity: 1, y: 0, ease: Power4.easeOut }, 0.2 );
		};

		_deAct = function() {
			TweenMax.killTweensOf( $sel.img );
			TweenMax.killTweensOf( $sel.txt_main );
			TweenMax.killTweensOf( $sel.txt_sub );
			TweenMax.set( $sel.img, { opacity: 0 } );
			TweenMax.set( $sel.txt_main, { opacity: 0 } );
			TweenMax.set( $sel.txt_sub, { opacity: 0 } );
		};

		_initScrollCheck = function() {
			dk.ScrollCheck.add( $sel.ul, function( y, winHeight, target ) {
				if( y / winHeight < 0.7 ) {
					if( _isMotion ) return;
					_isMotion = true;
					_act();
				} else if( y / winHeight > 1 ) {
					if( !_isMotion ) return;
					_isMotion = false;
					_deAct();
				}
			} );
		};

		return {
			init: init
		}
	} )() );

	// Manage1Visual --------------------------------------------------------------------------------------//
	dk.makeClass( 'Manage1Visual', ( function() {
		var init;
		var $sel;
		var _isInitialized;
		var _initSlider;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				ul: $( '#container.solution.manage1 .visual .slider>ul' ),
				dot: $( '#container.solution.manage1 .visual .dot' )
			};

			_initSlider();
		};

		_initSlider = function() {
			dk.Slider( $sel.ul, {
				$dot: $sel.dot,
				touch: true,
				// autoPlay: false,
				autoPlaySpeed: 3,
				motionType: 'fixed',
				// freezeTime: 2,
				motionEaseAct: Power4.easeOut,
				motionTime: 2
			} );
		};

		return {
			init: init
		}
	} )() );

	// Alert --------------------------------------------------------------------------------------//
	dk.makeClass( 'Alert', ( function() {
		var init, act;
		var $sel;
		var _isInitialized;
		var _addEvent;

		init = function() {
			if( _isInitialized ) return;
			_isInitialized = true;

			$sel = {
				alert: $( '.alert' ),
				txt: $( '.alert .alert_in .alert_content .txt' ),
				close: $( '.alert .alert_in .alert_content>a' )
			};

			_addEvent();
		};

		act = function( html ) {
			$sel.txt.html( html );
			TweenLite.to( $sel.alert, 0.5, { autoAlpha: 1, ease: Power4.easeOut } );
		};

		_addEvent = function() {
			$sel.close.on( 'click', function( e ) {
				e.preventDefault();
				TweenLite.to( $sel.alert, 0.5, { autoAlpha: 0, ease: Power4.easeOut } );
			} );
		}

		return {
			init: init,
			act: act
		}
	} )() );

	// 초기화 --------------------------------------------------------------------------------------//

	$( function() {
		// BtAlpha
		// dk.BtAlpha.init();

		dk.Scroll.init();
		dk.LocationId.init();
		dk.Gnb.init();
		dk.Family.init();
		dk.PortfolioView.init();
		dk.Alert.init();

		// 메인일때 종료
		if( dk.LocationId.getId()[ 0 ] == -1 ) return;
		dk.SubTitle.init();
		dk.Lnb.init();
		dk.FixedNavi.init();
	} );
} )();
