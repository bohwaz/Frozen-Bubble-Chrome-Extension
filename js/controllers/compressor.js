var Compressor_Controller = (function(inWinFunc, inGameOverFunc, inGameController) {
	var bubblesGrid = null;
	var compressorImg = null;
	var currentPos = 1;
	var compressorMainLoop = null;
	var level = 1;

	var advance = function() {
		SoundManager_Tool.play(config.compressor.newRootSnd);

		var extensor = new AnimatedImage_Tool('compressor_extender');
		extensor.init();
		extensor.setPos(config.compressor.extensor.x, ((currentPos - 1) * config.compressor.extensor.height));
		extensor.show();

		compressorImg.setPos(config.compressor.x, config.compressor.initY + (currentPos * config.compressor.extensor.height));

		bubblesGrid.setBaseY((currentPos * config.compressor.extensor.height) + config.compressor.initY + config.compressor.height);

		currentPos++;

		compressorMainLoop = setTimeout(advance, config.compressor.baseLoopTime - (level * config.compressor.timeToDecreaseByLevel));

		if (bubblesGrid.checkIfOutOfLimits()) {
			inGameOverFunc();
		}
	};

	return {
		stop: function() {
			clearTimeout(compressorMainLoop);
		},

		checkCollision: function(inBubble) {
			var bubbleCollision = bubblesGrid.checkCollision(inBubble);
			if (
				compressorImg.checkCollision(inBubble.getImage()) ||
				(bubbleCollision !== false)) {
				inBubble.stop();

				bubblesGrid.addBubble(inBubble, bubbleCollision);
			}
		},

		init: function(inLevel) {
			level = inLevel;
			bubblesGrid = new BubblesGrid_Controller(inWinFunc, inGameOverFunc, inGameController);

			compressorImg = new AnimatedImage_Tool('compressor');
			compressorImg.init();
			//compressorImg.setPos(config.compressor.x, config.compressor.initY);
			compressorImg.show();
			advance();

			var bubbles = levels[inLevel];
			for (bubble in bubbles) {
				bubbles[bubble].bubble = new Bullble_Controller(
					config.windowConf.width / 2,
					config.windowConf.width / 2);
			}

			bubblesGrid.init(levels[inLevel]);
		}
	}
});
