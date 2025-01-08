import { writeFileSync } from "fs";

export const saveOutput = (path: string, data: any) => {
  writeFileSync(`./src/rag/output/response_${path}.json`, JSON.stringify(data, null, 2));
};
