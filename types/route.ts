export interface Route {
  id: number;
  name: string;
  slug: string;
}

export interface RouteApiResponse {
  localRoutes: Route[];
  internationalRoutes: Route[];
}
