import axios from "axios";

const GATEWAY_DEFAULT_TIMEOUT = 60000;

async function downloadFromGateway(cid, options) {
  if (typeof options.endpoint !== "string") {
    throw new Error(`Default Gateway must be set`);
  }

  const downloadHeaders = {};
  if (options.token) {
    downloadHeaders["x-filebase-gateway-token"] = options.token;
  }

  const downloadResponse = await axios.request({
    method: "GET",
    baseURL: options.endpoint,
    url: `/ipfs/${cid}`,
    headers: downloadHeaders,
    type: "stream",
    timeout: options?.timeout || GATEWAY_DEFAULT_TIMEOUT,
  });
  return downloadResponse.data;
}

function apiErrorHandler(err) {
  if (
    err?.response &&
    err?.response?.status &&
    (err.response.status.toString()[0] === "4" ||
      err.response.status.toString()[0] === "5")
  ) {
    throw new Error(
      err.response.data.error?.details ||
        err.response.data.error?.reason ||
        err,
    );
  }
  throw err;
}

export { downloadFromGateway, apiErrorHandler };
