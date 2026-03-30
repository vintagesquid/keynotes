import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { TanStackDevtools } from "@tanstack/solid-devtools";
import { hotkeysDevtoolsPlugin } from "@tanstack/solid-hotkeys-devtools";
import { Suspense } from "solid-js";
import "./app.css";
import Sidebar from "./components/Sidebar";
import { schema } from "./zero/schema";
import { clientOnly } from "@solidjs/start";
import { mutators } from "./zero/mutators";

const ZeroProvider = clientOnly(async () => {
  return import("@rocicorp/zero/solid").then((mod) => ({
    default: mod.ZeroProvider,
  }));
});

export default function App() {
  return (
    <ZeroProvider
      userID="anon"
      cacheURL="http://localhost:4848"
      schema={schema}
      mutators={mutators}
    >
      <Router
        root={(props) => (
          <div class={"min-h-screen"}>
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
    </ZeroProvider>
  );
}
