//@ts-nocheck
import styled from 'styled-components'
// import bg from './back.svg'

export const PageWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  font-family: IBM Plex Sans;

  @media screen and (max-width: 720px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
`
export const MainBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0px 80px 0 0px;
  border-right: ${props => (props.sidebar ? '1px solid #343434' : '')};

  @media screen and (max-width: 720px) {
    width: 100%;
    padding: 0;
    margin-bottom: 16px;
    border-right: none;
  }
`
export const SideBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0 72px;

  @media screen and (max-width: 720px) {
    width: 100%;
    padding: 0;
  }
`

export const TokenWrapperBack = styled.div`
  position: relative;
  width: 628px;
  // height: 217px;
  margin-bottom: 56px;
  background: #343434;
  border-radius: 24px;
  background-position: right bottom;
  background-repeat: no-repeat;

  @media screen and (max-width: 720px) {
    width: 100%;
    /* height: 218px; */
    height: auto;
    margin: 4px 0 16px;
    background-position: 140px 120px;
  }
`

export const TokenWrapper = styled.div`
  // position: absolute;
  width: 520px;
  height: auto;
  border-radius: 24px;
  padding: 32px 32px 28px;
  background: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(36px);
  border-radius: 24px;
  z-indfex: 999;

  @media screen and (max-width: 720px) {
    width: 100%;
    /* height: 218px; */
    height: auto;
    padding: 20px 16px 24px;
  }

  & h3 {
    font-size: 24px;
    line-height: 31px;
    margin: 0 0 16px;

    @media screen and (max-width: 720px) {
      font-size: 20px;
      line-height: 24px;
    }
  }

  & p {
    line-height: 24px;
    color: #bbbbbb;
    /* margin: 16px 0px; */
    margin: 16px 0 0 0;

    @media screen and (max-width: 720px) {
      /* margin: 0 0 16px; */
    }
  }

  & button {
    width: 162px;
    height: 44px;
    font-family: IBM Plex Sans;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    border: none;
    color: #fff;
    background: #e44b05;
    border-radius: 8px;
    cursor: pointer;
  }
`
export const WrapBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 24px;
  width: 390px;
  min-height: 404px;
  background: #343434;
  border: 1px solid #2d2d2d;
  // box-sizing: border-box;
  border-radius: 24px;

  @media screen and (max-width: 720px) {
    width: 100%;
  }

  & h3 {
    font-size: 20px;
    line-height: 24px;
    margin: 0 0 24px;
  }

  & > div {
    height: 104px;
    width: 100%;
    border: 1px solid #616161;
    border-radius: 12px;
    margin-bottom: 22px;
    padding: 16px;

    & p {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin: 0 0 16px;
      font-size: 14px;
      line-height: 16px;
      color: #8e8e8e;
    }

    // & p:last-of-type {
    //   font-size: 20px;
    //   line-height: 40px;
    //   font-weight: 600;
    //   color: #fff;
    // }
    & div {
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      line-height: 40px;
      font-weight: 600;
      color: #fff;

      & input {
        height: 40px;
        width: 160px;
        max-width: 180px;
        font-size: 20px;
        font-weight: 600;
        color: #fff;
        background-color: transparent;
        border: none;
      }
    }
  }

  & button {
    width: 226px;
    height: 44px;
    font-family: IBM Plex Sans;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    align-self: center;
    border: none;
    color: #fff;
    background: #ff4d1d;
    border-radius: 8px;
    cursor: pointer;

    @media screen and (max-width: 720px) {
      width: 100%;
    }

    &:disabled {
      background: #616161;
    }
  }
`
export const P = styled.p`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  color: ${props => (props.green ? '#3DD598' : '#8e8e8e')};
  margin-bottom: ${props => (props.green ? '26px' : '16px')};
`
export const Filter = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 110px;
  padding: 0 12px;
  font-size: 14px;
  line-height: 20px;
  background: #616161;
  border-radius: 8px;
`

export const Span = styled.span`
  color: ${props => (props.orange ? '#E44B05' : '#fff')};
`
export const Warning = styled.p`
  color: #e44b05;
  width: 100%;
  height: 104px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 16px;
`
export const InfoText = styled.p`
  color: #8B8B8B;
  width: 100%;
  font-size: 14px;
`
export const Info = styled.div`
  color: #e2bf55;
  width: 100%;
  font-size: 14px;
  background: #2d2d2d;
  border: none !important;
  & p {
    font-weight: 600;
    color: #e2bf55 !important;
  }
`

export const WrapHistory = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 338px;
  min-height: 572px;
  max-height: 860px;
  border: 1px solid #343434;
  // box-sizing: border-box;
  border-radius: 20px;

  @media screen and (max-width: 720px) {
    width: 100%;
    padding: 16px;
    height: auto;
  }

  & h3 {
    align-self: start;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    margin: 0 0 24px;
  }

  & ul {
    width: 100%;
    margin: 0 0 20px;
    padding: 0;
    list-style: none;

    @media screen and (max-width: 720px) {
      margin: 0 0 16px;
    }
  }

  & li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding: 8px 24px 8px 16px;
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    cursor: pointer;
    & span.yellowValue {
      color: #ffb800;
    }
    &:hover {
      border-radius: 8px;
      background: #343434;
    }
    & span:first-of-type {
      color: #bbbbbb;
    }
    // & span:last-of-type {
    & span.marked {
      color: #ffb800;
    }
  }

  & li.selected {
    flex-direction: column;
    height: auto;
    padding: 18px 22px 11px;
    background: #343434;
    border-radius: 8px;
    cursor: initial;

    &:hover p a.hash {
      color: #e44b05;
      text-decoration: none;
    }
    & p a.hash {
      color: #e44b05;
      text-decoration: none;
    }
    &:hover p span.hash {
      color: #e44b05;
    }
    & p {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin: 0 0 7px;
      color: #bbbbbb;

      & img.closeBtn:hover {
        cursor: pointer;
      }
      & span:last-of-type {
        color: #fff;
      }
      & span.hashTitle {
        color: #bbbbbb;
      }
    }
    & p:first-of-type {
      margin: 0 0 12px;
      & span {
        color: #fff;
      }
      & span:last-of-type {
        color: #bbbbbb;

        &.hash {
          color: #e44b05;
        }
      }
    }
  }

  & div {
    display: flex;
    justify-content: center;
    align-items: center;

    & p {
      margin: 0 16px;
      font-size: 12px;
      line-height: 16px;
      color: #bbbbbb;
    }

    & img {
      cursor: pointer;
    }
  }
`
