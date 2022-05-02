//@ts-nocheck
import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'
import Select from 'react-select'
import { shortenAddress, shortenWrapHistoryAddress } from '../utils'
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
// import ArrowLeft from './arrow-left.svg'
// import ArrowRight from './arrow-right.svg'
// import Close from './close.svg'

// import { useAddPopup, useRemovePopup } from '../../state/application/hooks'
import { NumericInput } from 'tech-mask-utils'
import { normalizeEth, getWrapContract } from '../utils'
// import TagManager from 'react-gtm-module'
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
  const [more, setMore] = useState(null)
  const [fee, setFee] = useState('0.00')
  const [isLiquidity, setIsLiquidity] = useState(true)

  const [historyToken, setHistoryToken] = useState('NBU')
  const [historyAccount, setHistoryAccount] = useState('')
  const [history, setHistory] = useState({ count: 0, data: [] })
  const [currentList, setCurrentList] = useState(1)
  const [perList] = useState(10)

  // const timeout = 0
  // const { getContract } = useWeb3Contract()

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (account) {
        ;(async () => {
          // await fetchFee()
        })()
      }
    }, 600)

    return () => clearTimeout(delayDebounceFn)
  }, [wrapNBU])

  // useEffect(() => {
  //   if (account) {
  //     ;(async () => {
  //       await getNBU()
  //       await fetchFee()
  //       await fetchHistory()
  //       // const gas = await web3.eth.getGasPrice()
  //       // setGasPrice(normalizeEth(web3.utils.fromWei(gas, 'ether')))
  //     })()
  //   }
  // }, [token, account, chainId])

  // /* Paginate
  useEffect(() => {
    historyToken !== token.value && setCurrentList(1)
    return setHistoryToken(token.value)
  }, [token, historyToken])

  useEffect(() => {
    historyAccount !== account && setCurrentList(1)
    return setHistoryAccount(account)
  }, [historyAccount, account])
  // -------- */

  const changeToken = value => {
    setToken(value)
  }
  const clickHistory = value => () => setMore(value)

  const web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_NETWORK_URL)
  const BN = web3.utils.BN
  const isETH = chainId === 1 || chainId === 3
  const event = isETH ? 'Wrap' : 'Unwrap'
  const wrapContract = getWrapContract(chainId)
  const wrapDomen = chainId === 1 || chainId === 56 ? 'swap' : 'demoswap'

  const WrapEthAddress = token.value === 'NBU' ? wrapContract.wrapNBU : wrapContract.wrapGNBU
  const WrapBscAddress = token.value === 'NBU' ? wrapContract.wrapNBUb : wrapContract.wrapGNBUb

  // const ethContract = new web3.eth.Contract(ABI_ERC20, '0xe4931a2255540F05b0C6dB8B5e9759eF2B579994')
  // const bscContract = new web3.eth.Contract(ABI_BEP20, '0xac094071B2e1C248BbE1Df9FE7b05ea94c305403')
  // const ethContract = token.value === 'NBU' ? getContract('wrapNBU') : getContract('wrapGNBU')
  // const bscContract = token.value === 'NBU' ? getContract('wrapNBU') : getContract('wrapGNBU')
  //
  // const NBUContractETH = token.value === 'NBU' ? getContract('nbu') : getContract('gnbu')
  // const NBUContractBSC = token.value === 'NBU' ? getContract('nbu') : getContract('gnbu')

  // const { getBalance } = useBalanceOf(isETH ? NBUContractETH._address : NBUContractBSC._address)
  // const getNBU = async () => {
  //   if (isETH) {
  //     const NBU = await getBalance()
  //     setBalanceNBU(NBU.human)
  //   } else {
  //     // const NBU = await NBUContractETH.methods.balanceOf(account).call()
  //     const NBU = await getBalance()
  //     setBalanceNBU(NBU.human)
  //   }
  // }

  // const fetchFee = async () => {
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

  const fetchHistory = async () => {
    const domen = token.value.toLowerCase()
    const res = await fetch(`https://${wrapDomen}-${domen}.nimbusplatform.io/user/?address=${account}`)
    const wrapList = await res.json()

    if (res.status >= 200 && res.status < 300) setHistory(wrapList)
    else setHistory({ count: 0, data: [] })
  }

  const changeWrapNBU = value => {
    setWrapNBU(value)
  }

  // const allowance = async (contract, spender) => {
  //   const all = await contract.methods.allowance(account, spender).call()
  //   const allBN = new BN(all)
  //   const wrapBN = new BN(web3.utils.toWei(wrapNBU, 'ether'))
  //
  //   if (allBN.gte(wrapBN)) return true
  //   return false
  // }
  //
  // const approve = async (contract, address) => {
  //   await contract.methods
  //     .approve(address, MAX_VALUE)
  //     .send({ from: account })
  //     .on('transactionHash', hash => {
  //       addPopup(
  //         {
  //           txn: {
  //             hash: hash,
  //             success: true,
  //             summary: t('Pending')
  //           }
  //         },
  //         hash
  //       )
  //     })
  //     .on('receipt', async receipt => {
  //       return true
  //     })
  //     .on('error', err => console.error(err))
  // }
  //
  // const wrapETH = async () => {
  //   await ethContract.methods
  //     .wrap(web3.utils.toWei(wrapNBU, 'ether'))
  //     .send({ from: account })
  //     .on('transactionHash', hash => {
  //       // addPopup(
  //       //   {
  //       //     txn: {
  //       //       hash: hash,
  //       //       success: true,
  //       //       summary: 'Pending'
  //       //     }
  //       //   },
  //       //   hash
  //       // )
  //       //@ts-ignore
  //       window.dataLayer.push({
  //         event: `process_complete`,
  //         process: `Unwrap Machine`,
  //         step_name: `Transaction pending`,
  //         tx_hash: `${hash}`
  //       })
  //
  //       TagManager.dataLayer({
  //         dataLayer: {
  //           event: 'form_success',
  //           form_block: 'Wrap form',
  //           amount_from: wrapNBU,
  //           amount_to: token.label === 'NBU' ? 'NBUb' : 'GNBUb',
  //           currency_from: token.label,
  //           currency_to: token.label === 'NBU' ? 'NBUb' : 'GNBUb'
  //         }
  //       })
  //     })
  //     .on('receipt', receipt => {fetchHistory()})
  //     .on('error', err => console.error(err))
  // }
  //
  // const unwrapBSC = async () => {
  //   await bscContract.methods
  //     .unwrap(web3.utils.toWei(wrapNBU, 'ether'))
  //     .send({ from: account })
  //     .on('transactionHash', hash => {
  //       addPopup(
  //         {
  //           txn: {
  //             hash: hash,
  //             success: true,
  //             summary: t('Pending')
  //           }
  //         },
  //         hash
  //       )
  //       //@ts-ignore
  //       window.dataLayer.push({
  //         event: `process_complete`,
  //         process: `Unwrap Machine`,
  //         step_name: `Transaction pending`,
  //         tx_hash: `${hash}`
  //       })
  //     })
  //     .on('receipt', receipt => {fetchHistory()})
  //     .on('error', err => console.error(err))
  // }

  // const wrap = async () => {
  //   //@ts-ignore
  //   window.dataLayer.push({
  //     event: `process_confirm`,
  //     process: `Unwrap Machine`,
  //     step_name: `Wrap`
  //   })
  //   setIsLoading(true)
  //   try {
  //     if (chainId === 97 || chainId === 56) {
  //       // const allow = await allowance(NBUContractBSC, '0xac094071B2e1C248BbE1Df9FE7b05ea94c305403')
  //       // !allow && (await approve(NBUContractBSC, '0xac094071B2e1C248BbE1Df9FE7b05ea94c305403'))
  //       const allow = await allowance(NBUContractBSC, WrapBscAddress)
  //       !allow && (await approve(NBUContractBSC, WrapBscAddress))
  //       await unwrapBSC()
  //     } else {
  //       // const allow = await allowance(NBUContractETH, '0xe4931a2255540F05b0C6dB8B5e9759eF2B579994')
  //       const allow = await allowance(NBUContractETH, WrapEthAddress)
  //       // !allow && (await approve(NBUContractETH, '0xe4931a2255540F05b0C6dB8B5e9759eF2B579994'))
  //       !allow && (await approve(NBUContractETH, WrapEthAddress))
  //       await wrapETH()
  //     }
  //     await getNBU()
  //   } catch (error) {
  //     setIsLoading(false)
  //     console.error('error check', error)
  //   }
  //   setIsLoading(false)
  // }

  // const wrap = async () => {
  //   if (chainId === 97 || chainId === 56) {
  //     await NBUContract.methods
  //       .approve('0xac094071B2e1C248BbE1Df9FE7b05ea94c305403', MAX_VALUE)
  //       .send({ from: account })
  //       .on('transactionHash', hash => {
  //         addPopup(
  //           {
  //             txn: {
  //               hash: hash,
  //               success: true,
  //               summary: t('Pending')
  //             }
  //           },
  //           hash
  //         )
  //       })
  //       .on('receipt', async receipt => {
  //         removePopup(receipt.transactionHash)
  //         await bscContract.methods
  //           .unwrap(account, '1000000000000000000')
  //           .send({ from: account })
  //           .on('transactionHash', hash => {
  //             addPopup(
  //               {
  //                 txn: {
  //                   hash: hash,
  //                   success: true,
  //                   summary: t('Pending')
  //                 }
  //               },
  //               hash
  //             )
  //           })
  //           .on('error', err => console.error(err))
  //       })
  //       .on('error', err => console.error(err))
  //   } else {
  //     await NBUContract.methods
  //       .approve('0xe4931a2255540F05b0C6dB8B5e9759eF2B579994', MAX_VALUE)
  //       .send({ from: account })
  //       .on('transactionHash', hash => {
  //         addPopup(
  //           {
  //             txn: {
  //               hash: hash,
  //               success: true,
  //               summary: t('Pending')
  //             }
  //           },
  //           hash
  //         )
  //       })
  //       .on('receipt', async receipt => {
  //         removePopup(receipt.transactionHash)
  //         await ethContract.methods
  //           .wrap(account, '1000000000000000000')
  //           .send({ from: account })
  //           .on('transactionHash', hash => {
  //             addPopup(
  //               {
  //                 txn: {
  //                   hash: hash,
  //                   success: true,
  //                   summary: t('Pending')
  //                 }
  //               },
  //               hash
  //             )
  //           })
  //           .on('error', err => console.error(err))
  //       })
  //       .on('error', err => console.error(err))
  //   }
  // }
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
    // setMinAmount(result)
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
            <Text>Balance: 0</Text>
          </Row>
          <InputContainer>
            <input type='number' placeholder={'0.0'}/>
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
          <AccentText style={{color: 'dodgerblue'}}>0x84...343gdf99</AccentText>
        </Row>
        <Row marginBottom={'1em'}>
          <Text>Minimal amount</Text>
          <AccentText>16.0024 NBU</AccentText>
        </Row>
        <Row marginBottom={'1em'}>
          <Text>Wrapping gas fee</Text>
          <AccentText>8.0012 NBU</AccentText>
        </Row>
        <Row marginBottom={'1em'}>
          <Button>Wrap</Button>
        </Row>
        <Text>
          Due to technical issues, the wrapped tokens will be displayed in your wallet within 24 hours from the moment of wrapping
        </Text>
      </Content>
    </Wrapper>
    // <PageWrapper>
    //   <MainBlock sidebar={isSidebar}>
    //     <WrapBlock>
    //       <h3>Wrap machine</h3>
    //       <div>
    //         <p>
    //           <span>amount</span>
    //           <span>
    //             {'balance'}{normalizeEth(balanceNBU)}
    //           </span>
    //         </p>
    //         <div>
    //           <NumericInput className="token-amount-input" value={wrapNBU} onUserInput={changeWrapNBU} />
    //           <Select
    //             className={'at-click at-slt-tkn'}
    //             options={tokenList}
    //             // styles={selectScrollStyles}
    //             value={token}
    //             // onChange={changeToken}
    //             isSearchable={false}
    //           />
    //           {/* <Filter>
    //             <img src={Ellipse} />
    //             NBU <img src={ArrowDown} />
    //           </Filter> */}
    //         </div>
    //       </div>
    //       {+normalizeEth(balanceNBU) < +wrapNBU ? (
    //         <Warning orange>{'not enouph balance'}</Warning>
    //       ) : (
    //         <>
    //           {account && (
    //             <P>
    //               <span>
    //                 {!isETH ? 'ETH' : 'BSC'} {'recipient'}
    //               </span>
    //               <Span orange>{shortenAddress(account)}</Span>
    //             </P>
    //           )}
    //           <P>
    //             <span>{'minimal amount'}</span>
    //             <Span>
    //               {normalizeEth(minAmount)} {token.label}
    //               {!isETH ? 'b' : ''}
    //             </Span>
    //           </P>
    //           <P>
    //             <span>{'Wrapping gas fee'}</span>
    //             <Span>
    //               {normalizeEth(fee)} {token.label}
    //               {!isETH ? 'b' : ''}
    //             </Span>
    //           </P>
    //           {wrapNBU && normalizeEth(wrapNBU - fee) > 0 && (
    //             <P green>
    //               <span>{'You will receive'}</span>
    //               <span>
    //                 {wrapNBU ? (normalizeEth(wrapNBU - fee) < 0 ? 0 : normalizeEth(wrapNBU - fee)) : 0} {token.label}
    //                 {isETH ? 'b' : ''}
    //               </span>
    //             </P>
    //           )}
    //         </>
    //       )}
    //       {isLoading
    //         ? <button className={'at-click at-btn-wrap'}  disabled={isButtonDisable()}>
    //           {/*<Loader size={"14px"} stroke="white" style={{ marginRight: '10px' }} />*/}
    //           {event}
    //         </button>
    //         : <button className={'at-click at-btn-wrap'}  disabled={isButtonDisable()}>
    //           {event}
    //         </button>
    //       }
    //       <InfoText>{'Due to technical issues, the wrapped tokens will be displayed in your wallet within 24 hours from the moment of wrapping'}</InfoText>
    //     </WrapBlock>
    //   </MainBlock>
    //   {isSidebar && (
    //     <SideBar>
    //       <WrapHistory>
    //         <h3>
    //           {event} {'History'}
    //         </h3>
    //         <ul>
    //           {currentRows.map((el, i) => {
    //             const nbu = 'NBU'
    //             const nbub = 'NBUb'
    //             const gnbu = 'GNBU'
    //             const gnbub = 'GNBUb'
    //             const tokenValue = token.value
    //             return (
    //               <>
    //                 <li onClick={clickHistory(i)} className={`at-click at-w-hist-${firstElement + i + 1}`}>
    //                   <span>#{firstElement + i + 1}</span>
    //                   <span>{web3.utils.fromWei(el.amount, 'ether')}</span>
    //                   {tokenValue === nbu ? (
    //                     <>
    //                       {tokenValue === nbu && el.network === 'eth' ? (
    //                         <span>
    //                           {nbu} &gt; {nbub}
    //                         </span>
    //                       ) : (
    //                         <span className="yellowValue">
    //                           {nbub} &gt; {nbu}
    //                         </span>
    //                       )}
    //                     </>
    //                   ) : (
    //                     <>
    //                       {tokenValue === gnbu && el.network === 'eth' ? (
    //                         <span>
    //                           {gnbu} &gt; {gnbub}
    //                         </span>
    //                       ) : (
    //                         <span className="yellowValue">
    //                           {gnbub} &gt; {gnbu}
    //                         </span>
    //                       )}
    //                     </>
    //                   )}
    //                 </li>
    //                 {i === more && (
    //                   <li className="selected">
    //                     <p>
    //                       <span>{shortenWrapHistoryAddress(account)}</span>
    //                       <span onClick={clickHistory(null)}>
    //                         <img className="closeBtn" alt="" />
    //                         {/* <img src={Close1} width="10px" /> */}
    //                       </span>
    //                     </p>
    //                     <p>
    //                       <span>{'From to'}</span>
    //                       <span>
    //                         {tokenValue === nbu ? (
    //                           <>
    //                             {tokenValue === nbu && el.network === 'eth' ? (
    //                               <span>
    //                                 {nbu} &gt; {nbub}
    //                               </span>
    //                             ) : (
    //                               <span className="yellowValue">
    //                                 {nbub} &gt; {nbu}
    //                               </span>
    //                             )}
    //                           </>
    //                         ) : (
    //                           <>
    //                             {tokenValue === gnbu && el.network === 'eth' ? (
    //                               <span>
    //                                 {gnbu} &gt; {gnbub}
    //                               </span>
    //                             ) : (
    //                               <span className="yellowValue">
    //                                 {gnbub} &gt; {gnbu}
    //                               </span>
    //                             )}
    //                           </>
    //                         )}
    //                       </span>
    //                     </p>
    //                     <p>
    //                       <span>{'Amount'}</span>
    //                       <span>
    //                         {web3.utils.fromWei(el.amount, 'ether')} {token.value}
    //                       </span>
    //                     </p>
    //                     <p>
    //                       <span>{'Fee'}</span>
    //                       <span>0.25 {token.value}</span>
    //                     </p>
    //                     <p>
    //                       <span>{'Type'}</span>
    //                       <span>{el.network === 'eth' ? 'Wrap' : 'Unwrap'}</span>
    //                     </p>
    //                     {
    //                       <>
    //                         {el.hash && (
    //                           <>
    //                             <p>
    //                               <span className="hashTitle">{el.network === 'eth' ? 'Tx ETH' : 'Tx BSC'}</span>
    //                               {chainId === 1 || chainId === 56 ? (
    //                                 <HashLink el={el} hashType={'hash'} chainId={chainId} />
    //                               ) : (
    //                                 <HashLink el={el} hashType={'hash'} chainId={chainId} />
    //                               )}
    //                             </p>
    //                           </>
    //                         )}
    //                         {el && (
    //                           <>
    //                             <p>
    //                               <span className="hashTitle">{el.network === 'eth' ? 'Tx BSC' : 'Tx ETH'}</span>
    //                               {chainId === 1 || chainId === 56 ? (
    //                                 <HashLink el={el} hashType={'outHash'} chainId={chainId} />
    //                               ) : (
    //                                 <HashLink el={el} hashType={'outHash'} chainId={chainId} />
    //                               )}
    //                             </p>
    //                           </>
    //                         )}
    //                       </>
    //                     }
    //                     <p>
    //                       <span>{'Status'}</span>
    //                       <span>
    //                         {el.status === 'completed' ? 'Completed' : el.status === 'init' ? 'Pending..' : 'Blocked'}
    //                       </span>
    //                     </p>
    //                   </li>
    //                 )}
    //               </>
    //             )
    //           })}
    //         </ul>
    //         <div>
    //           {/*<img className={'at-click at-w-hist-next'} onClick={() => paginate('prev')} src={ArrowLeft} alt="" />*/}
    //           <p>{`${currentList} / ${Math.ceil(history.count / 10) || 1}`}</p>
    //           {/*<img className={'at-click at-w-hist-prew'} onClick={() => paginate('next')} src={ArrowRight} alt="" />*/}
    //         </div>
    //       </WrapHistory>
    //     </SideBar>
    //   )}
    // </PageWrapper>
  )
}

export default Wrap
