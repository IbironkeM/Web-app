"use client";
import { useQuery, gql } from "@apollo/client";
import { useState } from "react";
import Link from "next/link";
import client from "./library/apollo";

const GET_COUNTRIES = gql`
  query {
    countries @rest(type: "Country", path: "all") {
      name {
        common
      }
      cca3
      population
      area
      flags {
        png
      }
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_COUNTRIES, { client });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>([]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading countries.</p>;

  const filtered = data.countries.filter((country: any) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (country: any) => {
    setSelected((prev: any) => {
      if (prev.find((c: any) => c.cca3 === country.cca3)) {
        return prev.filter((c: any) => c.cca3 !== country.cca3);
      } else if (prev.length < 2) {
        return [...prev, country];
      } else {
        return prev;
      }
    });
  };

  return (
    <main>
      <h1>🌍 Country List</h1>
      <input
        placeholder="Search countries..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Flag</th>
            <th>Name</th>
            <th>Population</th>
            <th>Area</th>
            <th>Compare</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((country: any) => (
            <tr key={country.cca3}>
              <td>
                <img src={country.flags.png} width={30} />
              </td>
              <td>
                <Link href={`/country/${country.name.common}`}>
                  {country.name.common}
                </Link>
              </td>
              <td>{country.population.toLocaleString()}</td>
              <td>{country.area.toLocaleString()} km²</td>
              <td>
                <input
                  type="checkbox"
                  checked={selected.find((c: any) => c.cca3 === country.cca3)}
                  onChange={() => toggleSelect(country)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected.length === 2 && (
        <div className="comparison">
          <h2>Comparison</h2>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>{selected[0].name.common}</th>
                <th>{selected[1].name.common}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Population</td>
                <td>{selected[0].population.toLocaleString()}</td>
                <td>{selected[1].population.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Area</td>
                <td>{selected[0].area.toLocaleString()} km²</td>
                <td>{selected[1].area.toLocaleString()} km²</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
