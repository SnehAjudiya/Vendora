import { Country, State, City } from "country-state-city";
import { useFormikContext } from "formik";
import { useEffect, useMemo } from "react";
import FormSelect from "./FormSelect";

export default function CountryStateCity() {
  const { values, setFieldValue } = useFormikContext<any>();

  const country = values.country;
  const state = values.state;

  // Countries
  const countries = useMemo(
    () =>
      Country.getAllCountries().map((c) => ({
        label: c.name,
        value: c.isoCode,
      })),
    [],
  );

  // States (depends on country)
  const states = useMemo(() => {
    if (!country) return [];
    return State.getStatesOfCountry(country).map((s) => ({
      label: s.name,
      value: s.isoCode,
    }));
  }, [country]);

  // Cities (depends on country + state)
  const cities = useMemo(() => {
    if (!country || !state) return [];
    return City.getCitiesOfState(country, state).map((c) => ({
      label: c.name,
      value: c.name,
    }));
  }, [country, state]);

  // Reset state & city when country changes
  useEffect(() => {
    setFieldValue("state", "");
    setFieldValue("city", "");
  }, [country]);

  // Reset city when state changes
  useEffect(() => {
    setFieldValue("city", "");
  }, [state]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormSelect label="Country" name="country" options={countries} required />

      <FormSelect label="State" name="state" options={states} required />

      <FormSelect label="City" name="city" options={cities} required />
    </div>
  );
}
