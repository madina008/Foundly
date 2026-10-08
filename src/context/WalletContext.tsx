import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Connection, PublicKey, Transaction, TransactionInstruction, LAMPORTS_PER_SOL } from '@solana/web3.js';

export interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: { toString: () => string; toBase58?: () => string };
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
  on: (event: string, callback: (args: unknown) => void) => void;
  removeListener?: (event: string, callback: (args: unknown) => void) => void;
}

declare global {
  interface Window {
    phantom?: {
      solana?: PhantomProvider;
    };
    solana?: PhantomProvider;
  }
}

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
const DEVNET_RPC_URL = 'https://api.devnet.solana.com';

interface WalletContextType {
  walletAddress: string | null;
  balance: number | null;
  isLoading: boolean;
  isRefreshingBalance: boolean;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  isRecordingBlockchain: boolean;
  lastTxSignature: string | null;
  sendSearchMemoTransaction: (params: {
    description: string;
    category: string;
    location: string;
  }) => Promise<{ success: boolean; signature?: string; error?: string }>;
  showConnectModal: boolean;
  setShowConnectModal: (show: boolean) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isRecordingBlockchain, setIsRecordingBlockchain] = useState(false);
  const [lastTxSignature, setLastTxSignature] = useState<string | null>(null);

  const getProvider = useCallback((): PhantomProvider | null => {
    if (typeof window === 'undefined') return null;
    if (window.phantom?.solana?.isPhantom) {
      return window.phantom.solana;
    }
    if (window.solana?.isPhantom) {
      return window.solana;
    }
    return null;
  }, []);

  const fetchBalance = useCallback(async (address: string) => {
    try {
      setIsRefreshingBalance(true);
      const connection = new Connection(DEVNET_RPC_URL, 'confirmed');
      const pubKey = new PublicKey(address);
      const lamports = await connection.getBalance(pubKey);
      const sol = lamports / LAMPORTS_PER_SOL;
      setBalance(Number(sol.toFixed(4)));
    } catch (err) {
      console.warn('Failed to fetch devnet balance:', err);
      if (balance === null) setBalance(0);
    } finally {
      setIsRefreshingBalance(false);
    }
  }, [balance]);

  const connectWallet = useCallback(async (): Promise<string | null> => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const provider = getProvider();
      if (!provider) {
        setErrorMessage('Откройте приложение в отдельной вкладке с установленным Phantom');
        return null;
      }

      const response = await provider.connect();
      const pubkey = response?.publicKey?.toString() || provider.publicKey?.toString();

      if (pubkey) {
        setWalletAddress(pubkey);
        setShowConnectModal(false);
        await fetchBalance(pubkey);
        return pubkey;
      } else {
        setErrorMessage('Не удалось получить публичный ключ кошелька');
        return null;
      }
    } catch (err: unknown) {
      const error = err as { code?: number; message?: string };
      if (error?.code === 4001 || error?.message?.includes('User rejected')) {
        setErrorMessage('Вы отменили подтверждение подключения в кошельке.');
      } else {
        setErrorMessage('Откройте приложение в отдельной вкладке с установленным Phantom');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchBalance, getProvider]);

  const disconnectWallet = useCallback(async () => {
    try {
      const provider = getProvider();
      if (provider) {
        await provider.disconnect();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setWalletAddress(null);
      setBalance(null);
    }
  }, [getProvider]);

  const refreshBalance = useCallback(async () => {
    if (walletAddress) {
      await fetchBalance(walletAddress);
    }
  }, [fetchBalance, walletAddress]);

  // Auto-connect check if trusted
  useEffect(() => {
    const provider = getProvider();
    if (provider) {
      provider.connect({ onlyIfTrusted: true })
        .then((resp) => {
          const pubkey = resp?.publicKey?.toString() || provider.publicKey?.toString();
          if (pubkey) {
            setWalletAddress(pubkey);
            fetchBalance(pubkey);
          }
        })
        .catch(() => {});

      const handleAccountChange = (newKey: unknown) => {
        if (newKey) {
          const keyStr = (newKey as { toString: () => string }).toString();
          setWalletAddress(keyStr);
          fetchBalance(keyStr);
        } else {
          setWalletAddress(null);
          setBalance(null);
        }
      };

      provider.on('accountChanged', handleAccountChange);
    }
  }, [fetchBalance, getProvider]);

  // Send transaction with 1 Memo instruction into Solana Devnet
  const sendSearchMemoTransaction = async (params: {
    description: string;
    category: string;
    location: string;
  }): Promise<{ success: boolean; signature?: string; error?: string }> => {
    const provider = getProvider();

    // If wallet not connected, prompt to connect
    if (!provider || !walletAddress) {
      setShowConnectModal(true);
      return { success: false, error: 'Кошелёк не подключён' };
    }

    setIsRecordingBlockchain(true);

    try {
      const userPublicKey = new PublicKey(walletAddress);
      const connection = new Connection(DEVNET_RPC_URL, 'confirmed');

      // Memo text formatting: text to be written into the blockchain
      const memoText = `Foundly: Поиск вещи «${params.description || 'Белые беспроводные наушники'}» | Категория: ${params.category} | Локация: ${params.location || 'Университет'}`;

      // Convert text to bytes using TextEncoder (NOT Buffer)
      const memoData = new TextEncoder().encode(memoText);

      // Memo instruction using program MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr
      const memoInstruction = new TransactionInstruction({
        keys: [{ pubkey: userPublicKey, isSigner: true, isWritable: false }],
        programId: MEMO_PROGRAM_ID,
        data: memoData as unknown as Buffer,
      });

      // Latest blockhash & transaction creation
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
      const transaction = new Transaction();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = userPublicKey;
      transaction.add(memoInstruction);

      // User confirms in Phantom (network fee paid by user)
      const { signature } = await provider.signAndSendTransaction(transaction);

      // Wait for confirmation on Solana Devnet
      const confirmation = await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        'confirmed'
      );

      if (confirmation.value.err) {
        throw new Error('Транзакция отклонена узлом Solana: ' + JSON.stringify(confirmation.value.err));
      }

      setLastTxSignature(signature);

      // Refresh balance after fee deduction
      await fetchBalance(walletAddress);

      return { success: true, signature };
    } catch (err: unknown) {
      console.error('Solana Memo recording error:', err);
      const error = err as { code?: number; message?: string; name?: string };

      let userError = 'Не удалось отправить запись в Solana Devnet.';
      if (
        error?.code === 4001 ||
        error?.message?.includes('User rejected') ||
        error?.message?.includes('rejected') ||
        error?.name === 'WalletSignTransactionError'
      ) {
        userError = 'Вы отменили подтверждение в кошельке. Запись не отправлена';
      } else if (error?.message?.includes('insufficient lamports') || error?.message?.includes('Attempt to debit')) {
        userError = 'Недостаточно SOL для комиссии сети Devnet (~0.000005 SOL). Пополните через Solana Faucet.';
      } else if (error?.message) {
        userError = error.message;
      }

      return { success: false, error: userError };
    } finally {
      setIsRecordingBlockchain(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        balance,
        isLoading,
        isRefreshingBalance,
        errorMessage,
        setErrorMessage,
        connectWallet,
        disconnectWallet,
        refreshBalance,
        isRecordingBlockchain,
        lastTxSignature,
        sendSearchMemoTransaction,
        showConnectModal,
        setShowConnectModal,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};
