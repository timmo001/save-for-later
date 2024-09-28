import { Save } from "lucide-react";
import { z } from "zod";

import "./style.css";

import { ThemeProvider } from "~/entrypoints/popup/components/theme-provider";
import { Button } from "~/entrypoints/popup/components/ui/button";
import { Separator } from "~/entrypoints/popup/components/ui/separator";

const SavedItemSchema = z.object({
  id: z.string(),
  position: z.number(),
  url: z.string(),
});

type SavedItem = z.infer<typeof SavedItemSchema>;

const savedItems: Array<SavedItem> = [
  {
    id: "1",
    position: 0,
    url: "https://timmo.dev",
  },
  {
    id: "2",
    position: 1,
    url: "https://vitejs.dev",
  },
];

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <main className="w-[320px] bg-gradient-to-b from-slate-400 to-white p-6 dark:from-slate-950 dark:to-black">
        <h1 className="w-full text-2xl font-semibold tracking-tight text-center text-nowrap text-primary">
          Save for Later
        </h1>
        <p className="w-full text-sm text-center">
          Save articles, videos, and more to view later.
        </p>

        <section className="flex flex-row justify-center mt-6">
          <Button variant="default">
            <Save size={16} className="mr-2" />
            Save for later
          </Button>
        </section>
        <Separator className="w-full my-6" />

        <section className="flex flex-col items-center">
          <h2 className="text-lg font-semibold text-primary">Saved Items</h2>
          {savedItems.length < 1 ? (
            <p className="text-sm text-center">You have no saved items.</p>
          ) : (
            <ul className="w-full mt-6">
              {savedItems.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-row items-center justify-between p-2 rounded-md bg-slate-300 dark:bg-slate-950"
                >
                  <p className="text-sm">
                    <a
                      href={item.url}
                      referrerPolicy="no-referrer"
                      target="_blank"
                    >
                      {item.url}
                    </a>
                  </p>
                  <Button variant="default" size="sm">
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </ThemeProvider>
  );
}

export default App;
