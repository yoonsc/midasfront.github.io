'use strict';
( function() {
	var W = window,
		DOC = document;
	var dk;
	var trim = /^\s*|\s*$/g;

	// 보정패치 :
	W.console = W[ 'console' ] ? W[ 'console' ] : { log: function() {} };
	W.log = W[ 'log' ] ? W[ 'log' ] : function() {
		if( !dk.IS_DEBUG ) return;
		if( arguments[ 0 ] == 'debug' ) {
			W.console.info( arguments[ 1 ] );
			debugger;
		} else {
			W.console.info( arguments[ 0 ] );
		}
	};
	Date.now = Date.now * 1 || function() { return +new Date };
	W.requestAnimationFrame = ( function() { return W.requestAnimationFrame || W.webkitRequestAnimationFrame || W.mozRequestAnimationFrame || function( loop ) { return W.setTimeout( loop, 17 ) } } )();
	W.cancelAnimationFrame = ( function() { return W.cancelAnimationFrame || W.webkitCancelRequestAnimationFrame || W.webkitCancelAnimationFrame || W.mozCancelAnimationFrame || function( requestID ) { W.clearTimeout( requestID ) } } )();
	( function( f ) { W.setTimeout = f( W.setTimeout ), W.setInterval = f( W.setInterval ) } )( function( f ) {
		return function( a, b ) {
			var arg = [].slice.call( arguments, 2 );
			return f( function() { a.apply( this, arg ); }, b );
		};
	} );

	// dk :
	dk = W.dk = W[ 'dk' ] ? W[ 'dk' ] : {};

	// CORE const :
	dk.makeFunction = function( k, v ) {
		k = k.replace( trim, '' ), k = k.charAt( 0 ).toLowerCase() + k.substring( 1, k.length ),
			dk[ k ] !== undefined ? dk.err( 'dk function에 이미 ' + k + '값이 존재합니다' ) : dk[ k ] = v;
	};
	dk.makeClass = function( k, v ) {
		k = k.replace( trim, '' ), k = k.charAt( 0 ).toUpperCase() + k.substring( 1, k.length ),
			dk[ k ] !== undefined ? dk.err( 'dk class에 이미 ' + k + '값이 존재합니다' ) : dk[ k ] = v;
	};
	dk.makeStatic = function( k, v ) {
		k = k.replace( trim, '' ).toUpperCase(),
			dk[ k ] !== undefined ? dk.err( 'dk static에 이미 ' + k + '값이 존재합니다' ) : dk[ k ] = v;
	};

	// INFO :
	dk.makeStatic( 'INFO', { name: 'dk bloodstone', version: 'v0.0.1', github: 'https://github.com/ssw3131/bloodstone' } );

	// ERROR :
	dk.makeFunction( 'err', function( v ) {
		throw new Error( 'dk error : ' + v );
		// log( 'dk error : ' + v );
	} );

	// IS_DEBUG :
	dk.makeFunction( 'isDebug', function( v ) {
		dk.IS_DEBUG = v;
	} );

	// BOM :
	dk.makeStatic( 'W', W );
	dk.makeStatic( 'DOC', DOC );
	dk.makeStatic( 'HEAD', DOC.getElementsByTagName( 'head' )[ 0 ] );
} )();

// DETECTOR :
dk.makeStatic( 'DETECTOR', ( function( w, doc ) {
	var navi = w.navigator,
		agent = navi.userAgent.toLowerCase(),
		platform = navi.platform.toLowerCase(),
		app = navi.appVersion.toLowerCase(),
		device = 'pc',
		os, osv, browser, bv, flash,
		prefixCss, prefixStyle, transform3D, keyframe = w[ 'CSSRule' ],
		docMode = 0,
		d = doc.createElement( 'div' ),
		s = d.style,
		c = doc.createElement( 'canvas' ),
		a = doc.createElement( 'audio' ),
		v = doc.createElement( 'video' ),
		t0,
		edge, ie, chrome, firefox, safari, opera, naver;

	edge = function() {
			if( agent.indexOf( 'edge' ) < 0 ) return;
			if( agent.indexOf( 'Windows Phone' ) > -1 ) os = 'winMobile';
			return browser = 'edge', bv = 'edge';
		},
		ie = function() {
			if( agent.indexOf( 'msie' ) < 0 && agent.indexOf( 'trident' ) < 0 ) return;
			if( agent.indexOf( 'iemobile' ) > -1 ) os = 'winMobile';
			return browser = 'ie', bv = agent.indexOf( 'msie 7' ) > -1 && agent.indexOf( 'trident' ) > -1 ? -1 : agent.indexOf( 'msie' ) < 0 ? 11 : parseFloat( /msie ([\d]+)/.exec( agent )[ 1 ] );
		},
		chrome = function() {
			if( agent.indexOf( 'opr' ) > -1 || agent.indexOf( 'opera' ) > -1 ) return;
			if( agent.indexOf( t0 = 'chrome' ) < 0 && agent.indexOf( t0 = 'crios' ) < 0 ) return;
			return browser = 'chrome', bv = parseFloat( ( t0 == 'chrome' ? /chrome\/([\d]+)/ : /crios\/([\d]+)/ ).exec( agent )[ 1 ] );
		},
		firefox = function() {
			return agent.indexOf( 'firefox' ) < 0 ? 0 : ( browser = 'firefox', bv = parseFloat( /firefox\/([\d]+)/.exec( agent )[ 1 ] ) );
		},
		safari = function() {
			if( agent.indexOf( 'opr' ) > -1 || agent.indexOf( 'opera' ) > -1 ) return;
			return agent.indexOf( 'safari' ) < 0 ? 0 : ( browser = 'safari', bv = parseFloat( /version\/([\d]+)/.exec( agent )[ 1 ] ) );
		},
		opera = function() {
			var i;
			return( agent.indexOf( i = 'opera' ) < 0 && agent.indexOf( i = 'opr' ) < 0 ) ? 0 : ( browser = 'opera', bv = ( i == 'opera' ) ? parseFloat( /version\/([\d]+)/.exec( agent )[ 1 ] ) : parseFloat( /opr\/([\d]+)/.exec( agent )[ 1 ] ) );
		},
		naver = function() {
			return agent.indexOf( 'naver' ) < 0 ? 0 : browser = 'naver';
		};

	// os, browser
	if( agent.indexOf( 'android' ) > -1 ) {
		browser = os = 'android';
		if( agent.indexOf( 'mobile' ) == -1 ) browser += 'Tablet', device = 'tablet';
		else device = 'mobile';
		if( t0 = /android ([\d.]+)/.exec( agent ) ) t0 = t0[ 1 ].split( '.' ), osv = parseFloat( t0[ 0 ] + '.' + t0[ 1 ] );
		else osv = 0;
		if( t0 = /safari\/([\d.]+)/.exec( agent ) ) bv = parseFloat( t0[ 1 ] );
		naver() || chrome() || opera() || firefox();
	} else if( agent.indexOf( t0 = 'ipad' ) > -1 || agent.indexOf( t0 = 'iphone' ) > -1 ) {
		device = t0 == 'ipad' ? 'tablet' : 'mobile', browser = os = t0;
		if( t0 = /os ([\d_]+)/.exec( agent ) ) t0 = t0[ 1 ].split( '_' ), osv = parseFloat( t0[ 0 ] + '.' + t0[ 1 ] );
		else osv = 0;
		if( t0 = /mobile\/([\S]+)/.exec( agent ) ) bv = parseFloat( t0[ 1 ] );
		naver() || chrome() || opera() || firefox();
	} else {
		if( platform.indexOf( 'win' ) > -1 ) {
			os = 'win', t0 = 'windows nt ';
			if( agent.indexOf( t0 + '5.1' ) > -1 ) osv = 'xp';
			else if( agent.indexOf( t0 + '6.0' ) > -1 ) osv = 'vista';
			else if( agent.indexOf( t0 + '6.1' ) > -1 ) osv = '7';
			else if( agent.indexOf( t0 + '6.2' ) > -1 ) osv = '8';
			else if( agent.indexOf( t0 + '6.3' ) > -1 ) osv = '8.1';
			else if( agent.indexOf( t0 + '10.0' ) > -1 ) osv = '10';
			edge() || ie() || chrome() || firefox() || safari() || opera();
		} else if( platform.indexOf( 'mac' ) > -1 ) {
			os = 'mac', t0 = /os x ([\d._]+)/.exec( agent )[ 1 ].replace( '_', '.' ).split( '.' ), osv = parseFloat( t0[ 0 ] + '.' + t0[ 1 ] ),
				chrome() || safari() || firefox() || opera();
		} else {
			os = app.indexOf( 'x11' ) > -1 ? 'unix' : app.indexOf( 'linux' ) > -1 ? 'linux' : 0, chrome() || firefox();
		}
	}
	// flash
	( function() {
		var plug = navi.plugins,
			t0;
		if( browser == 'ie' ) try { t0 = new ActiveXObject( 'ShockwaveFlash.ShockwaveFlash' ).GetVariable( '$version' ).substr( 4 ).split( ',' ), flash = parseFloat( t0[ 0 ] + '.' + t0[ 1 ] ); } catch( e ) {}
		else if( ( t0 = plug[ 'Shockwave Flash 2.0' ] ) || ( t0 = plug[ 'Shockwave Flash' ] ) ) t0 = t0.description.split( ' ' )[ 2 ].split( '.' ), flash = parseFloat( t0[ 0 ] + '.' + t0[ 1 ] );
		else if( agent.indexOf( 'webtv' ) > -1 ) flash = agent.indexOf( 'webtv/2.6' ) > -1 ? 4 : agent.indexOf( 'webtv/2.5' ) > -1 ? 3 : 2;
	} )();
	// dom
	switch( browser ) {
		case 'ie':
			if( bv == -1 ) bv = !c[ 'getContext' ] ? 8 : !( 'msTransition' in s ) && !( 'transition' in s ) ? 9 : c.getContext( 'webgl' ) || c.getContext( 'experimental-webgl' ) ? 11 : 10;
			prefixCss = '-ms-', prefixStyle = 'ms', transform3D = bv > 9 ? true : false, docMode = doc[ 'documentMode' ] || 0;
			break;
		case 'firefox':
			prefixCss = '-moz-', prefixStyle = 'Moz', transform3D = true;
			break;
		case 'opera':
			prefixCss = '-o-', prefixStyle = 'O', transform3D = true;
			break;
		default:
			prefixCss = '-webkit-', prefixStyle = 'webkit', transform3D = os == 'android' ? ( osv < 4 ? false : true ) : true;
	}
	if( keyframe ) {
		if( keyframe.WEBKIT_KEYFRAME_RULE ) keyframe = '-webkit-keyframes';
		else if( keyframe.MOZ_KEYFRAME_RULE ) keyframe = '-moz-keyframes';
		else if( keyframe.KEYFRAME_RULE ) keyframe = 'keyframes';
		else keyframe = null;
	}

	return {
		device: device,
		os: os,
		osVer: osv,
		browser: browser,
		browserVer: bv,
		ie8: browser == 'ie' && bv < 9 ? true : false,
		mobile: device == 'pc' ? false : true,
		flash: flash,
		prefixCss: prefixCss,
		prefixStyle: prefixStyle,
		transform3D: transform3D,
		transform: ( prefixStyle + 'Transform' in s || 'transform' in s ) ? true : false,
		transition: ( prefixStyle + 'Transition' in s || 'transition' in s ) ? true : false,
		keyframe: keyframe,
		float: 'cssFloat' in s ? 'cssFloat' : 'styleFloat',
		canvas: c ? true : false,
		canvasText: c && c[ 'getContext' ] && c.getContext( '2d' ).fillText ? true : false,
		audio: a ? true : false,
		video: v ? true : false,
		videoPoster: v && 'poster' in v ? true : false,
		videoWebm: v && v[ 'canPlayType' ] && v.canPlayType( 'video/webm; codecs="vp8,mp4a.40.2"' ).indexOf( 'no' ) == -1 ? true : false,
		videoH264: v && v[ 'canPlayType' ] && v.canPlayType( 'video/mp4; codecs="avc1.4D401E, mp4a.40.2"' ).indexOf( 'no' ) == -1 ? true : false,
		videoTeora: v && v[ 'canPlayType' ] && v.canPlayType( 'video/ogg; codecs="theora,vorbis"' ).indexOf( 'no' ) == -1 ? true : false,
		insertBefore: 'insertBefore' in d ? true : false,
		innerText: 'innerText' in d ? true : false,
		textContent: 'textContent' in d ? true : false,
		touchBool: 'ontouchstart' in w ? true : false,
		currentTarget: browser == 'firefox' ? 'target' : 'srcElement',
		wheelEvent: browser == 'firefox' ? 'DOMMouseScroll' : 'mousewheel'
	}
} )( dk.W, dk.DOC ) );

// UTIL :
dk.makeFunction( 'random', ( function( mathRandom ) {
	return function( max, min ) {
		return max = max || 1, min = min || 0, ( max - min ) * mathRandom() + min;
	}
} )( Math.random ) );

dk.makeFunction( 'randomInt', ( function( $mathRandom ) {
	return function( max, min ) {
		return min = min || 0, parseInt( ( max - min + 0.99999 ) * $mathRandom() + min );
	}
} )( Math.random ) );

dk.makeFunction( 'randomColor', ( function( randomInt ) {
	return function() {
		return 'rgb(' + randomInt( 256 ) + ', ' + randomInt( 256 ) + ', ' + randomInt( 256 ) + ')';
	}
} )( dk.randomInt ) );

dk.makeFunction( 'timeCheck', ( function( dateNow ) {
	var t0, r;
	return function() {
		return t0 ? ( r = dateNow() - t0, t0 = null, r ) : ( t0 = dateNow(), null );
	}
} )( Date.now ) );

dk.makeFunction( 'parseLocation', ( function() {
	var obj;
	return function() {
		if( obj === undefined ) {
			var pairs = location.search.substring( 1 ).split( "&" );
			var pair, i;

			obj = {};
			for( i in pairs ) {
				if( pairs[ i ] === "" ) continue;
				pair = pairs[ i ].split( "=" );
				obj[ decodeURIComponent( pair[ 0 ] ) ] = decodeURIComponent( pair[ 1 ] );
			}

			return obj;
		} else {
			return obj;
		}
	}
} )() );

// ListManager :
dk.makeClass( 'ListManager', ( function() {
	var factory, ListManager, fn;
	var _addTimer, _delTimer;

	/**
	 * @class	: ListManager
	 * @param	: leng - list length
	 * @param	: act - 활성화 함수
	 * @param	: option - initId, infinity, autoPlay, autoPlaySpeed
	 */
	ListManager = function( leng, act, option ) {
		if( leng == undefined || leng == 0 ) return dk.err( 'ListManager : leng 이 없거나 0 이면 안됩니다' );
		if( act == undefined ) return dk.err( 'ListManager : act 는 필수항목 입니다' );
		this._leng = leng;
		this._act = act;

		this._option = {
			initId: 0,
			infinity: true,
			autoPlay: false,
			autoPlaySpeed: 4
		};
		$.extend( this._option, option );

		this._id = -1;
		this._oldId = -1;
		this._timer = null;

		this.act( this._option.initId, 'next' );

		if( this._option.autoPlay ) this.play();
	};

	fn = ListManager.prototype;

	fn.destroy = function() {
		this.stop();

		this._timer = null;
		this._oldId = null;
		this._id = null;

		this._option = null;

		this._act = null;
		this._leng = null;
	};

	fn.getId = function() {
		return {
			id: this._id,
			oldId: this._oldId
		}
	};

	fn.act = function( id, directon ) {
		if( id == this._id ) return;
		if( id >= this._leng ) return dk.err( 'ListManager : id값이 leng를 초과하였습니다' );
		this.resetTimer();
		if( !directon ) {
			directon = id > this._id ? 'next' : 'prev';
		}
		this._oldId = this._id;
		this._id = id;
		// log( 'ListManager act : ' + this._id + ', ' + this._oldId + ', ' + directon );
		this._act( this._id, this._oldId, directon );
	};

	fn.next = function() {
		var id = this._id;
		if( !this._option.infinity && id == this._leng - 1 ) return;
		id = ++id == this._leng ? 0 : id;
		this.act( id, 'next' );
	};

	fn.prev = function() {
		var id = this._id;
		if( !this._option.infinity && id == 0 ) return;
		id = --id < 0 ? this._leng - 1 : id;
		this.act( id, 'prev' );
	};

	fn.play = function() {
		this._option.autoPlay = true;
		_addTimer.call( this );
	};

	fn.stop = function() {
		this._option.autoPlay = false;
		_delTimer.call( this );
	};

	fn.pause = function() {
		_delTimer.call( this );
	};

	fn.resetTimer = function() {
		_delTimer.call( this );
		_addTimer.call( this );
	};

	// innner
	_addTimer = function() {
		if( !this._option.autoPlay ) return;
		var self = this;
		var loop, old;

		cancelAnimationFrame( this._timer );

		old = Date.now();
		loop = function() {
			if( Date.now() - old > self._option.autoPlaySpeed * 1000 ) {
				old = Date.now();
				self.next();
			} else {
				self._timer = requestAnimationFrame( loop );
			}
		};
		this._timer = requestAnimationFrame( loop );
	};

	_delTimer = function() {
		cancelAnimationFrame( this._timer );
	};

	factory = function( leng, act, option ) {
		return new ListManager( leng, act, option );
	};

	return factory;
} )() );

// BtManager :
dk.makeClass( 'BtManager', ( function() {
	var factory, BtManager, fn;
	var _addEvent, _delEvent, _connect0, _connect1;

	/**
	 * @class	: BtManager
	 * @param	: $bts - bts 제이쿼리
	 * @param	: act - 버튼 클릭 시 활성화 함수
	 * @param	: option - btAct, freezeTime, ListManager 동일 (initId, infinity, autoPlay, autoPlaySpeed)
	 */
	BtManager = function( $bts, act, option ) {
		if( $bts.length == 0 ) return dk.err( 'BtManager : $bts 는 필수항목 입니다' );
		if( act === undefined ) return dk.err( 'BtManager : act 는 필수항목 입니다' );
		this._$bts = $bts;

		var _act = ( function( self ) {
			return function( id, oldId, directon ) {
				if( self._isMove ) return;
				self._isMove = true;
				if( self._option.freezeTime == 0 ) self._isMove = false;
				else setTimeout( function() { self._isMove = false; }, self._option.freezeTime * 1000 );
				self._btAct( id, oldId, directon );
				act.call( self, id, oldId, directon );
			};
		} )( this );

		this._option = {
			btAct: undefined,
			freezeTime: 0,
			autoPlaySpeed: 4
		};
		$.extend( this._option, option );
		if( this._option.freezeTime >= this._option.autoPlaySpeed ) return dk.err( 'BtManager : freezeTime 은 autoPlaySpeed 보다 작아야 합니다' );

		this._btAct = ( function( self ) {
			if( self._option.btAct === undefined ) {
				return function( id, oldId, directon ) {
					$bts.removeClass( 'on' );
					$bts.eq( id ).addClass( 'on' );
				};
			} else {
				return function( id, oldId, directon ) {
					self._option.btAct.call( self, id, oldId, directon );
				};
			}
		} )( this );

		this._isMove = false;

		this._ListManager = dk.ListManager( $bts.length, _act, this._option );

		_addEvent.call( this );
	};
	fn = BtManager.prototype;

	_connect0 = function() {
		var i = arguments.length;
		var name;
		while( i-- ) {
			name = arguments[ i ];
			fn[ name ] = ( function( name ) {
				return function() {
					return this._ListManager[ name ].apply( this._ListManager, arguments );
				};
			} )( name );
		}
	};

	_connect1 = function() {
		var i = arguments.length;
		var name;
		while( i-- ) {
			name = arguments[ i ];
			fn[ name ] = ( function( name ) {
				return function() {
					if( this._isMove ) return;
					return this._ListManager[ name ].apply( this._ListManager, arguments );
				};
			} )( name );
		}
	};

	fn.destroy = function() {
		_delEvent.call( this );
		this._ListManager.destroy();
		this._ListManager = null;
		this._isMove = null;
		this._btAct = null;
		this._option = null;
		this._$bts = null;
	};

	_connect0( 'getId', 'play', 'stop', 'pause', 'resetTimer' );

	_connect1( 'act', 'next', 'prev' );

	_addEvent = function() {
		var self = this,
			$a = this._$bts.find( '>a' ),
			timer;
		$a.each( function( i ) {
			var $this = $( this );
			$this.on( 'mouseenter', function() {
				self.pause();
				clearTimeout( timer );
				self._btAct( i );
			} );
			$this.on( 'mouseleave', function() {
				self.resetTimer();
				timer = setTimeout( function() {
					var id = self.getId().id;
					self._btAct( id );
				}, 300 );
			} );
			$this.on( 'click', function( e ) {
				e.preventDefault();
				if( self._isMove ) return;
				self.act( i );
			} );
		} );
	};

	_delEvent = function() {
		var $a = this._$bts.find( '>a' );
		$a.off();
	};

	factory = function( $bts, act, option ) {
		return new BtManager( $bts, act, option );
	};
	return factory;
} )() );

// Tab :
dk.makeClass( 'Tab', ( function() {
	var factory, Tab, fn;
	var _connect0;

	/**
	 * @class	: Tab
	 * @param	: $tab - tab 제이쿼리
	 * @param	: $tabCon - tab content 제이쿼리
	 * @param	: option - motionTime, BtManager 동일 (act, btAct, freezeTime, initId, infinity, autoPlay, autoPlaySpeed)
	 */
	Tab = function( $tab, $tabCon, option ) {
		if( $tab.length == 0 ) return dk.err( 'Tab : $tab 는 필수항목 입니다' );
		if( $tabCon.length == 0 ) return dk.err( 'Tab : $tabCon 는 필수항목 입니다' );
		this._$tab = $tab;
		this._$tabCon = $tabCon;

		this._option = {
			motionTime: 0.5
		};
		$.extend( this._option, option );

		var _act = ( function( self ) {
			if( self._option.act === undefined ) {
				TweenLite.set( self._$tabCon, { 'display': 'none', 'opacity': 0 } );
				return function( id, oldId ) {
					var $oldCon = $tabCon.eq( oldId );
					var $actCon = $tabCon.eq( id );
					TweenLite.killTweensOf( $oldCon );
					TweenLite.set( $oldCon, { 'display': 'none', 'opacity': 0 } );
					TweenLite.killTweensOf( $actCon );
					TweenLite.set( $actCon, { 'display': 'block' } );
					TweenLite.to( $actCon, self._option.motionTime, { opacity: 1, ease: Power2.easeOut } );
				}
			} else {
				return function( id, oldId, directon ) {
					self._option.act.call( self, id, oldId, directon );
				};
			}
		} )( this );

		this._BtManager = dk.BtManager( $tab, _act, this._option );
	};
	fn = Tab.prototype;

	_connect0 = function() {
		var i = arguments.length;
		var name;
		while( i-- ) {
			name = arguments[ i ];
			fn[ name ] = ( function( name ) {
				return function() {
					return this._BtManager[ name ].apply( this._BtManager, arguments );
				};
			} )( name );
		}
	};

	fn.destroy = function() {
		this._BtManager.destroy();
		this._option = null;
		this._$tabCon = null;
		this._$tab = null;
	};

	_connect0( 'getId', 'act', 'next', 'prev', 'play', 'stop', 'pause', 'resetTimer' );

	factory = function( $tab, $tabCon, option ) {
		return new Tab( $tab, $tabCon, option );
	};
	return factory;
} )() );

// Slider :
dk.makeClass( 'Slider', ( function() {
	var factory, Slider, fn;
	var _defaultOption, _addTouchEvent, _delTouchEvent, _connect0, _connect1;
	var Slide, Dot, Arrow;

	/**
	 * @class	: Slider
	 * @param	: $slide - slide 제이쿼리
	 * @param	: option - $dot, $arrow, onAct, touch, motionType, freezeTime, motionTime, motionDelay, motionEaseAct, motionEaseOld, ListManager 동일 (initId, infinity, autoPlay, autoPlaySpeed)
	 */
	Slider = function( $slide, option ) {
		if( $slide.length == 0 ) return dk.err( 'Slider : $slide 는 필수항목 입니다' );
		this._$slideUl = $slide;
		this._$slideLi = $slide.find( '>li' );
		this._leng = this._$slideLi.length;

		this._option = _defaultOption( option.motionType );
		$.extend( this._option, option );
		if( this._option.freezeTime >= this._option.autoPlaySpeed ) return dk.err( 'Slider : freezeTime 은 autoPlaySpeed 보다 작아야 합니다' );

		this._Slide = Slide( this._$slideUl, this._$slideLi, this._leng, this._option.motionType, this._option.motionTime, this._option.motionDelay, this._option.motionEaseAct, this._option.motionEaseOld );
		if( this._option.$dot ) this._Dot = Dot( this, this._option.$dot, this._leng );
		if( this._option.$arrow ) this._Arrow = Arrow( this, this._option.$arrow, this._leng, this._option.infinity );

		var _act = ( function( self ) {
			var isFirst = true;
			return function( id, oldId, directon ) {
				if( self._isMove ) return;
				self._isMove = true;
				if( self._option.freezeTime == 0 || isFirst ) self._isMove = false;
				else setTimeout( function() { self._isMove = false; }, self._option.freezeTime * 1000 );
				isFirst = false;
				// log( 'Slider act : ' + id + ', ' + oldId + ', ' + directon );
				self._Slide.act( id, oldId, directon );
				if( self._option.$dot ) self._Dot.act( id, oldId, directon );
				if( self._option.$arrow ) self._Arrow.act( id, oldId, directon );
				if( self._option.onAct ) self._option.onAct.call( self, id, oldId, directon );
			};
		} )( this );

		this._isMove = false;

		this._ListManager = dk.ListManager( this._leng, _act, this._option );

		if( this._option.touch ) _addTouchEvent.call( this );
	};
	fn = Slider.prototype;

	_defaultOption = function( type ) {
		var basicOption = { $dot: undefined, $arrow: undefined, onAct: undefined, touch: false, infinity: true, autoPlay: true, autoPlaySpeed: 4 };
		var motionOption;
		switch( type ) {
			case 'fixed':
				motionOption = {
					motionType: 'fixed',
					freezeTime: 0.5,
					motionTime: 1,
					motionDelay: 0,
					motionEaseAct: Power2.easeOut,
					motionEaseOld: null
				};
				break;
			case 'slideDelay':
				motionOption = {
					motionType: 'slideDelay',
					freezeTime: 1,
					motionTime: 2,
					motionDelay: 0,
					motionEaseAct: Power4.easeOut,
					motionEaseOld: Power4.easeInOut
				};
				break;
			case 'fade':
				motionOption = {
					motionType: 'fade',
					freezeTime: 0.5,
					motionTime: 1,
					motionDelay: 0,
					motionEaseAct: Power2.easeOut,
					motionEaseOld: Power2.easeOut
				};
				break;
			default:
				motionOption = {
					motionType: 'slide',
					freezeTime: 0.5,
					motionTime: 1,
					motionDelay: 0,
					motionEaseAct: Power4.easeOut,
					motionEaseOld: Power4.easeOut
				};
		}
		return $.extend( basicOption, motionOption );
	};

	_addTouchEvent = function() {
		var self = this;
		var _start = false;
		this._$slideUl.swipe( {
			swipeStatus: function( event, phase, direction, distance, duration, fingers, fingerData, currentDirection ) {
				if( phase == 'end' || phase == 'cancel' ) return _start = false;
				if( _start ) return;
				if( phase == 'move' ) _start = true;
				if( self._isMove ) return;
				switch( direction ) {
					case 'left':
						self.next();
						break;
					case 'right':
						self.prev();
						break;
				}
			}
		} );
	};

	_delTouchEvent = function() {
		this._$slideUl.swipe( 'destroy' );
	};

	_connect0 = function() {
		var i = arguments.length;
		var name;
		while( i-- ) {
			name = arguments[ i ];
			fn[ name ] = ( function( name ) {
				return function() {
					return this._ListManager[ name ].apply( this._ListManager, arguments );
				};
			} )( name );
		}
	};

	_connect1 = function() {
		var i = arguments.length;
		var name;
		while( i-- ) {
			name = arguments[ i ];
			fn[ name ] = ( function( name ) {
				return function() {
					if( this._isMove ) return;
					return this._ListManager[ name ].apply( this._ListManager, arguments );
				};
			} )( name );
		}
	};

	fn.destroy = function() {
		if( this._option.touch ) _delTouchEvent.call( this );
		this._ListManager.destroy();
		this._ListManager = null;
		this._isMove = null;
		if( this._Arrow ) {
			this._Arrow.destroy();
			this._Arrow = null;
		}
		if( this._Dot ) {
			this._Dot.destroy();
			this._Dot = null;
		}
		this._Slide.destroy();
		this._Slide = null;
		this._option = null;
		this._leng = null;
		this._$slideLi = null;
		this._$slideUl = null;
	};

	_connect0( 'getId', 'play', 'stop', 'pause', 'resetTimer' );

	_connect1( 'act', 'next', 'prev' );

	factory = function( $slide, option ) {
		return new Slider( $slide, option );
	};

	// Slide
	Slide = ( function() {
		var factory, Slide, fn;
		var _initMotion, _actMotion;

		Slide = function( $slideUl, $slideLi, leng, motionType, motionTime, motionDelay, motionEaseAct, motionEaseOld ) {
			this._$ul = $slideUl;
			this._$li = $slideLi;
			this._leng = leng;
			this._motionOption = {
				type: motionType,
				time: motionTime,
				delay: motionDelay,
				easeAct: motionEaseAct,
				easeOld: motionEaseOld
			};
			this._isFirst = true;
			_initMotion[ motionType ].call( this );
		};
		fn = Slide.prototype;

		fn.destroy = function() {
			this._motionOption = null;
			this._leng = null;
			this._$li = null;
			this._$ul = null;
		};

		fn.act = function( id, oldId, directon ) {
			if( this._isFirst ) return this._isFirst = false;
			_actMotion[ this._motionOption.type ].call( this, id, oldId, directon );
		};

		_initMotion = {
			fixed: function() {
				this._$ul.css( { 'position': 'relative', 'overflow': 'hidden' } );
				TweenLite.set( this._$li, { x: '100%', 'overflow': 'hidden' } );
				TweenLite.set( this._$li.find( '>div' ), { x: '-100%' } );
				TweenLite.set( this._$li.eq( 0 ), { x: '0%', opacity: 1 } );
				TweenLite.set( this._$li.eq( 0 ).find( '>div' ), { x: '0%' } );
			},
			slideDelay: function() {
				this._$ul.css( { 'position': 'relative', 'overflow': 'hidden' } );
				TweenLite.set( this._$li, { x: '100%', opacity: 0 } );
				TweenLite.set( this._$li.eq( 0 ), { x: '0%', opacity: 1 } );
			},
			fade: function() {
				TweenLite.set( this._$li, { opacity: 0 } );
				TweenLite.set( this._$li.eq( 0 ), { opacity: 1 } );
			},
			slide: function() {
				this._$ul.css( { 'position': 'relative', 'overflow': 'hidden' } );
				TweenLite.set( this._$li, { x: '100%' } );
				TweenLite.set( this._$li.eq( 0 ), { x: '0%' } );
			}
		};

		_actMotion = {
			fixed: function( id, oldId, directon ) {
				var $actLi, $oldLi, $actLiDiv;

				this._$li.css( 'z-index', 0 );

				$actLi = this._$li.eq( id );
				$actLiDiv = $actLi.find( '>div' );
				$actLi.css( 'z-index', 2 );
				TweenLite.killTweensOf( $actLi );
				TweenLite.set( $actLi, { x: directon == 'next' ? '100%' : '-100%' } );
				TweenLite.set( $actLiDiv, { x: directon == 'next' ? '-100%' : '100%' } );
				TweenLite.to( $actLi, this._motionOption.time, { x: '0%', ease: this._motionOption.easeAct } );
				TweenLite.to( $actLiDiv, this._motionOption.time, { x: '0%', ease: this._motionOption.easeAct } );

				if( oldId < 0 ) return;
				$oldLi = this._$li.eq( oldId );
				$oldLi.css( 'z-index', 1 );
			},
			slideDelay: function( id, oldId, directon ) {
				var $actLi, $oldLi;

				this._$li.css( 'z-index', 0 );

				$actLi = this._$li.eq( id );
				$actLi.css( 'z-index', 2 );
				TweenLite.killTweensOf( $actLi );
				TweenLite.set( $actLi, { x: directon == 'next' ? '100%' : '-100%', opacity: 1 } );
				TweenLite.to( $actLi, this._motionOption.time, { x: '0%', ease: this._motionOption.easeAct } );

				if( oldId < 0 ) return;
				$oldLi = this._$li.eq( oldId );
				$oldLi.css( 'z-index', 1 );
				TweenLite.to( $oldLi, this._motionOption.time, { delay: this._motionOption.delay, x: directon == 'next' ? '-100%' : '100%', opacity: 0, ease: this._motionOption.easeOld } );
			},
			fade: function( id, oldId, directon ) {
				var $actLi, $oldLi;

				$actLi = this._$li.eq( id );
				TweenLite.killTweensOf( $actLi );
				TweenLite.to( $actLi, this._motionOption.time, { opacity: 1, ease: this._motionOption.easeAct } );

				if( oldId < 0 ) return;
				$oldLi = this._$li.eq( oldId );
				TweenLite.to( $oldLi, this._motionOption.time, { delay: this._motionOption.delay, opacity: 0, ease: this._motionOption.easeOld } );
			},
			slide: function( id, oldId, directon ) {
				var $actLi, $oldLi;

				$actLi = this._$li.eq( id );
				TweenLite.set( $actLi, { x: directon == 'next' ? '100%' : '-100%' } );
				TweenLite.to( $actLi, this._motionOption.time, { x: '0%', ease: this._motionOption.easeAct } );

				if( oldId < 0 ) return;
				$oldLi = this._$li.eq( oldId );
				TweenLite.to( $oldLi, this._motionOption.time, { delay: this._motionOption.delay, x: directon == 'next' ? '-100%' : '100%', ease: this._motionOption.easeOld } );
			}
		};

		factory = function( $slideUl, $slideLi, leng, motionType, motionTime, motionDelay, motionEaseAct, motionEaseOld ) {
			return new Slide( $slideUl, $slideLi, leng, motionType, motionTime, motionDelay, motionEaseAct, motionEaseOld );
		};
		return factory;
	} )();

	// Dot
	Dot = ( function() {
		var factory, Dot, fn;
		var _addEvent, _delEvent;

		Dot = function( caller, $dot, leng ) {
			this._caller = caller;

			this._$ul = $dot;
			this._$clone = this._$ul.find( '>li:first-child' ).removeClass( 'on' ).clone();
			this._$ul.empty();
			for( var i = 0; i < leng; i++ ) {
				this._$ul.append( this._$clone.clone() );
			}
			this._$li = this._$ul.find( '>li' );

			_addEvent.call( this );
		};
		fn = Dot.prototype;

		fn.destroy = function() {
			_delEvent.call( this );
			this._$li = null;
			this._$ul.empty();
			this._$clone = null;
			this._$ul = null;
			this._caller = null;
		};
		fn.act = function( id, oldId, directon ) {
			this._$li.removeClass( 'on' );
			this._$li.eq( id ).addClass( 'on' );
		};

		_addEvent = function() {
			var caller = this._caller;
			this._$li.find( '>a' ).each( function( i ) {
				var $this = $( this );
				$this.on( 'click', function( e ) {
					e.preventDefault();
					caller.act( i );
				} );
			} );
		};

		_delEvent = function() {
			this._$li.find( '>a' ).off();
		};

		factory = function( caller, $dot, leng ) {
			return new Dot( caller, $dot, leng );
		};
		return factory;
	} )();

	// Arrow
	Arrow = ( function() {
		var factory, Arrow, fn;
		var _addEvent, _delEvent;

		Arrow = function( caller, $arrow, leng, infinity ) {
			this._caller = caller;
			this._$arrow = $arrow;
			this._$prev = this._$arrow.find( 'a.prev' );
			this._$next = this._$arrow.find( 'a.next' );
			this._leng = leng;
			this._infinity = infinity;
			_addEvent.call( this );
		};
		fn = Arrow.prototype;

		fn.destroy = function() {
			_delEvent.call( this );
			this._infinity = null;
			this._leng = null;
			this._$next = null;
			this._$prev = null;
			this._$arrow = null;
			this._caller = null;
		};

		fn.act = function( id, oldId, directon ) {
			if( this._infinity ) return;
			id == 0 ? this._$prev.hide() : this._$prev.show();
			id == this._leng - 1 ? this._$next.hide() : this._$next.show();
		};

		_addEvent = function() {
			var caller = this._caller;
			this._$prev.on( 'click', function( e ) {
				e.preventDefault();
				caller.prev();
			} );
			this._$next.on( 'click', function( e ) {
				e.preventDefault();
				caller.next();
			} );
		};

		_delEvent = function() {
			this._$prev.off();
			this._$next.off();
		};

		factory = function( caller, $arrow, leng, infinity ) {
			return new Arrow( caller, $arrow, leng, infinity );
		};
		return factory;
	} )();

	return factory;
} )() );

// Scroll :
dk.makeClass( 'Scroll', ( function() {
	var init, destroy, changeTarget, goTop;
	var $sel;
	var _isInitialized;
	var _getMaxDoc, _getMaxDom, _getMax, _addEvent, _delEvent;
	var _scrollY, _max, _timer, _isMove = false;

	/**
	 * @class	: Scroll
	 * @param	: target - 타겟, 기본값 $( window )
	 * @param	: time - 모션 시간, 기본값 1
	 * @param	: ease - 모션 이징값, 기본값 Power4.easeOut
	 * @param	: initGap - 이동 값, 기본값 200
	 */
	init = function( target, time, ease, initGap ) {
		if( _isInitialized ) return;
		_isInitialized = true;

		$sel = {
			win: $( window ),
			doc: $( document ),
			target: target == undefined ? $( window ) : target
		};

		_getMax = $sel.target.prop( 'scrollHeight' ) == undefined ? _getMaxDoc : _getMaxDom;

		_addEvent( time == undefined ? 1 : time, ease == undefined ? Power4.easeOut : ease, initGap == undefined ? 200 : initGap );
	};

	destroy = function() {
		_delEvent();
		_isMove = false;
		$sel = null;
		_isInitialized = false;
	};

	changeTarget = function( target ) {
		TweenLite.killTweensOf( $sel.target, { scrollTo: true } );
		_isMove = false;
		$sel.target = target;
		_getMax = $sel.target.prop( 'scrollHeight' ) == undefined ? _getMaxDoc : _getMaxDom;
	};

	goTop = function() {
		TweenLite.killTweensOf( $sel.win, { scrollTo: true } );
		TweenLite.to( $sel.win, 1, { scrollTo: 0, ease: Power4.easeOut, onComplete: function() { _isMove = false; } } );
	};

	_getMaxDoc = function() {
		_max = $sel.doc.height() - $sel.win.height();
	};

	_getMaxDom = function() {
		_max = $sel.target.prop( 'scrollHeight' ) - $sel.win.height();
	};

	_addEvent = function( time, ease, initGap ) {
		$sel.win.on( 'mousewheel.Scroll DOMMouseScroll.Scroll', function( e ) {
			e.preventDefault();
			var ev = window.event || e.originalEvent;
			var delta = ev.detail ? ev.detail < 0 ? -1 : 1 : ev.wheelDelta > 0 ? -1 : 1;
			var gap = delta > 0 ? initGap : -initGap;

			_getMax();
			if( !_isMove ) {
				_isMove = true;
				_scrollY = $sel.target.scrollTop();
			}
			_isMove = true;
			_scrollY = _scrollY + gap;
			_scrollY = _scrollY < 0 ? 0 : _scrollY >= _max ? _max : _scrollY;
			TweenLite.killTweensOf( $sel.target, { scrollTo: true } );
			TweenLite.to( $sel.target, time, { scrollTo: _scrollY, ease: ease } );
			clearTimeout( _timer );
			_timer = setTimeout( function() { _isMove = false; }, time * 1000 );
		} );
	};

	_delEvent = function() {
		TweenLite.killTweensOf( $sel.target, { scrollTo: true } );
		$sel.win.off( '.Scroll' );
	};

	return {
		init: init,
		destroy: destroy,
		changeTarget: changeTarget,
		goTop: goTop
	}
} )() );

// ScrollCheck :
dk.makeClass( 'ScrollCheck', ( function() {
	var add, destroy, reset;
	var _init, _addEvent, _delEvent, _check;
	var $sel;
	var _list = [],
		_winHeight;

	add = function( $dom, cb ) {
		if( $dom.length == 0 ) return;

		_list.push( {
			$dom: $dom,
			cb: cb,
			offsetTop: $dom.offset().top
		} );
		if( _list.length == 1 ) _init();

		_check();
	};

	destroy = function() {
		_delEvent();
		$sel = null;
		_list = [];
	};

	reset = function() {
		if( _list.length == 0 ) return;

		// offsetTop 재계산
		var i = _list.length;
		var obj;
		while( i-- ) {
			obj = _list[ i ];
			obj.offsetTop = obj.$dom.offset().top;
		}
		// window height 재계산
		_winHeight = $sel.win.height();
	};

	_init = function() {
		$sel = {
			win: $( window )
		};
		_addEvent();
	};

	_addEvent = function() {
		var resize;
		resize = function() {
			_winHeight = $sel.win.height();
		};
		$sel.win.on( 'resize.ScrollCheck', resize );
		resize();

		$sel.win.on( 'scroll.ScrollCheck', function() {
			_check();
		} );
	};

	_delEvent = function() {
		$sel.win.off( '.ScrollCheck' );
	};

	_check = function() {
		var i = _list.length;
		var obj;
		var scrollTop = $sel.win.scrollTop();
		while( i-- ) {
			obj = _list[ i ];
			obj.cb( obj.offsetTop - scrollTop, _winHeight, obj.$dom );
		}
	};

	return {
		add: add,
		destroy: destroy,
		reset: reset
	}
} )() );
