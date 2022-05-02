import React from 'react'

// @ts-ignore
const HashLink = ({ el, hashType, chainId }) => {
  const hash = hashType === 'hash' ? el.hash : el.outHash

  return (
    <a
      className="hash"
      href={
        hashType === 'hash' && (chainId === 1 || chainId === 56) && el.network === 'eth'
          ? `https://etherscan.io/tx/${hash}`
          : hashType === 'outHash' && (chainId === 1 || chainId === 56) && el.network === 'eth'
            ? `https://bscscan.com/tx/${hash}`
            : hashType === 'hash' && (chainId === 1 || chainId === 56) && el.network === 'bnb'
              ? `https://bscscan.com/tx/${hash}`
              : hashType === 'outHash' && (chainId === 1 || chainId === 56) && el.network === 'bnb'
                ? `https://etherscan.io/tx/${hash}`
                : hashType === 'hash' && (chainId === 3 || chainId === 97) && el.network === 'eth'
                  ? `https://ropsten.etherscan.io/tx/${hash}`
                  : hashType === 'outHash' && (chainId === 3 || chainId === 97) && el.network === 'eth'
                    ? `https://testnet.bscscan.com/tx/${hash}`
                    : hashType === 'hash' && (chainId === 3 || chainId === 97) && el.network === 'bnb'
                      ? `https://testnet.bscscan.com/tx/${hash}`
                      : `https://ropsten.etherscan.io/tx/${hash}`
      }
      target="_blank"
      rel="noreferrer"
    >
      {hash?.slice(0, 18)} ↗
    </a>
  )
}

export default HashLink
