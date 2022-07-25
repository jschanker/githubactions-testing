const core = require('@actions/core');
const fs = require('fs');

try {
  // console.log("FE", core.getInput('steps.join_pathway_data.outputs.front_end_data'));
  // console.log("BE", core.getInput('steps.join_pathway_data.outputs.back_end_data'));
  // const frontEndPathwayData = JSON.parse(core.getInput('front_end_data'));
  // const backEndPathwayData = core.getInput('back_end_data').pathways || [];
  
  const frontEndFilePath = process.argv[2];
  const backEndFilePath = process.argv[3];
  
  const frontEndPathwayData = JSON.parse(fs.readFileSync(frontEndFilePath, "utf8")) || [];
  const backEndPathwayData = JSON.parse(fs.readFileSync(backEndFilePath, "utf8"))?.pathways || [];
  
  console.log("Front-end pathway data:", frontEndPathwayData);
  console.log("Back-end pathway data:", backEndPathwayData);
  
  const feCodeToIndexMap = frontEndPathwayData.reduce(
      (codeMap, pathway, index) => {
        if (pathway.code) {
          codeMap[pathway.code] = index;
        }
        return codeMap;
      },
      {}
    );
  const joinedPathwayData = backEndPathwayData.reduce(
    (pathwayData, pathway) => {
      const indexOfPathway = feCodeToIndexMap[pathway.code];
      if (indexOfPathway != undefined) {
        pathwayData[indexOfPathway] = {
          ...pathway,
          ...pathwayData[indexOfPathway],
        };
      } else {
        pathwayData.push(pathway);
      }
      return pathwayData;
    },
    frontEndPathwayData
  );
  core.setOutput('joined_pathway_data', JSON.stringify(joinedPathwayData));
} catch (e) {
  core.setFailed(e.message);
}
