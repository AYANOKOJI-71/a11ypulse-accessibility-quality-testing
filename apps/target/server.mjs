import { createServer } from "node:http";

const port = Number.parseInt(process.env.PORT ?? "5300", 10);

const needsWorkPage = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: Arial, sans-serif; margin: 2rem; background: #ffffff; color: #777777; }
      .quiet { color: #aaaaaa; }
      .focus-button:focus { outline: none; }
    </style>
  </head>
  <body>
    <header><a href="#"></a></header>
    <h3>Checkout growth workspace</h3>
    <p class="quiet">Review the account workspace and product metrics.</p>
    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='120'%3E%3Crect width='100%25' height='100%25' fill='%23e8eef7'/%3E%3C/svg%3E" />
    <form>
      <input id="customer-email" type="email" placeholder="Work email" />
      <button class="focus-button" type="submit"></button>
    </form>
    <button id="action">Continue</button><input id="action" type="text" value="duplicate id" />
  </body>
</html>`;

const reviewedBaselinePage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Northstar Commerce — Account overview</title>
    <style>
      :root { color-scheme: light; }
      body { max-width: 68rem; margin: 0 auto; padding: 2rem; font-family: system-ui, sans-serif; background: #f6f8fb; color: #16233a; line-height: 1.5; }
      a { color: #124e9e; }
      a:focus-visible, button:focus-visible, input:focus-visible { outline: 3px solid #cc4a00; outline-offset: 3px; }
      .skip-link { position: absolute; left: -9999px; top: auto; }
      .skip-link:focus { left: 1rem; top: 1rem; padding: .5rem .75rem; background: #ffffff; }
      .panel { background: #ffffff; border: 1px solid #c8d3e2; border-radius: .75rem; padding: 1.5rem; }
      label, input { display: block; }
      input { margin: .4rem 0 1rem; padding: .6rem; width: min(100%, 28rem); }
      button { padding: .65rem 1rem; background: #124e9e; color: #ffffff; border: 0; border-radius: .35rem; }
    </style>
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <header><nav aria-label="Primary"><a href="#overview">Overview</a> · <a href="#billing">Billing</a></nav></header>
    <main id="main-content" tabindex="-1">
      <h1 id="overview">Account overview</h1>
      <section class="panel" aria-labelledby="subscription-heading">
        <h2 id="subscription-heading">Subscription health</h2>
        <p>Your monthly account review is ready.</p>
        <form aria-label="Account notifications">
          <label for="email">Notification email</label>
          <input id="email" name="email" type="email" autocomplete="email" />
          <button type="submit">Save preferences</button>
        </form>
      </section>
    </main>
  </body>
</html>`;

createServer((request, response) => {
  const page = request.url === "/demo-needs-work" ? needsWorkPage : request.url === "/demo-reviewed-baseline" ? reviewedBaselinePage : null;
  if (!page) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("A11yPulse local target not found");
    return;
  }
  response.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
  response.end(page);
}).listen(port, "127.0.0.1", () => {
  console.log(`A11yPulse local target ready at http://127.0.0.1:${port}`);
});
