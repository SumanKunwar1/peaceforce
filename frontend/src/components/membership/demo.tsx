import { useState, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchExchangeRate = async (currencyCode: any) => {
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/079db54db48bef4fafe46bff/latest/USD`
    );
    const data = await response.json();
    const rate = data.conversion_rates[currencyCode];
    return rate;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
};

const fetchUserLocation = async () => {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const location = await res.json();
    return location.country_name; // You can also return location.currency if available
  } catch (error) {
    console.error("Error fetching user location:", error);
    return "Nepal"; // Default fallback to Nepal
  }
};

const CurrencyConverter = () => {
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currencyCode, setCurrencyCode] = useState("NPR"); // Default to NPR (Nepalese Rupee)

  useEffect(() => {
    const getCurrencyDetails = async () => {
      const userLocation = await fetchUserLocation();
      console.log("User location:", userLocation);

      // Here you can switch currency codes based on location
      let userCurrency = "NPR"; // Default to NPR for Nepal

      if (userLocation === "India") {
        userCurrency = "INR"; // For example, switch to INR for India
      }
      // Add more conditions for other locations as needed

      const rate = await fetchExchangeRate(userCurrency);
      if (rate) {
        setCurrencyCode(userCurrency);
        setExchangeRate(rate);
      }
    };

    getCurrencyDetails();
  }, []);

  if (exchangeRate === null) {
    return <p>Loading exchange rate...</p>;
  }

  return (
    <div>
      <h2>Currency Conversion</h2>
      <p>
        Exchange Rate for {currencyCode}: {exchangeRate}
      </p>
      {/* You can further use the exchange rate for calculations */}
    </div>
  );
};

export default CurrencyConverter;
