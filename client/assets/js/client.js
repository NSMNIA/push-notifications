const publicVapidKey = "BDqQWzFa9U44rdNeurzNf2NxHS-4_fZBxVkgw8QB0pOg6MaRjyMdSfAOJ5toxhQhPHVppkqtbvd7k0zwBLBycpI";

const initServiceWorker = async () => {
    const register = await navigator.serviceWorker.register("../../worker.js", {
        scope: "/"
    });
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    })

    document.querySelector('button#subscribe')?.addEventListener('click', () => {
        Notification.requestPermission().then(perm => {
            if (perm === 'granted') {
                fetch("/subscription/add", {
                    method: "POST",
                    body: JSON.stringify(subscription),
                    headers: {
                        "content-type": "application/json",
                        'charset': 'utf-8'
                    }
                }).catch(err => console.error(err));
            }
        });
    });
}

document.querySelector('#send_notification')?.addEventListener('submit', e => {
    e.preventDefault();
    let title = document.querySelector(`input[name="title"]`).value;
    let message = document.querySelector(`input[name="message"]`).value;
    fetch("/notification", {
        method: "POST",
        body: JSON.stringify({ title, message }),
        headers: {
            "content-type": "application/json",
            'charset': 'utf-8'
        }
    }).catch(err => console.error(err));
})

if ("serviceWorker" in navigator) {
    initServiceWorker();
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}