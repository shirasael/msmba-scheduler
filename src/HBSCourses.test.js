import {exportedForTesting} from './HBSCourses';
import path from 'path';
import fs from "fs";

const {pullCourseDetails, parseCourse} = exportedForTesting;

test('Pulls course details from raw course', () => {

    const courseDetails = pullCourseDetails(dummyRawCourse)
    expect(Object.keys(courseDetails).sort()).toEqual([
        'SectionID',
        'Term',
        'Title',
        'Faculty',
        'Day',
        'Start',
        'OtherEventsDay',
        'OtherEventsStart',
        'LongCourseTitle'
      ].sort())
})

test('Pulls multiple faculty members', () => {
    const courseDetails = pullCourseDetails(dummyRawCourse)
    const faculty = courseDetails.Faculty.split(', ')
    expect(faculty.length).toEqual(2)
    expect(faculty[0]).toEqual("Shikhar Ghosh")
    expect(faculty[1]).toEqual("Ted Berk")
})

test('Parse course data', () => {
    const dummyData = [
        {
            SectionID: 123,
            Term: "Spring",
            Title: "Arts of Communication Q4, 1.5",
            Faculty: "Candace Bertotti",
            Day: "Y",
            Start: "3: 10 PM",
            OtherEventsDay: "",
            OtherEventsStart: "",
            LongCourseTitle: "The Arts of Communication"
        },
        {
            SectionID: 456,
            Term: "Fall",
            Title: "Authntic Leader Develp Q1Q2, 3",
            Faculty: "Thomas DeLong",
            Day: "T",
            Start: "8: 30 AM",
            OtherEventsDay: "T",
            OtherEventsStart: "5: 30 PM",
            LongCourseTitle: "Authentic Leader Development"
        }

    ];
    const parsedNoOtherEvents = parseCourse(dummyData[0]);
    const parsedWithOtherEvents = parseCourse(dummyData[1]);

    expect(parsedNoOtherEvents.semester).toBe("S");
    expect(parsedNoOtherEvents.id).toBe("HBS-123");
    expect(parsedNoOtherEvents.name).toBe(dummyData[0].LongCourseTitle);
    expect(parsedNoOtherEvents.prof).toBe(dummyData[0].Faculty);
    expect(parsedNoOtherEvents.school).toBe("HBS");
    expect(parsedNoOtherEvents.timeText).toBe("Thu, Fri 15:10-16:30");
    expect(parsedNoOtherEvents.times[0].day).toBe(3);
    expect(parsedNoOtherEvents.times[0].startHour).toBe("15:10");
    expect(parsedNoOtherEvents.times[0].endHour).toBe("16:30");
    expect(parsedNoOtherEvents.times[1].day).toBe(4);
    expect(parsedNoOtherEvents.times[1].startHour).toBe("15:10");
    expect(parsedNoOtherEvents.times[1].endHour).toBe("16:30");

    expect(parsedWithOtherEvents.semester).toBe("F");
    expect(parsedWithOtherEvents.id).toBe("HBS-456");
    expect(parsedWithOtherEvents.name).toBe(dummyData[1].LongCourseTitle);
    expect(parsedWithOtherEvents.prof).toBe(dummyData[1].Faculty);
    expect(parsedWithOtherEvents.school).toBe("HBS");
    expect(parsedWithOtherEvents.timeText).toBe("Tue 08:30-09:50; Tue 17:30-18:50");
    expect(parsedWithOtherEvents.times[0].day).toBe(1);
    expect(parsedWithOtherEvents.times[0].startHour).toBe("08:30");
    expect(parsedWithOtherEvents.times[0].endHour).toBe("09:50");
    expect(parsedWithOtherEvents.times[1].day).toBe(1);
    expect(parsedWithOtherEvents.times[1].startHour).toBe("17:30");
    expect(parsedWithOtherEvents.times[1].endHour).toBe("18:50");
});

const dummyRawCourse =  {
    "id": 797524,
    "name": "01",
    "courseFormat": "P",
    "scheduleType": "X",
    "xCredits": 3.0,
    "yCredits": null,
    "classCredits": 3.0,
    "mbaCapacity": 60,
    "startDate": [
        2023,
        12,
        15
    ],
    "endDate": [
        2024,
        5,
        17
    ],
    "required": false,
    "cancelled": false,
    "course": {
        "id": 797521,
        "programType": "MBA",
        "courseNumber": "1632",
        "acronym": "5 TECH",
        "shortName": "5TechChangeWorld Q3Q4,3",
        "longName": "5 Technologies that Will Change the World",
        "courseType": "E",
        "styleCode": "CL",
        "credits": 3.0,
        "startDate": [
            2023,
            12,
            15
        ],
        "endDate": [
            2024,
            5,
            17
        ],
        "applicationOnly": false,
        "cancelled": false,
        "primaryUnitCode": "EM",
        "primaryUnitName": "Entrepreneurial Management",
        "unitCodes": "EM",
        "units": "Entrepreneurial Management"
    },
    "term": {
        "id": 677890,
        "type": 3,
        "programType": "MBA",
        "abbreviation": "SP",
        "name": "Spring",
        "startDate": [
            2024,
            1,
            21
        ],
        "endDate": [
            2024,
            5,
            23
        ]
    },
    "events": [
        {
            "id": 17560,
            "type": "CL",
            "scheduleType": "X",
            "startTime": [
                11,
                50,
                0,
                0
            ],
            "endTime": [
                13,
                10,
                0,
                0
            ]
        }
    ],
    "facultyMembers": [
        {
            "faculty": {
                "id": 122194
            },
            "firstName": "Shikhar",
            "lastName": "Ghosh"
        },
        {
            "faculty": {
                "id": 122000
            },
            "firstName": "Ted",
            "lastName": "Berk"
        }
    ],
    "scienceMgmtPlanFlag": true,
    "demand": {
        "initialEnrollments": 0,
        "enrollments": 60,
        "drops": 0,
        "filledAt": 5,
        "id": 366313
    },
    "position": 0,
    "available": true,
    "enrollments": 0,
    "primaryEvent": {
        "id": 17560,
        "type": "CL",
        "scheduleType": "X",
        "startTime": [
            11,
            50,
            0,
            0
        ],
        "endTime": [
            13,
            10,
            0,
            0
        ]
    },
    "otherEvents": []
}