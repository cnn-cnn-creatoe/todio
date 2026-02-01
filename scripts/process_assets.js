import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BRAIN_DIR = 'C:/Users/Evan/.gemini/antigravity/brain/2910ad97-8fdd-49b2-ad9f-b8c8323f835b';
const REF_LOGO = 'logo_v2_clean_1769268810907.png';
const INSTALLER_SIDEBAR = path.join(__dirname, '../build/Installer-Sidebar.png');
const UNINSTALLER_SIDEBAR = path.join(__dirname, '../build/Uninstaller-Sidebar.png');

const BUILD_DIR = path.join(__dirname, '../build');
const LOGO_SRC = path.join(BRAIN_DIR, REF_LOGO);

async function processAssets() {
    console.log('Processing Assets...');

    // 1. Process Logo
    // Copy as icon.png (256x256)
    await sharp(LOGO_SRC)
        .resize(256, 256)
        .toFile(path.join(BUILD_DIR, 'icon.png'));
    
    // Generate icon.ico
    const buf = await pngToIco(LOGO_SRC);
    fs.writeFileSync(path.join(BUILD_DIR, 'icon.ico'), buf);
    
    console.log('✅ Logo processed (png & ico)');

    // 2. Process Sidebar Assets
    // You now keep the sidebars directly under build/ as:
    // - build/Installer-Sidebar.png
    // - build/Uninstaller-Sidebar.png
    // This script no longer generates/renames sidebar files.

    if (!fs.existsSync(INSTALLER_SIDEBAR)) {
        throw new Error(`Missing installer sidebar: ${INSTALLER_SIDEBAR}`);
    }
    if (!fs.existsSync(UNINSTALLER_SIDEBAR)) {
        throw new Error(`Missing uninstaller sidebar: ${UNINSTALLER_SIDEBAR}`);
    }

    console.log('✅ Sidebar assets found');
}

processAssets().catch(console.error);
