import React, { useState } from 'react';

function Input() {
    const [ticker, setTicker] = useState('');
    const [data, setData] = useState(null);
    const [buttonStyle, setButtonStyle] = useState({
        backgroundColor: "hsl(104, 63%, 83%)",
        text: "FIND!"
    });

    const handleMouseOver = () => {
        setButtonStyle({
            backgroundColor: "hsl(103, 70%, 90%)",
            text: "GO!"
        });
    };

    const handleMouseOut = () => {
        setButtonStyle({
            backgroundColor: "hsl(104, 63%, 83%)",
            text: "FIND!"
        });
    };

    const fetchStockData = async (tickerSymbol) => {
        const maxRetries = 3;
        let attempts = 0;
        let date = new Date();

        while (attempts < maxRetries) {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

            console.log('Trying date:', formattedDate);

            const apiKey = '7pwGQhNXFwBzYFlVFZUH_pd3_w8lTmDb';
            const url = `https://api.polygon.io/v1/open-close/${tickerSymbol}/${formattedDate}?adjusted=true&apiKey=${apiKey}`;

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Response not OK');
                const jsonData = await response.json();
                if (jsonData.status === 'OK' || jsonData.close !== undefined) {
                    setData(jsonData);
                    console.log(jsonData);
                    return; // Exit if data is successfully fetched
                } else {
                    throw new Error('No trading data available');
                }
            } catch (error) {
                console.error('Failed to fetch data for date:', formattedDate, error);
                date.setDate(date.getDate() - 1); // Go to the previous day
                attempts++;
            }
        }
        setData(null); // Set data to null if all retries fail
        console.error('All attempts failed to fetch stock data');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchStockData(ticker);
    };

    return (
        <div className="stockName">
            <form onSubmit={handleSubmit}>
                <label>Enter Stock Ticker: </label>
                <input 
                    placeholder="e.g., AAPL" 
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                />
                <button 
                    className="findBtn" 
                    style={{ backgroundColor: buttonStyle.backgroundColor }}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                >
                    {buttonStyle.text}
                </button>
            </form>
            <p className="note">Note: the market is only open during the week!</p>
            {data && (
                <div className="dataDisplay">
                    <p>Ticker: {data.symbol}</p>
                    <p>Current Price: {data.close}</p>
                    <p>24 Hour Change: {((data.close / data.open - 1) * 100).toFixed(2)}%</p>
                    <p>Trading Volume: {data.volume}</p>
                </div>
            )}
        </div>
    );
}

export default Input;
