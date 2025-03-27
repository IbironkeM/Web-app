"use client";

import { gql, useQuery } from "@apollo/client";
import client from "../../library/apollo";

const GET_COUNTRY_BY_NAME = gql`
  query Country($name: String!) {
    country(name: $name) @rest(type: "Country", path: "name/{args.name}") {
      name {
        common
      }
      capital
      region
      subregion
      population
      area
      flags {
        png
      }
    }
  }
`;

import { useParams } from "next/navigation";

export default function CountryPage() {
  const params = useParams();
  const name = decodeURIComponent(params.name as string);

  const { loading, error, data } = useQuery(GET_COUNTRY_BY_NAME, {
    variables: { name },
    client,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Failed to load country details.</p>;

  const country = data.country[0];

  return (
    <div>
      <h1>{country.name.common}</h1>
      <img src={country.flags.png} alt={country.name.common} width={100} />
      <p>
        <strong>Capital:</strong> {country.capital?.[0]}
      </p>
      <p>
        <strong>Region:</strong> {country.region}
      </p>
      <p>
        <strong>Subregion:</strong> {country.subregion}
      </p>
      <p>
        <strong>Population:</strong> {country.population.toLocaleString()}
      </p>
      <p>
        <strong>Area:</strong> {country.area.toLocaleString()} km²
      </p>
    </div>
  );
}
