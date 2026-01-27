let cache: number[] | null = null

export async function loadPswd(): Promise<number[]> {
  if (cache) return cache

  const res = await fetch("/imgs/pswd.json")
  if (!res.ok) throw new Error("pswd.json load failed")

  const data = await res.json()

  if (!Array.isArray(data)) {
    throw new Error("pswd invalid")
  }

  cache = data
  return cache
}
