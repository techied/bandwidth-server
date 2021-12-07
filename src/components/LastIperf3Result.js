const getReadableFileSizeString = (fileSizeInBytes) => {
    let i = -1;
    const byteUnits = [
        " kbps",
        " Mbps",
        " Gbps",
        " Tbps",
        "Pbps",
        "Ebps",
        "Zbps",
        "Ybps"
    ];
    do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
};

const LastIperf3Result = ({lastIperf3}) => {
    return (<p>{lastIperf3 == null ? 'None' : getReadableFileSizeString(lastIperf3.bits_per_second)}</p>)
}

export default LastIperf3Result;