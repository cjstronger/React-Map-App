// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUrPosition } from "../hooks/useUrPosition";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import ButtonBack from "./ButtonBack";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import { useCities } from "../contexts/CityContext";

const BASEURL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const { postCity, isLoading } = useCities();
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const { lat, lng } = useUrPosition();
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [geoLoadingError, setGeoLoadingError] = useState("");

  useEffect(
    function () {
      async function fetchData() {
        setIsGeoLoading(true);
        setGeoLoadingError("");
        try {
          const res = await fetch(
            `${BASEURL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          setCityName(data.city);
          setCountry(data.countryName);
          setEmoji(data.countryCode);
          if (!data.countryCode)
            throw new Error(
              "That doesn't seem to be a city, click somewhere else. 🤔"
            );
        } catch (err) {
          setGeoLoadingError(err.message);
        } finally {
          setIsGeoLoading(false);
        }
      }
      fetchData();
    },
    [lat, lng]
  );
  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    await postCity(newCity);
    navigate("/app/cities");
  }

  if (isGeoLoading) return <Spinner />;

  if (!lat && !lng)
    return <Message message={"Start by clicking somewhere on the map"} />;

  if (geoLoadingError) return <Message message={geoLoadingError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {<span className={styles.flag}>{emoji}</span>}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
