import { RequestHandler } from "express";

export const getRecommendation: RequestHandler = (req, res) => {
  const { claim_id } = req.params as { claim_id: string };

  const recommendations = [
    {
      scheme: "Forest Rights Act Assistance",
      reason: "Claim is Approved and within high NDVI region",
      score: 0.92,
    },
    {
      scheme: "Community Water Conservation",
      reason: "Proximity to NDWI layer and pending infrastructure",
      score: 0.78,
    },
  ];

  res.json({ claim_id, recommendations });
};
