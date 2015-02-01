
class Visualizer 
	constructor: (options) ->
		@music = new Music
		@visual = new Visual

	start: () ->
		@visual.init()
		@visual.render()