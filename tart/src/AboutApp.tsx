import { Box, Table } from "@chakra-ui/react";


function AboutApp() {
    return (
        <Box bg="gray.950">
            <Table.Root size="sm" variant="outline">
                <Table.ColumnGroup>
                    <Table.Column htmlWidth="75%" />
                    <Table.Column />
                </Table.ColumnGroup>

                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Software</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end">Version</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    <Table.Row key="tart">
                        <Table.Cell>TART</Table.Cell>
                        <Table.Cell textAlign="end">1.1.1.1r</Table.Cell>
                    </Table.Row>
                    <Table.Row key="config">
                        <Table.Cell>CONFIG</Table.Cell>
                        <Table.Cell textAlign="end">1.1.2.4</Table.Cell>
                    </Table.Row>
                    <Table.Row key="rust">
                        <Table.Cell>Rust</Table.Cell>
                        <Table.Cell textAlign="end">1.24.2</Table.Cell>
                    </Table.Row>
                    <Table.Row key="node">
                        <Table.Cell>Node</Table.Cell>
                        <Table.Cell textAlign="end">23.4.2</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table.Root>
        </Box>
    );
}

export default AboutApp;
