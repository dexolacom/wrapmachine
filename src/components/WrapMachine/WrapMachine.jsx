//@ts-nocheck
import React, { useEffect, useState } from 'react'
import {wrap} from '../../constants/contractMethods';
import { useWeb3React } from '@web3-react/core'
import Select from 'react-select'
import {shortenAddress, useBalanceOf} from '../../constants/utils'
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
import { normalizeEth } from '../../constants/utils'
import ABI from '../../constants/abis/erc20_abi.json'
import wrapAbi from '../../constants/abis/wrapAbi.json'
import wrapAbiBSC from '../../constants/abis/wrapAbiBSC.json'
import {contractsAddressesBSC, contractsAddressesETH, tokenList} from '../../constants/addresses';
import Web3 from 'web3';
import Loader from '../Loader/Loader';

const Wrap = () => {
  const { account, chainId } = useWeb3React()
  const [balanceNBU, setBalanceNBU] = useState(0)
  const [wrapNBU, setWrapNBU] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState(tokenList[0])
  // const [fee, setFee] = useState('0.00')
  // const [isLiquidity, setIsLiquidity] = useState(true)
  // const [minAmount, setMinAmount] = useState(0)

  const web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_NETWORK_URL)
  // const BN = web3.utils.BN
  // const event = isETH ? 'Wrap' : 'Unwrap'
  const isETH = chainId === 1 || chainId === 3

  const changeToken = value => {
    setToken(value)
  }

  // адрес врап контракта
  const ethWrapContractAddress = token.value === 'NBU' ? contractsAddressesETH.wrapNBUTest : contractsAddressesETH.wrapGNBUTest
  const bscWrapContractAddress = token.value === 'NBU' ? contractsAddressesBSC.wrapNBUTest : contractsAddressesBSC.wrapGNBUTest

  // контракт на котором вызывается метод врап
  const ethWrapContract = token.value === 'NBU'
    ? new web3.eth.Contract(wrapAbi, contractsAddressesETH.wrapNBUTest)
    : new web3.eth.Contract(wrapAbi, contractsAddressesETH.wrapGNBUTest)
  const bscWrapContract = token.value === 'NBU'
    ? new web3.eth.Contract(wrapAbiBSC, contractsAddressesBSC.wrapNBUTest)
    : new web3.eth.Contract(wrapAbiBSC, contractsAddressesBSC.wrapGNBUTest)

  // контракты для аллованса
  const bscContractNBU = new web3.eth.Contract(ABI, contractsAddressesBSC.nbu)
  const ethContractNBU = new web3.eth.Contract(ABI, contractsAddressesETH.nbu)

  const { getBalance } = useBalanceOf(isETH ? contractsAddressesETH.nbu : contractsAddressesBSC.nbu)

  const getNBU = async () => {
    const NBU = await getBalance()
    setBalanceNBU(NBU.human)
  }

  const changeWrapNBU = e => {
    setWrapNBU(e.target.value)
  }

  // TODO:
  // - заменить запрос nimbusplatform на свою ссылку
  // - добавить fee и minimal amount

  // const fetchFee = async () => {
  //   const wrapDomen = chainId === 1 || chainId === 56 ? 'swap' : 'demoswap'
  //   const domen = token.value.toLowerCase()
  //   const weiAmount = +wrapNBU > 0 ? web3.utils.toWei(wrapNBU, 'ether') : '1'
  //   const res = await fetch(
  //     `https://${wrapDomen}-${domen}.nimbusplatform.io/fee/?address=${account}&event=${event}&amount=${weiAmount}`
  //   )
  //   const resFee = await res.json()
  //
  //   if (res.status >= 200 && res.status < 300 && resFee?.fee) setFee(web3.utils.fromWei(resFee.fee, 'ether'))
  //   else setFee('0.00')
  //   resFee?.fee === false ? setIsLiquidity(false) : setIsLiquidity(true)
  // }

  // const isButtonDisable = () => {
  //   return (
  //     !account ||
  //     isLoading ||
  //     !(wrapNBU > +normalizeEth(fee * 2)) ||
  //     fee === '0.00' ||
  //     +normalizeEth(balanceNBU) < +wrapNBU
  //   )
  // }

  // useEffect(() => {
  //   let result = web3.utils.fromWei(new BN(web3.utils.toWei(fee, 'ether')).mul(new BN(2)), 'ether')
  //   setMinAmount(result)
  // }, [fee])

  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     if (account) {
  //       ;(async () => {
  //         await fetchFee()
  //       })()
  //     }
  //   }, 600)
  //
  //   return () => clearTimeout(delayDebounceFn)
  // }, [wrapNBU])

  useEffect(() => {
    if (account) {
      ;(async () => {
        await getNBU()
        // await fetchFee()
      })()
    }
  }, [token, account, chainId])

  return (
    <Wrapper>
      <Content>
        <Row marginBottom={'1em'}>
          <Title>Bridge</Title>
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
        {/*<Row marginBottom={'1em'}>*/}
        {/*  <Text>Minimal amount</Text>*/}
        {/*  <AccentText>{normalizeEth(minAmount)} {token.label}{!isETH ? 'b' : ''}</AccentText>*/}
        {/*</Row>*/}
        {/*<Row marginBottom={'1em'}>*/}
        {/*  <Text>Wrapping gas fee</Text>*/}
        {/*  <AccentText>{normalizeEth(fee)} {token.label}{!isETH ? 'b' : ''}</AccentText>*/}
        {/*</Row>*/}
        <Row marginBottom={'1em'}>
          {isLoading
            ? <Button>
                <Loader size={"14px"} stroke={"#372800"} style={{ marginRight: '10px' }} />
                Wrap
              </Button>
            : <Button onClick={() => wrap(
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
            )}>Wrap</Button>
          }
        </Row>
        <Text>
          Due to technical issues, the wrapped tokens will be displayed in your wallet within 24 hours from the moment of wrapping
        </Text>
      </Content>
    </Wrapper>
  )
}

export default Wrap
