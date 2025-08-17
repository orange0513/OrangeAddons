/// <reference types="../../CTAutocomplete" />

/**
 * @typedef {import('../index.js').default} MainType
 */
export default class FileUtils {
    /**
     * @param {MainType} main
     */
    constructor(main) {
        this.main = main;
    }

    /**
     * @param {string} path
     * @returns {object}
     * @description Read a JSON file from the OrangeAddons folder.
     */
    readJSON(path) {
        if (!this.exists(path)) return null;
        return JSON.parse(FileLib.read("OrangeAddons", path));
    }
    
    /**
     * @param {string} path
     * @returns {string}
     * @description Read a file from the OrangeAddons folder.
     */
    read(path) {
        return FileLib.read("OrangeAddons", path);
    }

    /**
     * @param {string} path
     * @param {string} data
     * @description Write a file to the OrangeAddons folder.
     */
    write(path, data) {
        return FileLib.write("OrangeAddons", path, data);
    }

    /**
     * @param {string} path
     * @returns {boolean}
     * @description Check if a file exists in the OrangeAddons folder.
     */
    exists(path) {
        return FileLib.exists("OrangeAddons", path);
    }
}