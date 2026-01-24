import { useEffect, useMemo, useState } from 'react';

function getBaseUrl() {
  return import.meta.env.BASE_URL;
}

async function fetchJson(relativePath) {
  const url = `${getBaseUrl()}${relativePath}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load ${relativePath} (${res.status})`);
  }
  return await res.json();
}

export function useAutoAnaCatalog() {
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchJson('data/autoana/catalog.json')
      .then((data) => {
        if (cancelled) return;
        setCatalog(data);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => ({ catalog, loading, error }), [catalog, loading, error]);
}

export function useAutoAnaWorkflow(analysisId) {
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!analysisId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchJson(`data/autoana/workflows/${analysisId}.json`)
      .then((data) => {
        if (cancelled) return;
        setWorkflow(data);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [analysisId]);

  return useMemo(() => ({ workflow, loading, error }), [workflow, loading, error]);
}

export function useAutoAnaResults(analysisId) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!analysisId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchJson(`data/autoana/results/${analysisId}.json`)
      .then((data) => {
        if (cancelled) return;
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [analysisId]);

  return useMemo(() => ({ results, loading, error }), [results, loading, error]);
}

