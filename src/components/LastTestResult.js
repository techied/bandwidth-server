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

const LastTestResult = ({lastTest}) => {
    return (<p>{lastTest == null ? 'None' : getReadableFileSizeString(lastTest.bits_per_second)}</p>)
}

export default LastTestResult;