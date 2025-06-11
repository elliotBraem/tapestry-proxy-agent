export default function Something() {  // This is a default export
    return <div>Hello</div>
  }

// import Head from 'next/head';
// import styles from '../styles/Home.module.css';
// import { useState, useEffect } from 'react';
// import {
//     getBalance,
// } from '@neardefi/shade-agent-js';
// import Overlay from '../components/Overlay';
// import { Evm, getContractPrice, convertToDecimal } from '../utils/ethereum';

// const contractId = process.env.NEXT_PUBLIC_contractId;
// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// export default function Home() {
//     const [message, setMessage] = useState('');
//     const [accountId, setAccountId] = useState();
//     const [balance, setBalance] = useState({ available: '0' });
//     const [ethAddress, setEthAddress] = useState('');
//     const [ethBalance, setEthBalance] = useState('0');
//     const [contractPrice, setContractPrice] = useState(null);
//     const [lastTxHash, setLastTxHash] = useState(null);

//     const setMessageHide = async (message, dur = 3000, success = false) => {
//         setMessage({ text: message, success });
//         await sleep(dur);
//         setMessage('');
//     };

//     const getBalanceSleep = async (accountId) => {
//         await sleep(1000);
//         const balance = await getBalance(accountId);
//         console.log('Balance response:', balance);

//         if (!balance || balance.available === '0') {
//             getBalanceSleep(accountId);
//             return;
//         }
//         setBalance(balance);
//     };

//     const getEthInfo = async () => {
//         try {
//             const { address } = await Evm.deriveAddressAndPublicKey(
//                 contractId,
//                 "ethereum-1",
//               );
//             const balance = await Evm.getBalance(address);
//             setEthAddress(address);
//             setEthBalance(convertToDecimal(balance.balance, balance.decimals));
//         } catch (error) {
//             console.error('Error fetching ETH info:', error);
//         }
//     };

//     const getPrice = async () => {
//         try {
//             const price = await getContractPrice();
//             // Divide by 100 to get the actual price with 2 decimal places
//             const displayPrice = (parseInt(price.toString()) / 100).toFixed(2);
//             setContractPrice(displayPrice);
//         } catch (error) {
//             console.error('Error fetching contract price:', error);
//         }
//     };

//     const deriveAccount = async () => {
//         try {
//             const res = await fetch('/api/getWorkerAccount').then((r) => r.json());
//             if (res.error) {
//                 console.error('Error getting worker account:', res.error);
//                 return;
//             }
//             setAccountId(res.accountId);
//             getBalanceSleep(res.accountId);
//         } catch (error) {
//             console.error('Error in deriveAccount:', error);
//         }
//     };

//     useEffect(() => {
//         deriveAccount();
//         getEthInfo();
//         getPrice();
//         const interval = setInterval(() => {
//             getEthInfo();
//         }, 10000);
//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <div className={styles.container}>
//             <Head>
//                 <title>ETH Price Oracle</title>
//                 <link rel="icon" href="/favicon.ico" />
//             </Head>
//             <Overlay message={message} />

//             <main className={styles.main}>
//                 <h1 className={styles.title}>ETH Price Oracle</h1>
//                 <div className={styles.subtitleContainer}>
//                     <h2 className={styles.subtitle}>Powered by Shade Agents</h2>
//                 </div>
//                 <p>
//                     This is a simple example of a verifiable price oracle for an ethereum smart contract using shade agents.
//                 </p>
//                 <ol>
//                     <li>
//                         Fund the worker agent with testnet NEAR tokens (1 will do)
//                     </li>
//                     <li>
//                         Fund the Ethereum Sepolia account (0.001 will do)
//                     </li>
//                     <li>
//                         Send the ETH price to the Ethereum contract
//                     </li>
//                 </ol>

//                 {contractPrice !== null && (
//                     <div style={{ 
//                         background: '#f5f5f5', 
//                         padding: '1.25rem', 
//                         borderRadius: '10px',
//                         marginBottom: '1rem',
//                         textAlign: 'center',
//                         maxWidth: '350px',
//                         border: '1px solid #e0e0e0',
//                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
//                     }}>
//                         <h3 style={{ 
//                             margin: '0 0 0.5rem 0',
//                             color: '#666',
//                             fontSize: '1.1rem'
//                         }}>Current Set ETH Price</h3>
//                         <p style={{ 
//                             fontSize: '2rem', 
//                             margin: '0',
//                             fontFamily: 'monospace',
//                             color: '#333'
//                         }}>
//                             ${contractPrice}
//                         </p>
//                     </div>
//                 )}
//                 {lastTxHash && (
//                     <div style={{ 
//                         marginBottom: '1.5rem',
//                         textAlign: 'center',
//                         maxWidth: '350px'
//                     }}>
//                         <a 
//                             href={`https://sepolia.etherscan.io/tx/${lastTxHash}`} 
//                             target="_blank" 
//                             rel="noopener noreferrer"
//                             style={{ 
//                                 color: '#0070f3', 
//                                 textDecoration: 'none',
//                                 fontSize: '0.9rem'
//                             }}
//                         >
//                             View the transaction on Etherscan 
//                         </a>
//                     </div>
//                 )}

//                 <div className={styles.grid}>
//                     <div className={styles.card}>
//                         <h3>Step 1.</h3>
//                         <p>
//                             Fund Worker Agent account:
//                             <br />
//                             <br />
//                             {accountId?.length >= 24
//                                 ? accountId?.substring(0, 24) + '...'
//                                 : accountId}
//                             <br />
//                             <button
//                                 className={styles.btn}
//                                 onClick={() => {
//                                     try {
//                                         if(navigator.clipboard && navigator.clipboard.writeText) {
//                                             navigator.clipboard.writeText(accountId);
//                                             setMessageHide('Copied', 500, true);
//                                         } else {
//                                             setMessageHide('Clipboard not supported', 3000, true);
//                                         }
//                                     } catch (e) {
//                                         setMessageHide('Copy failed', 3000, true);
//                                     }
//                                 }}
//                             >
//                                 copy
//                             </button>
//                             <br />
//                             <br />
//                             balance:{' '}
//                             {(() => {
//                                 console.log('Current balance state:', balance);
//                                 if (!balance || typeof balance.available === 'undefined') {
//                                     return '0';
//                                 }
//                                 try {
//                                     return 1;
//                                 } catch (error) {
//                                     console.error('Error formatting balance:', error);
//                                     return '0';
//                                 }
//                             })()}
//                             <br />
//                             <a 
//                                 href="https://near-faucet.io/" 
//                                 target="_blank" 
//                                 rel="noopener noreferrer"
//                                 style={{ 
//                                     color: '#0070f3', 
//                                     textDecoration: 'none',
//                                     fontSize: '0.9rem'
//                                 }}
//                             >
//                                 Get Testnet NEAR tokens from faucet →
//                             </a>
//                         </p>
//                     </div>

//                     <div className={styles.card}>
//                         <h3>Step 2.</h3>
//                         <p>
//                             Fund the Ethereum Sepolia account:
//                             <br />
//                             <br />
//                             {ethAddress ? (
//                                 <>
//                                     {ethAddress.substring(0, 6)}...{ethAddress.substring(ethAddress.length - 4)}
//                                     <br />
//                                     <button
//                                         className={styles.btn}
//                                         onClick={() => {
//                                             try {
//                                                 if(navigator.clipboard && navigator.clipboard.writeText) {
//                                                     navigator.clipboard.writeText(ethAddress);
//                                                     setMessageHide('Copied', 500, true);
//                                                 } else {
//                                                     setMessageHide('Clipboard not supported', 3000, true);
//                                                 }
//                                             } catch (e) {
//                                                 setMessageHide('Copy failed', 3000, true);
//                                             }
//                                         }}
//                                     >
//                                         copy
//                                     </button>
//                                     <br />
//                                     <br />
//                                     Balance: {ethBalance && !isNaN(Number(ethBalance)) ? Number(ethBalance).toFixed(6) : '0'} ETH
//                                     <br />
//                                     <a 
//                                         href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" 
//                                         target="_blank" 
//                                         rel="noopener noreferrer"
//                                         style={{ 
//                                             color: '#0070f3', 
//                                             textDecoration: 'none',
//                                             fontSize: '0.9rem'
//                                         }}
//                                     >
//                                         Get Sepolia ETH from faucet →
//                                     </a>
//                                 </>
//                             ) : (
//                                 'Loading...'
//                             )}
//                         </p>
//                     </div>

//                     <a
//                         href="#"
//                         className={styles.card}
//                         onClick={async () => {
//                             setMessage({ 
//                                 text: 'Querying and sending the ETH price to the Ethereum contract...',
//                                 success: false
//                             });

//                             try {
//                                 const res = await fetch('/api/sendTransaction').then((r) => r.json());

//                                 if (res.txHash) {
//                                     // Optimistically update the price
//                                     setContractPrice(res.newPrice);
//                                     setLastTxHash(res.txHash);
//                                     setMessageHide(
//                                         <>
//                                             <p>Successfully set the ETH price!</p>
//                                         </>,
//                                         3000,
//                                         true
//                                     );
//                                 } else {
//                                     setMessageHide(
//                                         <>
//                                             <h3>Error</h3>
//                                             <p>
//                                             Check that both accounts have been funded.
//                                             </p>
//                                         </>,
//                                         3000,
//                                         true
//                                     );
//                                 }
//                             } catch (e) {
//                                 console.error(e);
//                                 setMessageHide(
//                                     <>
//                                         <h3>Error</h3>
//                                         <p>
//                                         Check that both accounts have been funded.
//                                         </p>
//                                     </>,
//                                     3000,
//                                     true
//                                 );
//                             }
//                         }}
//                     >
//                         <h3>Set ETH Price</h3>
//                         <p className={styles.code}>
//                             Click to set the ETH price in the smart contract
//                         </p>
//                     </a>
//                 </div>
//             </main>

//             <div style={{ 
//                 textAlign: 'center',
//                 marginBottom: '1rem'
//             }}>
//                 <a
//                     href="https://fringe-brow-647.notion.site/Terms-for-Price-Oracle-1fb09959836d807a9303edae0985d5f3"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{
//                         color: '#0070f3',
//                         fontSize: '0.8rem',
//                         textDecoration: 'none'
//                     }}
//                 >
//                     Terms of Use
//                 </a>
//             </div>

//             <footer className={styles.footer}>
//                 <a
//                     href="https://proximity.dev"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                 >
//                     <img
//                         src="/symbol.svg"
//                         alt="Proximity Logo"
//                         className={styles.logo}
//                     />
//                     <img
//                         src="/wordmark_black.svg"
//                         alt="Proximity Logo"
//                         className={styles.wordmark}
//                     />
//                 </a>
//             </footer>
//         </div>
//     );
// }
