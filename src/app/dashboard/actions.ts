"use server";

import { GoogleGenAI, Type } from "@google/genai";
import { Resident } from "./page";

interface Summary {
  firefighter: string;
  emt: string;
  police: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSummary(summary: any): summary is Summary {
  return (
    summary.firefighter &&
    summary.emt &&
    summary.police &&
    typeof summary.firefighter === "string" &&
    typeof summary.emt === "string" &&
    typeof summary.police === "string"
  );
}

export async function generateSummary(
  nearbyResidents: Resident[],
): Promise<Summary | null> {
  if (nearbyResidents.length === 0) {
    return null;
  }

  const residentText = nearbyResidents
    .map((resident) => {
      return `- ${resident.name}, ${resident.phone} (${resident.street}, ${resident.city}, ${resident.state} ${resident.zipcode}) - ${resident.medical_needs} ${resident.mobility_status} ${resident.additional_info}`;
    })
    .join("\n");

  const systemPrompt =
    "You are an emergency response assistant. Generate separate response summaries for Firefighters, EMTs, and Police based on the at-risk residents in the fire-affected area. Each summary should be concise and relevant to their role.";
  const userPrompt = `Generate emergency response summaries for first responders. The following at-risk residents are near the fire:
        ${residentText}
      `;

  const llm_client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await llm_client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [systemPrompt, userPrompt],
    config: {
      maxOutputTokens: 2000,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          firefighter: {
            type: Type.STRING,
          },
          emt: {
            type: Type.STRING,
          },
          police: {
            type: Type.STRING,
          },
        },
      },
    },
  });

  const parsedResponse = JSON.parse(response.text ?? "{}");
  if (isSummary(parsedResponse)) {
    return parsedResponse;
  }
  return null;
}
