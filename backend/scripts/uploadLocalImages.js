/**
 * One-time script: uploads all local product images to Cloudinary
 * and updates the MongoDB products (seeded via legacyId) with real URLs.
 *
 * Run from backend folder:
 *   node scripts/uploadLocalImages.js
 */

import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

await mongoose.connect(process.env.MONGODB_URI);
console.log('MongoDB connected');

const productModel = (await import('../models/productModel.js')).default;

const imageMap = {
    aaaaa: ['p_img1.png'],
    aaaab: ['p_img2.png'],
    aaaac: ['p_img3.png'],
    aaaad: ['p_img4.png'],
    aaaae: ['p_img5.png'],
    aaaaf: ['p_img6.png'],
    aaaag: ['p_img7.png'],
    aaaah: ['p_img8.png'],
    aaaai: ['p_img9.png'],
    aaaaj: ['p_img10.png'],
    aaaak: ['p_img11.png'],
    aaaal: ['p_img12.png'],
    aaaam: ['p_img13.png'],
    aaaan: ['p_img14.png'],
    aaaao: ['p_img15.png'],
    aaaap: ['p_img16.png'],
    aaaaq: ['p_img17.png'],
    aaaar: ['p_img18.png'],
    aaaas: ['p_img19.png'],
    aaaat: ['p_img20.png'],
    aaaau: ['p_img21.png'],
    aaaav: ['p_img22.png'],
    aaaaw: ['p_img23.png'],
    aaaax: ['p_img24.png'],
    aaaay: ['p_img25.png'],
    aaaaz: ['p_img26.png'],
    aaaba: ['p_img27.png'],
    aaabb: ['p_img28.png'],
    aaabc: ['p_img29.png'],
    aaabd: ['p_img30.png'],
    aaabe: ['p_img31.png'],
    aaabf: ['p_img32.png'],
    aaabg: ['p_img33.png'],
    aaabh: ['p_img34.png'],
    aaabi: ['p_img35.png'],
    aaabj: ['p_img36.png'],
    aaabk: ['p_img37.png'],
    aaabl: ['p_img38.png'],
    aaabm: ['p_img39.png'],
    aaabn: ['p_img40.png'],
    aaabo: ['p_img41.png'],
    aaabp: ['p_img42.png'],
    aaabq: ['p_img43.png'],
    aaabr: ['p_img44.png'],
    aaabs: ['p_img45.png'],
    aaabt: ['p_img46.png'],
    aaabu: ['p_img47.png'],
    aaabv: ['p_img48.png'],
    aaabw: ['p_img49.png'],
    aaabx: ['p_img50.png'],
    aaaby: ['p_img51.png'],
    aaabz: ['p_img52.png'],
    aaaca: ['p_img53.png'],
    aaacb: ['p_img54.png'],
    aaacc: ['p_img55.png'],
    aaacd: ['p_img56.png'],
    aaace: ['p_img57.png'],
    aaacf: ['p_img58.png'],
    aaacg: ['p_img59.png'],
    aaach: ['p_img60.png', 'p_img60_1.png'],
    aaaci: ['p_img61.png'],
    aaacj: ['p_img62.png'],
    aaack: ['p_img63.png'],
    aaacl: ['p_img64.png'],
    aaacm: ['p_img65.png'],
    aaacn: ['p_img66.png'],
    aaaco: ['p_img67.png'],
    aaacp: ['p_img68.png'],
    aaacq: ['p_img69.png'],
    aaacr: ['p_img70.png'],
    aaacs: ['p_img71.png'],
    aaact: ['p_img72.png'],
    aaacu: ['p_img73.png'],
    aaacv: ['p_img74.png'],
    aaacw: ['p_img75.png'],
    aaacx: ['p_img76.png'],
    aaacy: ['p_img77.png'],
    aaacz: ['p_img78.png'],
    aaada: ['p_img79.png'],
    aaadb: ['p_img80.png'],
    aaadc: ['p_img81.png'],
    aaadd: ['p_img82.png'],
    aaade: ['p_img83.png'],
    aaadf: ['p_img84.png'],
    aaadg: ['p_img85.png'],
    aaadh: ['p_img86.png'],
    aaadi: ['p_img87.png'],
    aaadj: ['p_img88.png'],
    aaadk: ['p_img89.png'],
    aaadl: ['p_img90.png'],
    aaadm: ['p_img91.png'],
    aaadn: ['p_img92.png'],
    aaado: ['p_img93.png', 'p_img93_1.png'],
    aaadp: ['p_img94.png'],
    aaadq: ['p_img95.png'],
    aaadr: ['p_img96.png'],
    aaads: ['p_img97.png'],
    aaadt: ['p_img98.png'],
    aaadu: ['p_img99.png'],
    aaadv: ['p_img100.png'],
    aaadw: ['p_img101.png'],
    aaadx: ['p_img102.png'],
    aaady: ['p_img103.png'],
    aaadz: ['p_img104.png'],
    aaaea: ['p_img105.png'],
    aaaeb: ['p_img106.png'],
    aaaec: ['p_img107.png'],
    aaaed: ['p_img108.png'],
    aaaee: ['p_img109.png'],
    aaaef: ['p_img110.png'],
    aaaeg: ['p_img111.png'],
    aaaeh: ['p_img112.png'],
    aaaei: ['p_img113.png'],
    aaaej: ['p_img114.png'],
    aaaek: ['p_img115.png'],
};

const assetsDir = path.resolve(__dirname, '../../frontend/src/assets');

let updated = 0, skipped = 0, failed = 0;

for (const [legacyId, files] of Object.entries(imageMap)) {
    const doc = await productModel.findOne({ legacyId });
    if (!doc) { console.log(`⚠ Not in DB yet: ${legacyId}`); skipped++; continue; }

    if (doc.image?.length && String(doc.image[0]).includes('cloudinary')) {
        console.log(`✓ Already on Cloudinary: ${doc.name}`);
        skipped++;
        continue;
    }

    try {
        const urls = [];
        for (const file of files) {
            const filePath = path.join(assetsDir, file);
            if (!fs.existsSync(filePath)) { console.log(`⚠ File not found: ${file}`); continue; }
            const result = await cloudinary.uploader.upload(filePath, { folder: 'kalakriti' });
            urls.push(result.secure_url);
        }
        if (urls.length) {
            await productModel.findByIdAndUpdate(doc._id, { image: urls });
            console.log(`✅ ${doc.name}`);
            updated++;
        }
    } catch (e) {
        console.log(`❌ Failed: ${legacyId} — ${e.message}`);
        failed++;
    }
}

console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}, Failed: ${failed}`);
await mongoose.disconnect();
