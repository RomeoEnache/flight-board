import type { Flight } from "../domain/flight";
import { mapPostsToFlights, parsePosts } from "./mapPostToFlight";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

export type FlightLoadRequest = {
  signal: AbortSignal;
};

export type FlightLoader = (request: FlightLoadRequest) => Promise<Flight[]>;

export const fetchFlights: FlightLoader = async ({ signal }) => {
  const response = await fetch(POSTS_URL, { signal });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const responseData = await response.json();
  const posts = parsePosts(responseData);

  return mapPostsToFlights(posts);
};
