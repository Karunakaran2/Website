/** Website CMS has no seat hierarchy API. */
export function useAuthorizedSeats() {
  return {
    seats: [],
    isLoading: false,
    isFetching: false,
    error: null,
    listError: null,
    refetch: () => {},
  }
}