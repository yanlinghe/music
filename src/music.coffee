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
        @gfx.clearRect(0, 0, @wWidth, @height)

        @gfx.fillStyle = 'rgb(20, 20, 20)'
        @gfx.fillRect(0, 0, @wWidth, @height)

        bufferLength = @fft.frequencyBinCount
        data = new Uint8Array(bufferLength)
        @fft.getByteFrequencyData(data)

        barWidth = (@wWidth / bufferLength)
        barHeight
        x = 0

        for i in [0..bufferLength]
            barHeight = data[i] / 2
            @gfx.fillStyle = 'rgb(' + (barHeight + 100) + ', 50, 50)'
            @gfx.fillRect(x, @height - barHeight, barWidth, barHeight)
            x += (barWidth + 1)



