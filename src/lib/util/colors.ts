const setBrightness = (color: string, brightness: number) => {
	let red = parseInt(color.slice(0, 2), 16);
	let green = parseInt(color.slice(2, 4), 16);
	let blue = parseInt(color.slice(4, 6), 16);
	const rgbMax = Math.max(Math.max(red, green), blue);
	const rgbMin = Math.min(Math.min(red, green), blue);
	const rgbConstantRange = rgbMax - rgbMin;
	let saturation;
	if (rgbMax != 0) {
		saturation = rgbConstantRange / rgbMax;
	} else {
		saturation = 0.0;
	}

	let hue;
	if (saturation == 0.0) {
		hue = 0.0;
	} else {
		const constantRed = (rgbMax - red) / rgbConstantRange;
		const constantGreen = (rgbMax - green) / rgbConstantRange;
		const constantBlue = (rgbMax - blue) / rgbConstantRange;
		if (red == rgbMax) {
			hue = constantBlue - constantGreen;
		} else if (green == rgbMax) {
			hue = 2.0 + constantRed - constantBlue;
		} else {
			hue = 4.0 + constantGreen - constantRed;
		}

		hue /= 6.0;
		if (hue < 0.0) {
			++hue;
		}
	}

	if (saturation == 0.0) {
		red = green = blue = Math.round(brightness * 255.0);
		return { red, green, blue };
	} else {
		let colorWheelSegment = (hue - Math.floor(hue)) * 6.0;
		let colorWheelOffset = colorWheelSegment - Math.floor(colorWheelSegment);
		let primaryColor = brightness * (1.0 - saturation);
		let secondaryColor = brightness * (1.0 - saturation * colorWheelOffset);
		let tertiaryColor = brightness * (1.0 - saturation * (1.0 - colorWheelOffset));
		switch (Math.floor(colorWheelSegment)) {
			case 0:
				red = Math.round(brightness * 255.0);
				green = Math.round(tertiaryColor * 255.0);
				blue = Math.round(primaryColor * 255.0);
				break;
			case 1:
				red = Math.round(secondaryColor * 255.0);
				green = Math.round(brightness * 255.0);
				blue = Math.round(primaryColor * 255.0);
				break;
			case 2:
				red = Math.round(primaryColor * 255.0);
				green = Math.round(brightness * 255.0);
				blue = Math.round(tertiaryColor * 255.0);
				break;
			case 3:
				red = Math.round(primaryColor * 255.0);
				green = Math.round(secondaryColor * 255.0);
				blue = Math.round(brightness * 255.0);
				break;
			case 4:
				red = Math.round(tertiaryColor * 255.0);
				green = Math.round(primaryColor * 255.0);
				blue = Math.round(brightness * 255.0);
				break;
			case 5:
				red = Math.round(brightness * 255.0);
				green = Math.round(primaryColor * 255.0);
				blue = Math.round(secondaryColor * 255.0);
		}

		return { red, green, blue };
	}
};

export const getRenderedColor = (color: string) => {
	const rendered = setBrightness(color, 0.9);
	return `${rendered.red.toString(16).padStart(2, "0")}${rendered.green.toString(16).padStart(2, "0")}${rendered.blue.toString(16).padStart(2, "0")}`;
};
