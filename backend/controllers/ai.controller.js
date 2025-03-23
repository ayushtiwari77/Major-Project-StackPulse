import { generateResult } from "../services/ai.service.js";

export const getResult = async (req, res) => {
  const { prompt } = req.query;

  try {
    const result = await generateResult(prompt);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
