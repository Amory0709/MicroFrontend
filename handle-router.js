import { getApps } from './index';

export async function handleRoute() {
    const apps = getApps();

    const app = apps.find(app => window.location.pathname.startsWith(app.activeRule));

    if (!app) return;

    // load
    const html = await fetchRes(app.entry);
    const template = document.createElement('div');
    const container = document.getElementById('subapp-container');
    template.innerHTML = html;

    container.appendChild(template);

    const scripts = html.querySelectorAll('script');
    const links = html.querySelectorAll('link');

    // after loading, js not exeuted
    // get scripts and execute the scripts
    const { bootstrap, mount, unmount } = await execScript();
    app.bootstrap = bootstrap;
    app.mount = mount;
    app.unmount = unmount;

    // get the lifecycle methods of sub app
    // subapp expose lifecycle methods by umd(webpack universal module definition)
    // windows['vue-app'] can also get methods

    async function getExternalScripts() {
        return Promise.all(Array.from(scripts).map(script => {
            const src = script.getAttribute('src');
            if (src) {
                return fetchRes(src.startsWith('http') ? src : `${app.entry}/${src}`)
            } else {
                return Promise.resolve(script.innerHTML);
            }
        }));
    }

    async function getExternalLinks() {
        return Promise.all(Array.from(links).map(script => {
            const href = script.getAttribute('href');
            if (href) {
                return fetchRes(href.startsWith('http') ? href : `${app.entry}/${href}`)
            }
        }));
    }

    async function execScript() {
        const scripts = await getExternalScripts();
        const links = await getExternalLinks();

        // some weird 
        const module = {
            exports: {},
        };
        const exports = module.exports;

        for (const code of scripts) {
            eval(code);
        }

        for (const code of links) {
            eval(code);
        }

        return module.exports;

        // can get subapp here
        //console.log(windows['vue-app'])
    }

    async function fetchRes(url) {
        const res = await fetch(url);
        return res.next();
    }
}