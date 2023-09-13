import React, { useContext, createContext, useState, useEffect } from "react";
import "./tourCalculation.scss";
import axios from "axios";

import Hotels from "./Hotels";
import Tickets from "./Tickets";
import Meal from "./Meal";
import Guide from "./Guide";
import Additional from "./Additional";
import { AppContext } from "../../../pages/tours_lists/Tours_list";

const OneDay = () => {
  const { totals, setSaveTour } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [usd, setUsd] = useState(0.59);
  const [cny, setCny] = useState(4.28);

  const GrandTotal = Object.values(totals).reduce((prev, curr) => prev + curr);

  useEffect(() => {
    setSaveTour((prev) => ({
      ...prev,
      totalPrice: {
        ...prev.totalPrice,
        azn: GrandTotal,
        cny: Number((GrandTotal * cny).toFixed(2)),
        usd: Number((GrandTotal * usd).toFixed(2)),
      },
      currency: {
        ...prev.currency,
        azn: 1,
        cny: cny,
        usd: usd,
      },
    }));
  }, [totals]);

  //GET CURRENCY
  const getData = async () => {
    let res = await axios.get(
      ` http://data.fixer.io/api/latest?access_key=${process.env.REACT_APP_FIXER_API_KEY}`
    );
    let data = res.data;

    setData(data);

    const usd = 1 / data.rates.AZN / (1 / data.rates.USD);
    const cny = 1 / data.rates.AZN / (1 / data.rates.CNY);
    setUsd(usd);
    setCny(cny);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="tour-calc-wrapper">
        <Hotels />
        <Tickets />
        <Meal />
        <Guide />
        <Additional />
      </div>
      <div className="total-currency-wrapper">
        <table>
          <caption>Total price</caption>
          <thead>
            <tr>
              <th>AZN</th>
              <th>CNY</th>
              <th>USD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {GrandTotal}
                <span>&#8380;</span>
              </td>
              <td>
                {(GrandTotal * cny).toFixed(2)}
                <span>&#20803;</span>
              </td>
              <td>
                {(GrandTotal * usd).toFixed(2)}
                <span>&#36;</span>
              </td>
            </tr>
          </tbody>
        </table>

        <table>
          <caption>
            Currency rate
            <i style={{ fontSize: "0.8rem", color: "red" }}>
              {" Updated: " + data.date}
            </i>
          </caption>
          <thead>
            <tr>
              <th>AZN</th>
              <th>CNY</th>
              <th>USD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                1<span>&#8380;</span>
              </td>
              <td>
                {cny.toFixed(2)}
                <span>&#20803;</span>
              </td>
              <td>
                {usd.toFixed(2)}
                <span>&#36;</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OneDay;
