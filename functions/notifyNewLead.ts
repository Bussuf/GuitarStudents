import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const WEBHOOK_URL = 'https://hook.eu1.make.com/45o0jplqjoohlbtkaoxndkvk4ko2lg7p';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leadData } = await req.json();

    // Send lead data to external webhook
    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lead: leadData,
        timestamp: new Date().toISOString(),
        app_user: user.email
      })
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook failed: ${webhookResponse.statusText}`);
    }

    return Response.json({ 
      success: true,
      message: 'Lead notification sent successfully'
    });

  } catch (error) {
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});