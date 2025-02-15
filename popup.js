document.addEventListener('DOMContentLoaded', function() {
    const siteInput = document.getElementById('siteInput');
    const addButton = document.getElementById('addSite');
    const siteList = document.getElementById('siteList');

    function updateSiteList() {
        chrome.runtime.sendMessage({action: "getSites"}, function(response) {
            siteList.innerHTML = '';
            response.sites.forEach(site => {
                const div = document.createElement('div');
                div.className = 'site-item';
                div.innerHTML = `
                    <span>${site}</span>
                    <button class="remove-site" data-site="${site}">Remove</button>
                `;
                siteList.appendChild(div);
            });
        });
    }

    addButton.addEventListener('click', function() {
        const site = siteInput.value.trim();
        if (site) {
            chrome.runtime.sendMessage({
                action: "addSite",
                site: site
            }, () => {
                siteInput.value = '';
                updateSiteList();
            });
        }
    });

    siteList.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-site')) {
            const site = e.target.dataset.site;
            chrome.runtime.sendMessage({
                action: "removeSite",
                site: site
            }, () => {
                updateSiteList();
            });
        }
    });

    updateSiteList();
});