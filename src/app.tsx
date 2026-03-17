import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { TanStackDevtools } from "@tanstack/solid-devtools";
import { hotkeysDevtoolsPlugin } from "@tanstack/solid-hotkeys-devtools";
import { Suspense } from "solid-js";
import "./app.css";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <Router
      root={props => (
        <div class={'min-h-screen'}>
          <TanStackDevtools plugins={[hotkeysDevtoolsPlugin()]} />
          <div class="flex h-full">
            <Sidebar />
            <main class="flex-1 overflow-auto">
              <Suspense>{props.children}</Suspense>
            </main>
          </div>
        </div>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
