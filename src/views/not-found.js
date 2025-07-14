// Render the 404 "Not Found" view when the user navigates to an invalid route
export function renderNotFoundView() {
    const app = document.getElementById('app');

    // Inject a basic error message into the app container
    app.innerHTML = `
        <div class="not-found">
            <h1>404 — Page Not Found</h1>
            <p>The route you're trying to access does not exist.</p>
        </div>
    `;
}
