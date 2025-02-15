let blockedSites = [];
const RULE_ID_START = 1;

async function updateBlockRules() {
    const rules = blockedSites.map((site, index) => ({
        id: RULE_ID_START + index,
        priority: 1,
        action: { 
            type: "redirect",
            redirect: { extensionPath: "/blocked.html" }
        },
        condition: {
            urlFilter: site,
            resourceTypes: ["main_frame"]
        }
    }));

    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: Array.from(
            { length: blockedSites.length },
            (_, i) => RULE_ID_START + i
        ),
        addRules: rules
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "addSite") {
        chrome.storage.local.get(['blockedSites'], async function(result) {
            blockedSites = result.blockedSites || [];
            if (!blockedSites.includes(request.site)) {
                blockedSites.push(request.site);
                await chrome.storage.local.set({ blockedSites });
                await updateBlockRules();
            }
            sendResponse({ success: true });
        });
        return true;
    } 
    else if (request.action === "removeSite") {
        chrome.storage.local.get(['blockedSites'], async function(result) {
            blockedSites = (result.blockedSites || []).filter(site => site !== request.site);
            await chrome.storage.local.set({ blockedSites });
            await updateBlockRules();
            sendResponse({ success: true });
        });
        return true;
    }
    else if (request.action === "getSites") {
        chrome.storage.local.get(['blockedSites'], function(result) {
            sendResponse({ sites: result.blockedSites || [] });
        });
        return true;
    }
});

// Rules from storage
chrome.storage.local.get(['blockedSites'], function(result) {
    blockedSites = result.blockedSites || [];
    updateBlockRules();
});
