import { Elysia } from 'elysia';

const app = new Elysia()
  .get('/', () => {
    return { 
      message: 'PR on Blast! Worker is running! 🚀',
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
  })
  .get('/health', () => {
    return { status: 'ok', service: 'pr-blast-worker' };
  })
  .ws('/ws', {
    open: (ws) => {
      console.log('WebSocket connection opened');
      ws.send(JSON.stringify({ 
        type: 'connected', 
        message: 'Connected to PR on Blast! AI Worker' 
      }));
    },
    message: async (ws, message) => {
      try {
        console.log('Received message:', message);
        const data = JSON.parse(message.toString());
        
        // Send acknowledgment
        ws.send(JSON.stringify({
          type: 'received',
          message: 'Message received, processing...',
          data: data
        }));
        
        // Simulate processing
        setTimeout(() => {
          ws.send(JSON.stringify({
            type: 'analysis_complete',
            data: {
              journalists: [
                {
                  id: 'test-1',
                  name: 'Test Journalist',
                  outlet: 'Tech News Daily',
                  email: 'test@technews.com',
                  beat: ['technology', 'startups'],
                  recentArticles: ['Sample Article 1', 'Sample Article 2'],
                  contactInfo: {
                    email: 'test@technews.com',
                    twitter: 'https://twitter.com/testjournalist'
                  },
                  enrichmentScore: 85
                }
              ],
              pitches: [
                {
                  journalistId: 'test-1',
                  subject: 'Test Pitch Subject',
                  emailBody: 'This is a test pitch email body.',
                  personalizedElements: ['Recent article reference'],
                  confidence: 85
                }
              ],
              timestamp: new Date().toISOString()
            }
          }));
        }, 3000);
        
      } catch (error) {
        console.error('Error processing message:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process message'
        }));
      }
    },
    close: () => {
      console.log('WebSocket connection closed');
    }
  })
  .listen(process.env.PORT || 3001);

console.log(`🚀 PR on Blast! Worker running on port ${app.server?.port}`);
console.log(`📡 WebSocket endpoint: ws://localhost:${app.server?.port}/ws`);