SEPARATION = 100
AMOUNTX = 50
AMOUNTY = 50
PI2 = Math.PI * 2

class Scene2
	constructor: (options) ->
		{@scene, @composer, @camera} = options
		@camera.position.y = 1000
		@camera.position.z = 1000

		@particles = new Array()
		@count = 0

	start: () ->
		effect = new THREE.ShaderPass( THREE.RGBShiftShader );
		effect.uniforms[ 'amount' ].value = 0.0015;
		# effect.renderToScreen = true;
		# @composer.addPass( effect );
		effect.renderToScreen = true
		@composer.addPass( effect )

		material = new THREE.SpriteMaterial( {
			color: 0xffffff,
			# program: ( context ) ->
			# 	context.beginPath();
			# 	context.arc( 0, 0, 0.5, 0, PI2, true );
			# 	context.fill();
		} )

		i = 0;
		for ix in [0...AMOUNTX]
			for iy in [0...AMOUNTY]
				particle = @particles[ i++ ] = new THREE.Sprite( material );
				particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
				particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
				@scene.add( particle );

	update: ( ratio ) ->
		i = 0
		for ix in [0...AMOUNTX]
			for iy in [0...AMOUNTY]
				particle = @particles[ i++ ]
				particle.position.y = ( Math.sin( ( ix + @count ) * 0.3) * 50 ) +
					( Math.sin( ( iy + @count ) * 0.5 ) * 50 )
				particle.scale.x = particle.scale.y = ( Math.sin( ( ix + @count ) * 0.3 ) + 1 ) * 4 +
					( Math.sin( ( iy + @count ) * 0.5 ) + 1 ) * 4
		@count += 0.1;
