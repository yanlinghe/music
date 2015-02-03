class Visual
	constructor: (options) ->
		{@music} = options
		@container = document.getElementById( 'container' )

		@camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 4000 )
		@camera.position.z = 1000

		@scene = new THREE.Scene()
		@renderer = new THREE.WebGLRenderer()
		@renderer.setSize( window.innerWidth, window.innerHeight )

		@composer = new THREE.EffectComposer( @renderer )

		@scene2 = new Scene2 scene: @scene, composer: @composer, camera: @camera

	init: () ->
		@container.appendChild( @renderer.domElement )
		@composer.addPass( new THREE.RenderPass( @scene, @camera ) );

		@scene2.start()

		# effect = new THREE.ShaderPass( THREE.CopyShader );
		# effect.uniforms[ 'scale' ].value = 2;
		# effect.renderToScreen = true;
		# @composer.addPass( effect );

		# effect = new THREE.ShaderPass( THREE.RGBShiftShader );
		# effect.uniforms[ 'amount' ].value = 0.015;
		# effect.renderToScreen = true;
		# @composer.addPass( effect );

	render: (ratio) ->
		requestAnimationFrame( @render.bind(this) )
		
		@scene2.update(@music.getBarWidth())
		@composer.render()

