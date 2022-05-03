//@ts-nocheck
import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'
import Select from 'react-select'
import {shortenAddress, shortenWrapHistoryAddress, useBalanceOf} from '../../constants/utils'
import {
  Wrapper,
  Content,
  Title,
  InputContainer,
  Row,
  selectScrollStyles,
  InputWrapper,
  Text,
  Button,
  AccentText
} from './styles'
import HashLink from '../HashLink/HashLink'
import { normalizeEth, getWrapContract } from '../../constants/utils'
import ABI from '../../constants/erc20_abi.json'
// import { useWeb3Contract } from 'context/contexts'
// import Loader from '../Loader'

const tokenList = [
  {
    label: 'NBU',
    value: 'NBU'
  },
  {
    label: 'GNBU',
    value: 'GNBU'
  }
]

const MAX_VALUE = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

const Wrap = () => {
  const { account, chainId } = useWeb3React()
  const [balanceNBU, setBalanceNBU] = useState(0)
  const [wrapNBU, setWrapNBU] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState(tokenList[0])
  const [fee, setFee] = useState('0.00')
  const [isLiquidity, setIsLiquidity] = useState(true)
  const [minAmount, setMinAmount] = useState(0)


  // const timeout = 0
  // const { getContract } = useWeb3Contract()

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (account) {
        ;(async () => {
          await fetchFee()
        })()
      }
    }, 600)

    return () => clearTimeout(delayDebounceFn)
  }, [wrapNBU])

  useEffect(() => {
    if (account) {
      ;(async () => {
        await getNBU()
        await fetchFee()
        // await fetchHistory()
        // const gas = await web3.eth.getGasPrice()
        // setGasPrice(normalizeEth(web3.utils.fromWei(gas, 'ether')))
      })()
    }
  }, [token, account, chainId])


  const changeToken = value => {
    setToken(value)
  }

  const web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_NETWORK_URL)
  const BN = web3.utils.BN
  const isETH = chainId === 1 || chainId === 3
  const event = isETH ? 'Wrap' : 'Unwrap'
  const wrapContract = getWrapContract(chainId)
  const wrapDomen = chainId === 1 || chainId === 56 ? 'swap' : 'demoswap'

  const WrapEthAddress = token.value === 'NBU' ? wrapContract.wrapNBU : wrapContract.wrapGNBU
  const WrapBscAddress = token.value === 'NBU' ? wrapContract.wrapNBUb : wrapContract.wrapGNBUb

  const ethContract = new web3.eth.Contract(ABI, '0xe4931a2255540F05b0C6dB8B5e9759eF2B579994')
  // const bscContract = new web3.eth.Contract(ABI_BEP20, '0xac094071B2e1C248BbE1Df9FE7b05ea94c305403')
  const NBUContractBSC = new web3.eth.Contract(ABI, '0x5f20559235479F5B6abb40dFC6f55185b74E7b55')
  const NBUContractETH = new web3.eth.Contract(ABI, '0xEB58343b36C7528F23CAAe63a150240241310049')

  const { getBalance } = useBalanceOf('0xEB58343b36C7528F23CAAe63a150240241310049')


  const getNBU = async () => {
    const NBU = await getBalance()
    setBalanceNBU(NBU.human)
  }

  const changeWrapNBU = e => {
    setWrapNBU(e.target.value)
  }

  const fetchFee = async () => {
    const domen = token.value.toLowerCase()
    const weiAmount = +wrapNBU > 0 ? web3.utils.toWei(wrapNBU, 'ether') : '1'
    const res = await fetch(
      `https://${wrapDomen}-${domen}.nimbusplatform.io/fee/?address=${account}&event=${event}&amount=${weiAmount}`
    )
    const resFee = await res.json()

    if (res.status >= 200 && res.status < 300 && resFee?.fee) setFee(web3.utils.fromWei(resFee.fee, 'ether'))
    else setFee('0.00')
    resFee?.fee === false ? setIsLiquidity(false) : setIsLiquidity(true)
  }

  const allowance = async (contract, spender) => {
    const all = await contract.methods.allowance(account, spender).call()
    console.log('in allowance')
    console.log(all)
    const allBN = new BN(all)
    const wrapBN = new BN(web3.utils.toWei(wrapNBU, 'ether'))

    if (allBN.gte(wrapBN)) return true
    return false
  }

  const approve = async (contract, address) => {
    console.log('in approve')
    await contract.methods
      .approve(address, MAX_VALUE)
      .send({ from: account })
      .on('transactionHash', hash => {})
      .on('receipt', async receipt => {
        return true
      })
      .on('error', err => console.error(err))
  }

  const wrapETH = async () => {
    await ethContract.methods
      .wrap(web3.utils.toWei(wrapNBU, 'ether'))
      .send({ from: account })
      .on('transactionHash', hash => {})
      .on('error', err => console.error(err))
  }

  // const unwrapBSC = async () => {
  //   await bscContract.methods
  //     .unwrap(web3.utils.toWei(wrapNBU, 'ether'))
  //     .send({ from: account })
  //     .on('transactionHash', hash => {})
  //     .on('error', err => console.error(err))
  // }

  const wrap = async () => {
    //@ts-ignore
    setIsLoading(true)
    try {
      if (chainId === 97 || chainId === 56) {
        // const allow = await allowance(NBUContractBSC, '0xac094071B2e1C248BbE1Df9FE7b05ea94c305403')
        // !allow && (await approve(NBUContractBSC, '0xac094071B2e1C248BbE1Df9FE7b05ea94c305403'))
        const allow = await allowance(NBUContractBSC, WrapBscAddress)
        !allow && (await approve(NBUContractBSC, WrapBscAddress))
        // await unwrapBSC()
      } else {
        console.log(1)
        const allow = await allowance(NBUContractETH, '0xe4931a2255540F05b0C6dB8B5e9759eF2B579994')
        // const allow = await allowance(NBUContractETH, WrapEthAddress)
        !allow && (await approve(NBUContractETH, '0xe4931a2255540F05b0C6dB8B5e9759eF2B579994'))
        // !allow && (await approve(NBUContractETH, WrapEthAddress))
        await wrapETH()
      }
      await getNBU()
    } catch (error) {
      setIsLoading(false)
      console.error('error check', error)
    }
    setIsLoading(false)
  }

  const isButtonDisable = () => {
    return (
      !account ||
      isLoading ||
      !(wrapNBU > +normalizeEth(fee * 2)) ||
      fee === '0.00' ||
      +normalizeEth(balanceNBU) < +wrapNBU
    )
  }

  useEffect(() => {
    let result = web3.utils.fromWei(new BN(web3.utils.toWei(fee, 'ether')).mul(new BN(2)), 'ether')
    setMinAmount(result)
  }, [fee])


  return (
    <Wrapper>
      <Content>
        <Row marginBottom={'1em'}>
          <Title>Wrap Machine</Title>
        </Row>
        <InputWrapper>
          <Row padding={'0.8em 0.8em 0 0.8em'}>
            <Text>Amount</Text>
            <Text>Balance: {normalizeEth(balanceNBU)}</Text>
          </Row>
          <InputContainer>
            <input type='number' placeholder={'0.0'} value={wrapNBU} onChange={(e) => changeWrapNBU(e)}/>
            <Select
              className={'at-click at-slt-tkn'}
              options={tokenList}
              styles={selectScrollStyles}
              value={token}
              onChange={changeToken}
              isSearchable={false}
            />
          </InputContainer>
        </InputWrapper>
        <Row marginBottom={'1em'}>
          <Text>BSC recipient</Text>
          <AccentText style={{color: 'dodgerblue'}}>{shortenAddress(account)}</AccentText>
        </Row>
        <Row marginBottom={'1em'}>
          <Text>Minimal amount</Text>
          <AccentText>{normalizeEth(minAmount)} {token.label}{!isETH ? 'b' : ''}</AccentText>
        </Row>
        <Row marginBottom={'1em'}>
          <Text>Wrapping gas fee</Text>
          <AccentText>{normalizeEth(fee)} {token.label}{!isETH ? 'b' : ''}</AccentText>
        </Row>
        <Row marginBottom={'1em'}>
          <Button onClick={wrap}>Wrap</Button>
        </Row>
        <Text>
          Due to technical issues, the wrapped tokens will be displayed in your wallet within 24 hours from the moment of wrapping
        </Text>
      </Content>
    </Wrapper>
  )
}

export default Wrap
