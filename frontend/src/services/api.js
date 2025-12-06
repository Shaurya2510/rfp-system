import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:4000/api",
});

// RFPs
export const createRfp = (data) => API.post("/rfps/create", data);
export const getRfps = () => API.get("/rfps");
export const deleteRfp = (id) => API.delete(`/rfps/${id}`);

// Vendors
export const addVendor = (data) => API.post("/vendors/add", data);
export const getVendors = () => API.get("/vendors");
export const deleteVendor = (id) => API.delete(`/vendors/${id}`);

// Send RFP Email
export const sendRfpEmail = (data) => API.post("/email/send", data);

// Proposals
export const getProposals = () => API.get("/proposals");

// Comparison
export const compareRfp = (rfp_id) => API.get(`/comparison/${rfp_id}`);

export default API;