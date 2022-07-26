import React, {useState, useEffect, useRef} from 'react';
import {
  ChakraProvider,
  Stack,
  Box,
  Text,
  Button,
  Input,
  theme,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import {ethers} from 'ethers';
import { abi, contractAddress } from './constants';

function App() {

  const [connection, setConnection] = useState(false);
  const [isMetamask, setMetamask] = useState(false);
  const inputRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [balance, setBalance] = useState(0);

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


  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(contractAddress);
      setBalance(ethers.utils.formatEther(balance));
      console.log(ethers.utils.formatEther(balance))
    }
  }

  async function fund(ethAmount) {
    if (typeof window.ethereum !== "undefined") {
      // provider = connection to the blockchain
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // signer =  wallet
      const signer = provider.getSigner();
      // contract = to interact with 
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try{
        const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmount) });
        await listenForTransactionMine(transactionResponse, provider);
      } catch (error) {
        console.log(error)
      }
      await listenForTransactionMine
    }
  }

  async function withdraw(){
    if (typeof window.ethereum !== "undefined") {
      // provider = connection to the blockchain
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // signer =  wallet
      const signer = provider.getSigner();
      // contract = to interact with 
      const contract = new ethers.Contract(contractAddress, abi, signer);
        
        try{
          const transactionResponse = await contract.withdraw();
          await listenForTransactionMine(transactionResponse, provider);
        } catch (error) {
          console.log(error)
        }
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

  var handleClick = () => {
    inputRef.current.value = null
    console.log("test")
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
        <Box mt="20" >
          <Stack direction='row' spacing={4}>
            <Input ref={inputRef} ml="10"size="sm" width="30" placeholder='Amount'  />
            <Button variantColor="teal" size="sm"  onClick={()=>{fund(inputRef.current.value);handleClick()}}>
              Fund
            </Button>
            <Button variantColor="teal" size="sm"  onClick={()=>{getBalance();onOpen()}}>
            Get Balance
            </Button>

            {/* GET BALANCE OVERLAY */}
            {isMetamask ?
            <>
              <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>FundMe Smart contract Balance</ModalHeader>
                <ModalCloseButton />
                <ModalBody fontWeight="bold">
                  {balance} ETH
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            </> : 
            <>
            <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Please install Metamask</ModalHeader>
              <ModalCloseButton />
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
            </Modal>
            </>}
            <Button variantColor="teal" size="sm" onClick={()=>withdraw()}>
              Withdraw
            </Button>
          </Stack>  
        </Box>
        <Box mt="20" ml="10" mr="10">
          <Text fontSize="sm" fontWeight="bold">
            Hey ! Welcome to the FundMe fullstack interface.
          </Text>
          <Text fontSize="sm">
            This is a demo of a smart contract that allows you to fund an account and withdraw it only if you are the owner.
          </Text>
          <Text fontSize="sm">
            I wanted to learn how to deploy a smart contract and how to interact with it. I also wanted to learn how to use the ethers library to interact with the blockchain.
          </Text>
          <Text fontSize="sm">
            The smartcontract is deployed on my hardhat localhost network. You can see the code on the github repo.
            To interact with the smart contract you need to deploy it on your localhost network, change the smart contract address in the constants file, then import a wallet from your hardhat to your metamask.
          </Text>

        </Box>
     
      </Box>
      
    </ChakraProvider>
  );
}

export default App;
