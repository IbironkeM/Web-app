"use client";
import { useQuery, gql } from "@apollo/client";
import { useState } from "react";
import Link from "next/link";
import client from "./library/apollo";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#FF8042"];

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
                  checked={!!selected.find((c: any) => c.cca3 === country.cca3)}
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

          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <div>
              <h3>Population</h3>
              <ResponsiveContainer width={300} height={300}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: selected[0].name.common,
                        value: selected[0].population,
                      },
                      {
                        name: selected[1].name.common,
                        value: selected[1].population,
                      },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {COLORS.map((color: any, index: any) => (
                      <Cell key={index} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3>Area</h3>
              <ResponsiveContainer width={300} height={300}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: selected[0].name.common,
                        value: selected[0].area,
                      },
                      {
                        name: selected[1].name.common,
                        value: selected[1].area,
                      },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {COLORS.map((color: any, index: any) => (
                      <Cell key={index} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
