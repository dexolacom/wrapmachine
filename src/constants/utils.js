import {useEffect, useState} from 'react';
import {useWeb3React} from '@web3-react/core';
import Web3 from 'web3';
import ABI from './abis/abi.json'

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