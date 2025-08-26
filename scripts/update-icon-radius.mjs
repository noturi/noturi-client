#!/usr/bin/env node
import sharp from 'sharp';

const iconSize = 1024;
const radius = 12;

async function createRoundedIcon() {
  try {
    // Create a rounded rectangle mask
    const roundedCorners = Buffer.from(
      `<svg>
        <defs>
          <clipPath id="rounded">
            <rect x="0" y="0" width="${iconSize}" height="${iconSize}" rx="${radius}" ry="${radius}"/>
          </clipPath>
        </defs>
        <rect x="0" y="0" width="${iconSize}" height="${iconSize}" fill="black" clip-path="url(#rounded)"/>
      </svg>`,
    );

    // Create the base black square with text
    const baseIcon = Buffer.from(
      `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${iconSize}" height="${iconSize}" fill="black"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
              font-family="Apple SD Gothic Neo, sans-serif" font-size="280" font-weight="600" fill="white">
          Noturi
        </text>
      </svg>`,
    );

    // Apply the rounded corners
    await sharp(baseIcon)
      .composite([{ input: roundedCorners, blend: 'dest-in' }])
      .png()
      .toFile('./assets/images/icon.png');

    console.log('Icon updated with 12px border radius');
  } catch (error) {
    console.error('Error creating icon:', error);
  }
}

async function createSplashIcon() {
  try {
    // Create the splash icon with transparent background and cursive black text
    const splashIcon = Buffer.from(
      `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
              font-family="Apple SD Gothic Neo, sans-serif" font-size="280" font-weight="600" fill="black">
          Noturi
        </text>
      </svg>`,
    );

    await sharp(splashIcon).png().toFile('./assets/images/splash-icon.png');

    console.log('Splash icon updated with cursive font');
  } catch (error) {
    console.error('Error creating splash icon:', error);
  }
}

createRoundedIcon();
createSplashIcon();
