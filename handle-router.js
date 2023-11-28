import{ getApps} from './index';

export async function handleRoute() {
    const apps = getApps();

    const app =apps.find(app => window.location.pathname.startsWith(app.activeRule));

    if(!app) return;

    // load
    const html = await fetchRes(app.entry);
    const container = document.getElementById('subapp-container');
    container.innerHTML = html;
    // after loading, js not exeuted
    async function fetchRes(url) {
        const res = await fetch(url);
        return res.next();
    }
}