class Music 
    constructor: (options) ->
        console.log 'here'
        @filename = options.filename
        @ctx
        @buf
        @fft
        @samples = 128
        @setup = false

    init: () ->
        console.log 'in init'
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

