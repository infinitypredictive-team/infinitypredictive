import { z } from 'zod';

// Wallet connection schemas
export const WalletAccountSchema = z.object({
  address: z.string(),
  chainId: z.number(),
  network: z.string(),
  balance: z.number().optional(),
});

export const WalletStateSchema = z.object({
  connected: z.boolean(),
  connecting: z.boolean(),
  account: WalletAccountSchema.optional(),
  error: z.string().optional(),
});

export type WalletAccount = z.infer<typeof WalletAccountSchema>;
export type WalletState = z.infer<typeof WalletStateSchema>;

// Supported networks
export const SUPPORTED_NETWORKS = {
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    currency: 'MATIC',
  },
  gnosis: {
    chainId: 100,
    name: 'Gnosis Chain',
    rpcUrl: 'https://rpc.gnosischain.com',
    explorerUrl: 'https://gnosisscan.io',
    currency: 'XDAI',
  },
} as const;

export type SupportedNetwork = keyof typeof SUPPORTED_NETWORKS;

// Base wallet adapter interface
export interface WalletAdapter {
  name: string;
  icon: string;
  available: boolean;
  connect(): Promise<WalletAccount>;
  disconnect(): Promise<void>;
  getAccount(): Promise<WalletAccount | null>;
  switchNetwork(chainId: number): Promise<void>;
  signMessage(message: string): Promise<string>;
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;
}

// Demo adapter for environments without injected wallets
export class DemoAdapter implements WalletAdapter {
  name = 'Demo Wallet';
  icon = '🎛️';

  get available(): boolean {
    const allow = String((import.meta as any)?.env?.VITE_ALLOW_DEMO_WALLET ?? 'true').toLowerCase() !== 'false';
    return allow;
  }

  async connect(): Promise<WalletAccount> {
    const chainId = Number((import.meta as any)?.env?.VITE_CHAIN_ID) || SUPPORTED_NETWORKS.polygon.chainId;
    return {
      address: '0x1111111111111111111111111111111111111111',
      chainId,
      network: this.getNetworkName(chainId),
      balance: 0,
    };
  }

  async disconnect(): Promise<void> { }

  async getAccount(): Promise<WalletAccount | null> {
    return null;
  }

  async switchNetwork(_chainId: number): Promise<void> { }

  async signMessage(message: string): Promise<string> {
    return `demo-signature:${btoa(unescape(encodeURIComponent(message))).slice(0, 16)}`;
  }

  on(_event: string, _callback: (...args: any[]) => void): void { }
  off(_event: string, _callback: (...args: any[]) => void): void { }

  private getNetworkName(chainId: number): string {
    const network = Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === chainId);
    return network?.name || `Unknown (${chainId})`;
  }
}

// MetaMask adapter
export class MetaMaskAdapter implements WalletAdapter {
  name = 'MetaMask';
  icon = '🦊';
  
  get available(): boolean {
    // Accept any injected EVM provider to reduce false negatives (e.g., Brave, Coinbase Wallet)
    return typeof window !== 'undefined' && !!(window as any).ethereum;
  }

  private get ethereum() {
    const eth = (window as any).ethereum;
    // Handle multiple providers (MetaMask, Coinbase, Brave)
    if (eth?.providers && Array.isArray(eth.providers)) {
      const mm = eth.providers.find((p: any) => p?.isMetaMask);
      return mm || eth.providers[0];
    }
    return eth;
  }

  async connect(): Promise<WalletAccount> {
    if (!this.available) {
      throw new Error('No EVM wallet detected. Install MetaMask or enable your browser wallet (e.g., Brave Wallet).');
    }

    try {
      // Request account access
      const accounts = await this.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Get chain ID
      const chainId = await this.ethereum.request({
        method: 'eth_chainId',
      });

      const account: WalletAccount = {
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        network: this.getNetworkName(parseInt(chainId, 16)),
      };

      // Get balance
      try {
        const balance = await this.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        });
        account.balance = parseInt(balance, 16) / Math.pow(10, 18); // Convert wei to ETH
      } catch (error) {
        console.warn('Failed to fetch balance:', error);
      }

      return account;
    } catch (error: any) {
      if (error?.code === 4001) {
        throw new Error('Request rejected. Please approve the connection in your wallet.');
      }
      if (error?.code === -32002) {
        throw new Error('A connection request is already pending. Open your wallet extension and complete it.');
      }
      throw new Error(error?.message || 'Failed to connect to wallet');
    }
  }

  async disconnect(): Promise<void> {
    // MetaMask doesn't have a programmatic disconnect
    // Users need to disconnect from the extension
  }

  async getAccount(): Promise<WalletAccount | null> {
    if (!this.available) return null;

    try {
      const accounts = await this.ethereum.request({
        method: 'eth_accounts',
      });

      if (!accounts || accounts.length === 0) {
        return null;
      }

      const chainId = await this.ethereum.request({
        method: 'eth_chainId',
      });

      return {
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        network: this.getNetworkName(parseInt(chainId, 16)),
      };
    } catch (error) {
      console.error('Failed to get account:', error);
      return null;
    }
  }

  async switchNetwork(chainId: number): Promise<void> {
    if (!this.available) {
      throw new Error('MetaMask is not installed');
    }

    const hexChainId = `0x${chainId.toString(16)}`;

    try {
      await this.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
    } catch (error: any) {
      // Network not added to MetaMask
      if (error.code === 4902) {
        const networkConfig = Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === chainId);
        if (networkConfig) {
          await this.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: hexChainId,
              chainName: networkConfig.name,
              rpcUrls: [networkConfig.rpcUrl],
              blockExplorerUrls: [networkConfig.explorerUrl],
              nativeCurrency: {
                name: networkConfig.currency,
                symbol: networkConfig.currency,
                decimals: 18,
              },
            }],
          });
        }
      } else {
        throw error;
      }
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.available) {
      throw new Error('MetaMask is not installed');
    }

    const account = await this.getAccount();
    if (!account) {
      throw new Error('No account connected');
    }

    return this.ethereum.request({
      method: 'personal_sign',
      params: [message, account.address],
    });
  }

  on(event: string, callback: (...args: any[]) => void): void {
    if (this.available) {
      this.ethereum.on(event, callback);
    }
  }

  off(event: string, callback: (...args: any[]) => void): void {
    if (this.available) {
      this.ethereum.removeListener(event, callback);
    }
  }

  private getNetworkName(chainId: number): string {
    const network = Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === chainId);
    return network?.name || `Unknown (${chainId})`;
  }
}

// Phantom adapter (for Solana - stub implementation)
export class PhantomAdapter implements WalletAdapter {
  name = 'Phantom';
  icon = '👻';
  
  get available(): boolean {
    return typeof window !== 'undefined' && !!(window as any).solana?.isPhantom;
  }

  async connect(): Promise<WalletAccount> {
    // Stub implementation - to be completed in Phase 2
    throw new Error('Phantom integration coming in Phase 2');
  }

  async disconnect(): Promise<void> {
    // Stub implementation
  }

  async getAccount(): Promise<WalletAccount | null> {
    return null;
  }

  async switchNetwork(chainId: number): Promise<void> {
    throw new Error('Network switching not supported for Solana');
  }

  async signMessage(message: string): Promise<string> {
    throw new Error('Phantom integration coming in Phase 2');
  }

  on(event: string, callback: (...args: any[]) => void): void {
    // Stub implementation
  }

  off(event: string, callback: (...args: any[]) => void): void {
    // Stub implementation
  }
}

// WalletConnect adapter (using Web3Modal)
export class WalletConnectAdapter implements WalletAdapter {
  name = 'WalletConnect';
  icon = '🔗';
  
  get available(): boolean {
    return true; // WalletConnect is always available
  }

  async connect(): Promise<WalletAccount> {
    // Stub implementation - requires Web3Modal setup
    throw new Error('WalletConnect integration requires Web3Modal setup');
  }

  async disconnect(): Promise<void> {
    // Stub implementation
  }

  async getAccount(): Promise<WalletAccount | null> {
    return null;
  }

  async switchNetwork(chainId: number): Promise<void> {
    // Stub implementation
  }

  async signMessage(message: string): Promise<string> {
    throw new Error('WalletConnect integration requires Web3Modal setup');
  }

  on(event: string, callback: (...args: any[]) => void): void {
    // Stub implementation
  }

  off(event: string, callback: (...args: any[]) => void): void {
    // Stub implementation
  }
}

// Available wallet adapters
export const walletAdapters = {
  metamask: new MetaMaskAdapter(),
  phantom: new PhantomAdapter(),
  walletconnect: new WalletConnectAdapter(),
  demo: new DemoAdapter(),
};

export type WalletType = keyof typeof walletAdapters;

// Get available wallets
export function getAvailableWallets(): { type: WalletType; adapter: WalletAdapter }[] {
  return Object.entries(walletAdapters)
    .filter(([_, adapter]) => adapter.available)
    .map(([type, adapter]) => ({ type: type as WalletType, adapter }));
}

// Utility functions
export function formatAddress(address: string, start: number = 6, end: number = 4): string {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function isValidAddress(address: string, type: 'ethereum' | 'solana' = 'ethereum'): boolean {
  if (type === 'ethereum') {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  } else if (type === 'solana') {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  }
  return false;
}

export function getExplorerUrl(address: string, chainId: number, type: 'address' | 'tx' = 'address'): string {
  const network = Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === chainId);
  if (!network) return '';
  
  return `${network.explorerUrl}/${type}/${address}`;
}