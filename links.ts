// this file mostly serves just to find our links for class
// import filereader and path
import { studentClass } from "./types/types.d.ts";

const jsonPath = "info.json";

const readStudentClasses = async (
  filePath: string,
): Promise<studentClass[]> => {
  const decoder = new TextDecoder("utf-8");
  return JSON.parse(decoder.decode(await Deno.readFile(filePath)));
};

export default { jsonPath, readStudentClasses };
