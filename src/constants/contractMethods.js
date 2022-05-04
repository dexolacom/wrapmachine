import {contractsAddressesBSC, contractsAddressesETH, MAX_VALUE} from './addresses';
import Web3 from 'web3';
import ABI from './abis/erc20_abi.json';
import wrapAbi from './abis/wrapAbi.json';
import wrapAbiBSC from './abis/wrapAbiBSC.json';

const web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_NETWORK_URL)
const BN = web3.utils.BN

// контракты для аллованса
const bscContractNBU = new web3.eth.Contract(ABI, contractsAddressesBSC.nbu)
const ethContractNBU = new web3.eth.Contract(ABI, contractsAddressesETH.nbu)

// контракт на котором вызывается метод врап
const ethWrapContract = new web3.eth.Contract(wrapAbi, contractsAddressesETH.wrapNBUTest)
const bscWrapContract = new web3.eth.Contract(wrapAbiBSC, contractsAddressesBSC.wrapNBUTest)

const allowance = async (contract, spender, wrapNBU, account) => {
  const all = await contract.methods.allowance(account, spender).call()
  const allBN = new BN(all)
  const wrapBN = new BN(web3.utils.toWei(wrapNBU, 'ether'))
  return !!allBN.gte(wrapBN);
}

const approve = async (contract, address, account) => {
  await contract.methods
    .approve(address, MAX_VALUE)
    .send({ from: account })
    .on('receipt', async receipt => true)
    .on('error', err => console.error(err))
}

const wrapETH = async (ethWrapContract, wrapNBU, account) => {
  await ethWrapContract.methods
    .wrap(web3.utils.toWei(wrapNBU, 'ether'))
    .send({ from: account })
    .on('error', err => console.error(err))
}

const unwrapBSC = async (bscWrapContract, wrapNBU, account) => {
  await bscWrapContract.methods
    .unwrap(web3.utils.toWei(wrapNBU, 'ether'))
    .send({ from: account })
    .on('error', err => console.error(err))
}

export const wrap = async (chainId, account, setIsLoading, getNBU, wrapNBU) => {
  //@ts-ignore
  setIsLoading(true)
  try {
    if (chainId === 97 || chainId === 56) {
      const allow = await allowance(bscContractNBU, contractsAddressesBSC.wrapNBUTest, wrapNBU, account)
      !allow && (await approve(bscContractNBU, contractsAddressesBSC.wrapNBUTest, account))
      await unwrapBSC(bscWrapContract, wrapNBU, account)
    } else {
      const allow = await allowance(ethContractNBU, contractsAddressesETH.wrapNBUTest, wrapNBU, account)
      !allow && (await approve(ethContractNBU, contractsAddressesETH.wrapNBUTest, account))
      await wrapETH(ethWrapContract, wrapNBU, account)
    }
    await getNBU()
  } catch (error) {
    setIsLoading(false)
    console.error('error check', error)
  }
  setIsLoading(false)
}