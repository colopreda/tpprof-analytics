export const GENDER = {
    name: "driver_gender",
    type: "dropdown",
    main: false,
    selected: "Gender",
    options: [
        {
            value: 'Gender',
            text: 'Gender'
        },
        {
            value: 'M',
            text: 'Male'
        },
        {
            value: 'F',
            text: 'Female'
        }
    ]
};

export const YEAR = {
    name: "year",
    type: "dropdown",
    main: false,
    selected: "Year",
    options: [
        'Year', '2013', '2014', '2015', '2016'
    ]
};

export const GENDER_DYNAMIC = {
    name: "driver_gender",
    type: "dropdown",
    main: false,
    dynamic: true,
    selected: "Gender",
    options: [
        {
            value: 'Gender',
            text: 'Gender'
        },
        {
            value: 'M',
            text: 'Male'
        },
        {
            value: 'F',
            text: 'Female'
        }
    ]
};


export const AGE = {
    name: "driver_age_category",
    type: "dropdown",
    selected: 0,
    options: [
        {
            value: 0,
            text: 'Age'
        },
        {
            value: 20,
            text: '20-24 years old'
        },
        {
            value: 25,
            text: '25-29 years old'
        },
        {
            value: 30,
            text: '30-34 years old'
        },
        {
            value: 35,
            text: '35-39 years old'
        },
        {
            value: 40,
            text: '40-44 years old'
        },
        {
            value: 45,
            text: '45-49 years old'
        },
        {
            value: 50,
            text: '50-54 years old'
        },
        {
            value: 55,
            text: '55-59 years old'
        },
        {
            value: 60,
            text: '60-64 years old'
        },
        {
            value: 65,
            text: '65-69 years old'
        },
        {
            value: 70,
            text: '70-74 years old'
        },
        {
            value: 75,
            text: '75-79 years old'
        },
        {
            value: 80,
            text: '80-84 years old'
        },
    ]
};

export const AGE_DYNAMIC = {
    name: "driver_age_category",
    type: "dropdown",
    selected: 0,
    dynamic: true,
    options: [
        {
            value: 0,
            text: 'Age'
        },
        {
            value: 20,
            text: '20-24 years old'
        },
        {
            value: 25,
            text: '25-29 years old'
        },
        {
            value: 30,
            text: '30-34 years old'
        },
        {
            value: 35,
            text: '35-39 years old'
        },
        {
            value: 40,
            text: '40-44 years old'
        },
        {
            value: 45,
            text: '45-49 years old'
        },
        {
            value: 50,
            text: '50-54 years old'
        },
        {
            value: 55,
            text: '55-59 years old'
        },
        {
            value: 60,
            text: '60-64 years old'
        },
        {
            value: 65,
            text: '65-69 years old'
        },
        {
            value: 70,
            text: '70-74 years old'
        },
        {
            value: 75,
            text: '75-79 years old'
        },
        {
            value: 80,
            text: '80-84 years old'
        },
    ]
};

export const TOD = {
    name: "hour_of_day",
    type: "dropdown",
    main: false,
    selected: "Time of day",
    options: [
        'Time of day', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
    ]
};

export const TOD_OBJ = {
    name: "hour_of_day",
    type: "dropdown",
    main: false,
    selected: 'Time of day',
    options: [
        {
            value: 'Time of day',
            text: 'Time of day'
        },
        {
            value: 0,
            text: '12.00am'
        },
        {
            value: 1,
            text: '01.00am'
        },
        {
            value: 2,
            text: '02.00am'
        },
        {
            value: 3,
            text: '03.00am'
        },
        {
            value: 4,
            text: '04.00am'
        },
        {
            value: 5,
            text: '05.00am'
        },
        {
            value: 6,
            text: '06.00am'
        },
        {
            value: 7,
            text: '07.00am'
        },
        {
            value: 8,
            text: '08.00am'
        },
        {
            value: 9,
            text: '09.00am'
        },
        {
            value: 10,
            text: '10.00am'
        },
        {
            value: 11,
            text: '11.00am'
        },
        {
            value: 12,
            text: '12.00pm'
        },
        {
            value: 13,
            text: '01.00pm'
        },
        {
            value: 14,
            text: '02.00pm'
        },
        {
            value: 15,
            text: '03.00pm'
        },
        {
            value: 16,
            text: '04.00pm'
        },
        {
            value: 17,
            text: '05.00pm'
        },
        {
            value: 18,
            text: '06.00pm'
        },
        {
            value: 19,
            text: '07.00pm'
        },
        {
            value: 20,
            text: '08.00pm'
        },
        {
            value: 21,
            text: '09.00pm'
        },
        {
            value: 22,
            text: '10.00pm'
        },
        {
            value: 23,
            text: '11.00pm'
        }
    ]
};

export const TOD_OBJ_DYNAMIC = {
    name: "hour_of_day",
    type: "dropdown",
    main: false,
    dynamic: true,
    selected: -1,
    options: [
        {
            value: -1,
            text: 'Time of day'
        },
        {
            value: 0,
            text: '12.00am'
        },
        {
            value: 1,
            text: '01.00am'
        },
        {
            value: 2,
            text: '02.00am'
        },
        {
            value: 3,
            text: '03.00am'
        },
        {
            value: 4,
            text: '04.00am'
        },
        {
            value: 5,
            text: '05.00am'
        },
        {
            value: 6,
            text: '06.00am'
        },
        {
            value: 7,
            text: '07.00am'
        },
        {
            value: 8,
            text: '08.00am'
        },
        {
            value: 9,
            text: '09.00am'
        },
        {
            value: 10,
            text: '10.00am'
        },
        {
            value: 11,
            text: '11.00am'
        },
        {
            value: 12,
            text: '12.00pm'
        },
        {
            value: 13,
            text: '01.00pm'
        },
        {
            value: 14,
            text: '02.00pm'
        },
        {
            value: 15,
            text: '03.00pm'
        },
        {
            value: 16,
            text: '04.00pm'
        },
        {
            value: 17,
            text: '05.00pm'
        },
        {
            value: 18,
            text: '06.00pm'
        },
        {
            value: 19,
            text: '07.00pm'
        },
        {
            value: 20,
            text: '08.00pm'
        },
        {
            value: 21,
            text: '09.00pm'
        },
        {
            value: 22,
            text: '10.00pm'
        },
        {
            value: 23,
            text: '11.00pm'
        }
    ]
};

export const DOW = {
    name: "day_of_week_nb",
    type: "dropdown",
    main: false,
    selected: "Day of week",
    options: [
        'Day of week', 'Monday', 'Tuesday', 'Wednseday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ]
};

export const DOW_OBJ = {
    name: "day_of_week_nb",
    type: "dropdown",
    main: false,
    selected: 0,
    options: [
        {
            value: 0,
            text: 'Day of week'
        },
        {
            value: 1,
            text: 'Monday'
        },
        {
            value: 2,
            text: 'Tuesday'
        },
        {
            value: 3,
            text: 'Wednesday'
        },
        {
            value: 4,
            text: 'Thursday'
        },
        {
            value: 5,
            text: 'Friday'
        },
        {
            value: 6,
            text: 'Saturday'
        },
        {
            value: 7,
            text: 'Sunday'
        }
    ]
};

export const DOW_OBJ_DYNAMIC = {
    name: "day_of_week_nb",
    type: "dropdown",
    main: false,
    dynamic: true,
    selected: -1,
    options: [
        {
            value: -1,
            text: 'Day of week'
        },
        {
            value: 1,
            text: 'Monday'
        },
        {
            value: 2,
            text: 'Tuesday'
        },
        {
            value: 3,
            text: 'Wednesday'
        },
        {
            value: 4,
            text: 'Thursday'
        },
        {
            value: 5,
            text: 'Friday'
        },
        {
            value: 6,
            text: 'Saturday'
        },
        {
            value: 7,
            text: 'Sunday'
        }
    ]
};

export const CF = {
    name: "cf",
    type: "dropdown",
    main: true,
    selected: "Contributory factors",
    options: [
        'Contributory factors', 'Road Layout', 'Animal in carriageway', 'Disobeyed priority sign', 'Disobeyed pedestrian', 'Disobeyed double white line',
        'Illegal turn or direction', 'Exceeding speed limit', 'Travelling too fast', 'Junction overshoot', 'Poor turn', 'Failed to look', 'Sudden breaking',
        'swerved', 'Loss of Control', 'Fatigue', 'Aggressive driving', 'Careless or in a hurry', 'Poor road surface', 'Vision affected by weather',
        'Dazzling sun proportion', 'Slippery road'
    ]
};

export const CF_FORCED = {
    name: "cf",
    type: "dropdown",
    main: false,
    forced: true,
    selected: "Exceeding speed limit",
    label: "Contributory Factor",
    options: [
        'Exceeding speed limit', 'Road Layout', 'Animal in carriageway', 'Disobeyed priority sign', 'Disobeyed pedestrian', 'Disobeyed double white line',
        'Illegal turn or direction', 'Following too close', 'Distraction in vehicle', 'Travelling too fast', 'Junction overshoot', 'Poor turn', 'Failed to look', 'Sudden braking',
        'Swerved', 'Loss of Control', 'Fatigue', 'Aggressive driving', 'Careless or in a hurry', 'Poor road surface', 'Vision affected by weather',
        'Dazzling sun', 'Slippery road'
    ]
};

export const CF_CATEGORIES = {
    name: "cf_categories",
    type: "dropdown",
    main: true,
    selected: "CF Categories",
    options: [
        'CF Categories', 'Vision Affected', 'Road Environment', 'Injudicious Action', 'Impairment or distraction',
        'Driver error or reaction', 'Behaviour or inexperience'
    ]
};

export const CF_CATEGORIES_FORCED = {
    name: "category",
    type: "dropdown",
    main: false,
    forced: true,
    selected: "Road environment contributed",
    options: [
        'Road environment contributed', 'Injudicious action', 'Driver/Rider error or reaction', 'Impairment or distraction',
        'Behaviour or inexperience', 'Vision affected by external factors'
    ]
};


export const SEVERITY = {
    name: "severity",
    type: "dropdown",
    main: true,
    selected: "Severity",
    options: [
        'Severity', 'Fatal', 'Serious', 'Slight'
    ]
};

export const AVG_RISK = {
    name: "avg_risk",
    type: "minmax",
    label: "Avg. Risk",
    main: true,
    selected: {
        min: '',
        max: ''
    }
};

export const AVG_DIST = {
    name: "avg_distance",
    type: "minmax",
    label: "Avg. Distance",
    main: true,
    selected: {
        min: '',
        max: ''
    }
};