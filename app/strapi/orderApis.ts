const postJson = async (url: string, body: unknown) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (typeof data === "object" && data && "error" in data && data.error) ||
      "Request failed";
    throw new Error(String(message));
  }

  return { data };
};

const createOrder = (data: unknown) => postJson("/api/orders", data);
const createOrderLine = (data: unknown) => postJson("/api/order-lines", data);

const orderApis = {
  createOrder,
  createOrderLine,
};

export default orderApis;
