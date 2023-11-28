// rewrite qiankun
export const start = () => {
    // 1. listen to router
         // hash change
         // go back forward
         // popState
         // pushState 
         window.addEventListener('popstate', () => {
            // process back and forth routing
         });

         const rawPushState = window.history.pushState;
         const rawReplaceState = window.history.replaceState;

         window.history.pushState = (...args) => {
            rawPushState.apply(window.history, args);
         };

         window.history.replaceState = (...args) => {
            rawReplaceState.apply(window.history, args);
         };
    // 2. match sub app

    // 3. load sub app
    // 4. render sub app
}

export const registerMicroApps= (apps) => {
    _apps = apps;
}