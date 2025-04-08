// plugins/unregister-sw.client.js
export default defineNuxtPlugin(() => {
  if (process.client && "serviceWorker" in navigator) {
    // Unregister all existing service workers
    navigator.serviceWorker
      .getRegistrations()
      .then(function (registrations) {
        for (let registration of registrations) {
          console.log("Unregistering service worker:", registration)
          registration.unregister()
        }

        // Optionally register the self-destroying service worker
        navigator.serviceWorker.register("/unregister-sw.js")
      })
      .catch((error) => {
        console.error("Service worker unregistration failed:", error)
      })
  }
})
