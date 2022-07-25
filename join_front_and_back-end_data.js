const core = require('@actions/core');
const axios = require('axios');

try {
  // console.log("FE", core.getInput('steps.join_pathway_data.outputs.front_end_data'));
  // console.log("BE", core.getInput('steps.join_pathway_data.outputs.back_end_data'));
  // const frontEndPathwayData = JSON.parse(core.getInput('front_end_data'));
  // const backEndPathwayData = core.getInput('back_end_data').pathways || [];
  
  const frontEndFilePath = process.argv[2];
  const backEndFilePath = process.argv[3];
  
  const feResponse = await axios(frontEndFilePath);
  const beResponse = await axios(backEndFilePath);
  
  if (!feResponse?.data || !beResponse?.data) {
    throw new Error('Failed to retrieve front-end or back-end data');
  }
  
  const frontEndPathwayData = feResponse.data;
  const backEndPathwayData = beResponse.data.pathways || [];
  
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
} catch(e) {
  core.setFailed(e.message);
}
