import RenderLib from "../RenderLib";

const lineSphere = new org.lwjgl.util.glu.Sphere();
lineSphere.drawStyle = org.lwjgl.util.glu.GLU.GLU_LINE;

const lineCylinder = new org.lwjgl.util.glu.Cylinder();
lineCylinder.drawStyle = org.lwjgl.util.glu.GLU.GLU_LINE;

const lineDisk = new org.lwjgl.util.glu.Disk();
lineDisk.drawStyle = org.lwjgl.util.glu.GLU.GLU_LINE;

// Helper function to parse string representation of colors (e.g., "#RRGGBB" or "#RRGGBBAA")
function parseColorString(colorString) {
    if (colorString.charAt(0) === '#') {
        // Hexadecimal representation: #RRGGBB or #RRGGBBAA
        const hex = colorString.slice(1);
        const hasAlpha = hex.length === 8; // Check if the string contains alpha channel

        const red = parseInt(hasAlpha ? hex.slice(0, 2) : hex.slice(0, 2) + "FF", 16);
        const green = parseInt(hex.slice(2, 4), 16);
        const blue = parseInt(hex.slice(4, 6), 16);
        const alpha = hasAlpha ? parseInt(hex.slice(6, 8), 16) : 255;

        return { getRed: () => red, getGreen: () => green, getBlue: () => blue, getAlpha: () => alpha };
    } else {
        throw new Error(`Invalid color array format: ${colorString}`);
    }
}

// Helper function to parse array representation of colors (e.g., [r, g, b, a] or [r, g, b])
function parseColorArray(colorArray) {
    if (colorArray.length === 4) {
        // Array representation with alpha channel: [r, g, b, a]
        const red = colorArray[0];
        const green = colorArray[1];
        const blue = colorArray[2];
        const alpha = colorArray[3];

        return { getRed: () => red, getGreen: () => green, getBlue: () => blue, getAlpha: () => alpha };
    } else if (colorArray.length === 3) {
        // Array representation without alpha channel: [r, g, b]
        const red = colorArray[0];
        const green = colorArray[1];
        const blue = colorArray[2];
        const alpha = 255; // Default alpha value if not provided in the array

        return { getRed: () => red, getGreen: () => green, getBlue: () => blue, getAlpha: () => alpha };
    }

    throw new Error(`Invalid color array format: ${colorArray}`);
}

export default class RenderLibV2 extends RenderLib {
    /**
     * Draws the frame of a box with customizable width in the X and Z directions
     * @param {number} x - X Coordinates
     * @param {number} y - Y Coordinates
     * @param {number} z - Z Coordinates
     * @param {number} wx - Box Width in X direction
     * @param {number} h - Box Height
     * @param {number} wz - Box Width in Z direction
     * @param {number} red - Box Color Red 0-1
     * @param {number} green - Box Color Green 0-1
     * @param {number} blue - Box Color Blue 0-1
     * @param {number} alpha - Box Color Alpha 0-1
     * @param {boolean} phase - Depth test disabled. True: See through walls
     * @param {number} [lineWidth=2.0] - The line width in float. if this parameter not pass, default is 2.0
     */
    static drawEspBoxV2 = (x, y, z, wx, h, wz, red, green, blue, alpha, phase, lineWidth) => {
        Tessellator.pushMatrix();
        if (!lineWidth) lineWidth = 2.0;
        GL11.glLineWidth(lineWidth);
        GlStateManager.func_179129_p(); // disableCullFace
        GlStateManager.func_179147_l(); // enableBlend
        GlStateManager.func_179112_b(770, 771); // blendFunc
        GlStateManager.func_179132_a(false); // depthMask
        GlStateManager.func_179090_x(); // disableTexture2D

        if (phase) {
            GlStateManager.func_179097_i(); // disableDepth
        }

        const locations = [
            //    x, y, z    x, y, z
            [
                [0, 0, 0],
                [wx, 0, 0],
            ],
            [
                [0, 0, 0],
                [0, 0, wz],
            ],
            [
                [wx, 0, wz],
                [wx, 0, 0],
            ],
            [
                [wx, 0, wz],
                [0, 0, wz],
            ],

            [
                [0, h, 0],
                [wx, h, 0],
            ],
            [
                [0, h, 0],
                [0, h, wz],
            ],
            [
                [wx, h, wz],
                [wx, h, 0],
            ],
            [
                [wx, h, wz],
                [0, h, wz],
            ],

            [
                [0, 0, 0],
                [0, h, 0],
            ],
            [
                [wx, 0, 0],
                [wx, h, 0],
            ],
            [
                [0, 0, wz],
                [0, h, wz],
            ],
            [
                [wx, 0, wz],
                [wx, h, wz],
            ],
        ];

        locations.forEach((loc) => {
            Tessellator.begin(3).colorize(red, green, blue, alpha);

            Tessellator.pos(x + loc[0][0] - wx / 2, y + loc[0][1], z + loc[0][2] - wz / 2).tex(0, 0);

            Tessellator.pos(x + loc[1][0] - wx / 2, y + loc[1][1], z + loc[1][2] - wz / 2).tex(0, 0);

            Tessellator.draw();
        });

        GlStateManager.func_179089_o(); // enableCull
        GlStateManager.func_179084_k(); // disableBlend
        GlStateManager.func_179132_a(true); // depthMask
        GlStateManager.func_179098_w(); // enableTexture2D

        if (phase) {
            GlStateManager.func_179126_j(); // enableDepth
        }

        Tessellator.popMatrix();
    };

    /**
         * Draws the filled sides of a box with customizable width in the X and Z directions
         * @param {number} x - X Coordinates
         * @param {number} y - Y Coordinates
         * @param {number} z - Z Coordinates
         * @param {number} wx - Box Width in X direction
         * @param {number} h - Box Height
         * @param {number} wz - Box Width in Z direction
         * @param {number} red - Box Color Red 0-1
         * @param {number} green - Box Color Green 0-1
         * @param {number} blue - Box Color Blue 0-1
         * @param {number} alpha - Box Color Alpha 0-1
         * @param {boolean} phase - Depth test disabled. True: See through walls
         */
    static drawInnerEspBoxV2 = (x, y, z, wx, h, wz, red, green, blue, alpha, phase) => {
        Tessellator.pushMatrix();
        GL11.glLineWidth(2.0);
        GlStateManager.func_179129_p(); // disableCullFace
        GlStateManager.func_179147_l(); // enableBlend
        GlStateManager.func_179112_b(770, 771); // blendFunc
        GlStateManager.func_179132_a(false); // depthMask
        GlStateManager.func_179090_x(); // disableTexture2D

        if (phase) {
            GlStateManager.func_179097_i(); // disableDepth
        }

        const halfwx = wx / 2;
        const halfwz = wz / 2;

        Tessellator.begin(GL11.GL_QUADS, false);
        Tessellator.colorize(red, green, blue, alpha);

        Tessellator.translate(x, y, z)
            .pos(halfwx, 0, halfwz)
            .pos(halfwx, 0, -halfwz)
            .pos(-halfwx, 0, -halfwz)
            .pos(-halfwx, 0, halfwz)

            .pos(halfwx, h, halfwz)
            .pos(halfwx, h, -halfwz)
            .pos(-halfwx, h, -halfwz)
            .pos(-halfwx, h, halfwz)

            .pos(-halfwx, h, halfwz)
            .pos(-halfwx, h, -halfwz)
            .pos(-halfwx, 0, -halfwz)
            .pos(-halfwx, 0, halfwz)

            .pos(halfwx, h, halfwz)
            .pos(halfwx, h, -halfwz)
            .pos(halfwx, 0, -halfwz)
            .pos(halfwx, 0, halfwz)

            .pos(halfwx, h, -halfwz)
            .pos(-halfwx, h, -halfwz)
            .pos(-halfwx, 0, -halfwz)
            .pos(halfwx, 0, -halfwz)

            .pos(-halfwx, h, halfwz)
            .pos(halfwx, h, halfwz)
            .pos(halfwx, 0, halfwz)
            .pos(-halfwx, 0, halfwz)
            .draw();

        GlStateManager.func_179089_o(); // enableCull
        GlStateManager.func_179084_k(); // disableBlend
        GlStateManager.func_179132_a(true); // depthMask
        GlStateManager.func_179098_w(); // enableTexture2D
        if (phase) {
            GlStateManager.func_179126_j(); // enableDepth
        }

        Tessellator.popMatrix();
    };

    /**
     * Draws a box like baritone with the top and bottom going up and down smoothly
     * @param {number} x - X Coordinates
     * @param {number} y - Y Coordinates
     * @param {number} z - Z Coordinates
     * @param {number} w1 - Box Width in X direction
     * @param {number} h - Box Height
     * @param {number} w2 - Box Width in Z direction
     * @param {number} red - Box Color Red 0-1
     * @param {number} green - Box Color Green 0-1
     * @param {number} blue - Box Color Blue 0-1
     * @param {number} alpha - Box Color Alpha 0-1
     * @param {boolean} phase - Depth test disabled. True: See through walls
     * @param {number} [lineWidth=2.0] - The line width in float. if this parameter not pass, default is 2.0
     */

    static drawBaritoneEspBoxV2 = (x, y, z, w1, h, w2, red, green, blue, alpha, phase, lineWidth) => {
        Tessellator.pushMatrix();
        if (!lineWidth) lineWidth = 2.0;
        GL11.glLineWidth(lineWidth);
        GlStateManager.func_179129_p(); // disableCullFace
        GlStateManager.func_179147_l(); // enableBlend
        GlStateManager.func_179112_b(770, 771); // blendFunc
        GlStateManager.func_179132_a(false); // depthMask
        GlStateManager.func_179090_x(); // disableTexture2D

        if (phase) {
            GlStateManager.func_179097_i(); // disableDepth
        }

        let th = h / 2 + Math.cos((((java.lang.System.nanoTime() / 100000) % 20000) / 20000) * Math.PI * 2) / (2 / h);
        let bh = h / 2 + Math.cos((((java.lang.System.nanoTime() / 100000) % 20000) / 20000) * Math.PI * 2) / -(2 / h);

        const halfW1 = w1 / 2;
        const halfW2 = w2 / 2;

        const locations = [
            [
                [halfW1, th, halfW2],
                [halfW1, th, -halfW2],
            ],
            [
                [halfW1, th, -halfW2],
                [-halfW1, th, -halfW2],
            ],
            [
                [-halfW1, th, -halfW2],
                [-halfW1, th, halfW2],
            ],
            [
                [-halfW1, th, halfW2],
                [halfW1, th, halfW2],
            ],
            [
                [halfW1, bh, halfW2],
                [halfW1, bh, -halfW2],
            ],
            [
                [halfW1, bh, -halfW2],
                [-halfW1, bh, -halfW2],
            ],
            [
                [-halfW1, bh, -halfW2],
                [-halfW1, bh, halfW2],
            ],
            [
                [-halfW1, bh, halfW2],
                [halfW1, bh, halfW2],
            ],
            [
                [halfW1, th, halfW2],
                [halfW1, bh, halfW2],
            ],
            [
                [halfW1, th, -halfW2],
                [halfW1, bh, -halfW2],
            ],
            [
                [-halfW1, th, -halfW2],
                [-halfW1, bh, -halfW2],
            ],
            [
                [-halfW1, th, halfW2],
                [-halfW1, bh, halfW2],
            ],
        ];

        locations.forEach((loc) => {
            Tessellator.begin(3).colorize(red, green, blue, alpha);

            Tessellator.pos(x + loc[0][0], y + loc[0][1], z + loc[0][2]).tex(0, 0);

            Tessellator.pos(x + loc[1][0], y + loc[1][1], z + loc[1][2]).tex(0, 0);

            Tessellator.draw();
        });

        GlStateManager.func_179089_o(); // enableCull
        GlStateManager.func_179084_k(); // disableBlend
        GlStateManager.func_179132_a(true); // depthMask
        GlStateManager.func_179098_w(); // enableTexture2D
        if (phase) {
            GlStateManager.func_179126_j(); // enableDepth
        }

        Tessellator.popMatrix();
    };

    /**
         * Draws the filled sides of a box like baritone with the top and bottom going up and down smoothly
         * @param {number} x - X Coordinates
         * @param {number} y - Y Coordinates
         * @param {number} z - Z Coordinates
         * @param {number} wx - Box Width in X direction
         * @param {number} h - Box Height
         * @param {number} wz - Box Width in Z direction
         * @param {number} red - Box Color Red 0-1
         * @param {number} green - Box Color Green 0-1
         * @param {number} blue - Box Color Blue 0-1
         * @param {number} alpha - Box Color Alpha 0-1
         * @param {boolean} phase - Depth test disabled. True: See through walls
         */
    static drawInnerBaritoneEspBoxV2 = (x, y, z, wx, h, wz, red, green, blue, alpha, phase) => {
        Tessellator.pushMatrix();
        GL11.glLineWidth(2.0);
        GlStateManager.func_179129_p(); // disableCullFace
        GlStateManager.func_179147_l(); // enableBlend
        GlStateManager.func_179112_b(770, 771); // blendFunc
        GlStateManager.func_179132_a(false); // depthMask
        GlStateManager.func_179090_x(); // disableTexture2D

        if (phase) {
            GlStateManager.func_179097_i(); // disableDepth
        }

        let th = h / 2 + Math.cos((((java.lang.System.nanoTime() / 100000) % 20000) / 20000) * Math.PI * 2) / (2 / h);
        let bh = h / 2 + Math.cos((((java.lang.System.nanoTime() / 100000) % 20000) / 20000) * Math.PI * 2) / -(2 / h);

        const halfwx = wx / 2;
        const halfwz = wz / 2;

        Tessellator.begin(GL11.GL_QUADS, false);
        Tessellator.colorize(red, green, blue, alpha);

        Tessellator.translate(x, y, z)
            .pos(halfwx, th, halfwz)
            .pos(halfwx, th, -halfwz)
            .pos(-halfwx, th, -halfwz)
            .pos(-halfwx, th, halfwz)

            .pos(halfwx, bh, halfwz)
            .pos(halfwx, bh, -halfwz)
            .pos(-halfwx, bh, -halfwz)
            .pos(-halfwx, bh, halfwz)

            .pos(-halfwx, bh, halfwz)
            .pos(-halfwx, bh, -halfwz)
            .pos(-halfwx, th, -halfwz)
            .pos(-halfwx, th, halfwz)

            .pos(halfwx, bh, halfwz)
            .pos(halfwx, bh, -halfwz)
            .pos(halfwx, th, -halfwz)
            .pos(halfwx, th, halfwz)

            .pos(halfwx, bh, -halfwz)
            .pos(-halfwx, bh, -halfwz)
            .pos(-halfwx, th, -halfwz)
            .pos(halfwx, th, -halfwz)

            .pos(-halfwx, bh, halfwz)
            .pos(halfwx, bh, halfwz)
            .pos(halfwx, th, halfwz)
            .pos(-halfwx, th, halfwz)
            .draw();

        GlStateManager.func_179089_o(); // enableCull
        GlStateManager.func_179084_k(); // disableBlend
        GlStateManager.func_179132_a(true); // depthMask
        GlStateManager.func_179098_w(); // enableTexture2D
        if (phase) {
            GlStateManager.func_179126_j(); // enableDepth
        }

        Tessellator.popMatrix();
    };

    /**
         * Draws a line between 2 coordinates
         * @param {number} x1 - X Coordinates of first position
         * @param {number} y1 - Y Coordinates of first position
         * @param {number} z1 - Z Coordinates of first position
         * @param {number} x2 - X Coordinates of second position
         * @param {number} y2 - Y Coordinates of second position
         * @param {number} z2 - Z Coordinates of second position
         * @param {number} red - Line Color Red 0-1
         * @param {number} green - Line Color Green 0-1
         * @param {number} blue - Line Color Blue 0-1
         * @param {number} alpha - Line Color Alpha 0-1
         * @param {boolean} phase - Depth test disabled. True: See through walls
         * @param {number} [lineWidth=2.0] - The line width in float. if this parameter not pass, default is 2.0
         */
    static drawLine = (x1, y1, z1, x2, y2, z2, red, green, blue, alpha, phase, lineWidth) => {
        if (!lineWidth) lineWidth = 2.0;
        GlStateManager.func_179094_E(); // pushMatrix
        GL11.glLineWidth(lineWidth);
        GL11.glDisable(GL11.GL_CULL_FACE); // disableCullFace
        GL11.glEnable(GL11.GL_BLEND); // enableBlend
        GL11.glBlendFunc(770, 771); // blendFunc
        GL11.glDisable(GL11.GL_TEXTURE_2D); // disableTexture2D
        GL11.glDepthMask(false); // depthMask

        if (phase) {
            GL11.glDisable(GL11.GL_DEPTH_TEST); // disableDepth
        }

        Tessellator.begin(3)
            .colorize(red, green, blue, alpha)
            .pos(x1, y1, z1)
            .pos(x2, y2, z2)
            .draw();


        GL11.glEnable(GL11.GL_CULL_FACE); // enableCull
        GL11.glDisable(GL11.GL_BLEND); // disableBlend
        GL11.glDepthMask(true); // depthMask
        GL11.glEnable(GL11.GL_TEXTURE_2D); // enableTexture2D
        if (phase) {
            GL11.glEnable(GL11.GL_DEPTH_TEST); // enableDepth
        }

        GlStateManager.func_179121_F(); // popMatrix
    };

    /**
         * Calculate the box render parameter by providing 2 coordinates
         * @param {number} x1 - X Coordinates of first position
         * @param {number} y1 - Y Coordinates of first position
         * @param {number} z1 - Z Coordinates of first position
         * @param {number} x2 - X Coordinates of second position
         * @param {number} y2 - Y Coordinates of second position
         * @param {number} z2 - Z Coordinates of second position
         * 
         * @returns {Object} An object containing center coordinates and dimensions.
         * - `cx`: The x-coordinate of the center of the box.
         * - `cy`: The y-coordinate of the center of the box, taken as the lower of the two y-coordinates provided.
         * - `cz`: The z-coordinate of the center of the box.
         * - `wx`: The width of the box in the x-direction.
         * - `h`: The height of the box.
         * - `wz`: The width of the box in the z-direction.
         */
    static calculateCenter = (x1, y1, z1, x2, y2, z2) => {
        // Calculate center point
        const cx = (x1 + x2) / 2;
        const cy = y1 > y2 ? y2 : y1;
        const cz = (z1 + z2) / 2;

        // Calculate width in X, Y, and Z directions
        const wx = Math.abs(x2 - x1);
        const h = Math.abs(y2 - y1);
        const wz = Math.abs(z2 - z1);
        return { cx, cy, cz, wx, h, wz };
    };

    /**
         * Retrieves the RGBA values of the provided color object.
         * @param {Object|string|Array} color - The color to be retrieved. Alpha default is 1, It can be one of the following types:
         * - Java.type("java.awt.Color")
         * - string representation of a color (e.g., "#RRGGBB" or "#RRGGBBAA")
         * - Array of color [r, g, b, a] or [r, g, b]. (In the range 0 to 255)
         *
         * @returns {Object} An object containing the RGBA values of the color.
         * - `red`: The red component of the color in the range 0 to 1.
         * - `green`: The green component of the color in the range 0 to 1.
         * - `blue`: The blue component of the color in the range 0 to 1.
         * - `alpha`: The alpha (opacity) component of the color in the range 0 to 1.
         */
    static getColor = (color) => {
        if (typeof color === 'string') {
            color = parseColorString(color);
        } else if (Array.isArray(color)) {
            color = parseColorArray(color);
        } else if (!(color instanceof Java.type("java.awt.Color"))) {
            throw new Error(`Invalid color array format: ${color}`);
        }

        const red = color.getRed() / 255;
        const green = color.getGreen() / 255;
        const blue = color.getBlue() / 255;
        const alpha = color.getAlpha() / 255;

        return { red, green, blue, alpha };
    };
}
