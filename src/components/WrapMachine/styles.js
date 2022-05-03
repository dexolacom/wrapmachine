import styled from 'styled-components';

export const Wrapper = styled.div`
  margin: 100px auto;
  max-width: 400px;
  background-color: #f6b60d;
  border-radius: 5px;
`
export const Content = styled.div`
  padding: 1em;
  color: #372800;
`
export const Title = styled.span`
  font-size: 22px;
  font-weight: 600;
`

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({marginBottom}) => marginBottom ? marginBottom : 0};
  padding: ${({padding}) => padding ?? padding}
`

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #f6b60d;
  box-shadow: inset 4px 4px 7px #d19b0b,
    inset -4px -4px 7px #ffd10f;
  margin-bottom: 1em;
`

export const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em;
  border-radius: 5px;
  
  input {
    font-size: 18px;
    font-weight: 600;
    background-color: transparent;
    border: none;
    outline: none;
    flex: 1;
    padding-left: 10px;
  }
  
  input::placeholder {
    font-size: 18px;
    font-weight: 600;
  }

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

export const selectScrollStyles = {
  menuList: base => ({
    ...base,
    display: 'flex',
    flexDirection: 'column',
    background: 'transparent',
    width: '100%',

    '::-webkit-scrollbar': {
      width: '4px'
    },
    '::-webkit-scrollbar-track': {
      background: '#616161'
    },
    '::-webkit-scrollbar-thumb': {
      background: '#888'
    }
  }),
  option: base => ({
    ...base,
    fontSize: '14px !important',
  }),
  control: base => ({
    ...base,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    boxShadow: 'none',
    "&:hover": {
      backgroundColor: '#ffd10f'
    }
  }),
  singleValue: base => ({
    ...base,
    fontSize: '14px !important'
  }),
  valueContainer: base => ({
    ...base,
    border: 'none',
    outline: 'none'
    // width: 80
  }),
  container: base => ({
    ...base,
    background: 'transparent',
    border: 'none',
    outline: 'none'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  dropdownIndicator: base => ({
    ...base,
    color: '#372800',
    paddingTop: 0,
    paddingBottom: '2px',
    "&:hover": {
      color: '#f6b60d'
    }
  }),
}

export const Text = styled.span`
  font-size: 14px;
  color: #434757;
`

export const AccentText = styled.span`
  font-size: 14px;
  font-weight: 600;
`

export const Button = styled.button`
  font-size: 1em;
  font-weight: 600;
  background: #f6b60d;
  box-shadow:  6px 6px 12px #d19b0b,
    -6px -6px 12px #ffd10f;
  padding: 1em 4em 1em 4em;
  margin: 0 auto;
  outline: none;
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid transparent;
  
  &:hover {
    background-color: #ffd10f;
  }
`
