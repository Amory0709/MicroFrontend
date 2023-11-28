import{ getApps} from './index';

export async function handleRoute() {
    const apps = getApps();

    const app =apps.find(app => window.location.pathname.startsWith(app.activeRule));

    if(!app) return;

    // load
    const html = await fetchRes(app.entry);
    const template = document.createElement('div');
    const container = document.getElementById('subapp-container');
    container.innerHTML = html;

    const scripts = html.querySelectorAll('script');
    const links = html.querySelectorAll('link');

    // after loading, js not exeuted
    // get scripts and execute the scripts
    const res = await execScript();

    async function getExternalScripts(){
        return Promise.all(Array.from(scripts).map(script => {
            const src = script.getAttribute('src');
            if(src) {
                return fetchRes(src.startsWith('http') ? src : `${app.entry}${src}`)
            } else {
                return Promise.resolve(script.innerHTML);
            }
        }));
    }

    async function execScript() {
        const scripts = await getExternalScripts();
        for( const code of scripts) {
            eval(code);
        }
    }

    async function fetchRes(url) {
        const res = await fetch(url);
        return res.next();
    }
}