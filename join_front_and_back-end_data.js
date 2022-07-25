// const core = require('@actions/core');
const fs = require('fs');

try {
  // console.log("FE", core.getInput('steps.join_pathway_data.outputs.front_end_data'));
  // console.log("BE", core.getInput('steps.join_pathway_data.outputs.back_end_data'));
  // const frontEndPathwayData = JSON.parse(core.getInput('front_end_data'));
  // const backEndPathwayData = core.getInput('back_end_data').pathways || [];
  
  const frontEndFilePath = process.argv[2];
  const backEndFilePath = process.argv[3];
  const joinedFilePath = process.argv[4];
  
  const frontEndPathwayData = JSON.parse(fs.readFileSync(frontEndFilePath, 'utf8')) || [];
  const backEndData = JSON.parse(fs.readFileSync(backEndFilePath, 'utf8'));
  const backEndPathwayData = backEndData?.pathways || [];
  
  console.log("Front-end pathway data:", frontEndPathwayData);
  console.log("Back-end pathway data:", backEndPathwayData);
  
  if (backEndPathwayData.length === 0) {
    throw new Error("Back-end pathway data is empty.");
  }
  
  const feCodeToIndexMap = frontEndPathwayData.reduce(
      (codeMap, pathway, index) => {
        if (pathway.code) {
          codeMap[pathway.code] = index;
        }
        return codeMap;
      },
      {}
    );
  backEndData.pathways = backEndPathwayData.reduce(
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
  // core.setOutput('joined_pathway_data', JSON.stringify(backEndPathwayData));
  fs.writeFileSync(joinedFilePath, JSON.stringify(backEndData), 'utf-8');
} catch (e) {
  // core.setFailed(e.message);
  throw new Error(e.message); // throwing caught error will happen automatically
}
