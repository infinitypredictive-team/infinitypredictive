import { useCallback, useEffect, useRef } from 'react';

interface WebSocketMessage {
  type: string;
  channel: string;
  data: any;
  timestamp: number;
}

interface SubscriptionCallback {
  (data: any): void;
}

interface Subscription {
  channel: string;
  callback: SubscriptionCallback;
  id: string;
}

class WebSocketClient {
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, Subscription[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000; // Start with 1s
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private isConnected = false;

  constructor(private url: string) {
    this.connect();
  }

  private connect() {
    if (this.isConnecting || this.isConnected) return;
    
    this.isConnecting = true;
    
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        this.startHeartbeat();
        this.resubscribeAll();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.isConnecting = false;
        this.stopHeartbeat();
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
        this.isConnecting = false;
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    // Exponential backoff with jitter
    const jitter = Math.random() * 1000;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts) + jitter, 30000);
    
    setTimeout(() => {
      this.reconnectAttempts++;
      console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      this.connect();
    }, delay);
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // 30s heartbeat
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private resubscribeAll() {
    // Re-send all subscription messages
    for (const [channel, subs] of this.subscriptions) {
      if (subs.length > 0) {
        this.sendSubscription(channel, true);
      }
    }
  }

  private handleMessage(message: WebSocketMessage) {
    if (message.type === 'pong') {
      // Heartbeat response
      return;
    }

    const channelSubs = this.subscriptions.get(message.channel);
    if (channelSubs) {
      channelSubs.forEach(sub => {
        try {
          sub.callback(message.data);
        } catch (error) {
          console.error('Subscription callback error:', error);
        }
      });
    }
  }

  private sendSubscription(channel: string, subscribe: boolean) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: subscribe ? 'subscribe' : 'unsubscribe',
        channel,
        timestamp: Date.now(),
      }));
    }
  }

  subscribe(channel: string, callback: SubscriptionCallback): () => void {
    const id = Math.random().toString(36).substring(7);
    const subscription: Subscription = { channel, callback, id };

    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, []);
      // Send subscription message if connected
      this.sendSubscription(channel, true);
    }

    this.subscriptions.get(channel)!.push(subscription);

    // Return unsubscribe function
    return () => {
      const channelSubs = this.subscriptions.get(channel);
      if (channelSubs) {
        const index = channelSubs.findIndex(sub => sub.id === id);
        if (index >= 0) {
          channelSubs.splice(index, 1);
          
          // If no more subscribers, unsubscribe from channel
          if (channelSubs.length === 0) {
            this.subscriptions.delete(channel);
            this.sendSubscription(channel, false);
          }
        }
      }
    };
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscriptions.clear();
    this.isConnected = false;
    this.isConnecting = false;
  }
}

// Global WebSocket client instance
let wsClient: WebSocketClient | null = null;
let sseSource: EventSource | null = null;

function getWebSocketClient(): WebSocketClient {
  if (!wsClient) {
    const useSse = String((import.meta as any)?.env?.VITE_USE_SSE || '').toLowerCase() === 'true';
    if (useSse && typeof window !== 'undefined' && 'EventSource' in window) {
      // Initialize SSE as an alternative transport
      const sseUrl = (import.meta as any)?.env?.VITE_AZURO_SSE_URL || `${(location.origin)}/sse`;
      try {
        sseSource = new EventSource(sseUrl as string);
        // Bridge SSE messages into the subscription system using a lightweight WS shim
        const bridge = new WebSocketClient('');
        // Override connect-related behavior for SSE bridge
        // @ts-expect-error - private access for adaptation
        bridge.connect = () => {};
        // @ts-expect-error - mark connected
        bridge.isConnected = true;
        sseSource.onmessage = (ev: MessageEvent) => {
          try {
            const msg = JSON.parse(ev.data);
            // @ts-expect-error - call private message handler
            bridge.handleMessage(msg);
          } catch {}
        };
        // @ts-expect-error
        wsClient = bridge;
      } catch {
        const wsUrl = (import.meta as any)?.env?.VITE_AZURO_WS_URL || 'wss://api.azuro.org/ws';
        wsClient = new WebSocketClient(wsUrl as string);
      }
    } else {
      const wsUrl = (import.meta as any)?.env?.VITE_AZURO_WS_URL || 'wss://api.azuro.org/ws';
      wsClient = new WebSocketClient(wsUrl as string);
    }
  }
  return wsClient;
}

// React hook for WebSocket subscriptions
export function useSubscriptions() {
  const clientRef = useRef<WebSocketClient>();

  useEffect(() => {
    clientRef.current = getWebSocketClient();
    
    return () => {
      // Don't disconnect on unmount as other components might be using it
      // The client will manage its own lifecycle
    };
  }, []);

  const subscribe = useCallback((channel: string, callback: SubscriptionCallback) => {
    if (!clientRef.current) {
      clientRef.current = getWebSocketClient();
    }
    return clientRef.current.subscribe(channel, callback);
  }, []);

  const unsubscribe = useCallback((unsubscribeFn: () => void) => {
    unsubscribeFn();
  }, []);

  return { subscribe, unsubscribe };
}

// Cleanup on app unmount
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (wsClient) {
      wsClient.disconnect();
    }
    if (sseSource) {
      try { sseSource.close(); } catch {}
      sseSource = null;
    }
  });
}