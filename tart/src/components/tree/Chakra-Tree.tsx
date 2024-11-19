import { Box, Stack } from "@chakra-ui/react"
import { MenuContextTrigger, MenuItem, MenuContent, MenuRoot } from "../ui/menu"
import { useState } from "react"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"

export type TreeItem = {
    label: string;
    checked: boolean;
    value: string;
}
export type TreeItems = { root: TreeItem[] }

const fuelValues: TreeItem[] = [
    { label: "Fuel Left", checked: false, value: "fuel" },
    { label: "Burn Rate", checked: false, value: "burn-rate" }
]
const altitudeValues: TreeItem[] = [
    { label: "Absolute Altitude", checked: false, value: "absolute-altitude" },
    { label: "Relative Altitude", checked: false, value: "relative-altitude" },
    { label: "Altitude Level", checked: false, value: "altitude-level" },
    { label: "Lift Off", checked: false, value: "lift-off" },
]

type CheckboxTreeParams = { title: string; values: any; setValues: any; }
function CheckboxTree({ title, values, setValues }: CheckboxTreeParams) {

    const allChecked = values.every((value: { checked: boolean }) => value.checked);
    const indeterminate = values.some((value: { checked: boolean }) => value.checked) && !allChecked;

    const openDetailsWindow = () => {
        console.log('opening window here');
        // Make a call to the backend lib.rs where the command creates a new window for the details
    }

    return (
        <Stack align="flex-start">
            <Checkbox
                checked={indeterminate ? "indeterminate" : allChecked}
                onCheckedChange={(e) => {
                    setValues((current: any[]) =>
                        current.map((value) => ({ ...value, checked: !!e.checked }))
                    );
                }}
            >
                {title}
            </Checkbox>
            {values.map((item: any, index: any) => (
                <MenuRoot key={index}>
                    <MenuContextTrigger w="full">
                        <Checkbox
                            ms={6}
                            w="100%"
                            key={item.value}
                            checked={item.checked}
                            onCheckedChange={(e) => {
                                setValues((current: any) => {
                                    const newValues = [...current];
                                    newValues[index] = { ...newValues[index], checked: !!e.checked };
                                    return newValues;
                                });
                            }}
                        >
                            {item.label}
                        </Checkbox>
                    </MenuContextTrigger>
                    <MenuContent>
                        <MenuItem value="new-txt" onClick={openDetailsWindow}>Details</MenuItem>
                    </MenuContent>
                </MenuRoot>
            ))}
        </Stack>
    );
}

type ChakraTreeParams = { onValueChange: Function }
function ChakraTree({ onValueChange }: ChakraTreeParams) {
    const [fuelCheckboxes, setFuelCheckboxes] = useState(fuelValues);
    const [altitudeCheckboxes, setAltitudeCheckboxes] = useState(altitudeValues);

    const testFunc = () => {
        const items = [fuelCheckboxes.filter(f => f.checked), altitudeCheckboxes.filter(a => a.checked)];
        onValueChange(items);
    }

    return (
        <Box minWidth={300} padding={5} display="flex" flexDirection="column" justifyContent="space-between">
            <Stack p={4}>
                <CheckboxTree title="Fuel" values={fuelCheckboxes} setValues={setFuelCheckboxes} />
                <CheckboxTree title="Altitude" values={altitudeCheckboxes} setValues={setAltitudeCheckboxes} />
            </Stack>
            <Button onClick={testFunc}>Parse</Button>
        </Box>
    )
}

export default ChakraTree;