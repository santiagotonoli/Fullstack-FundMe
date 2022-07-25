import React, {useState, useEffect} from 'react';
import {
  ChakraProvider,
  VStack,
  Box,
  Text,
  Button,
  Input,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import {ethers} from 'ethers';
import { abi, contractAddress } from './constants';

function App() {

  const [connection, setConnection] = useState(false);
  const [isMetamask, setMetamask] = useState(false);

useEffect(() => {
  const isConnect = async () => {
  if (typeof window.ethereum !== "undefined") {
    setMetamask(true);
    const accounts = await window.ethereum.request({ method: "eth_accounts" })
    if (accounts.length > 0) {
      setConnection(true);
    }
  }
  }
  isConnect();
} , []);


    const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" })
      } catch (error) {
        console.log(error)
      }
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      if (accounts.length > 0) {
        setConnection(true);
      }
      console.log(accounts)
    }
  }


  // async function getBalance() {
  //   if (typeof window.ethereum !== "undefined") {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const balance = provider.getBalance();
  //     console.log(ethers.utils.formatEther(balance))

  //   }
  // }

  async function fund(ethAmount) {
    if (typeof window.ethereum !== "undefined") {
      const amount = "0.001"
      // provider = connection to the blockchain
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // signer =  wallet
      const signer = provider.getSigner();
      // contract = to interact with 
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try{
        const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(amount) });
        await listenForTransactionMine(transactionResponse, provider);
      } catch (error) {
        console.log(error)
      }
      await listenForTransactionMine
    }
  }

  function listenForTransactionMine(transactionResponse, provider){
    console.long(`Mineing transaction ${transactionResponse.hash}`)
    // listen for this transaction to finish
    return new Promise((resolve, reject)=>{
      provider.once(transactionResponse.hash, (transactionReceipt)=>{
        console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
        resolve()
      }) 
    })
    
  }


  return (
    <ChakraProvider theme={theme}>
      <Box flexDirection="column">
        <Box ml="5" mr="5" mt="5" display="flex" justifyContent="space-between">
            <ColorModeSwitcher justifySelf="flex-end" />
            <Text  fontSize="2xl" fontWeight="bold">
                FundMe
            </Text>
            {isMetamask ? (connection ?
            <Button colorScheme="green" size="sm">
            Connected
            </Button> :
            <Button colorScheme="gray" size="sm" onClick={()=>connect()}>
            Connect Wallet
            </Button>) : 
            <Text  fontSize="sm" mt="2" fontWeight="bold">
            Please install Metamask
            </Text>
            }
            
        </Box>
        <Box mt="20" display="flex">
          <Input ml="10"size="sm" width="30" placeholder='Amount' />
          <Button variantColor="teal" size="sm" ml="5" onClick={()=>fund()}>
            Fund
          </Button>
        </Box>
        <Box mt="5" display="flex">
          <Button variantColor="teal" size="sm" ml="60">
            Get Balance
          </Button>
        </Box>
        <Box mt="5" display="flex">
          <Button variantColor="teal" size="sm" ml="60">
            Withdraw
          </Button>
        </Box>
      </Box>
      
    </ChakraProvider>
  );
}

export default App;
