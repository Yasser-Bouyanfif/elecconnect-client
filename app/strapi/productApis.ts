const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (typeof data === "object" && data && "error" in data && data.error) ||
      response.statusText ||
      "Request failed";
    throw new Error(typeof message === "string" ? message : "Request failed");
  }

  return { data };
};

const getProducts = async () => {
  const response = await fetch("/api/products", {
    method: "GET",
    cache: "no-store",
  });
  return handleResponse(response);
};

const getProductById = async (id: string) => {
  const response = await fetch(`/api/products/${encodeURIComponent(id)}`, {
    method: "GET",
    cache: "no-store",
  });
  return handleResponse(response);
};

const productApi = {
  getProducts,
  getProductById,
};

export default productApi;
