import { optimize } from "npm:svgo@3.2.0";
import { z } from "npm:zod@3.22.4";

const argSchema = z.literal("avatar").or(z.literal("favicon"));
const arg = argSchema.parse(Deno.args[0]);
const s = <T>(values: { [k in z.infer<typeof argSchema>]: T }): T =>
  values[arg];

const size = 400;
const backgroundColor = `#000001`;
const strokeColor = `#0b6cfb`;

// amount of points in the path
const resolution = 628;

const frequency = 6;
const offset = Math.PI;
// relative fractions to size
const radius = 0.2542857142857143;
const amplitude = 0.05142857142857142;
const strokeWidth =
  0.017 *
  s({
    avatar: 1,
    favicon: 3,
  });

const distanceToShape =
  size / 2 - size * (radius + amplitude + strokeWidth / 2);
let svgPath = "";

const step = (2 * Math.PI) / resolution;
for (let rad = 0; rad < 2 * Math.PI; rad += step) {
  const r =
    radius * size + Math.cos(offset + rad * frequency) * (amplitude * size);
  const y = r * Math.sin(rad) + size / 2;
  const x = r * Math.cos(rad) + size / 2;

  const svgCommand = svgPath === "" ? "M" : " L";

  svgPath += `${svgCommand}${x} ${y}`;
}

const svg = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="${s(
  {
    avatar: `0 0 ${size} ${size}`,
    favicon: `${distanceToShape} ${distanceToShape} ${
      size - 2 * distanceToShape
    } ${size - 2 * distanceToShape}`,
  }
)}">
  ${s({
    favicon: "",
    avatar: `<rect fill="${backgroundColor}" stroke="none" x="0" y="0" width="${size}" height="${size}" fill-opacity="1"/>`,
  })}
  <path fill="${s({
    favicon: backgroundColor,
    avatar: "none",
  })}" stroke="${strokeColor}" paint-order="fill stroke markers" d="${svgPath}" stroke-opacity="1" stroke-linecap="round" stroke-miterlimit="10" stroke-width="${
  strokeWidth * size
}"/>
</svg>
`;

const optimizedSvg = optimize(svg, {
  multipass: true,
}).data;

console.log(optimizedSvg);
