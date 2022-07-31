const fs = require('fs');

const [classDataFilePath, batchOutputFilePath] = process.argv.slice(2);
const classesStartingFromLastWeek =
  JSON.parse(fs.readFileSync(classDataFilePath, 'utf8')) || [];

if (classesStartingFromLastWeek.length === 0) {
  throw new Error('Back-end pathway data is empty.');
}

// Assume classes are sorted by start time from nearest in the future from back-end and
//  that batch classes scheduled to meet at least once per week (and haven't been canceled).
//  In that case, upcoming batches are batches for which no classes starting from 1 week ago
//  have met prior to now.

const pathwayUpcomingBatches = {};
// map from recurring ids to the last class with that id
const recurringIdToLastClassMap = new Map();

classesStartingFromLastWeek.forEach((c) => {
  // map old to new pathway for Python (fix, very hacky)
  const cPathwayId =
    c.pathway_v2 || { 39: 1 }[c.pathway_v1] || c.pathway_v1 || c.pathway_id;
  if (c.recurring_id && cPathwayId) {
    pathwayUpcomingBatches[cPathwayId] ||= [];
    if (!recurringIdToLastClassMap.has(c.recurring_id)) {
      new Date(c.end_time || c.start_time) > new Date() &&
        pathwayUpcomingBatches[cPathwayId].push(c);
    }
    recurringIdToLastClassMap.set(c.recurring_id, c);
  }
});

Object.values(pathwayUpcomingBatches).forEach((upcomingBatches) =>
  upcomingBatches.forEach(
    (c) => (c.end_batch_time = recurringIdToLastClassMap.get(c.recurring_id))
  )
);

fs.writeFileSync(
  batchOutputFilePath,
  JSON.stringify(pathwayUpcomingBatches),
  'utf-8'
);
