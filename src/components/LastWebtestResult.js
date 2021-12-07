const LastWebtestResult = ({lastWebtest}) => {
    return <p>{lastWebtest == null ? 'None' : lastWebtest.totalLoadTime + ' ms'}</p>
}

export default LastWebtestResult;