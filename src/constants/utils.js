import {useEffect, useState} from 'react';
// import ABI from './ABI_DEFAULT.json'
import {useWeb3React} from '@web3-react/core';
import Web3 from 'web3';
import ABI from './abi.json'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address, chars = 4) {
  if (address) return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenWrapHistoryAddress(address, chars = 12) {
  return `${address.substring(0, chars + 2)}`
}

export const normalizeEth = str => {
  const wei = '' + str
  if (!wei) return 0
  const dot = wei.indexOf('.')
  if (dot < 0) return str
  return wei.slice(0, dot + 5)
}

export const getWrapContract = chainId => {
  // 0xBFe52A0DBF40183bc5fC3220Dab2Db64BF19368E NBU Wrapper Binance
  // 0xCaD011b3B79a3a83C576E6b2682049e296bE9374 GNBU Wrapper Binance
  // 0xBFe52A0DBF40183bc5fC3220Dab2Db64BF19368E NBU Wrapper Ethereum
  // 0xCaD011b3B79a3a83C576E6b2682049e296bE9374 GNBU Wrapper Ethereum

  //Prod
  if (chainId === 1 || chainId === 56) {
    return {
      wrapNBU: '0xBFe52A0DBF40183bc5fC3220Dab2Db64BF19368E',
      wrapNBUb: '0xBFe52A0DBF40183bc5fC3220Dab2Db64BF19368E',
      wrapGNBU: '0xCaD011b3B79a3a83C576E6b2682049e296bE9374',
      wrapGNBUb: '0xCaD011b3B79a3a83C576E6b2682049e296bE9374'
    }
  }
  return {
    wrapNBUb: '0xD25969cf1c1930e4EB5b13007B09A5CFd02c16c8',
    wrapGNBUb: '0xEe9628E882ee2929DF2de2c8Ca06b70aC9c211Aa',
    wrapNBU: '0x760d38b906034f114B46254d2516cD3995a2680f',
    wrapGNBU: '0x988Ff123073eA1374Ec999Eabd5F9Bb4Ba3c5399'
  }
}

export const convertToHuman = (value, decimals)  => {
  return parseInt(value) / 10 ** parseInt(decimals)
}

async function getGnbuAvailable(account, contractAddress, web3) {
  if (account) {
    const contract = new web3.eth.Contract(ABI, contractAddress)
    const availableForTransfer = await contract.methods.availableForTransfer(account).call()
    const delegatee = await contract.methods.delegates(account).call()
    const delegateeTotalDelegated = await contract.methods.getCurrentVotes(delegatee).call()
    const dec = await contract.methods.decimals().call()
    if (
      delegatee !== ZERO_ADDRESS &&
      convertToHuman(delegateeTotalDelegated, dec) < convertToHuman(availableForTransfer, dec)
    ) {
      return delegateeTotalDelegated
    } else {
      return availableForTransfer
    }
  }
}

export const useBalanceOf = (contractAddress) => {
  const { account } = useWeb3React()
  const web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_NETWORK_URL)

  const [balance, setBalance] = useState()
  const [balanceHuman, setBalanceHuman] = useState()
  const getBalance = async () => {
    const contract = new web3.eth.Contract(ABI, contractAddress)
    const symbol = await contract.methods.symbol().call()
    let balance
    try {
      balance = await contract.methods[symbol === 'NBU' ? 'availableForTransfer' : 'balanceOf'](account).call()
    } catch (error) {
      console.error(error)
    }

    if (symbol === 'GNBU') {
      balance = await getGnbuAvailable(account, contractAddress, web3)
      console.log(1)
    }
    const dec = await contract.methods.decimals().call()
    const human = convertToHuman(balance, dec)
    setBalance(balance)
    setBalanceHuman(human)
    return { balance: balance, human: human }
  }

  useEffect(() => {
    if (contractAddress) getBalance()
  }, [contractAddress])

  return { balance, balanceHuman, getBalance }
}