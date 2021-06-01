export const GET_ALL_DATA = 'GET_ALL_DATA';

export function getAllData(AllData) {
  return {
    type: GET_ALL_DATA,
    payload: AllData,
  };
}
