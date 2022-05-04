import { MAX_VALUE} from './addresses';
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_NETWORK_URL)
const BN = web3.utils.BN

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
    .on('receipt', async receipt => {
      return true
    })
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

export const wrap = async (
  chainId,
  account,
  setIsLoading,
  getNBU,
  wrapNBU,
  ethWrapContractAddress,
  bscWrapContractAddress,
  ethWrapContract,
  bscWrapContract,
  bscContractNBU,
  ethContractNBU
) => {
  //@ts-ignore
  setIsLoading(true)
  try {
    if (chainId === 97 || chainId === 56) {
      const allow = await allowance(bscContractNBU, bscWrapContractAddress, wrapNBU, account)
      !allow && (await approve(bscContractNBU, bscWrapContractAddress, account))
      await unwrapBSC(bscWrapContract, wrapNBU, account)
    } else {
      const allow = await allowance(ethContractNBU, ethWrapContractAddress, wrapNBU, account)
      !allow && (await approve(ethContractNBU, ethWrapContractAddress, account))
      await wrapETH(ethWrapContract, wrapNBU, account)
    }
    await getNBU()
  } catch (error) {
    setIsLoading(false)
    console.error('error check', error)
  }
  setIsLoading(false)
}