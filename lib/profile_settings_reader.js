const kAw1PortraitsPrefix = "terrain/co-portraits/aw1/";
const kAw2PortraitsPrefix = "terrain/co-portraits/aw2/";
const kDsPortraitsPrefix = "terrain/co-portraits/ds/";
const kFallbackPortraitPrefix = "terrain/co-portraits/ds2/";
const kDsOnlyCOs = new Set(["rachel", "jake", "sasha", "grimm", "javier", "koal", "jugger", "kindle", "vonbolt"]);

class ProfileSettingsReader {
    constructor() {
        this.cachedProfileSettings = undefined;
        this.fetchedProfileSettings = undefined;
        this.listeners = [];

        this.initialStorageReadPromise = this.readProfileSettingsFromStorage();
        this.startAsyncProfileSettingsFetch();
    }

    static async instance() {
        let reader = _profileSettingsReaderSingleton;
        await reader.waitForReady();
        return reader;
    }

    async waitForReady() {
        if (this.cachedProfileSettings === undefined) {
            this.cachedProfileSettings = await this.initialStorageReadPromise;
        }
        return "";
    }

    addProfileSettingsUpdateListener(listener) {
        this.listeners.push(listener);
    }

    getCoPortraitURL(coName) {
        if (kDsOnlyCOs.has(coName))
            return kDsPortraitsPrefix + coName;
        return kAw2PortraitsPrefix + coName
    }

    // getCoPortraitsPrefix() {
    //     if (this.fetchedProfileSettings !== undefined) {
    //         return this.fetchedProfileSettings.settings_co_portraits_prefix;
    //     } else if (this.cachedProfileSettings !== undefined) {
    //         return this.cachedProfileSettings.cached_profile_settings_co_portraits_prefix;
    //     } else {
    //         reportError("Resorted to fallback co portraits prefix");
    //         return kFallbackPortraits;
    //     }
    //     return kFallbackPortraitPrefix;
    // }

    readProfileSettingsFromStorage() {
        // return new Promise((resolve, reject) => {
        //     chrome.storage.sync.get({
        //         cached_profile_settings_co_portraits_prefix: kFallbackPortraitPrefix,
        //     }, (cachedProfileSettings) => {
        //         console.log("Read cached settings from storage:", cachedProfileSettings);
        //         resolve(cachedProfileSettings);
        //     });
        // });
        // return kFallbackPortraitPrefix;
    }

    startAsyncProfileSettingsFetch() {
        fetchProfileSettings().then((settings) => {
            this.handleAsyncProfileSettingsFetch(settings);
        });
    }

    handleAsyncProfileSettingsFetch(parsedSettings) {
        this.fetchedProfileSettings = parsedSettings;
        // chrome.storage.sync.set({
        //     cached_profile_settings_co_portraits_prefix: parsedSettings.settings_co_portraits_prefix,
        // });


        for (let listener of this.listeners) {
            listener();
        }
    }
}
let _profileSettingsReaderSingleton = new ProfileSettingsReader();
