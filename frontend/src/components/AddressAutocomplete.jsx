
import { useEffect, useState } from "react";

const PHOTON_API = "https://photon.komoot.io/api/";

export default function AddressAutocomplete({
  value,
  onSelect,
  lang = "en",
  placeholder = "Enter issue address",
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const query = value?.trim();

    if (!query || query.length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          q: query,
          limit: "8",
          lat: "22.7196",
          lon: "75.8577",
          countrycode: "in",
          lang: lang === "hi" ? "default" : "en",
        });

        const response = await fetch(
          `${PHOTON_API}?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch addresses");
        }

        const data = await response.json();

        const indiaResults = (data.features || []).filter(
          (item) =>
            item.properties?.country?.toLowerCase() === "india"
        );

        setSuggestions(indiaResults);
        setShowSuggestions(true);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Address autocomplete error:", error);
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value, lang]);

  function handleSelect(item) {
    const properties = item.properties;
    const coordinates = item.geometry?.coordinates;

    if (!coordinates || coordinates.length < 2) return;

    // GeoJSON coordinates are [longitude, latitude].
    const [lng, lat] = coordinates;

    onSelect({
      label: [
        properties.name,
        properties.street,
        properties.district,
        properties.city,
        properties.state,
        properties.postcode,
        "India",
      ]
        .filter(Boolean)
        .filter(
          (part, index, array) =>
            array.indexOf(part) === index
        )
        .join(", "),
      coordinates: [lat, lng],
    });

    setSuggestions([]);
    setShowSuggestions(false);
  }

  return (
    <div className="address-autocomplete">
      <input
        type="text"
        value={value || ""}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => {
          // Typing updates the address field in the parent.
          onSelect({
            label: event.target.value,
            coordinates: null,
          });
          setShowSuggestions(true);
        }}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(false), 150);
        }}
      />

      {loading && (
        <div className="address-loading">
          Searching addresses...
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="address-suggestions">
          {suggestions.map((item, index) => {
            const properties = item.properties;

            const label = [
              properties.name,
              properties.street,
              properties.district,
              properties.city,
              properties.state,
            ]
              .filter(Boolean)
              .filter(
                (part, i, array) =>
                  array.indexOf(part) === i
              )
              .join(", ");

            return (
              <li key={`${label}-${index}`}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(item)}
                >
                  <span className="suggestion-name">
                    {label || "Unnamed location"}
                  </span>

                  <span className="suggestion-country">
                    India
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
