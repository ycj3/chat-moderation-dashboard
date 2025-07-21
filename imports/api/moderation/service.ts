import { IncomingMessage, ServerResponse } from 'http';
import { runModeration } from './engine';

export async function handleModerationWebhook(req: IncomingMessage & { body: any }, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end('Method Not Allowed');
    return;
  }

  try {
    const result = await runModeration(req.body);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } catch (err) {
    console.error('Webhook error:', err);
    res.writeHead(500);
    res.end('Internal Error');
  }
}
