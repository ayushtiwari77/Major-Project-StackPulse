import { WebContainer } from "@webcontainer/api";

let webcontainerInstance = null;

export const getWebContainer = async () => {
  try {
    if (!webcontainerInstance) {
      webcontainerInstance = await WebContainer.boot();
      console.log("WebContainer booted successfully");
    }
    return webcontainerInstance;
  } catch (error) {
    console.error("Failed to boot WebContainer:", error);
    throw error;
  }
};
