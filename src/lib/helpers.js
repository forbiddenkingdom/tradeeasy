/**
 * Function used to load an User Strategy
 * @param {number} id
 * @returns
 */
export async function loadUserStrategy(id) {
  const USER_ID = localStorage.getItem("user_id");
  const API_URL = `${process.env.REACT_APP_TRADEASY_API}session/${USER_ID}`;
  try {
    const body = JSON.stringify({
      origin: "M",
      strategyId: id,
      userId: USER_ID,
    });
    const response = await fetch(API_URL, {
      method: "PUT",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Load finished with errors");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return { hadErrors: true };
  }
}
/**
 * Function used to load a Shared Strategy
 * @param {number} id
 * @returns
 */
export async function loadSharedStrategy(id) {
  const USER_ID = localStorage.getItem("user_id");
  const API_URL = `${process.env.REACT_APP_TRADEASY_API}session/${USER_ID}`;
  try {
    const body = JSON.stringify({
      origin: "S",
      strategyId: id,
      userId: USER_ID,
    });
    const response = await fetch(API_URL, {
      method: "PUT",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Load finished with errors");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return { hadErrors: true };
  }
}

/**
 * Function used to load an history User Strategy
 * @param {number} id
 * @returns
 */
export async function loadHistoryStrategy(id) {
  const USER_ID = localStorage.getItem("user_id");
  const API_URL = `${process.env.REACT_APP_TRADEASY_API}session/${USER_ID}`;
  try {
    const body = JSON.stringify({
      origin: "H",
      strategyId: id,
      userId: USER_ID,
    });
    const response = await fetch(API_URL, {
      method: "PUT",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Load finished with errors");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return { hadErrors: true };
  }
}
