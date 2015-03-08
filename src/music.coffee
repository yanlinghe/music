class Music 
	constructor: (options) ->
		@filename = options.filename
		@ctx
		@buf
		@fft
		@samples = 128
		@setup = false
		@gfx
		@wWidth
		@wHeight
		@height = 300
		@visual = options.visual

		@beatHoldFrames = 18
		@beatThreshold = 80
		@beatCutoff = 0
		@beatDecayRate = 0.95
		@framesSinceLastbeat = 0

	init: () ->
		try
			@ctx = new (window.AudioContext || window.webkitAudioContext)()
			console.log @ctx
			@loadFile()
		catch e
			alert 'no web audio support'

	loadFile: () ->
		req = new XMLHttpRequest()
		console.log @filename
		req.open('GET', @filename, true)

		req.responseType = 'arraybuffer'
		req.onload = () =>
			console.log @ctx
			@ctx.decodeAudioData req.response, (buffer) =>
				@buf = buffer
				@play()
				@setupCanvas()
				@update()

		req.send()

	play: () ->
		src = @ctx.createBufferSource()
		src.buffer = @buf

		@fft = @ctx.createAnalyser()
		@fft.fftSize = @samples

		src.connect(@fft)
		@fft.connect(@ctx.destination)

		src.start(0)
		@setup = true

	setupCanvas: () ->
		canvas = document.getElementById('canvas')
		@gfx = canvas.getContext('2d')
		@wWidth = document.body.clientWidth
		@wHeight = document.body.clientHeight
		canvas.width = @wWidth
		canvas.height = @height

	update: () ->
		requestAnimationFrame( @update.bind(this) )
		return if !@setup

		# get the frequency distribution
		bufferLength = @fft.frequencyBinCount
		data = new Uint8Array(bufferLength)
		@fft.getByteFrequencyData(data)

		# get average volume and check whether it's on a beat
		average = @getAverageVolume(data, bufferLength)
		isBeat = @detectBeat(average)

		# updating the view on canvas
		@gfx.clearRect(0, 0, @wWidth, @height)
		@gfx.fillStyle = 'rgb(20, 20, 20)'
		@gfx.fillRect(0, 0, @wWidth, @height)

		barWidth = (@wWidth / (bufferLength + 10))
		barHeight
		x = 0

		for i in [0..bufferLength]
			barHeight = data[i] / 2
			@gfx.fillStyle = 'rgb(' + (barHeight + 100) + ', 50, 50)'
			@gfx.fillRect(x, @height - barHeight, barWidth, barHeight)
			x += (barWidth + 1)

		# draw the average volume and beat indicator
		barHeight = average / 2
		if isBeat
			@gfx.fillStyle = 'rgb(255, 255, 255)'
		else
			@gfx.fillStyle = 'rgb(' + (barHeight + 100) + ', 50, 50)'

		@gfx.fillRect(x, @height - barHeight, barWidth, barHeight)

	getAverageVolume: (data, bufferLength) ->
		values = 0

		for i in [0..bufferLength]
			if data[i] == undefined || data[i] == NaN
				values += 0
			else
				values += data[i]

		return values / bufferLength;

	detectBeat: (average) ->
		console.log average
		if average > @beatCutoff && average > @beatThreshold
			@beatCutoff = average * 1.1
			@framesSinceLastbeat = 0
			return true
		else
			if @framesSinceLastbeat <= @beatHoldFrames
				@framesSinceLastbeat += 1
			else
				@beatCutoff *= @beatDecayRate
				@beatCutoff = Math.max @beatCutoff, @beatThreshold

		return false




