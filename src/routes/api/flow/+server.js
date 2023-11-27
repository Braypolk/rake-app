import fs from 'fs';
import { resolve } from 'path';

export async function POST({ request }) {
    try {
        let { flow, location } = await request.json();

        // Perform the file save operation here
        fs.writeFileSync(location, JSON.stringify(flow));

        return new Response(JSON.stringify({
            status: 200,
            body: { message: 'Flow saved successfully' }
        }));
    } catch (error) {
        console.error('Error saving flow:', error);

        return new Response(JSON.stringify({
            status: 500,
            body: { error: 'Failed to save flow' }
        }));
    }
}

// src/routes/api/restoreFlow.json.js

export async function GET({ url }) {
    try {
        const filePath = resolve(url.searchParams.get('location'));

        if (!fs.existsSync(filePath)) {
            return new Response(JSON.stringify({
                status: 200,
                body: { message: 'No flow data found' }
            }));
        }

        const fileData = fs.readFileSync(filePath, 'utf8');
        const flow = JSON.parse(fileData);

        if (flow) {
            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            const nodes = flow.nodes;
            const edges = flow.edges;

            return new Response(JSON.stringify({
                status: 200,
                body: {
                    message: 'Flow restored successfully',
                    flow: { x, y, zoom, nodes, edges }
                }
            }));
        } else {
            return new Response(JSON.stringify({
                status: 200,
                body: { message: 'No flow data found' }
            }));
        }
    } catch (error) {
        console.error('Error restoring flow:', error);

        return new Response(JSON.stringify({
            status: 500,
            body: { error: 'Failed to restore flow' }
        }));
    }
}