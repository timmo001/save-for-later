import { storage } from "wxt/storage";
import { Link, Trash } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import "./style.css";

import { ThemeProvider } from "~/entrypoints/popup/components/theme-provider";
import { Button } from "~/entrypoints/popup/components/ui/button";
import { Separator } from "~/entrypoints/popup/components/ui/separator";

const SavedItemSchema = z.object({
  id: z.string(),
  url: z.string(),
});

type SavedItem = z.infer<typeof SavedItemSchema>;

function App() {
  const [savedItems, setSavedItems] = useState<Array<SavedItem>>();

  useEffect(() => {
    if (!savedItems)
      getSavedItems().then((items) => {
        if (items) {
          setSavedItems(items);
        } else {
          setSavedItems([]);
        }
      });

    const unwatch = storage.watch<Array<SavedItem>>(
      "sync:savedItems",
      (newItems, oldItems) => {
        console.log("Items changed:", { newItems, oldItems });
        if (newItems) {
          setSavedItems(newItems);
        }
      },
    );

    return () => {
      unwatch();
    };
  }, []);

  async function getSavedItems() {
    return await storage.getItem<Array<SavedItem>>("sync:savedItems");
  }

  async function saveItem(item: SavedItem) {
    if (!savedItems) {
      await storage.setItem("sync:savedItems", [item]);
      // setSavedItems([item]);
      return;
    }

    const newSavedItems = [...savedItems, item];
    // setSavedItems(newSavedItems);
    await storage.setItem("sync:savedItems", newSavedItems);
  }

  async function deleteItem(item: SavedItem) {
    if (!savedItems) {
      return;
    }

    const newSavedItems = savedItems.filter(
      (savedItem) => savedItem.id !== item.id,
    );
    // setSavedItems(newSavedItems);
    await storage.setItem("sync:savedItems", newSavedItems);
  }

  return (
    <ThemeProvider defaultTheme="system">
      <main className="flex w-[320px] max-w-[420px] flex-col items-center justify-center bg-gradient-to-b from-slate-400 to-white p-6 dark:from-slate-950 dark:to-black">
        <svg
          className="w-1/3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          version="1.1"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
            stroke="#6366f1"
          />
          <path
            d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
            stroke="#8b5cf6"
          />
        </svg>
        <h1 className="w-full mt-2 text-2xl font-semibold tracking-tight text-center text-nowrap text-primary">
          Save for Later
        </h1>
        <p className="w-full text-sm text-center">
          Save articles, videos, and more to view later.
        </p>

        <section className="flex flex-row justify-center mt-6">
          <Button
            variant="default"
            onClick={() => {
              // Get the browser tab URL and save it
              browser.tabs
                .query({
                  active: true,
                  currentWindow: true,
                })
                .then(([currentTab]) => {
                  if (!currentTab) {
                    console.warn("Cannot find currentTab:", currentTab);
                    return;
                  }

                  if (!currentTab.url) {
                    console.warn("Cannot find currentTab url:", currentTab);
                    return;
                  }

                  saveItem({
                    id: uuidv4(),
                    url: currentTab.url,
                  });
                });
            }}
          >
            <Link size={16} className="mr-2" />
            Save for later
          </Button>
        </section>
        <Separator className="w-full my-6" />

        <section className="flex flex-col items-center w-full">
          <h2 className="text-lg font-semibold text-primary">Saved Items</h2>
          {savedItems && savedItems.length > 0 ? (
            <div className="w-full mt-6">
              {savedItems.map((item, index) => (
                <>
                  <div
                    key={index}
                    className="flex flex-row items-center justify-between w-full p-2 my-1 rounded-xl bg-slate-300 dark:bg-slate-950"
                  >
                    <a
                      className="flex-1 ml-1 text-sm"
                      href={item.url}
                      referrerPolicy="no-referrer"
                      target="_blank"
                    >
                      {item.url}
                    </a>
                    <Button
                      className="ml-2"
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        deleteItem(item);
                      }}
                    >
                      <Trash size={12} />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </>
              ))}
            </div>
          ) : (
            <p className="text-sm text-center">You have no saved items.</p>
          )}
        </section>
      </main>
    </ThemeProvider>
  );
}

export default App;
