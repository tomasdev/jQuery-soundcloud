/**
 * @fileOverview jQuery SoundCloud
 * 
 * Github:        https://github.com/tomasdev/jQuery-soundcloud
 * Documentation: In my TO-DO list
 *
 * @author <a href="mailto:hola&#064;tomasroggero.&#99;om">Tomas Roggero</a>
 * @license Creative Commons Attribution-ShareAlike 3.0 Unported License
 * @version 0.1b
 * @see http://developers.soundcloud.com/docs
 *
 */

(function($){

	var CLIENT_ID,
		ID = "sc-scripts-container",
		SC_LOADED = false,
		WAITING = false;
		
	$.fn.soundcloud = function(config){
	
		config = $.extend({
			
		}, config);
		
		if( !config.clientId && !CLIENT_ID ){
			throw new SyntaxError('API Client ID is required on first $.soundcloud call');
			return false;
		}else if( !CLIENT_ID ){
			CLIENT_ID = config.clientId;
		}
	
		var $SC = $("#" + ID);
		
		$SC = ($SC.length && $SC) || ( $('<div style="width:0;height:0;overflow:hidden;" id="' + ID + '"></div>').appendTo("body") );
		
		var initSDK = function(callback){
			if( WAITING ){
				return false;
			}
			console.log('initSDK()', CLIENT_ID);
			WAITING = true;
			$.getScript('http://connect.soundcloud.com/sdk.js', function(){
				SC.initialize({
					client_id: CLIENT_ID
				});
				SC_LOADED = true;
				WAITING = false;
				console.log('SDK Loaded');
				(typeof callback == "function") && callback();
			});
			return false;
		};
		initSDK();
		
		var API = function(url, callback, ops){
			if( !SC_LOADED ){
				// TODO: use events instead of timeout hack!
				return setTimeout(function(){
					API(url, callback, ops);
				}, 200);
			}
			console.log('API(', url, ')');
			ops = ops || {};
			SC.get(url, ops, callback);
			return false;
		};
		
		var trackSWF = function(url){
			return ['<object height="81" width="100%">',
						'<param name="movie" value="https://player.soundcloud.com/player.swf?url=' + url + '&amp;auto_play=false&amp;' + config.themeColors + '"></param>',
						'<param name="allowscriptaccess" value="always"></param>',
						'<embed allowscriptaccess="always" height="81" src="https://player.soundcloud.com/player.swf?url=' + url + '&amp;auto_play=false&amp;' + config.themeColors + '" type="application/x-shockwave-flash" width="100%"></embed>',
						'</object>'].join("");
		};
		
		var putContents = function(where){
			if( config.artist ){
				API('/users/' + config.artist + '/tracks', function(tracks){
					var html = "";
					if( tracks.length ){
						for( var i = 0; track = tracks[i++]; ){
							if ( config.showCaption ){
								html += track.user.username + ' - ' + track.title;
							}
							html += trackSWF(track.uri);
						}
					}else{
						html += "Not available right now.";
					}
					$(where).append(html);
				});
			}
		};
	
		return $(this).each(function(){
			putContents(this);
		
		});
	};
	
}(jQuery));