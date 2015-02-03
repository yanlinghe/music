
class Visualizer 
	constructor: (options) ->
		@music = new Music {filename: 'numb.mp3'}
		@visual = new Visual {music: @music}

	start: () ->
        @music.init()
        @visual.init()
        @render()
        
    render: () -> 
    	@music.g
    	@visual.render()
