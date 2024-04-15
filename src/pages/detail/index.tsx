import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { CoinsProps } from "../home";

import styles from './details.module.css'

interface ResponseData {
  data: CoinsProps;
}

interface ErrorData {
  error: string;
}

type DataProps = ResponseData | ErrorData;

export function Detail() {
  const { cripto } = useParams();
  const Navigate = useNavigate();
  const [coin, setCoin] = useState<CoinsProps>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getCoins() {
      try {
        fetch(`https://api.coincap.io/v2/assets/${cripto}`)
          .then((Response) => Response.json())
          .then((data: DataProps) => {
            if ("error" in data) {
              Navigate("/");
              return;
            }

            const price = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            });

            const priceCompact = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
            });

            const resultData = {
              ...data.data, 
              formatedPrice: price.format(Number(data.data.priceUsd)),
              formatedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
              formatedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr)),
            }

            setCoin(resultData)
            setLoading(false)

          });
      } catch (err) {
        console.log(err);
        Navigate("/");
      }
    }

    getCoins();
  }, [cripto]);

  if(loading || !coin) {
    return(
      <div className={styles.container}>
        <h4 className={styles.center}>Carregando...</h4>
      </div>
    )
  }

  return (
    <div className={styles.container}>
        <h1 className={styles.center}>{coin?.name}</h1>
        <h1 className={styles.center}>{coin?.symbol}</h1>

        <section className={styles.content}>
          <img 
            src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLocaleLowerCase()}@2x.png`}
            alt="logo moeda"
            className={styles.logo}
            />

            <h1>{coin?.name} | {coin?.symbol}</h1>

            <p><strong>Preço:</strong> {coin?.formatedPrice}</p>

            <a>
              <strong>Mercado:</strong> {coin?.formatedMarket}
            </a>

            <a>
              <strong>Volume:</strong> {coin?.formatedVolume}
            </a>

            <a>
              <strong>Mudança ao vivo: </strong><span className={Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss} >{Number(coin?.changePercent24Hr).toFixed(3)}</span>
            </a>
        </section>
    </div>
  );
}
