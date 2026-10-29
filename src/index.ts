
interface ProjectInfo {
  name: string;
  language: string;
  framework: string;
}

const project: ProjectInfo = {
  name: "Multi-Agent Research Assistant",
  language: "TypeScript",
  framework: "LangGraph.js",
};

console.log("Project initialized successfully!");
console.log(`Project: ${project.name}`);
console.log(`Language: ${project.language}`);
console.log(`Planned framework: ${project.framework}`);
