
class Visualizer 
	constructor: (options) ->
		@music = new Music {filename: 'numb.mp3'}
		@visual = new Visual

	start: () ->
        @music.init()
        @visual.init()
        @visual.render()
