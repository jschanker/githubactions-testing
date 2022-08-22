const axios = require('axios');
const nodeHTMLParser = require('node-html-parser');
const fs = require('fs');

function getBrowserRefreshKey(parseTree) {
  return parseTree.getElementById('___BrowserRefresh').getAttribute('value');
}

async function getSessionAndKey() {
  try {
    const response = await axios.get('https://lionsden.molloy.edu/ICS/Course_Search/Course_Search.jnz?portlet=Course_Schedules&screen=Advanced+Course+Search&screenType=next');
    console.log("STATUS", response.status);
    const parseTree = nodeHTMLParser.parse(response.data);
    //return {sessionCookie: /=([^=;]+);/.exec(response.headers['set-cookie'].find(cookie => cookie.startsWith('ASP.NET_SessionId=')))[1], browserRefreshKey: getBrowserRefreshKey(parseTree), viewState: parseTree.getElementById('__VIEWSTATE').getAttribute('value'), viewStateGenerator: parseTree.getElementById('__VIEWSTATEGENERATOR').getAttribute('value')};
    return {sessionCookie: /=([^=;]+);/.exec(response.headers['set-cookie'].find(cookie => cookie.startsWith('ASP.NET_SessionId=')))[1], browserRefreshKey: getBrowserRefreshKey(parseTree)};
  } catch (error) {
    return error;
  }
}

async function getCourseData() {
  let {sessionCookie, browserRefreshKey, viewState, viewStateGenerator} = await getSessionAndKey();
  // console.log(sessionCookie, browserRefreshKey, "\n", viewState, "\n", viewStateGenerator, "\n", "====================");
  console.log(sessionCookie, browserRefreshKey, "\n", "====================");
  /*
  const body = `------FormBoundary\nContent-Disposition: form-data; name="__EVENTTARGET"\n\npg0$V$ltrNav\n------FormBoundary\nContent-Disposition: form-data; name="__EVENTARGUMENT"\n\n${page}\n------FormBoundary\nContent-Disposition: form-data; name="___BrowserRefresh"\n\n${browserRefreshKey}\n------FormBoundary\nContent-Disposition: form-data; name="__VIEWSTATE"\n\n${viewState}\n------FormBoundary\nContent-Disposition: form-data; name="__VIEWSTATEGENERATOR"\n\n${viewStateGenerator}\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlTerm"\n\n2022;FA\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlDept"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlCourseFrom"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlCourseTo"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlTitleRestrictor"\n\nBeginsWith\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$txtTitleRestrictor"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlCourseRestrictor"\n\nBeginsWith\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$txtCourseRestrictor"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlDivision"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlMethod"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlTimeFrom"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlTimeTo"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$days"\n\nrdAnyDay\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlFaculty"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlCampus"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlBuilding"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlSecStatus"\n\nOpenFull\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$txtMin"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$txtMax"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$hiddenCache"\n\nfalse\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$btnSearch"\n\nSearch\n------FormBoundary--`;
  */
  try {
    const tryRepeat = 1000;
    const results = [];
    let page = "";
    let headings = [];
    for (let i = 1; i <= tryRepeat; i++) {
      const body = `------FormBoundary\nContent-Disposition: form-data; name="__EVENTTARGET"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="__EVENTARGUMENT"\n\n${page}\n------FormBoundary\nContent-Disposition: form-data; name="___BrowserRefresh"\n\n${browserRefreshKey}\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlTerm"\n\n2022;FA\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlDept"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlCourseFrom"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlCourseTo"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlTitleRestrictor"\n\nBeginsWith\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$txtTitleRestrictor"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlCourseRestrictor"\n\nBeginsWith\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$txtCourseRestrictor"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlDivision"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlMethod"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlTimeFrom"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlTimeTo"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$days"\n\nrdAnyDay\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlFaculty"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlCampus"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlBuilding"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlSecStatus"\n\nOpenFull\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$txtMin"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$txtMax"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$hiddenCache"\n\nfalse\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$btnSearch"\n\nSearch\n------FormBoundary--`;
      console.log("Attempting to get page", (page || 0), "with", browserRefreshKey, "...");
      const response = await axios({
        url: "https://lionsden.molloy.edu/ICS/Course_Search/Course_Search.jnz?portlet=Course_Schedules&screen=Advanced+Course+Search&screenType=next", 
        method: "POST",
        //timeout: 60000,
        headers: {
          "content-type" : "multipart/form-data; boundary=----FormBoundary",
          cookie: 'ASP.NET_SessionId=' + sessionCookie
        },
        data: body
      });
      // console.log(response.status, response.data, body);
      const root = nodeHTMLParser.parse(response.data, 'text/html');
      console.log(root.querySelector('.letterNavigator')?.innerText);
      //console.log("DATA", response.data);
      browserRefreshKey = getBrowserRefreshKey(root) || browserRefreshKey;
      if(root.getElementById('pg0_V_dgCourses')?.innerHTML) {
        headings = root.getElementById('pg0_V_dgCourses').querySelectorAll('th')?.map(x => x.childNodes[0].innerText.replace(' ', '_').toLowerCase());
        const cols = root.getElementById('pg0_V_dgCourses').querySelectorAll('tr')?.map(x => x.querySelectorAll('td')?.map(x => x.innerText));
        const pageResults = cols.map(x => x.reduce((acc, y, index) => ({...acc, [headings[index]]: y.trim()}), {})).filter(result => result.course_code);
        pageResults.forEach((result) => {
          const [area, code, section] = result.course_code.split(/\s+/g);
          result.area = area;
          result.code = code;
          result.section = section;
          result.time = //JSON.stringify(
            result.schedule?.split(/\n/g).map(dateTime => {
              const [match, days, startTime, endTime] = dateTime.match(/^([MTWRFSU]+)(?:&nbsp;|\s)+(\d+:\d+\s*AM|\d+:\d+\s*PM)[\D]+(\d+:\d+\s*AM|\d+:\d+\s*PM)/) || [];
              return days?.split('').map(day => ({day, startTime, endTime}))
            }).flat()
          //)
        });
        results.push(...pageResults);
        page = (parseInt(page) + 1) || 1;
        if (!root.querySelector('.letterNavigator')?.innerText?.toLowerCase().includes('next')) {
          break;
        }
        // return {headings, results};
        //return {headings, cols, results};
      }
    }
    return { headings, results };
  } catch(e) {
    console.log("ERROR");
    console.log(e);
    return e;
  }
}

getCourseData().then(data => fs.writeFileSync("courses.json", JSON.stringify(data), 'utf-8'));
