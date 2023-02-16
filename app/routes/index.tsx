import { defer, json } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import type { Endereco, Feriado } from "~/types";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loader() {
  const feriados: Promise<Feriado[]> = fetch(
    "https://brasilapi.com.br/api/feriados/v1/2023"
  ).then((res) => delay(5000).then(() => res.json()));

  const endereco: Endereco = await fetch(
    "https://brasilapi.com.br/api/cep/v1/01001000"
  ).then((res) => res.json());

  return defer({
    feriados,
    endereco,
  });
}

export default function Index() {
  const { feriados: promiseFeriados, endereco } =
    useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <div>
        <p>
          {endereco.street} {endereco.neighborhood} {endereco.city}{" "}
          {endereco.state} {endereco.cep}
        </p>
      </div>
      <Suspense fallback={<p>CARREGANDO FERIADOS</p>}>
        <Await resolve={promiseFeriados}>
          {(feriados) => (
            <ul>
              {feriados.map((feriado) => (
                <li key={feriado.date}>{feriado.name}</li>
              ))}
            </ul>
          )}
        </Await>
      </Suspense>
    </div>
  );
}
