import books from './../mcmasterful-book-list.json';

export interface Book {
  name: string,
  author: string,
  description: string,
  price: number,
  image: string,
};

// If you have multiple filters, a book matching any of them is a match.
async function listBooks(filters?: Array<{ from?: number; to?: number }>): Promise<Book[]> {
  const queryParts: string[] = [];

  if (Array.isArray(filters)) {
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];

      const from =
        typeof filter?.from === "number" && Number.isFinite(filter.from) && filter.from >= 0
          ? filter.from
          : undefined;

      const to =
        typeof filter?.to === "number" && Number.isFinite(filter.to) && filter.to >= 0
          ? filter.to
          : undefined;

      // This makes it so empty or invalid filters are just ignored
      if (from === undefined && to === undefined) continue;

      // This builds the query params so the backend filters the book list by the selected price ranges
      if (from !== undefined) queryParts.push(`filters[${i}][from]=${from}`);
      if (to !== undefined) queryParts.push(`filters[${i}][to]=${to}`);
    }
  }

  const queryString = queryParts.join("&");
  const url = queryString
    ? `http://localhost:3000/books?${queryString}`
    : "http://localhost:3000/books";

  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new Error("Unable to connect to the server backend.");
  }

  if (!res.ok) {
    throw new Error(`The backend returned ${res.status} when requesting books.`);
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error("The backend returned unexpected data.");
  }

  return data as Book[];
}

const assignment = "assignment-1";

export default {
  assignment,
  listBooks,
};

