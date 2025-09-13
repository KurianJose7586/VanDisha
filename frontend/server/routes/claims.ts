import { RequestHandler } from "express";

// Simple mock GeoJSON for claims
const claimsGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        claim_id: "IFR-001",
        type: "IFR",
        status: "Approved",
        claimant: {
          name: "Asha Devi",
          village: "Bhind",
          district: "Morena",
          state: "MP",
        },
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [77.198, 28.621],
            [77.206, 28.621],
            [77.206, 28.627],
            [77.198, 28.627],
            [77.198, 28.621],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        claim_id: "CR-101",
        type: "CR",
        status: "Pending",
        claimant: {
          name: "Ramesh Kumar",
          village: "Kolar",
          district: "Bhopal",
          state: "MP",
        },
      },
      geometry: {
        type: "Point",
        coordinates: [77.212, 28.624],
      },
    },
    {
      type: "Feature",
      properties: {
        claim_id: "CFR-205",
        type: "CFR",
        status: "Approved",
        claimant: {
          name: "Van Suraksha Samiti",
          village: "Hoshangabad",
          district: "Narmadapuram",
          state: "MP",
        },
      },
      geometry: {
        type: "Point",
        coordinates: [77.193, 28.619],
      },
    },
  ],
};

export const getClaims: RequestHandler = (_req, res) => {
  res.json(claimsGeoJson);
};
