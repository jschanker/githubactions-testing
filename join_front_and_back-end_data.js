const core = require('@actions/core');

try {
  const frontEndPathwayData = JSON.parse(core.getInput('front_end_data'));
  const backEndPathwayData = core.getInput('back_end_data').pathways || [];
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
  core.setFailed(error.message);
}
