import { execFileSync } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const images = {
  "59360003": "https://v3b.fal.media/files/b/0aae7fc0/AQJ5apv3LM0JL7UmG33nc_7rgnVXeG.png",
  "58880004": "https://v3b.fal.media/files/b/0aae7fc0/x-gbm1fc9PAgk1CKjyk6j_DuIaXB4U.png",
  "58120001": "https://v3b.fal.media/files/b/0aae7fc0/t124YfdyJZ0MzoV5w9q0Y_mtDAVxgi.png",
  "3140": "https://v3b.fal.media/files/b/0aae7fc0/bNDm-2bzAn4qvM4uqrjd-_8Gsdhsoe.png",
  "32090001": "https://v3b.fal.media/files/b/0aae7fc0/EXiBkmhL11ntFv-K_7c0q_7YR02DES.png",
  "31360001": "https://v3b.fal.media/files/b/0aae7fc3/0EgtsFR62QHL0erkyOCjX_lOynMScS.png",
  "30980001": "https://v3b.fal.media/files/b/0aae7fc3/UTGbqJQwOW8jrSq1UdEwT_8eHtYNE8.png",
  "32710001": "https://v3b.fal.media/files/b/0aae7fc3/cjjq7EH_FwkFnhFkqWzlQ_ZatZbgI6.png",
  "30960001": "https://v3b.fal.media/files/b/0aae7fc3/G2ejjufF6GoJ7QrTFLcjU_GNXZvLqN.png",
  "32800004": "https://v3b.fal.media/files/b/0aae7fc3/ZBbKsPGcWfeY3v42hDdej_rMyNMIRV.png",
  "51400003": "https://v3b.fal.media/files/b/0aae7fc5/tXna2Y2JVY_awHNILUytQ_1hfNi5RS.png",
  "2516": "https://v3b.fal.media/files/b/0aae7fc5/njaAEJno8eZFVd74n6IcU_Mjoyswj3.png",
  "5814": "https://v3b.fal.media/files/b/0aae7fc5/BgY2k8dMJGiwpKpIipUJk_zrjoG1HJ.png",
  "2444": "https://v3b.fal.media/files/b/0aae7fc5/Kz_qSPxJyw6zPQVQDf0Lu_bDsHCrCg.png",
  "2445": "https://v3b.fal.media/files/b/0aae7fc5/pcYB7K_qQV48JKMXByUac_sxJNeNVT.png",
  "2443": "https://v3b.fal.media/files/b/0aae7fc7/yPj9WBnFzT1eK8DRrq1c1_VAre1A0d.png",
  "2448": "https://v3b.fal.media/files/b/0aae7fc7/VjvTIXbi7BLVm1zI4_mRw_rseMYisJ.png",
  "32100001": "https://v3b.fal.media/files/b/0aae7fc7/dLKIbBIfUnY9DKAH1xboA_W79ZKOcx.png",
  "30710002": "https://v3b.fal.media/files/b/0aae7fc7/3-bBU42XB2u5FINDUoxn__kkDuKyPs.png",
  "26370008": "https://v3b.fal.media/files/b/0aae7fc7/7j1HhYZitUSBakdbzgFps_eGpKmhQR.png",
};

const outputDirectory = path.resolve("public/images/products");
await mkdir(outputDirectory, { recursive: true });
for (const [sku, url] of Object.entries(images)) {
  const source = path.join(outputDirectory, `${sku}.source.png`);
  const output = path.join(outputDirectory, `${sku}.webp`);
  execFileSync("curl", ["--fail", "--location", "--silent", "--show-error", "--max-time", "45", "--output", source, url]);
  await sharp(source)
    .resize(1000, 1250, { fit: "cover", position: "bottom" })
    .webp({ quality: 84, effort: 5 })
    .toFile(output);
  await rm(source, { force: true });
  const metadata = await sharp(output).metadata();
  console.log(`${sku}: ${metadata.width}x${metadata.height} → ${output}`);
}
console.log(`Imagens convertidas: ${Object.keys(images).length}`);
