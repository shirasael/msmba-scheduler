import Papa from "papaparse";
import {hourFormat} from "./Consts";
import moment from "moment";
import getTimeText from "./CoursesTimeText";


const days = {
    X: [0, 1],
    Y: [3, 4],
    M: [0],
    T: [1],
    W: [2],
    H: [3],
    F: [4],
}


function pullCourseDetails(rawCourse) {
    return {
        SectionID: rawCourse.id,
        Term: rawCourse.term.name,
        Title: rawCourse.course.shortName,
        Faculty: rawCourse.facultyMembers.map(f => `${f.firstName} ${f.lastName}`).join(', '),
        Day: rawCourse.scheduleType,
        Start: rawCourse.events[0].startTime,
        OtherEventsDay:  rawCourse.events.length > 1 ? rawCourse.events[1].scheduleType : '',
        OtherEventsStart: rawCourse.events.length > 1 ? rawCourse.events[1].startTime : '',
        LongCourseTitle: rawCourse.course.longName,
      }
}


function formatHBSCourses(rawCourseList){
    return rawCourseList.filter(course => !course.cancelled).map(pullCourseDetails)
}

function getCourseHours(startRaw) {
    const courseStartHour = moment(startRaw, "hh:mm:ss A");
    return {
        startHour: courseStartHour.format(hourFormat),
        endHour: courseStartHour.add(80, 'm').format(hourFormat)
    };
}

function parseCourse(courseData) {
    let courseHours = days[courseData.Day].map((day) => {
        return {
            ...getCourseHours(courseData.Start),
            day: day
        }
    });
    if (courseData.OtherEventsDay !== "") {
        courseHours = courseHours.concat(days[courseData.OtherEventsDay].map((day) => {
            return {
                ...getCourseHours(courseData.OtherEventsStart),
                day: day
            };
        }));
    }

    return {
        id: `HBS-${courseData.SectionID}`,
        name: courseData.LongCourseTitle,
        school: "HBS",
        prof: courseData.Faculty,
        timeText: getTimeText(courseHours),
        semester: courseData.Term.slice(0,1),
        times: courseHours
    }
}


export async function parseCourses(rawCourseJson) {
    const formattedCourses = formatHBSCourses(rawCourseJson);
    return formattedCourses.map(parseCourse);
}

export const exportedForTesting = {
    parseCourse, pullCourseDetails
};
