import { ReactNode, useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import ChakraTree, { TreeItems } from "./components/tree/Chakra-Tree";
import { Box, Separator, Tabs } from "@chakra-ui/react";
import { CloseButton } from "./components/ui/close-button";
import "./App.css";
import Chart from "./components/chart/Chart";

interface Item {
    id: string
    title: string
    content: ReactNode
    items: TreeItems | null
}
const items: Item[] = [
]

function App() {
    const [tabs, setTabs] = useState<Item[]>(items);
    const [selectedTab, setSelectedTab] = useState<string | null>(null);

    useEffect(() => {
        // Listen for Rust create_tab function to execute
        listen<string>('create-tab', (event) => {
            addTab(event.payload);
        });
    }, []);

    const addTab = async (name: string) => {
        const newTabs = [...tabs];
        const uid = Math.random().toString(36).substring(2, 15);
        newTabs.push({
            id: uid,
            title: name,
            content: 'Tab Body',
            items: null
        });
        setTabs(newTabs);
        setSelectedTab(uid);
    };

    const removeTab = (id: string) => {
        const newTabs = tabs.filter((tab) => tab.id !== id);
        setTabs(newTabs);
        if (id === selectedTab && newTabs.length > 0) {
            setSelectedTab(newTabs[0].id);
        } else if (newTabs.length === 0) {
            setSelectedTab(null);
        }
    };

    const parseValues = (newItems: TreeItems, tabID: string) => {
        setTabs((currentTabs) =>
            currentTabs.map((item) =>
                item.id === tabID ? { ...item, items: newItems } : item
            )
        );
    };

    if (tabs.length === 0) {
        return (
            <Box
                bg="gray.900"
                h="100vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                gap={10}
            >
                <h1>TART MAIN WINDOW</h1>
                <h2>Tauri Analysis And Reporting Tool</h2>
            </Box>
        );
    }

    return (
        <Tabs.Root
            value={selectedTab}
            variant="line"
            size="sm"
            bg="gray.950"
            onValueChange={(e) => setSelectedTab(e.value)}
            height="100vh"
            display="flex"
            flexDirection="column"
        >
            <Tabs.List>
                {tabs.map((item) => (
                    <Tabs.Trigger value={item.id} key={item.id}>
                        {item.title}
                        <CloseButton
                            as="span"
                            role="button"
                            size="2xs"
                            me="-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeTab(item.id);
                            }}
                        />
                    </Tabs.Trigger>
                ))}
            </Tabs.List>

            <Tabs.ContentGroup flexGrow={1} display="flex">
                {tabs.map((tab) => (
                    <Tabs.Content value={tab.id} key={tab.id} padding={0} flexGrow={1} display="flex" w="100">
                        <ChakraTree onValueChange={(param: TreeItems) => parseValues(param, tab.id)} />
                        <Separator orientation="vertical" />
                        <Box flexGrow={1} display="flex" alignItems="center" justifyContent="center">
                            <Chart items={tab.items as any} />
                        </Box>
                    </Tabs.Content>
                ))}
            </Tabs.ContentGroup>
        </ Tabs.Root>
    );
}

export default App;



/*
<main className="container">
    <form className="row" onSubmit={(e) => { e.preventDefault(); greet(); }}>
        <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
    </form>
    <p>{greetMsg}</p>

    <div>
        <button>Notify Me</button>
        <p>tab name: {level}</p>
    </div>
</main>
*/