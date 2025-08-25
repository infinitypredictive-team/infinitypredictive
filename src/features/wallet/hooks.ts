import { useState, useCallback, useEffect } from 'react';
import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletAdapters, WalletType, WalletAdapter, WalletAccount, SUPPORTED_NETWORKS } from './adapters';
import { useUIStore } from '@/lib/store';
import { toast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';

interface UseWalletReturn {
  // State
  account: WalletAccount | null;
  connected: boolean;
  connecting: boolean;
  error: string | null;
  
  // Actions
  connect: (type: WalletType) => Promise<void>;
  disconnect: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  
  // Utils
  getBalance: () => Promise<number | null>;
  getExplorerUrl: (address?: string) => string;
}

// Wallet state management
export function useWallet(): UseWalletReturn {
  const [currentAdapter, setCurrentAdapter] = useState<WalletAdapter | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setDemoMode } = useUIStore();
  const queryClient = useQueryClient();

  // Get current account
  const { data: account, refetch: refetchAccount } = useQuery({
    queryKey: ['wallet', 'account'],
    queryFn: async () => {
      if (!currentAdapter) return null;
      return currentAdapter.getAccount();
    },
    enabled: !!currentAdapter,
    staleTime: 30 * 1000, // 30s
    refetchInterval: 60 * 1000, // 1min
  });

  const connected = !!account;

  // Connect wallet
  const connectMutation = useMutation({
    mutationFn: async (type: WalletType) => {
      const requested = walletAdapters[type];
      const fallback = walletAdapters.demo;
      let adapter: WalletAdapter | null = null;
      if (requested && requested.available) {
        adapter = requested;
      } else if (fallback && fallback.available) {
        adapter = fallback;
      }
      if (!adapter) {
        throw new Error(`${requested?.name || 'Requested'} wallet is not available, and demo wallet is disabled`);
      }
      setCurrentAdapter(adapter);
      try {
        return await adapter.connect();
      } catch (err) {
        // Fallback to demo wallet if connect fails and demo is allowed
        if (adapter !== fallback && fallback?.available) {
          setCurrentAdapter(fallback);
          return await fallback.connect();
        }
        throw err;
      }
    },
    onMutate: () => {
      setConnecting(true);
      setError(null);
    },
    onSuccess: (account) => {
      setConnecting(false);
      setDemoMode(false); // Exit demo mode on successful connection
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${currentAdapter?.name}`,
      });
      
      // Update query cache
      queryClient.setQueryData(['wallet', 'account'], account);
      
      // Check if on correct network (from env or fallback to Polygon)
      const envChainId = Number((import.meta as any)?.env?.VITE_CHAIN_ID) || SUPPORTED_NETWORKS.polygon.chainId;
      if (account.chainId !== envChainId) {
        toast({
          title: "Wrong Network",
          description: `Please switch to the required network (chainId ${envChainId}).`,
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      setConnecting(false);
      setError(error.message);
      setCurrentAdapter(null);
      
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Disconnect wallet
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      if (currentAdapter) {
        await currentAdapter.disconnect();
      }
    },
    onSuccess: () => {
      setCurrentAdapter(null);
      setError(null);
      setDemoMode(true); // Return to demo mode
      
      // Clear query cache
      queryClient.setQueryData(['wallet', 'account'], null);
      queryClient.removeQueries({ queryKey: ['user'] });
      
      toast({
        title: "Wallet Disconnected",
        description: "You've been disconnected from your wallet",
      });
    },
  });

  // Switch network
  const switchNetworkMutation = useMutation({
    mutationFn: async (chainId: number) => {
      if (!currentAdapter) {
        throw new Error('No wallet connected');
      }
      return currentAdapter.switchNetwork(chainId);
    },
    onSuccess: () => {
      // Refetch account to get updated network info
      refetchAccount();
      
      toast({
        title: "Network Switched",
        description: "Successfully switched network",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Network Switch Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Sign message
  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!currentAdapter) {
      throw new Error('No wallet connected');
    }
    return currentAdapter.signMessage(message);
  }, [currentAdapter]);

  // Get balance
  const getBalance = useCallback(async (): Promise<number | null> => {
    if (!account) return null;
    return account.balance || null;
  }, [account]);

  // Get explorer URL
  const getExplorerUrl = useCallback((address?: string): string => {
    const addr = address || account?.address;
    if (!addr || !account) return '';
    
    const network = Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === account.chainId);
    return network ? `${network.explorerUrl}/address/${addr}` : '';
  }, [account]);

  // Listen for account changes
  useEffect(() => {
    if (!currentAdapter) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        disconnectMutation.mutate();
      } else {
        // Account changed, refetch
        refetchAccount();
      }
    };

    const handleChainChanged = () => {
      // Chain changed, refetch account
      refetchAccount();
    };

    const handleDisconnect = () => {
      disconnectMutation.mutate();
    };

    currentAdapter.on('accountsChanged', handleAccountsChanged);
    currentAdapter.on('chainChanged', handleChainChanged);
    currentAdapter.on('disconnect', handleDisconnect);

    return () => {
      currentAdapter.off('accountsChanged', handleAccountsChanged);
      currentAdapter.off('chainChanged', handleChainChanged);
      currentAdapter.off('disconnect', handleDisconnect);
    };
  }, [currentAdapter, refetchAccount, disconnectMutation]);

  // Try to restore connection on mount
  useEffect(() => {
    const tryAutoConnect = async () => {
      // Check for previously connected wallet
      const lastWallet = localStorage.getItem('lastConnectedWallet') as WalletType;
      if (lastWallet && walletAdapters[lastWallet].available) {
        const adapter = walletAdapters[lastWallet];
        const existingAccount = await adapter.getAccount();
        
        if (existingAccount) {
          setCurrentAdapter(adapter);
          setDemoMode(false);
        }
      }
    };

    tryAutoConnect();
  }, [setDemoMode]);

  // Store last connected wallet
  useEffect(() => {
    if (connected && currentAdapter) {
      const walletType = Object.entries(walletAdapters).find(
        ([_, adapter]) => adapter === currentAdapter
      )?.[0];
      
      if (walletType) {
        localStorage.setItem('lastConnectedWallet', walletType);
      }
    } else {
      localStorage.removeItem('lastConnectedWallet');
    }
  }, [connected, currentAdapter]);

  return {
    // State
    account,
    connected,
    connecting: connecting || connectMutation.isPending,
    error,
    
    // Actions
    connect: (type: WalletType) => connectMutation.mutateAsync(type),
    disconnect: () => disconnectMutation.mutateAsync(),
    switchNetwork: (chainId: number) => switchNetworkMutation.mutateAsync(chainId),
    signMessage,
    
    // Utils
    getBalance,
    getExplorerUrl,
  };
}

// Hook for wallet-gated features
export function useRequireWallet() {
  const { connected, connect } = useWallet();
  
  const requireConnection = useCallback((action: string = 'perform this action') => {
    if (!connected) {
      toast({
        title: "Wallet Required",
        description: `Please connect a wallet to ${action}`,
        action: React.createElement(
          ToastAction,
          {
            altText: "Connect Wallet",
            onClick: () => {
              window.location.href = '/wallet';
            },
          },
          'Connect'
        ),
      });
      return false;
    }
    return true;
  }, [connected]);

  return {
    connected,
    requireConnection,
    promptConnection: connect,
  };
}

// Hook for network validation
export function useNetworkGuard(requiredChainId: number = (Number((import.meta as any)?.env?.VITE_CHAIN_ID) || SUPPORTED_NETWORKS.polygon.chainId)) {
  const { account, switchNetwork } = useWallet();
  
  const isCorrectNetwork = account?.chainId === requiredChainId;
  
  const ensureCorrectNetwork = useCallback(async () => {
    if (!account) {
      throw new Error('No wallet connected');
    }
    
    if (account.chainId !== requiredChainId) {
      await switchNetwork(requiredChainId);
    }
  }, [account, requiredChainId, switchNetwork]);

  return {
    isCorrectNetwork,
    currentChainId: account?.chainId,
    requiredChainId,
    ensureCorrectNetwork,
  };
}

// Hook for wallet balances
export function useWalletBalance() {
  const { account } = useWallet();
  
  return useQuery({
    queryKey: ['wallet', 'balance', account?.address, account?.chainId],
    queryFn: async () => {
      if (!account?.address) return null;
      const eth = (window as any)?.ethereum;
      if (!eth) return account.balance || 0;
      try {
        const balanceHex = await eth.request({
          method: 'eth_getBalance',
          params: [account.address, 'latest'],
        });
        const balance = parseInt(balanceHex, 16) / Math.pow(10, 18);
        return balance;
      } catch {
        return account.balance || 0;
      }
    },
    enabled: !!account?.address,
    staleTime: 30 * 1000, // 30s
    refetchInterval: 60 * 1000, // 1min
  });
}